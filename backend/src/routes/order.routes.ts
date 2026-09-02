import { Router } from 'express';
import { z } from 'zod';
import { requireAuth } from '../lib/auth';
import { asyncHandler, HttpError } from '../lib/http';
import { prisma } from '../lib/prisma';

export const orderRouter = Router();

export const FREE_DELIVERY_ABOVE = 999;
export const DELIVERY_FEE = 49;

const createOrderSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.number().int().positive(),
        quantity: z.number().int().positive().max(10),
      }),
    )
    .min(1, 'Your cart is empty'),
  customerName: z.string().min(3, 'Please enter the full name'),
  customerPhone: z.string().regex(/^[6-9]\d{9}$/, 'Please enter a valid 10 digit mobile number'),
  customerAddress: z.string().min(10, 'Please enter the complete address'),
  customerCity: z.string().min(2, 'Please enter your city'),
  customerPincode: z.string().regex(/^\d{6}$/, 'Please enter a valid 6 digit pincode'),
  paymentMethod: z.enum(['UPI', 'COD']).default('UPI'),
});

orderRouter.post(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    const data = createOrderSchema.parse(req.body);

    const products = await prisma.product.findMany({
      where: { id: { in: data.items.map((i) => i.productId) } },
    });

    const lines = data.items.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) throw new HttpError(400, 'One of the products is no longer available');
      if (product.stock < item.quantity) {
        throw new HttpError(400, `Only ${product.stock} left in stock for ${product.name}`);
      }
      return { product, quantity: item.quantity };
    });

    const itemsTotal = lines.reduce((sum, l) => sum + l.product.price * l.quantity, 0);
    const deliveryFee = itemsTotal >= FREE_DELIVERY_ABOVE ? 0 : DELIVERY_FEE;

    const order = await prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          userId: req.auth!.userId,
          customerName: data.customerName,
          customerPhone: data.customerPhone,
          customerAddress: data.customerAddress,
          customerCity: data.customerCity,
          customerPincode: data.customerPincode,
          paymentMethod: data.paymentMethod,
          paymentStatus: data.paymentMethod === 'COD' ? 'Pending' : 'Paid',
          itemsTotal,
          deliveryFee,
          totalAmount: itemsTotal + deliveryFee,
          items: {
            create: lines.map((l) => ({
              productId: l.product.id,
              productName: l.product.name,
              productImage: l.product.image,
              price: l.product.price,
              quantity: l.quantity,
            })),
          },
        },
        include: { items: true },
      });

      for (const line of lines) {
        await tx.product.update({
          where: { id: line.product.id },
          data: { stock: { decrement: line.quantity } },
        });
      }

      return created;
    });

    res.status(201).json({ order });
  }),
);

orderRouter.get(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    const orders = await prisma.order.findMany({
      where: { userId: req.auth!.userId },
      include: { items: true },
      orderBy: { id: 'desc' },
    });
    res.json({ orders });
  }),
);

orderRouter.get(
  '/:id',
  requireAuth,
  asyncHandler(async (req, res) => {
    const order = await prisma.order.findFirst({
      where: { id: Number(req.params.id), userId: req.auth!.userId },
      include: { items: true },
    });
    if (!order) throw new HttpError(404, 'Order not found');
    res.json({ order });
  }),
);

orderRouter.post(
  '/:id/cancel',
  requireAuth,
  asyncHandler(async (req, res) => {
    const order = await prisma.order.findFirst({
      where: { id: Number(req.params.id), userId: req.auth!.userId },
      include: { items: true },
    });
    if (!order) throw new HttpError(404, 'Order not found');
    if (!['PENDING', 'PACKED'].includes(order.orderStatus)) {
      throw new HttpError(400, 'This order can no longer be cancelled');
    }

    const updated = await prisma.$transaction(async (tx) => {
      for (const item of order.items) {
        if (item.productId) {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { increment: item.quantity } },
          });
        }
      }
      return tx.order.update({
        where: { id: order.id },
        data: { orderStatus: 'CANCELLED' },
        include: { items: true },
      });
    });

    res.json({ order: updated });
  }),
);

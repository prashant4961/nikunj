import { Router } from 'express';
import { z } from 'zod';
import { requireAdmin } from '../lib/auth';
import { asyncHandler, HttpError } from '../lib/http';
import { prisma } from '../lib/prisma';

export const adminRouter = Router();

adminRouter.use(requireAdmin);

adminRouter.get(
  '/stats',
  asyncHandler(async (_req, res) => {
    const [products, orders, customers, revenue, outOfStock, recentOrders] = await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
      prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: { orderStatus: { not: 'CANCELLED' } },
      }),
      prisma.product.count({ where: { stock: { lte: 0 } } }),
      prisma.order.findMany({ take: 6, orderBy: { id: 'desc' }, include: { items: true } }),
    ]);

    const byStatus = await prisma.order.groupBy({ by: ['orderStatus'], _count: { orderStatus: true } });

    res.json({
      products,
      orders,
      customers,
      revenue: revenue._sum.totalAmount ?? 0,
      outOfStock,
      recentOrders,
      byStatus: byStatus.map((s) => ({ status: s.orderStatus, count: s._count.orderStatus })),
    });
  }),
);

const productSchema = z.object({
  name: z.string().min(3, 'Product name is required'),
  description: z.string().min(10, 'Please add a short description'),
  category: z.string().min(2, 'Category is required'),
  price: z.coerce.number().int().positive('Price must be greater than 0'),
  mrp: z.coerce.number().int().positive('MRP must be greater than 0'),
  image: z.string().min(1, 'Product image is required'),
  gallery: z.array(z.string()).default([]),
  stock: z.coerce.number().int().nonnegative().default(0),
  featured: z.boolean().default(false),
});

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

adminRouter.get(
  '/products',
  asyncHandler(async (_req, res) => {
    const products = await prisma.product.findMany({ orderBy: { id: 'desc' } });
    res.json({ products });
  }),
);

adminRouter.post(
  '/products',
  asyncHandler(async (req, res) => {
    const data = productSchema.parse(req.body);
    if (data.mrp < data.price) throw new HttpError(400, 'MRP cannot be lower than the selling price');

    let slug = slugify(data.name);
    if (await prisma.product.findUnique({ where: { slug } })) slug = `${slug}-${Date.now()}`;

    const product = await prisma.product.create({ data: { ...data, slug } });
    res.status(201).json({ product });
  }),
);

adminRouter.put(
  '/products/:id',
  asyncHandler(async (req, res) => {
    const data = productSchema.parse(req.body);
    if (data.mrp < data.price) throw new HttpError(400, 'MRP cannot be lower than the selling price');

    const product = await prisma.product.update({ where: { id: Number(req.params.id) }, data });
    res.json({ product });
  }),
);

adminRouter.delete(
  '/products/:id',
  asyncHandler(async (req, res) => {
    await prisma.product.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: 'Product deleted' });
  }),
);

adminRouter.get(
  '/orders',
  asyncHandler(async (req, res) => {
    const status = typeof req.query.status === 'string' ? req.query.status : undefined;
    const orders = await prisma.order.findMany({
      where: status && status !== 'ALL' ? { orderStatus: status as never } : undefined,
      include: { items: true, user: { select: { id: true, fullName: true, email: true } } },
      orderBy: { id: 'desc' },
    });
    res.json({ orders });
  }),
);

adminRouter.put(
  '/orders/:id/status',
  asyncHandler(async (req, res) => {
    const { status } = z
      .object({
        status: z.enum(['PENDING', 'PACKED', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED']),
      })
      .parse(req.body);

    const order = await prisma.order.update({
      where: { id: Number(req.params.id) },
      data: {
        orderStatus: status,
        ...(status === 'DELIVERED' ? { paymentStatus: 'Paid' } : {}),
      },
      include: { items: true },
    });

    res.json({ order });
  }),
);

adminRouter.get(
  '/customers',
  asyncHandler(async (_req, res) => {
    const customers = await prisma.user.findMany({
      where: { role: 'CUSTOMER' },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        createdAt: true,
        _count: { select: { orders: true } },
      },
      orderBy: { id: 'desc' },
    });
    res.json({ customers });
  }),
);

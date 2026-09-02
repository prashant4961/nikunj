import { Router } from 'express';
import { z } from 'zod';
import { requireAuth } from '../lib/auth';
import { asyncHandler } from '../lib/http';
import { prisma } from '../lib/prisma';

export const wishlistRouter = Router();

wishlistRouter.use(requireAuth);

wishlistRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const entries = await prisma.wishlist.findMany({
      where: { userId: req.auth!.userId },
      include: { product: true },
      orderBy: { id: 'desc' },
    });
    res.json({ items: entries.map((e) => e.product) });
  }),
);

wishlistRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    const { productId } = z.object({ productId: z.number().int().positive() }).parse(req.body);
    await prisma.wishlist.upsert({
      where: { userId_productId: { userId: req.auth!.userId, productId } },
      create: { userId: req.auth!.userId, productId },
      update: {},
    });
    res.status(201).json({ message: 'Added to wishlist' });
  }),
);

wishlistRouter.delete(
  '/:productId',
  asyncHandler(async (req, res) => {
    await prisma.wishlist.deleteMany({
      where: { userId: req.auth!.userId, productId: Number(req.params.productId) },
    });
    res.json({ message: 'Removed from wishlist' });
  }),
);

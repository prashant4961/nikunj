import { Prisma } from '@prisma/client';
import { Router } from 'express';
import { z } from 'zod';
import { asyncHandler, HttpError } from '../lib/http';
import { prisma } from '../lib/prisma';

export const productRouter = Router();

const listQuerySchema = z.object({
  q: z.string().trim().optional(),
  category: z.string().trim().optional(),
  minPrice: z.coerce.number().int().nonnegative().optional(),
  maxPrice: z.coerce.number().int().positive().optional(),
  minRating: z.coerce.number().min(0).max(5).optional(),
  inStock: z.enum(['true', 'false']).optional(),
  sort: z.enum(['popular', 'price_asc', 'price_desc', 'newest', 'discount']).default('popular'),
  page: z.coerce.number().int().positive().default(1),
  perPage: z.coerce.number().int().positive().max(48).default(12),
});

const sortOrders: Record<string, Prisma.ProductOrderByWithRelationInput[]> = {
  popular: [{ rating: 'desc' }, { ratingCount: 'desc' }],
  price_asc: [{ price: 'asc' }],
  price_desc: [{ price: 'desc' }],
  newest: [{ createdAt: 'desc' }],
  discount: [{ mrp: 'desc' }],
};

productRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const query = listQuerySchema.parse(req.query);

    const where: Prisma.ProductWhereInput = {
      ...(query.category && query.category !== 'All' ? { category: query.category } : {}),
      ...(query.minRating ? { rating: { gte: query.minRating } } : {}),
      ...(query.inStock === 'true' ? { stock: { gt: 0 } } : {}),
      ...(query.minPrice || query.maxPrice
        ? { price: { gte: query.minPrice ?? 0, ...(query.maxPrice ? { lte: query.maxPrice } : {}) } }
        : {}),
      ...(query.q
        ? {
            OR: [
              { name: { contains: query.q, mode: 'insensitive' } },
              { description: { contains: query.q, mode: 'insensitive' } },
              { category: { contains: query.q, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    const [items, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy: sortOrders[query.sort],
        skip: (query.page - 1) * query.perPage,
        take: query.perPage,
      }),
      prisma.product.count({ where }),
    ]);

    res.json({
      items,
      total,
      page: query.page,
      perPage: query.perPage,
      totalPages: Math.max(1, Math.ceil(total / query.perPage)),
    });
  }),
);

productRouter.get(
  '/categories',
  asyncHandler(async (_req, res) => {
    const grouped = await prisma.product.groupBy({
      by: ['category'],
      _count: { category: true },
      orderBy: { category: 'asc' },
    });
    res.json(grouped.map((g) => ({ name: g.category, count: g._count.category })));
  }),
);

productRouter.get(
  '/featured',
  asyncHandler(async (_req, res) => {
    const items = await prisma.product.findMany({
      where: { featured: true },
      orderBy: { rating: 'desc' },
      take: 8,
    });
    res.json({ items });
  }),
);

productRouter.get(
  '/:slug',
  asyncHandler(async (req, res) => {
    const product = await prisma.product.findUnique({ where: { slug: req.params.slug } });
    if (!product) throw new HttpError(404, 'Product not found');

    const related = await prisma.product.findMany({
      where: { category: product.category, NOT: { id: product.id } },
      take: 6,
      orderBy: { rating: 'desc' },
    });

    res.json({ product, related });
  }),
);

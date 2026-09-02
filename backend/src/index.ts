import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './lib/env';
import { errorHandler } from './lib/http';
import { prisma } from './lib/prisma';
import { adminRouter } from './routes/admin.routes';
import { authRouter } from './routes/auth.routes';
import { orderRouter } from './routes/order.routes';
import { productRouter } from './routes/product.routes';
import { wishlistRouter } from './routes/wishlist.routes';

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.corsOrigins.includes('*') ? true : env.corsOrigins,
    credentials: true,
  }),
);
app.use(express.json({ limit: '1mb' }));
app.use(morgan(env.isProduction ? 'combined' : 'dev'));

app.get('/health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok' });
  } catch {
    res.status(503).json({ status: 'database unavailable' });
  }
});

app.use('/api/auth', authRouter);
app.use('/api/products', productRouter);
app.use('/api/orders', orderRouter);
app.use('/api/wishlist', wishlistRouter);
app.use('/api/admin', adminRouter);

app.use((_req, res) => res.status(404).json({ message: 'Route not found' }));
app.use(errorHandler);

const server = app.listen(env.port, () => {
  console.log(`API listening on http://0.0.0.0:${env.port}`);
});

for (const signal of ['SIGTERM', 'SIGINT'] as const) {
  process.on(signal, () => {
    server.close(async () => {
      await prisma.$disconnect();
      process.exit(0);
    });
  });
}

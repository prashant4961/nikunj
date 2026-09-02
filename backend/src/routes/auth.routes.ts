import bcrypt from 'bcryptjs';
import { Router } from 'express';
import { z } from 'zod';
import { requireAuth, signToken } from '../lib/auth';
import { asyncHandler, HttpError } from '../lib/http';
import { prisma } from '../lib/prisma';

export const authRouter = Router();

const publicUser = {
  id: true,
  fullName: true,
  email: true,
  phone: true,
  role: true,
  createdAt: true,
} as const;

const registerSchema = z.object({
  fullName: z.string().min(3, 'Please enter your full name'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Please enter a valid 10 digit mobile number'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

authRouter.post(
  '/register',
  asyncHandler(async (req, res) => {
    const data = registerSchema.parse(req.body);

    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) throw new HttpError(409, 'An account with this email already exists');

    const user = await prisma.user.create({
      data: {
        fullName: data.fullName,
        email: data.email.toLowerCase(),
        phone: data.phone,
        passwordHash: await bcrypt.hash(data.password, 10),
      },
      select: publicUser,
    });

    res.status(201).json({ user, token: signToken({ userId: user.id, role: user.role }) });
  }),
);

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Please enter your password'),
});

authRouter.post(
  '/login',
  asyncHandler(async (req, res) => {
    const data = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { email: data.email.toLowerCase() } });
    if (!user || !(await bcrypt.compare(data.password, user.passwordHash))) {
      throw new HttpError(401, 'Invalid email or password');
    }

    res.json({
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt,
      },
      token: signToken({ userId: user.id, role: user.role }),
    });
  }),
);

authRouter.get(
  '/me',
  requireAuth,
  asyncHandler(async (req, res) => {
    const user = await prisma.user.findUnique({
      where: { id: req.auth!.userId },
      select: publicUser,
    });
    if (!user) throw new HttpError(401, 'Session expired, please log in again');
    res.json({ user });
  }),
);

const profileSchema = z.object({
  fullName: z.string().min(3, 'Please enter your full name'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Please enter a valid 10 digit mobile number'),
});

authRouter.put(
  '/me',
  requireAuth,
  asyncHandler(async (req, res) => {
    const data = profileSchema.parse(req.body);
    const user = await prisma.user.update({
      where: { id: req.auth!.userId },
      data,
      select: publicUser,
    });
    res.json({ user });
  }),
);

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Please enter your current password'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
});

authRouter.put(
  '/me/password',
  requireAuth,
  asyncHandler(async (req, res) => {
    const data = passwordSchema.parse(req.body);
    const user = await prisma.user.findUniqueOrThrow({ where: { id: req.auth!.userId } });

    if (!(await bcrypt.compare(data.currentPassword, user.passwordHash))) {
      throw new HttpError(400, 'Your current password is incorrect');
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: await bcrypt.hash(data.newPassword, 10) },
    });

    res.json({ message: 'Password changed successfully' });
  }),
);

import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, 'Please enter your username or email address.'),
  password: z.string().min(1, 'Password is required.'),
  rememberMe: z.boolean().optional(),
});

export const clientRegisterSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Please enter a valid email address.'),
  phone: z.string().min(10, 'Please enter a valid phone number (min 10 digits).'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match.',
  path: ['confirmPassword'],
});

export const adminRegisterSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
  confirmPassword: z.string(),
  adminAccessCode: z.string().min(1, 'Admin Access Code is required.'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match.',
  path: ['confirmPassword'],
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
});

export type LoginFields = z.infer<typeof loginSchema>;
export type ClientRegisterFields = z.infer<typeof clientRegisterSchema>;
export type AdminRegisterFields = z.infer<typeof adminRegisterSchema>;
export type ForgotPasswordFields = z.infer<typeof forgotPasswordSchema>;

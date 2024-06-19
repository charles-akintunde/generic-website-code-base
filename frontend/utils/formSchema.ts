import { EPageType, EUserRole } from '@/types/enums';
import { z } from 'zod';

const passwordSchema = () =>
  z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long.' })
    .refine(
      (password) => {
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*()_+=[\]{};':"\\|,.<>/?]/.test(
          password
        );

        return hasUppercase && hasLowercase && hasNumber && hasSpecialChar;
      },
      {
        message:
          'Password must contain at least one uppercase, one lowercase, one number, and one special character.',
      }
    );

const emailSchema = () =>
  z.string().email({ message: 'Invalid email address.' });

const requiredTextSchema = (field: string) => {
  return z.string().min(1, `${field} is required`);
};

export const loginSchema = z.object({
  email: emailSchema(),
  password: passwordSchema(),
});

export const accountCreationSchema = z
  .object({
    firstname: requiredTextSchema('First name'),
    lastname: requiredTextSchema('Last name'),
    email: emailSchema(),
    password: passwordSchema(),
    confirmPassword: passwordSchema(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const passwordResetSchema = z
  .object({
    email: emailSchema(),
    newPassword: passwordSchema(),
    confirmPassword: passwordSchema(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const createPageSchema = z.object({
  pageName: requiredTextSchema('Page name'),
  pageType: z.nativeEnum(EPageType),
  pagePermission: z
    .array(z.nativeEnum(EUserRole))
    .min(1, 'At least one permission must be selected'),
  isHidden: z.boolean().default(false),
});

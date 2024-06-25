import { EPageType, EUserRole } from '@/types/enums';
import { TElement } from '@udecode/plate-common';
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

// const textNodeSchema = z.object({
//   text: z.string(),
// });

// const nodeSchema: z.ZodSchema<TElement> = z.lazy(() =>
//   z.union([
//     textNodeSchema,
//     z.object({
//       id: z.string(),
//       type: z.string(),
//       children: z.array(z.lazy(() => nodeSchema)).optional(),
//       // Add other properties that different Plate.js blocks might have
//     }),
//   ])
// );

const textSchema = z.object({
  text: z.string(),
});

const MAX_FILE_SIZE = 1024 * 1024 * 5; // 5 MB limit (adjust as needed)
const ACCEPTED_IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

const descendantSchema = z.lazy(() => z.union([elementSchema, textSchema]));

const elementSchema = z.object({
  children: z.array(descendantSchema),
  type: z.string(),
});

const plateJsSchema = z
  .array(elementSchema)
  .min(1, { message: 'Page content cannot be empty' });

const fileSchema = z.instanceof(File).superRefine((file, ctx) => {
  if (file.size > MAX_FILE_SIZE) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Image size exceeds 5MB limit',
    });
  }
  if (!ACCEPTED_IMAGE_MIME_TYPES.includes(file.type)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Only JPG, JPEG, PNG, and WEBP images are allowed',
    });
  }
});

const urlSchema = z.string().url();

const imageSchema = z.union([fileSchema, urlSchema]);

export const pageContentSchema = z.object({
  pageContentName: requiredTextSchema('Content Name'),
  pageContentDisplayImage: imageSchema,
  pageContents: plateJsSchema,
  isPageContentHidden: z.boolean().default(false),
});

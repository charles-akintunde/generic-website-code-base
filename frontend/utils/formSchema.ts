import { EPageType, EUserRole } from '../types/enums';
import { TElement } from '@udecode/plate-common';
import { z } from 'zod';
// import { parsePhoneNumberFromString } from 'libphonenumber-js';
// import { getCountries } from 'country-list';
// import { validate as validatePostalCode } from 'postcode-validator';

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
  return z
    .string()
    .min(1, `${field} is required`)
    .regex(/^[^-]+$/, `${field} should not contain dashes (-)`);
};

const requiredTextSchemaAllowDash = (field: string) => {
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
    token: z.string().min(1, 'Token is required'),
    newPassword: passwordSchema(),
    confirmPassword: passwordSchema(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const resetPasswordWithEmailSchema = z.object({
  email: emailSchema(),
});

export const createPageSchema = z.object({
  pageName: requiredTextSchemaAllowDash('Page Name').max(
    100,
    `Page Name must be at most 100 characters long`
  ),
  pageDisplayURL: requiredTextSchemaAllowDash('Page Display URL'),
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
const MAX_DOC_FILE_SIZE = 10 * 1024 * 1024;
const ACCEPTED_DOC_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/csv',
  'application/zip',
  'application/x-zip-compressed',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
];

//@ts-ignore
const descendantSchema = z.lazy(() => z.union([elementSchema, textSchema]));

//@ts-ignore
const elementSchema = z.object({
  children: z.array(descendantSchema),
  type: z.string(),
});

const plateJsSchema = z
  .array(elementSchema)
  .min(1, { message: 'Page content cannot be empty' });

const imageFileSchema = z.instanceof(Blob).superRefine((file, ctx) => {
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

const docFileSchema = z.instanceof(Blob).superRefine((file, ctx) => {
  // Check file size
  if (file.size > MAX_DOC_FILE_SIZE) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Document size exceeds 10MB limit',
    });
  }

  // Check MIME type
  if (!ACCEPTED_DOC_MIME_TYPES.includes(file.type)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Only PDF, DOC, and DOCX documents are allowed',
    });
  }
});

const urlSchema = z.union([z.string(), z.string().url()]);

const imageSchema = z.union([imageFileSchema, urlSchema]);
const fileSchema = z.union([docFileSchema, urlSchema]);

export const pageContentSchema = z.object({
  pageContentName: requiredTextSchemaAllowDash('Content Name').max(
    200,
    `Page Name must be at most 100 characters long`
  ),
  pageContentDisplayImage: imageSchema,
  pageContentCreatedAt: z
    .union([z.date(), z.string()])
    .transform((val) => (typeof val === 'string' ? new Date(val) : val))
    .optional(),
  pageContentUsersId: z.array(z.string()).optional(),
  pageContentDisplayURL: requiredTextSchemaAllowDash('Page Display URL').max(
    255,
    `Page Name must be at most 254 characters long`
  ),
  pageContentResource: fileSchema.optional(),
  editorContent: plateJsSchema.optional(),
  isPageContentHidden: z.boolean().default(false),
});

export const pageContentSchemaEdit = z.object({
  pageContentName: requiredTextSchemaAllowDash('Content Name').max(
    200,
    `Page Name must be at most 100 characters long`
  ),
  pageContentCreatedAt: z.date().optional(),
  pageContentUsersId: z.array(z.string()).optional(),
  pageContentDisplayURL: requiredTextSchemaAllowDash('Page Display URL').max(
    255,
    `Page Name must be at most 254 characters long`
  ),
  pageContentDisplayImage: imageSchema.optional(),
  pageContentResource: fileSchema.optional(),
  editorContent: plateJsSchema.optional(),
  isPageContentHidden: z.boolean().default(false),
});

export const pageContentImageSchema = z.object({
  pageContentImage: imageFileSchema,
  pageContentImageURL: urlSchema,
});

export const optionalImagePageContentSchema = z.object({
  pageContentName: requiredTextSchema('Content Name'),
  pageContentDisplayImage: imageSchema.optional(),
  editorContent: plateJsSchema,
  isPageContentHidden: z.boolean().default(false),
});

// const phoneNumberSchema = z.string().refine(
//   (value, context) => {
//     const countryCode = context.parent.uiCountry;
//     const phoneNumber = parsePhoneNumberFromString(value, countryCode);
//     return phoneNumber?.isValid();
//   },
//   {
//     message: 'Invalid phone number',
//   }
// );

// const postalCodeSchema = z.string().refine(
//   (value, context) => {
//     const countryCode = context.parent.uiCountry;
//     return validatePostalCode(value, countryCode);
//   },
//   {
//     message: 'Invalid postal code',
//   }
// );

export const userProfileSchema = z.object({
  uiFirstName: requiredTextSchema('First Name'),
  uiLastName: requiredTextSchema('Last Name'),
  uiPrefix: z
  .string()
  .max(10, "Prefix must be 10 characters or fewer.")
  .nullable()
  .optional(),
  uiSuffix: z
  .string()
  .max(10, "Suffix must be 10 characters or fewer.")
  .nullable()
  .optional(),
  uiCity: z.string().nullable().optional(),
  uiProvince: z.string().nullable().optional(),
  uiCountry: z.string().nullable().optional(),
  uiPostalCode: z.string().nullable().optional(),
  uiPhoneNumber: z.string().nullable().optional(),
  uiOrganization: z.string().nullable().optional(),
  uiPhoto: imageSchema.nullable().optional(),
  // uiAbout: z.string().nullable().optional(),
});

export const userRoleStatusSchema = z
  .object({
    uiMainRoles: z
      .string()
      .optional()
      .refine(
        //@ts-ignore
        (value, ctx) => {
          const isUserAlumni = ctx?.parent?.uiIsUserAlumni;
          const memberPosition = ctx?.parent?.uiMemberPosition;
          // If not Alumni and Member Position is empty, Role is required
          if (!isUserAlumni && (!value || value.trim() === '') && !memberPosition) {
            return false;
          }
          return true;
        },
        { message: 'Role must be selected if Member Position is empty and the user is not an Alumni.' }
      ),
    uiStatus: z.string().optional(),
    uiMemberPosition: z.string().optional(),
    uiIsUserAlumni: z.boolean().default(false),
  })
  .refine(
    (data) => {
      if (
        data.uiMainRoles &&
        data.uiMainRoles.includes(EUserRole.Member) &&
        !data.uiMemberPosition
      ) {
        return false;
      }
      return true;
    },
    {
      message:"Member Position is required when the role is 'Member'.",
      path: ['uiMemberPosition'], // Attach the error to uiMemberPosition
    }
  )
  .refine(
    (data) => {
      if (data.uiIsUserAlumni && (!data.uiMemberPosition || data.uiMemberPosition.trim() === '')) {
        return false;
      }
      return true;
    },
    {
      message: 'Member Position cannot be empty when the user is an Alumni.',
      path: ['uiMemberPosition'], // Attach the error to uiMemberPosition
    }
  );

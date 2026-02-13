import { Request, Response, NextFunction } from 'express';
import { z, ZodSchema } from 'zod';

export const validate = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors,
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  };
};

// Validation schemas
export const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const moodTextSchema = z.object({
  text: z.string().min(10, 'Text must be at least 10 characters'),
});

export const saveContentSchema = z.object({
  type: z.enum(['meme', 'playlist', 'quote', 'mood', 'wallpaper']),
  contentData: z.object({
    title: z.string().optional(),
    url: z.string().optional(),
    description: z.string().optional(),
    mood: z.string().optional(),
    imageUrl: z.string().optional(),
    metadata: z.any().optional(),
  }),
});

export const createPollSchema = z.object({
  question: z.string().min(5, 'Question must be at least 5 characters').max(200),
  options: z.array(z.string()).min(2, 'Poll must have at least 2 options').max(6, 'Poll cannot have more than 6 options'),
  expiresIn: z.number().optional(), // hours
});

export const votePollSchema = z.object({
  optionIndex: z.number().min(0),
});

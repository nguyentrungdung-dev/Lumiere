import { z } from 'zod';

// Reusable field validators
export const emailValidator = z
  .string()
  .min(1, 'Email is required')
  .email('Invalid email format');

export const usernameValidator = z
  .string()
  .min(3, 'Username must be at least 3 characters')
  .max(20, 'Username must be less than 20 characters')
  .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores');

export const passwordValidator = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

export const fullNameValidator = z
  .string()
  .min(2, 'Full name must be at least 2 characters')
  .max(100, 'Full name must be less than 100 characters')
  .optional()
  .or(z.literal(''));

// Login form schema
export const loginSchema = z.object({
  username: z.string().min(1, 'Username or email is required'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// Register form schema
export const registerSchema = z
  .object({
    username: usernameValidator,
    email: emailValidator,
    full_name: fullNameValidator,
    password: passwordValidator,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

// Password strength calculator
export const calculatePasswordStrength = (password: string): {
  strength: 'weak' | 'medium' | 'strong';
  score: number;
  feedback: string;
} => {
  let score = 0;
  
  if (!password) {
    return { strength: 'weak', score: 0, feedback: 'Enter a password' };
  }
  
  // Length check
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  
  // Character variety checks
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^a-zA-Z0-9]/.test(password)) score += 1;
  
  // Determine strength
  let strength: 'weak' | 'medium' | 'strong';
  let feedback: string;
  
  if (score <= 2) {
    strength = 'weak';
    feedback = 'Weak password';
  } else if (score <= 4) {
    strength = 'medium';
    feedback = 'Medium password';
  } else {
    strength = 'strong';
    feedback = 'Strong password';
  }
  
  return { strength, score, feedback };
};


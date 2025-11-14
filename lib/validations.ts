// lib/validations.ts - Comprehensive Zod validation schemas
import { z } from "zod";

// Email validation
export const emailSchema = z
  .string()
  .email("Please enter a valid email address")
  .min(5, "Email is too short")
  .max(254, "Email is too long")
  .trim()
  .toLowerCase();

// Name validation (no special chars, XSS protection)
export const nameSchema = z
  .string()
  .min(1, "Name is required")
  .max(100, "Name is too long")
  .trim()
  .regex(
    /^[a-zA-Z\s'-]+$/,
    "Name can only contain letters, spaces, hyphens, and apostrophes"
  );

// User input validation for chat messages
export const chatMessageSchema = z
  .string()
  .min(5, "Message is too short. Please provide more details.")
  .max(500, "Message is too long. Keep it under 500 characters.")
  .trim()
  .refine(
    (val) => {
      // Check for suspicious patterns (basic XSS/injection prevention)
      const suspiciousPatterns = [
        /<script/i,
        /javascript:/i,
        /on\w+\s*=/i,
        /<iframe/i,
      ];
      return !suspiciousPatterns.some((pattern) => pattern.test(val));
    },
    { message: "Message contains invalid characters" }
  );

// Analytics event validation
export const analyticsEventSchema = z.object({
  eventName: z.string().min(1).max(100),
  eventParams: z
    .record(z.union([z.string(), z.number(), z.boolean()]))
    .optional(),
});

// Packing item validation
export const packingItemSchema = z.object({
  item_name: z.string().min(1).max(200).trim(),
  description: z.string().min(1).max(500).trim(),
  category: z.string().min(1).max(100).trim(),
  checked: z.boolean().optional().default(false),
});

export const packingListSchema = z.array(packingItemSchema).min(1).max(100);

// URL validation for share links
export const urlSchema = z.string().url("Invalid URL format");

// List ID validation (nanoid format)
export const listIdSchema = z
  .string()
  .min(10, "Invalid list ID")
  .max(30, "Invalid list ID")
  .regex(/^[a-zA-Z0-9_-]+$/, "Invalid list ID format");

// Trip context validation
export const tripContextSchema = z.object({
  destination: z.string().min(1).max(200).trim().optional(),
  duration: z.string().min(1).max(100).trim().optional(),
  activities: z.string().min(1).max(500).trim().optional(),
  weather: z.string().min(1).max(200).trim().optional(),
});

// Helper function to safely parse and return errors
export function safeValidate<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: string } {
  try {
    const result = schema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors[0]?.message || "Validation failed",
      };
    }
    return { success: false, error: "Unknown validation error" };
  }
}

// Sanitize string to prevent XSS
export function sanitizeString(input: string): string {
  return input
    .replace(/[<>]/g, "") // Remove angle brackets
    .replace(/javascript:/gi, "") // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, "") // Remove event handlers
    .trim();
}

// Hash email for privacy (simple hash for analytics)
export function hashEmail(email: string): string {
  let hash = 0;
  for (let i = 0; i < email.length; i++) {
    const char = email.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return `user_${Math.abs(hash).toString(36)}`;
}

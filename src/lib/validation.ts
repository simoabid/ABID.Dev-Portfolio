/**
 * Contact form validation utilities.
 *
 * Shared between server (API route) and client (ContactForm)
 * to ensure consistent validation rules.
 */

export interface ContactFormData {
  readonly name: string;
  readonly email: string;
  readonly message: string;
}

export interface ValidationErrors {
  name?: string;
  email?: string;
  message?: string;
  form?: string;
}

const NAME_MIN_LENGTH = 2;
const NAME_MAX_LENGTH = 100;
const MESSAGE_MIN_LENGTH = 10;
const MESSAGE_MAX_LENGTH = 5000;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Validate a single field. Returns an error message or undefined. */
export function validateField(
  field: keyof ContactFormData,
  value: string
): string | undefined {
  switch (field) {
    case 'name': {
      const trimmed = value.trim();
      if (!trimmed) return 'Name is required';
      if (trimmed.length < NAME_MIN_LENGTH) return `Name must be at least ${NAME_MIN_LENGTH} characters`;
      if (value.length > NAME_MAX_LENGTH) return `Name must be under ${NAME_MAX_LENGTH} characters`;
      return undefined;
    }
    case 'email': {
      if (!value.trim()) return 'Email is required';
      if (!EMAIL_REGEX.test(value)) return 'Please enter a valid email address';
      return undefined;
    }
    case 'message': {
      const trimmed = value.trim();
      if (!trimmed) return 'Message is required';
      if (trimmed.length < MESSAGE_MIN_LENGTH) return `Message must be at least ${MESSAGE_MIN_LENGTH} characters`;
      if (value.length > MESSAGE_MAX_LENGTH) return `Message must be under ${MESSAGE_MAX_LENGTH} characters`;
      return undefined;
    }
  }
}

/** Validate the full form. Returns an object of field errors (empty = valid). */
export function validateContactForm(data: ContactFormData): ValidationErrors {
  const errors: ValidationErrors = {};
  const nameErr = validateField('name', data.name);
  const emailErr = validateField('email', data.email);
  const messageErr = validateField('message', data.message);
  if (nameErr) errors.name = nameErr;
  if (emailErr) errors.email = emailErr;
  if (messageErr) errors.message = messageErr;
  return errors;
}

/** Check if errors object has any entries. */
export function hasErrors(errors: ValidationErrors): boolean {
  return Object.keys(errors).length > 0;
}

/** Character limit for the message field (exported for the UI counter). */
export const MESSAGE_CHAR_LIMIT = MESSAGE_MAX_LENGTH;

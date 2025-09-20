/**
 * Input sanitization utilities for security
 */

// Basic HTML tag stripping for text inputs
export const sanitizeText = (input: string): string => {
  if (!input) return '';
  return input
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/[<>]/g, '') // Remove remaining angle brackets
    .trim();
};

// Email validation and sanitization
export const sanitizeEmail = (email: string): string => {
  if (!email) return '';
  return email.toLowerCase().trim();
};

// Phone number sanitization
export const sanitizePhone = (phone: string): string => {
  if (!phone) return '';
  return phone.replace(/[^\d\-+\(\)\s]/g, '').trim();
};

// Company/business name sanitization
export const sanitizeCompanyName = (name: string): string => {
  if (!name) return '';
  return name
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/[<>"']/g, '') // Remove potentially dangerous characters
    .trim();
};

// General text area sanitization (for descriptions, notes, etc.)
export const sanitizeTextArea = (text: string): string => {
  if (!text) return '';
  return text
    .replace(/<script[^>]*>.*?<\/script>/gi, '') // Remove script tags
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocols
    .trim();
};

// Password strength validation
export const validatePasswordStrength = (password: string): { isValid: boolean; message: string } => {
  if (password.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters long' };
  }
  
  if (!/(?=.*[a-z])/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one lowercase letter' };
  }
  
  if (!/(?=.*[A-Z])/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one uppercase letter' };
  }
  
  if (!/(?=.*\d)/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one number' };
  }
  
  return { isValid: true, message: 'Password strength is good' };
};
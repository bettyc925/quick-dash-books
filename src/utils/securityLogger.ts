/**
 * Security event logging utilities
 */

export type SecurityEventType = 
  | 'auth_login_success'
  | 'auth_login_failure'
  | 'auth_signup_success'
  | 'auth_signup_failure'
  | 'auth_password_reset'
  | 'auth_logout'
  | 'rate_limit_exceeded'
  | 'suspicious_activity'
  | 'company_merge_request'
  | 'company_merge_approved'
  | 'company_merge_rejected';

export interface SecurityEvent {
  type: SecurityEventType;
  userId?: string;
  email?: string;
  ip?: string;
  userAgent?: string;
  details?: Record<string, any>;
  timestamp: string;
}

/**
 * Log a security event
 */
export const logSecurityEvent = async (event: Omit<SecurityEvent, 'timestamp'>): Promise<void> => {
  const securityEvent: SecurityEvent = {
    ...event,
    timestamp: new Date().toISOString(),
    ip: await getClientIP(),
    userAgent: navigator.userAgent,
  };

  // In a production environment, you would send this to your logging service
  // For now, we'll log to console and could store in a local security log
  console.log('[SECURITY EVENT]', securityEvent);

  // Store in sessionStorage for debugging (in production, send to secure logging service)
  const existingLogs = JSON.parse(sessionStorage.getItem('securityLogs') || '[]');
  existingLogs.push(securityEvent);
  
  // Keep only the last 50 events in sessionStorage
  if (existingLogs.length > 50) {
    existingLogs.splice(0, existingLogs.length - 50);
  }
  
  sessionStorage.setItem('securityLogs', JSON.stringify(existingLogs));
};

/**
 * Get client IP address (best effort)
 */
const getClientIP = async (): Promise<string | undefined> => {
  try {
    // In production, you might want to use a service or have the server provide this
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    return undefined;
  }
};

/**
 * Get security logs from session storage
 */
export const getSecurityLogs = (): SecurityEvent[] => {
  try {
    return JSON.parse(sessionStorage.getItem('securityLogs') || '[]');
  } catch (error) {
    return [];
  }
};

/**
 * Clear security logs (for debugging)
 */
export const clearSecurityLogs = (): void => {
  sessionStorage.removeItem('securityLogs');
};

import { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Shield, Eye, AlertTriangle, Trash2 } from 'lucide-react';
import { getSecurityLogs, clearSecurityLogs, type SecurityEvent } from '@/utils/securityLogger';

export default function SecurityAuditTrail() {
  const [logs, setLogs] = useState<SecurityEvent[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();
  
  // Don't show security logs on auth page to prevent interference
  const shouldHide = useMemo(() => {
    return location.pathname === '/auth';
  }, [location.pathname]);

  useEffect(() => {
    if (isVisible) {
      setLogs(getSecurityLogs());
    }
  }, [isVisible]);
  
  if (shouldHide) {
    return null;
  }

  const getEventBadge = (type: string) => {
    const eventConfig = {
      'auth_login_success': { color: 'bg-green-100 text-green-800', label: 'Login Success' },
      'auth_login_failure': { color: 'bg-red-100 text-red-800', label: 'Login Failed' },
      'auth_signup_success': { color: 'bg-blue-100 text-blue-800', label: 'Signup Success' },
      'auth_signup_failure': { color: 'bg-red-100 text-red-800', label: 'Signup Failed' },
      'auth_password_reset': { color: 'bg-yellow-100 text-yellow-800', label: 'Password Reset' },
      'auth_logout': { color: 'bg-gray-100 text-gray-800', label: 'Logout' },
      'rate_limit_exceeded': { color: 'bg-orange-100 text-orange-800', label: 'Rate Limited' },
      'suspicious_activity': { color: 'bg-red-100 text-red-800', label: 'Suspicious' },
      'company_merge_request': { color: 'bg-purple-100 text-purple-800', label: 'Merge Request' },
      'company_merge_approved': { color: 'bg-green-100 text-green-800', label: 'Merge Approved' },
      'company_merge_rejected': { color: 'bg-red-100 text-red-800', label: 'Merge Rejected' },
    };

    const config = eventConfig[type as keyof typeof eventConfig] || { color: 'bg-gray-100 text-gray-800', label: type };
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const handleClearLogs = () => {
    clearSecurityLogs();
    setLogs([]);
  };

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsVisible(true)}
          variant="outline"
          size="sm"
          className="shadow-lg"
        >
          <Shield className="mr-2 h-4 w-4" />
          Security Logs
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 z-50">
      <Card className="shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Security Audit Trail
              </CardTitle>
              <CardDescription className="text-xs">
                Recent security events ({logs.length} events)
              </CardDescription>
            </div>
            <div className="flex gap-1">
              <Button
                onClick={handleClearLogs}
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
              <Button
                onClick={() => setIsVisible(false)}
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
              >
                <Eye className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <ScrollArea className="h-64">
            {logs.length === 0 ? (
              <div className="text-center text-sm text-muted-foreground py-8">
                No security events recorded
              </div>
            ) : (
              <div className="space-y-2">
                {logs.slice(-20).reverse().map((log, index) => (
                  <div key={index} className="border rounded-lg p-3 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      {getEventBadge(log.type)}
                      <span className="text-muted-foreground">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    {log.email && (
                      <div className="text-muted-foreground">
                        User: {log.email}
                      </div>
                    )}
                    {log.ip && (
                      <div className="text-muted-foreground">
                        IP: {log.ip}
                      </div>
                    )}
                    {log.details && Object.keys(log.details).length > 0 && (
                      <div className="text-muted-foreground mt-1">
                        {Object.entries(log.details).map(([key, value]) => (
                          <div key={key}>
                            {key}: {typeof value === 'string' ? value : JSON.stringify(value)}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
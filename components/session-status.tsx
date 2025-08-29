"use client";

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, LogOut, RefreshCw } from 'lucide-react';
import { useAuthManager } from '@/hooks/useAuthManager';
import { getTimeUntilExpiration } from '@/utils/auth';

interface SessionStatusProps {
  showCard?: boolean;
  className?: string;
}

export default function SessionStatus({ showCard = false, className = "" }: SessionStatusProps) {
  const { token, isAuthenticated } = useSelector((state: any) => state.auth);
  const { handleLogout, timeUntilExpiration } = useAuthManager();
  const [displayTime, setDisplayTime] = useState<string>('');

  useEffect(() => {
    if (!token || !isAuthenticated) return;

    const updateDisplayTime = () => {
      const timeLeft = getTimeUntilExpiration(token);
      if (timeLeft <= 0) {
        setDisplayTime('Expired');
        return;
      }

      const hours = Math.floor(timeLeft / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

      if (hours > 0) {
        setDisplayTime(`${hours}h ${minutes}m`);
      } else if (minutes > 0) {
        setDisplayTime(`${minutes}m ${seconds}s`);
      } else {
        setDisplayTime(`${seconds}s`);
      }
    };

    // Update immediately
    updateDisplayTime();

    // Update every second
    const interval = setInterval(updateDisplayTime, 1000);

    return () => clearInterval(interval);
  }, [token, isAuthenticated]);

  if (!isAuthenticated || !token) {
    return null;
  }

  const timeLeft = getTimeUntilExpiration(token);
  const isExpiringSoon = timeLeft < 5 * 60 * 1000; // Less than 5 minutes
  const isExpired = timeLeft <= 0;

  const statusVariant = isExpired ? 'destructive' : isExpiringSoon ? 'secondary' : 'outline';

  const content = (
    <div className={`flex items-center gap-2 ${className}`}>
      <Clock className="h-4 w-4" />
      <span className="text-sm">Session:</span>
      <Badge variant={statusVariant}>
        {displayTime}
      </Badge>
      {isExpiringSoon && !isExpired && (
        <Button
          size="sm"
          variant="outline"
          onClick={() => window.location.reload()}
          className="h-6 px-2"
        >
          <RefreshCw className="h-3 w-3 mr-1" />
          Refresh
        </Button>
      )}
      <Button
        size="sm"
        variant="ghost"
        onClick={() => handleLogout('manual')}
        className="h-6 px-2 text-muted-foreground hover:text-destructive"
      >
        <LogOut className="h-3 w-3 mr-1" />
        Logout
      </Button>
    </div>
  );

  if (showCard) {
    return (
      <Card className="w-fit">
        <CardContent className="p-3">
          {content}
        </CardContent>
      </Card>
    );
  }

  return content;
}

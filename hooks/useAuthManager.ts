import { useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { logout } from '@/api/features/auth/authSlice';
import { isTokenExpired, getTimeUntilExpiration } from '@/utils/auth';
import { toast } from '@/components/ui/use-toast';

interface UseAuthManagerOptions {
  idleTimeoutMinutes?: number;
  checkIntervalMs?: number;
  showWarningBeforeLogout?: boolean;
  warningTimeMs?: number;
}

export const useAuthManager = (options: UseAuthManagerOptions = {}) => {
  const {
    idleTimeoutMinutes = 10,
    checkIntervalMs = 60000, // Check every minute
    showWarningBeforeLogout = true,
    warningTimeMs = 60000, // Show warning 1 minute before logout
  } = options;

  const dispatch = useDispatch();
  const router = useRouter();
  const { token, isAuthenticated } = useSelector((state: any) => state.auth);

  // Refs to track timers and activity
  const lastActivityRef = useRef<number>(Date.now());
  const tokenCheckIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const idleTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const warningTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasShownWarningRef = useRef<boolean>(false);

  // Activity events to track
  const activityEvents = [
    'mousedown',
    'mousemove',
    'keypress',
    'scroll',
    'touchstart',
    'click',
  ];

  const handleLogout = useCallback((reason: 'expired' | 'idle' | 'manual' = 'manual') => {
    // Clear all timers
    if (tokenCheckIntervalRef.current) {
      clearInterval(tokenCheckIntervalRef.current);
    }
    if (idleTimeoutRef.current) {
      clearTimeout(idleTimeoutRef.current);
    }
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
    }

    // Show appropriate toast message
    switch (reason) {
      case 'expired':
        toast({
          title: 'Session Expired',
          description: 'Your session has expired. Please log in again.',
          variant: 'destructive',
        });
        break;
      case 'idle':
        toast({
          title: 'Session Timeout',
          description: `You've been logged out due to ${idleTimeoutMinutes} minutes of inactivity.`,
          variant: 'destructive',
        });
        break;
    }

    // Dispatch logout action
    dispatch(logout());
    
    // Redirect to auth page
    router.push('/auth');
  }, [dispatch, router, idleTimeoutMinutes]);

  const showIdleWarning = useCallback(() => {
    if (hasShownWarningRef.current) return;
    
    hasShownWarningRef.current = true;
    toast({
      title: 'Session Warning',
      description: `You will be logged out in 1 minute due to inactivity. Move your mouse or press a key to stay logged in.`,
      duration: 10000, // Show for 10 seconds
    });
  }, []);

  const resetIdleTimer = useCallback(() => {
    lastActivityRef.current = Date.now();
    hasShownWarningRef.current = false;

    // Clear existing timers
    if (idleTimeoutRef.current) {
      clearTimeout(idleTimeoutRef.current);
    }
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
    }

    // Set new timers
    const idleTimeoutMs = idleTimeoutMinutes * 60 * 1000;
    
    if (showWarningBeforeLogout) {
      // Set warning timer
      warningTimeoutRef.current = setTimeout(() => {
        showIdleWarning();
      }, idleTimeoutMs - warningTimeMs);
    }

    // Set logout timer
    idleTimeoutRef.current = setTimeout(() => {
      handleLogout('idle');
    }, idleTimeoutMs);
  }, [idleTimeoutMinutes, showWarningBeforeLogout, warningTimeMs, showIdleWarning, handleLogout]);

  const handleActivity = useCallback(() => {
    resetIdleTimer();
  }, [resetIdleTimer]);

  const checkTokenExpiration = useCallback(() => {
    if (!token || !isAuthenticated) return;

    if (isTokenExpired(token)) {
      handleLogout('expired');
      return;
    }

    // Check if token will expire soon (within next check interval)
    const timeUntilExpiration = getTimeUntilExpiration(token);
    if (timeUntilExpiration > 0 && timeUntilExpiration < checkIntervalMs * 2) {
      toast({
        title: 'Session Expiring Soon',
        description: 'Your session will expire soon. Please save your work.',
        duration: 5000,
      });
    }
  }, [token, isAuthenticated, handleLogout, checkIntervalMs]);

  useEffect(() => {
    if (!isAuthenticated || !token) return;

    // Initial token check
    checkTokenExpiration();

    // Set up token expiration checking interval
    tokenCheckIntervalRef.current = setInterval(checkTokenExpiration, checkIntervalMs);

    // Set up activity listeners
    activityEvents.forEach((event) => {
      document.addEventListener(event, handleActivity, true);
    });

    // Initialize idle timer
    resetIdleTimer();

    // Cleanup function
    return () => {
      // Clear intervals and timeouts
      if (tokenCheckIntervalRef.current) {
        clearInterval(tokenCheckIntervalRef.current);
      }
      if (idleTimeoutRef.current) {
        clearTimeout(idleTimeoutRef.current);
      }
      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current);
      }

      // Remove activity listeners
      activityEvents.forEach((event) => {
        document.removeEventListener(event, handleActivity, true);
      });
    };
  }, [isAuthenticated, token, checkTokenExpiration, handleActivity, resetIdleTimer]);

  return {
    handleLogout,
    resetIdleTimer,
    isTokenExpired: token ? isTokenExpired(token) : true,
    timeUntilExpiration: token ? getTimeUntilExpiration(token) : 0,
  };
};

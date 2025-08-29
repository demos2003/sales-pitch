"use client";

import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useAuthManager } from '@/hooks/useAuthManager';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const { isAuthenticated } = useSelector((state: any) => state.auth);
  const router = useRouter();

  // Initialize auth manager with custom settings
  const { handleLogout } = useAuthManager({
    idleTimeoutMinutes: 10, // 10 minutes of inactivity
    checkIntervalMs: 60000, // Check token every minute
    showWarningBeforeLogout: true,
    warningTimeMs: 60000, // Show warning 1 minute before logout
  });

  useEffect(() => {
    // Redirect to auth page if not authenticated
    if (!isAuthenticated) {
      router.push('/auth');
    }
  }, [isAuthenticated, router]);

  // Don't render children if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

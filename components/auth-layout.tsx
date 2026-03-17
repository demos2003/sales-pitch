"use client";

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useAuthManager } from '@/hooks/useAuthManager';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const { isAuthenticated } = useSelector((state: any) => state.auth);
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Initialize auth manager with custom settings
  const { handleLogout } = useAuthManager({
    idleTimeoutMinutes: 10,
    checkIntervalMs: 60000,
    showWarningBeforeLogout: true,
    warningTimeMs: 60000,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push('/auth');
    }
  }, [mounted, isAuthenticated, router]);

  // Render null until mounted so the client's initial render matches the server
  if (!mounted || !isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

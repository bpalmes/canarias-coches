"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getToken } from '@/utils/auth';

const withAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  const AuthComponent = (props: P) => {
    const router = useRouter();

    useEffect(() => {
      const token = getToken();
      if (!token) {
        router.replace('/admin/login');
      }
    }, [router]);

    return <WrappedComponent {...props} />;
  };

  return AuthComponent;
};

export default withAuth; 
"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import withAuth from '@/components/withAuth';

function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirigir al dashboard del admin
    router.push('/admin/dashboard');
  }, [router]);

  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p>Redirigiendo al panel de administración...</p>
      </div>
    </div>
  );
}

export default withAuth(AdminPage); 
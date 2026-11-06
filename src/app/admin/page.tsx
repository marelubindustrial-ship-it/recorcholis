import type { Metadata } from 'next';
import AdminExperience from '@/components/admin/AdminExperience';

export const metadata: Metadata = {
  title: 'CRM Recórcholis',
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminExperience />;
}

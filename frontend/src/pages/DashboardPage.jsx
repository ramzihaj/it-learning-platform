import { useEffect } from 'react';
import Dashboard from '@/components/Dashboard';

/**
 * Page du tableau de bord
 */
export default function DashboardPage() {
  useEffect(() => {
    document.title = 'Tableau de Bord - IT Learning Platform';
  }, []);

  return <Dashboard />;
}

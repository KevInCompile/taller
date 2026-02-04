import { Outlet } from 'react-router-dom';
import Sidebar from '../sidebar/Sidebar';

export const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { DashboardLayout } from '../components/layout/LayoutDashboard';
import App from '../App';
import { WorkshopGuard } from '../components/guard/WorkshopGuard';
import { LoginPage } from '../modules/login';
import { RegisterPage } from '../modules/register';
import { OrdersPage } from '../modules/orders/orders';
import { SuppliesPage } from '../modules/supplies/supplies';
import { ServicesPage } from '../modules/types-services/services';
import { CustomersPage } from '../modules/customers/customers';
import { CustomerDetail } from '../modules/customers/ui/CustomerDetails';
import { SettingsPage } from '../modules/settings/settings';

// Componente para proteger
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = useAuthStore(state => state.token);
  return token ? children : <Navigate to="/login" />;
};

const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  {
    path: "/",
    element: <ProtectedRoute><DashboardLayout /></ProtectedRoute>,
    children: [
        { index: true, element: <App /> },
        // {
        //   path: "inventario",
        //   element: <WorkshopGuard><InventoryPage /></WorkshopGuard> // Protegido
        // },
        {
          path: "orders",
          element: <WorkshopGuard><OrdersPage /></WorkshopGuard>
        },
        {
          path: "supplies",
          element: <WorkshopGuard><SuppliesPage /></WorkshopGuard>
        },
        {
          path: "types-services",
          element: <WorkshopGuard><ServicesPage /></WorkshopGuard>
        },
        {
          path: "customers",
          element: <WorkshopGuard><CustomersPage /></WorkshopGuard>
        },
        {
          path: "customer/:id",
          element: <WorkshopGuard><CustomerDetail /></WorkshopGuard> // Protegido
        },
        { path: "settings", element: <SettingsPage /> },
      ]
  },
]);

export const AppRouter = () => <RouterProvider router={router} />;

import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { LoginPage } from '../pages/login';
import { RegisterPage } from '../pages/register';
import { SettingsPage } from '../pages/settings';
import { DashboardLayout } from '../components/layout/LayoutDashboard';
import App from '../App';
import { WorkshopGuard } from '../components/auth/WorkshopGuard';
import { CustomersPage } from '../pages/customers/customers';
import { CustomerDetail } from '../pages/customers/CustomerDetails';
import { OrdersPage } from '../pages/orders/orders';
import { SuppliesPage } from '../pages/supplies/supplies';
import { ServicesPage } from '../pages/services/services';

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
          path: "tipos-servicio",
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
        { path: "settings", element: <SettingsPage /> }, // Libre para que lo cree
      ]
  },
]);

export const AppRouter = () => <RouterProvider router={router} />;

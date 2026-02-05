import { useMemo, useState } from 'react';
import { useCustomers } from '../hooks/useCustomers';
import { Plus, Search, UserPlus, Loader2, Users, X } from 'lucide-react';

export const CustomersPage = () => {
  const { customers, loading } = useCustomers();
  const [searchTerm, setSearchTerm] = useState('');

  // Lógica de filtrado inteligente
  const filteredCustomers = useMemo(() => {
    if (!searchTerm.trim()) return customers;

    const lowerTerm = searchTerm.toLowerCase();

    return customers.filter((customer) => {
      const fullName = `${customer.firstName} ${customer.lastName}`.toLowerCase();
      const phone = customer.phone.toLowerCase();
      const email = customer.email.toLowerCase();

      const hasMatchingVehicle = customer.vehicles.some((v) =>
        v.plate.toLowerCase().includes(lowerTerm)
      );

      return (
        fullName.includes(lowerTerm) ||
        phone.includes(lowerTerm) ||
        email.includes(lowerTerm) ||
        hasMatchingVehicle
      );
    });
  }, [searchTerm, customers]);

  return (
    <div className="space-y-6 animate-fadeIn p-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Clientes</h1>
          <p className="text-gray-500 text-sm">Base de datos de propietarios y vehículos.</p>
        </div>
        <button className="bg-brand-accent text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-orange-600 transition shadow-lg shadow-orange-200">
          <UserPlus size={20} /> Nuevo Cliente
        </button>
      </header>

      {/* Buscador */}
      <div className="relative group">
        <Search className={`absolute left-3 top-3 transition-colors ${searchTerm ? 'text-brand-accent' : 'text-gray-400'}`} size={20} />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por nombre, teléfono, email o placa (ABC-123)..."
          className="w-full pl-10 pr-10 p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-accent outline-none transition-all shadow-sm group-hover:border-gray-300"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        )}
      </div>
      {/* Contenedor de Tabla / Loading */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden min-h-100">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-100 text-gray-400">
            <Loader2 className="animate-spin mb-4 text-brand-accent" size={40} />
            <p className="font-medium animate-pulse">Consultando base de datos...</p>
          </div>
        ) : customers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-100 text-center p-6">
            <div className="bg-gray-50 p-6 rounded-full mb-4">
              <Users size={48} className="text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-700">No hay clientes aún</h3>
            <p className="text-gray-500 max-w-xs mt-1">Registra a tu primer cliente para empezar a gestionar sus vehículos.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
                <tr>
                  <th className="px-6 py-4">Nombre</th>
                  <th className="px-6 py-4">Contacto</th>
                  <th className="px-6 py-4">Vehículos</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {customer.firstName} {customer.lastName}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="text-gray-700">{customer.phone}</div>
                      <div className="text-gray-400 text-xs">{customer.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {customer.vehicles.length > 0 ? (
                          customer.vehicles.map((v) => (
                            <span key={v.id} className="bg-orange-50 text-brand-accent text-[10px] px-2 py-0.5 rounded border border-orange-100 font-bold uppercase">
                              {v.plate}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-300 text-xs italic">0 vehículos</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-gray-400 hover:text-brand-accent transition-colors p-2">
                        <Plus size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

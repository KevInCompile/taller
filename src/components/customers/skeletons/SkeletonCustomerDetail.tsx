export const CustomerDetailSkeleton = () => {
  return (
    <div className="space-y-6 animate-pulse p-8">
      {/* Botón Volver Skeleton */}
      <div className="h-4 w-32 bg-gray-200 rounded-md mb-4"></div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* COLUMNA PERFIL (Izquierda) */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex flex-col items-center text-center mb-8">
            {/* Avatar circular */}
            <div className="w-20 h-20 bg-gray-200 rounded-full mb-4"></div>
            {/* Nombre */}
            <div className="h-6 w-40 bg-gray-200 rounded-md mb-2"></div>
            {/* Badge de estado */}
            <div className="h-4 w-24 bg-gray-100 rounded-full"></div>
          </div>

          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-100 rounded-lg"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-2 w-16 bg-gray-100 rounded"></div>
                  <div className="h-4 w-full bg-gray-50 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* COLUMNA GARAJE (Derecha) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div className="h-6 w-48 bg-gray-200 rounded-md"></div>
              <div className="h-8 w-32 bg-gray-100 rounded-xl"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2].map((i) => (
                <div key={i} className="border border-gray-50 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between">
                    <div className="h-6 w-20 bg-gray-200 rounded"></div>
                    <div className="h-5 w-5 bg-gray-100 rounded"></div>
                  </div>
                  <div className="h-5 w-3/4 bg-gray-100 rounded"></div>
                  <div className="h-3 w-1/2 bg-gray-50 rounded"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Historial de Órdenes Skeleton */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="h-6 w-40 bg-gray-200 rounded-md mb-6"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 w-full bg-gray-50 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Overlay opcional para mayor feedback */}
      {/*<div className="fixed bottom-10 right-10 flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-lg border border-gray-100 text-gray-400 text-sm">
        <Loader2 className="animate-spin text-brand-accent" size={18} />
        Sincronizando datos...
      </div>*/}
    </div>
  );
};

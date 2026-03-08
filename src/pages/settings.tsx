import { useState } from 'react';
import { User, Store } from 'lucide-react';
import { TabButton } from '../components/ui/TabButton';
import { ProfileTab } from '../components/settings/ProfileTab';
import { WorkshopTab } from '../components/settings/WorkshopTab';

type Tab = 'profile' | 'workshop';

export const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState<Tab>('profile');

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Configuración</h1>

      <div className="flex gap-4 border-b border-gray-200 mb-8">
        <TabButton
          active={activeTab === 'profile'}
          onClick={() => setActiveTab('profile')}
          icon={<User size={18} />}
          label="Perfil Personal"
        />
        <TabButton
          active={activeTab === 'workshop'}
          onClick={() => setActiveTab('workshop')}
          icon={<Store size={18} />}
          label="Datos del Negocio"
        />
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        {activeTab === 'profile' ? <ProfileTab /> : <WorkshopTab />}
      </div>
    </div>
  );
};
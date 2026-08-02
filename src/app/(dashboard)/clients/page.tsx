'use client';

import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { api } from '../../../lib/api';
import AddClientModal from './AddClientModal';

interface Client {
  id: string;
  name: string;
  phone: string;
  company: string | null;
  status: string;
  source: { name: string } | null;
  manager: { email: string } | null;
  createdAt: string;
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchClients = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/clients');
      setClients(res.data);
    } catch (error) {
      console.error('Ошибка загрузки клиентов', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">Клиенты</h1>
          <p className="text-sm text-neutral-400 mt-1">Управление базой клиентов и лидами</p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-neutral-200 transition-colors"
        >
          <Plus size={16} />
          Добавить клиента
        </button>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-neutral-300">
            <thead className="bg-neutral-950/50 text-neutral-400 border-b border-neutral-800">
              <tr>
                <th className="px-6 py-4 font-medium">Имя</th>
                <th className="px-6 py-4 font-medium">Телефон</th>
                <th className="px-6 py-4 font-medium">Компания</th>
                <th className="px-6 py-4 font-medium">Статус</th>
                <th className="px-6 py-4 font-medium">Источник</th>
                <th className="px-6 py-4 font-medium">Менеджер</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-neutral-500">Загрузка данных...</td>
                </tr>
              ) : clients.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-neutral-500">Нет клиентов. Добавьте первого!</td>
                </tr>
              ) : (
                clients.map((client) => (
                  <tr key={client.id} className="hover:bg-neutral-800/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-neutral-100">{client.name}</td>
                    <td className="px-6 py-4">{client.phone}</td>
                    <td className="px-6 py-4">{client.company || '—'}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-800 text-neutral-300 border border-neutral-700">
                        {client.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">{client.source?.name || '—'}</td>
                    <td className="px-6 py-4">{client.manager?.email || '—'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AddClientModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchClients} 
      />
    </div>
  );
}
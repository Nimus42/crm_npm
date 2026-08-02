'use client';

import { useEffect, useState } from 'react';
import { api } from '../../../lib/api';
import { Plus, Wallet, TrendingUp, CheckCircle2 } from 'lucide-react';
import AddExpenseModal from './AddExpenseModal';

interface Expense {
  id: string;
  name: string;
  amount: number;
}

interface Project {
  id: string;
  name: string;
  revenue: number;
  netProfit: number;
  managerBonus: number;
  status: string;
  expenses: Expense[];
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      // В реальном API нужно реализовать эндпоинт GET /projects, 
      // пока запрашиваем список или предполагаем, что он есть
      const res = await api.get('/projects'); 
      setProjects(res.data);
    } catch (error) {
      console.error('Ошибка загрузки проектов', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const openExpenseModal = (projectId: string) => {
    setActiveProjectId(projectId);
    setIsModalOpen(true);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto h-full overflow-y-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white tracking-tight">Проекты</h1>
        <p className="text-sm text-neutral-400 mt-1">Финансы, расходы и расчет бонусов</p>
      </div>

      {isLoading ? (
        <div className="text-neutral-500">Загрузка проектов...</div>
      ) : projects.length === 0 ? (
        <div className="p-12 border border-neutral-800 border-dashed rounded-xl text-center">
          <p className="text-neutral-500">У вас пока нет проектов. Переведите клиента в статус "Оплачено", чтобы проект создался автоматически.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 flex flex-col">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-lg font-medium text-white">{project.name}</h3>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium mt-2 ${
                    project.status === 'COMPLETED' ? 'bg-green-950 text-green-400 border border-green-900/50' : 'bg-blue-950 text-blue-400 border border-blue-900/50'
                  }`}>
                    <CheckCircle2 size={14} />
                    {project.status === 'COMPLETED' ? 'Завершен' : 'В работе'}
                  </span>
                </div>
                <button 
                  onClick={() => openExpenseModal(project.id)}
                  disabled={project.status === 'COMPLETED'}
                  className="flex items-center gap-2 bg-neutral-800 text-neutral-300 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-neutral-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus size={14} /> Расход
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-neutral-950 rounded-lg border border-neutral-800/50">
                <div>
                  <p className="text-xs text-neutral-500 mb-1">Выручка</p>
                  <p className="text-sm font-medium text-white">{project.revenue.toLocaleString()} TJS</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 mb-1">Расход</p>
                  <p className="text-sm font-medium text-red-400">
                    {project.expenses?.reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()} TJS
                  </p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 mb-1">Бонус (10%)</p>
                  <p className="text-sm font-medium text-green-400">{project.managerBonus.toLocaleString()} TJS</p>
                </div>
              </div>

              {project.expenses && project.expenses.length > 0 && (
                <div className="mt-auto">
                  <p className="text-xs font-medium text-neutral-500 mb-2 uppercase tracking-wider">Детализация расходов</p>
                  <ul className="space-y-2">
                    {project.expenses.map((expense) => (
                      <li key={expense.id} className="flex justify-between items-center text-sm py-1.5 border-b border-neutral-800/50 last:border-0">
                        <span className="text-neutral-300">{expense.name}</span>
                        <span className="text-neutral-400 font-medium">-{expense.amount.toLocaleString()}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {activeProjectId && (
        <AddExpenseModal
          projectId={activeProjectId}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setActiveProjectId(null);
          }}
          onSuccess={fetchProjects}
        />
      )}
    </div>
  );
}
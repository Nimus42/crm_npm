'use client';

import { useEffect, useState } from 'react';
import { api } from '../../../lib/api';
import { Calendar, CheckCircle2, Clock } from 'lucide-react';

interface Task {
  id: string;
  description: string;
  deadline: string;
  status: string; // OPEN, IN_PROGRESS, DONE
  client?: { name: string };
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      // Предполагается эндпоинт GET /tasks/my или подобный на бэкенде
      const res = await api.get('/tasks');
      setTasks(res.data);
    } catch (error) {
      console.error('Ошибка загрузки задач', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const updateStatus = async (taskId: string, newStatus: string) => {
    try {
      await api.patch(`/tasks/${taskId}/status`, { status: newStatus });
      setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    } catch (error) {
      console.error('Ошибка обновления статуса задачи', error);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white tracking-tight">Задачи</h1>
        <p className="text-sm text-neutral-400 mt-1">Список дел и дедлайны по клиентам</p>
      </div>

      {isLoading ? (
        <div className="text-neutral-500">Загрузка задач...</div>
      ) : tasks.length === 0 ? (
        <div className="p-12 border border-neutral-800 border-dashed rounded-xl text-center">
          <p className="text-neutral-500">У вас нет активных задач.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {tasks.map((task) => {
            const isOverdue = new Date(task.deadline) < new Date() && task.status !== 'DONE';
            
            return (
              <div key={task.id} className={`p-5 rounded-xl border flex items-center justify-between transition-colors ${
                task.status === 'DONE' ? 'bg-neutral-900/40 border-neutral-800/50 opacity-60' : 
                isOverdue ? 'bg-red-950/20 border-red-900/50' : 'bg-neutral-900 border-neutral-800'
              }`}>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-md ${
                      task.status === 'DONE' ? 'bg-green-950/50 text-green-500' : 
                      'bg-blue-950/50 text-blue-400'
                    }`}>
                      {task.status === 'DONE' ? 'Выполнено' : 'В работе'}
                    </span>
                    {task.client && (
                      <span className="text-xs text-neutral-400 bg-neutral-950 px-2.5 py-1 rounded-md border border-neutral-800">
                        Клиент: {task.client.name}
                      </span>
                    )}
                  </div>
                  <h3 className={`text-sm font-medium ${task.status === 'DONE' ? 'text-neutral-400 line-through' : 'text-neutral-200'}`}>
                    {task.description}
                  </h3>
                  <div className={`flex items-center gap-1.5 mt-3 text-xs ${isOverdue ? 'text-red-400 font-medium' : 'text-neutral-500'}`}>
                    {isOverdue ? <Clock size={14} /> : <Calendar size={14} />}
                    {new Date(task.deadline).toLocaleString('ru-RU', { 
                      day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' 
                    })}
                    {isOverdue && ' (Просрочено)'}
                  </div>
                </div>

                <div className="ml-6 flex gap-2">
                  {task.status !== 'DONE' && (
                    <button 
                      onClick={() => updateStatus(task.id, 'DONE')}
                      className="p-2 text-neutral-400 hover:text-green-400 bg-neutral-950 border border-neutral-800 rounded-lg transition-colors"
                      title="Завершить задачу"
                    >
                      <CheckCircle2 size={18} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import { api } from '../../../lib/api';

const expenseSchema = z.object({
  name: z.string().min(1, 'Название обязательно (например: Дизайн, Хостинг)'),
  amount: z.number({ invalid_type_error: 'Введите число' }).min(1, 'Сумма должна быть больше 0'),
});

type ExpenseForm = z.infer<typeof expenseSchema>;

interface AddExpenseModalProps {
  projectId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddExpenseModal({ projectId, isOpen, onClose, onSuccess }: AddExpenseModalProps) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ExpenseForm>({
    resolver: zodResolver(expenseSchema),
  });

  if (!isOpen) return null;

  const onSubmit = async (data: ExpenseForm) => {
    try {
      await api.post(`/projects/${projectId}/expenses`, {
        name: data.name,
        amount: data.amount
      });
      reset();
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Ошибка добавления расхода', error);
      alert('Не удалось добавить расход');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl w-full max-w-sm shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-neutral-800">
          <h3 className="text-lg font-medium text-white">Добавить расход</h3>
          <button onClick={onClose} className="text-neutral-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1">Название расхода</label>
            <input
              {...register('name')}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-neutral-100 focus:outline-none focus:border-neutral-600"
              placeholder="Например: Домен и хостинг"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1">Сумма (TJS / $)</label>
            <input
              {...register('amount', { valueAsNumber: true })}
              type="number"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-neutral-100 focus:outline-none focus:border-neutral-600"
              placeholder="0.00"
            />
            {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount.message}</p>}
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700 transition-colors text-sm font-medium"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2.5 bg-white text-black rounded-lg hover:bg-neutral-200 transition-colors text-sm font-medium disabled:opacity-50"
            >
              {isSubmitting ? 'Сохранение...' : 'Добавить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
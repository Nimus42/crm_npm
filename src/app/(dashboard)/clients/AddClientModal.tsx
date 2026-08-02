'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import { api } from '../../../lib/api';

const clientSchema = z.object({
  name: z.string().min(1, 'Имя обязательно'),
  phone: z.string().min(1, 'Телефон обязателен'),
  company: z.string().optional(),
  city: z.string().optional(),
});

type ClientForm = z.infer<typeof clientSchema>;

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddClientModal({ isOpen, onClose, onSuccess }: AddClientModalProps) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ClientForm>({
    resolver: zodResolver(clientSchema),
  });

  if (!isOpen) return null;

  const onSubmit = async (data: ClientForm) => {
    try {
      await api.post('/clients', { ...data, status: 'Новый лид' });
      reset();
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Ошибка при создании клиента', error);
      alert('Не удалось создать клиента');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-neutral-800">
          <h3 className="text-lg font-medium text-white">Новый клиент</h3>
          <button onClick={onClose} className="text-neutral-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1">Имя *</label>
            <input
              {...register('name')}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-neutral-100 focus:outline-none focus:border-neutral-600"
              placeholder="Иван Иванов"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1">Телефон *</label>
            <input
              {...register('phone')}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-neutral-100 focus:outline-none focus:border-neutral-600"
              placeholder="+992 00 000 0000"
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1">Компания</label>
            <input
              {...register('company')}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-neutral-100 focus:outline-none focus:border-neutral-600"
              placeholder="Название компании"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1">Город</label>
            <input
              {...register('city')}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-neutral-100 focus:outline-none focus:border-neutral-600"
              placeholder="Душанбе"
            />
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
              {isSubmitting ? 'Сохранение...' : 'Создать'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
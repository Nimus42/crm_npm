'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../../store/auth';

const registerSchema = z.object({
  email: z.string().email('Некорректный email'),
  password: z.string().min(6, 'Пароль должен содержать не менее 6 символов'),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const registerAction = useAuthStore((state) => state.register);
  const [errorMsg, setErrorMsg] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      setErrorMsg('');
      // Добавляем дефолтную роль, как требовалось в API
      await registerAction({ ...data, role: 'ADMIN' }); 
      router.push('/clients');
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Ошибка регистрации');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {errorMsg && (
        <div className="p-3 bg-red-900/30 border border-red-900 text-red-400 rounded-lg text-sm text-center">
          {errorMsg}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-neutral-300 mb-1">Email</label>
        <input
          {...register('email')}
          type="email"
          className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-neutral-100 focus:outline-none focus:border-neutral-600 transition-colors"
          placeholder="admin@rushddigital.tj"
        />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-300 mb-1">Пароль</label>
        <input
          {...register('password')}
          type="password"
          className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-neutral-100 focus:outline-none focus:border-neutral-600 transition-colors"
          placeholder="••••••"
        />
        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-white text-black font-medium rounded-lg px-4 py-2.5 mt-2 hover:bg-neutral-200 transition-colors disabled:opacity-50"
      >
        {isSubmitting ? 'Регистрация...' : 'Создать аккаунт'}
      </button>

      <p className="text-center text-sm text-neutral-500 mt-4">
        Уже есть аккаунт?{' '}
        <Link href="/auth/login" className="text-neutral-300 hover:text-white transition-colors">
          Войти
        </Link>
      </p>
    </form>
  );
}
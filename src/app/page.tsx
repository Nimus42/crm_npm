import { redirect } from 'next/navigation';

export default function Home() {
  // На этапе 1 перенаправляем корневой роут на страницу входа
  redirect('/auth/login');
}
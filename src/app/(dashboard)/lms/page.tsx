'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../../lib/api';
import { BookOpen, Award } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string | null;
}

export default function LmsPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get('/lms/courses'); // Предполагаемый эндпоинт списка курсов
        setCourses(res.data);
      } catch (error) {
        console.error('Ошибка загрузки курсов', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white tracking-tight">База знаний и Обучение</h1>
        <p className="text-sm text-neutral-400 mt-1">Доступные курсы и экзамены для повышения квалификации</p>
      </div>

      {isLoading ? (
        <div className="text-neutral-500">Загрузка курсов...</div>
      ) : courses.length === 0 ? (
        <div className="p-12 border border-neutral-800 border-dashed rounded-xl text-center">
          <p className="text-neutral-500">Доступных курсов пока нет.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
            <div key={course.id} className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 flex flex-col">
              <div className="w-12 h-12 bg-neutral-950 border border-neutral-800 rounded-xl flex items-center justify-center text-blue-400 mb-4">
                <BookOpen size={24} />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">{course.title}</h3>
              <p className="text-sm text-neutral-400 mb-6 flex-1 line-clamp-3">
                {course.description || 'Описание отсутствует'}
              </p>
              
              <button 
                onClick={() => router.push(`/lms/${course.id}/exam`)}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-white text-black rounded-lg text-sm font-medium hover:bg-neutral-200 transition-colors"
              >
                <Award size={16} />
                Пройти экзамен
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
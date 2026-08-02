'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '../../../../../lib/api';
import { CheckCircle2, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';

interface Question {
  id: string;
  text: string;
  options: string[];
}

export default function ExamPage() {
  const { courseId } = useParams();
  const router = useRouter();
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Храним ответы в виде Record: ключ - id вопроса, значение - индекс выбранного ответа
  const [answers, setAnswers] = useState<Record<string, number>>({});
  
  const [status, setStatus] = useState<'loading' | 'testing' | 'submitting' | 'result'>('loading');
  const [examResult, setExamResult] = useState<{ score: number, passed: boolean } | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const startExam = async () => {
      try {
        const res = await api.get(`/lms/exams/generate/${courseId}`);
        setQuestions(res.data);
        setStatus('testing');
      } catch (error: any) {
        setErrorMsg(error.response?.data?.message || 'Ошибка генерации экзамена (возможно недостаточно вопросов)');
        setStatus('result');
      }
    };
    if (courseId) startExam();
  }, [courseId]);

  const handleSelectOption = (optionIndex: number) => {
    const currentQ = questions[currentIndex];
    setAnswers(prev => ({ ...prev, [currentQ.id]: optionIndex }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    // Проверка, на все ли вопросы даны ответы
    if (Object.keys(answers).length < questions.length) {
      alert('Пожалуйста, ответьте на все вопросы перед отправкой!');
      return;
    }

    try {
      setStatus('submitting');
      
      const formattedAnswers = Object.entries(answers).map(([questionId, selectedOptionIndex]) => ({
        questionId,
        selectedOptionIndex
      }));

      const res = await api.post('/lms/exams/submit', {
        courseId,
        answers: formattedAnswers
      });

      setExamResult({ score: res.data.score, passed: res.data.passed });
      setStatus('result');
    } catch (error: any) {
      setErrorMsg(error.response?.data?.message || 'Ошибка при проверке экзамена');
      setStatus('result');
    }
  };

  if (status === 'loading') {
    return <div className="p-8 text-neutral-500">Генерация билета...</div>;
  }

  if (status === 'result' || errorMsg) {
    return (
      <div className="p-8 max-w-2xl mx-auto h-full flex items-center justify-center">
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 w-full text-center">
          {errorMsg ? (
            <>
              <div className="w-16 h-16 bg-red-950/50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-900/50">
                <AlertCircle size={32} />
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">Ошибка</h2>
              <p className="text-neutral-400 mb-6">{errorMsg}</p>
            </>
          ) : examResult ? (
            <>
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border ${
                examResult.passed ? 'bg-green-950/50 text-green-500 border-green-900/50' : 'bg-red-950/50 text-red-500 border-red-900/50'
              }`}>
                {examResult.passed ? <CheckCircle2 size={32} /> : <AlertCircle size={32} />}
              </div>
              <h2 className="text-2xl font-semibold text-white mb-2">
                {examResult.passed ? 'Экзамен сдан!' : 'Экзамен не сдан'}
              </h2>
              <p className="text-neutral-400 mb-2">
                Ваш результат: <strong className="text-white text-lg">{examResult.score} / 100</strong> баллов
              </p>
              {examResult.passed && (
                <p className="text-sm text-green-400 mb-6">Сертификат успешно сгенерирован и сохранен в профиле.</p>
              )}
            </>
          ) : null}
          
          <button 
            onClick={() => router.push('/lms')}
            className="px-6 py-2.5 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700 transition-colors mt-4"
          >
            Вернуться к курсам
          </button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const selectedAnswer = answers[currentQ.id];
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="p-8 max-w-3xl mx-auto flex flex-col h-full">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">Тестирование</h1>
          <p className="text-sm text-neutral-400 mt-1">Вопрос {currentIndex + 1} из {questions.length}</p>
        </div>
        <div className="text-sm font-medium bg-neutral-900 px-4 py-2 rounded-lg border border-neutral-800 text-neutral-300">
          Отвечено: {answeredCount} / {questions.length}
        </div>
      </div>

      <div className="flex-1">
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 mb-6 shadow-sm">
          <h2 className="text-lg font-medium text-white mb-8 leading-relaxed">
            {currentQ.text}
          </h2>
          
          <div className="space-y-3">
            {currentQ.options.map((option, idx) => {
              const isSelected = selectedAnswer === idx;
              return (
                <label 
                  key={idx} 
                  className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected 
                      ? 'bg-neutral-800 border-neutral-500 text-white' 
                      : 'bg-neutral-950 border-neutral-800 text-neutral-300 hover:border-neutral-600'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    isSelected ? 'border-white' : 'border-neutral-600'
                  }`}>
                    {isSelected && <div className="w-2.5 h-2.5 bg-white rounded-full"></div>}
                  </div>
                  <input 
                    type="radio" 
                    name={`q-${currentQ.id}`} 
                    className="hidden" 
                    checked={isSelected}
                    onChange={() => handleSelectOption(idx)}
                  />
                  <span className="text-sm">{option}</span>
                </label>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-6 border-t border-neutral-800">
        <button 
          onClick={handlePrev}
          disabled={currentIndex === 0 || status === 'submitting'}
          className="flex items-center gap-2 px-5 py-2.5 bg-neutral-900 text-neutral-300 border border-neutral-800 rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-50"
        >
          <ChevronLeft size={18} />
          Назад
        </button>

        {currentIndex === questions.length - 1 ? (
          <button 
            onClick={handleSubmit}
            disabled={status === 'submitting'}
            className="flex items-center gap-2 px-8 py-2.5 bg-white text-black font-medium rounded-lg hover:bg-neutral-200 transition-colors disabled:opacity-50"
          >
            {status === 'submitting' ? 'Проверка...' : 'Завершить экзамен'}
          </button>
        ) : (
          <button 
            onClick={handleNext}
            className="flex items-center gap-2 px-5 py-2.5 bg-neutral-900 text-neutral-300 border border-neutral-800 rounded-lg hover:bg-neutral-800 transition-colors"
          >
            Далее
            <ChevronRight size={18} />
          </button>
        )}
      </div>
    </div>
  );
}
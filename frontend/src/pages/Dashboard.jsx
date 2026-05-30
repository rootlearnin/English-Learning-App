import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Star, CheckCircle, TrendingUp, Clock, ChevronRight, Loader } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const difficultyLabel = { beginner: 'Iniciante', intermediate: 'Intermediário', advanced: 'Avançado' };
const difficultyColor = {
  beginner: 'bg-green-100 text-green-700',
  intermediate: 'bg-yellow-100 text-yellow-700',
  advanced: 'bg-red-100 text-red-700'
};

export default function Dashboard() {
  const { user } = useAuth();
  const [lessons, setLessons] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/lessons'),
      api.get('/users/stats')
    ])
      .then(([lessonsRes, statsRes]) => {
        setLessons(lessonsRes.data);
        setStats(statsRes.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="animate-spin text-indigo-600" size={40} />
      </div>
    );
  }

  const completedCount = lessons.filter(l => l.completed).length;
  const progressPercent = lessons.length > 0 ? Math.round((completedCount / lessons.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Cabeçalho */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900">
            Olá, {user.name.split(' ')[0]}! 👋
          </h1>
          <p className="text-gray-500 mt-1">
            Continue de onde parou e evolua no inglês.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Pontos', value: stats?.total_points || 0, icon: <Star size={20} className="text-yellow-500" />, bg: 'bg-yellow-50 border-yellow-200' },
            { label: 'Lições', value: `${completedCount}/${lessons.length}`, icon: <CheckCircle size={20} className="text-green-500" />, bg: 'bg-green-50 border-green-200' },
            { label: 'Taxa de Acerto', value: `${stats?.accuracy || 0}%`, icon: <TrendingUp size={20} className="text-blue-500" />, bg: 'bg-blue-50 border-blue-200' },
            { label: 'Exercícios', value: stats?.total_exercises || 0, icon: <Clock size={20} className="text-purple-500" />, bg: 'bg-purple-50 border-purple-200' },
          ].map((s, i) => (
            <div key={i} className={`${s.bg} border rounded-xl p-5`}>
              <div className="flex items-center gap-2 mb-2">
                {s.icon}
                <span className="text-sm text-gray-500 font-medium">{s.label}</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Progresso geral */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-10">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-gray-900">Progresso Geral</h2>
            <span className="text-sm text-indigo-600 font-semibold">{progressPercent}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-3">
            <div
              className="bg-indigo-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {completedCount} de {lessons.length} lições completadas
          </p>
        </div>

        {/* Lista de Lições */}
        <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
          <BookOpen size={20} className="text-indigo-600" />
          Suas Lições
        </h2>

        <div className="grid gap-4">
          {lessons.map((lesson) => (
            <div
              key={lesson.id}
              className={`bg-white rounded-xl border p-5 flex items-center gap-4 hover:shadow-md transition ${lesson.completed ? 'border-green-200' : 'border-gray-200'}`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${lesson.completed ? 'bg-green-100' : 'bg-indigo-100'}`}>
                {lesson.completed
                  ? <CheckCircle size={24} className="text-green-600" />
                  : <BookOpen size={24} className="text-indigo-600" />
                }
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-gray-900">{lesson.title}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${difficultyColor[lesson.difficulty]}`}>
                    {difficultyLabel[lesson.difficulty]}
                  </span>
                  {lesson.completed && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                      ✓ Completo — {lesson.score}%
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-0.5 truncate">{lesson.description}</p>
              </div>
              <Link
                to={`/lesson/${lesson.id}`}
                className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-semibold flex-shrink-0 transition ${
                  lesson.completed
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                {lesson.completed ? 'Revisar' : 'Iniciar'}
                <ChevronRight size={14} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

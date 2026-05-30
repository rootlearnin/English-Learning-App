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

        {/* Tabela Verbo TO BE */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-1 flex items-center gap-2">
            📌 Verbo TO BE — Referência Rápida
          </h2>
          <p className="text-sm text-gray-500 mb-5">Conjugação completa no presente, passado e negativa com tradução</p>

          {/* Presente */}
          <h3 className="text-sm font-semibold text-indigo-700 uppercase tracking-wide mb-2">Presente (Present)</h3>
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-indigo-50">
                  <th className="text-left px-4 py-2 text-indigo-700 font-semibold border border-indigo-100">Pronome</th>
                  <th className="text-left px-4 py-2 text-indigo-700 font-semibold border border-indigo-100">To Be</th>
                  <th className="text-left px-4 py-2 text-indigo-700 font-semibold border border-indigo-100">Contração</th>
                  <th className="text-left px-4 py-2 text-indigo-700 font-semibold border border-indigo-100">Exemplo</th>
                  <th className="text-left px-4 py-2 text-indigo-700 font-semibold border border-indigo-100">Tradução</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['I', 'am', "I'm", 'I am a student.', 'Eu sou um estudante.'],
                  ['You', 'are', "You're", 'You are smart.', 'Você é inteligente.'],
                  ['He', 'is', "He's", 'He is tall.', 'Ele é alto.'],
                  ['She', 'is', "She's", 'She is happy.', 'Ela está feliz.'],
                  ['It', 'is', "It's", 'It is cold.', 'Está frio.'],
                  ['We', 'are', "We're", 'We are friends.', 'Nós somos amigos.'],
                  ['You (pl.)', 'are', "You're", 'You are welcome.', 'Vocês são bem-vindos.'],
                  ['They', 'are', "They're", 'They are teachers.', 'Eles são professores.'],
                ].map(([pronoun, verb, contraction, example, translation], i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-2 border border-gray-100 font-semibold text-gray-800">{pronoun}</td>
                    <td className="px-4 py-2 border border-gray-100 text-indigo-600 font-semibold">{verb}</td>
                    <td className="px-4 py-2 border border-gray-100 text-purple-600 font-mono text-xs">{contraction}</td>
                    <td className="px-4 py-2 border border-gray-100 text-gray-700 italic">{example}</td>
                    <td className="px-4 py-2 border border-gray-100 text-gray-500">{translation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Passado */}
          <h3 className="text-sm font-semibold text-amber-700 uppercase tracking-wide mb-2">Passado (Past)</h3>
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-amber-50">
                  <th className="text-left px-4 py-2 text-amber-700 font-semibold border border-amber-100">Pronome</th>
                  <th className="text-left px-4 py-2 text-amber-700 font-semibold border border-amber-100">To Be</th>
                  <th className="text-left px-4 py-2 text-amber-700 font-semibold border border-amber-100">Exemplo</th>
                  <th className="text-left px-4 py-2 text-amber-700 font-semibold border border-amber-100">Tradução</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['I', 'was', 'I was tired yesterday.', 'Eu estava cansado ontem.'],
                  ['You', 'were', 'You were right.', 'Você estava certo.'],
                  ['He', 'was', 'He was at home.', 'Ele estava em casa.'],
                  ['She', 'was', 'She was happy.', 'Ela estava feliz.'],
                  ['It', 'was', 'It was cold.', 'Estava frio.'],
                  ['We', 'were', 'We were students.', 'Nós éramos estudantes.'],
                  ['You (pl.)', 'were', 'You were late.', 'Vocês estavam atrasados.'],
                  ['They', 'were', 'They were busy.', 'Eles estavam ocupados.'],
                ].map(([pronoun, verb, example, translation], i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-amber-50/30'}>
                    <td className="px-4 py-2 border border-gray-100 font-semibold text-gray-800">{pronoun}</td>
                    <td className="px-4 py-2 border border-gray-100 text-amber-600 font-semibold">{verb}</td>
                    <td className="px-4 py-2 border border-gray-100 text-gray-700 italic">{example}</td>
                    <td className="px-4 py-2 border border-gray-100 text-gray-500">{translation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Negativa e Interrogativa */}
          <h3 className="text-sm font-semibold text-red-700 uppercase tracking-wide mb-2">Negativa e Interrogativa</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-red-50">
                  <th className="text-left px-4 py-2 text-red-700 font-semibold border border-red-100">Forma</th>
                  <th className="text-left px-4 py-2 text-red-700 font-semibold border border-red-100">Estrutura</th>
                  <th className="text-left px-4 py-2 text-red-700 font-semibold border border-red-100">Exemplo</th>
                  <th className="text-left px-4 py-2 text-red-700 font-semibold border border-red-100">Tradução</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Negativa (pres.)', 'Sujeito + am/is/are + not', 'I am not tired. / She is not here.', 'Não estou cansado. / Ela não está aqui.'],
                  ['Negativa (passado)', 'Sujeito + was/were + not', 'He was not ready. / They were not late.', 'Ele não estava pronto. / Eles não estavam atrasados.'],
                  ['Interrogativa (pres.)', 'Am/Is/Are + sujeito + ?', 'Are you ready? / Is she home?', 'Você está pronto? / Ela está em casa?'],
                  ['Interrogativa (passado)', 'Was/Were + sujeito + ?', 'Was he at school? / Were they happy?', 'Ele estava na escola? / Eles estavam felizes?'],
                  ['Neg. contraída (pres.)', "isn't / aren't", "He isn't tall. / They aren't here.", 'Ele não é alto. / Eles não estão aqui.'],
                  ['Neg. contraída (passado)', "wasn't / weren't", "She wasn't busy. / We weren't late.", 'Ela não estava ocupada. / Não estávamos atrasados.'],
                ].map(([form, structure, example, translation], i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-red-50/30'}>
                    <td className="px-4 py-2 border border-gray-100 font-semibold text-gray-800 whitespace-nowrap">{form}</td>
                    <td className="px-4 py-2 border border-gray-100 text-red-600 font-mono text-xs">{structure}</td>
                    <td className="px-4 py-2 border border-gray-100 text-gray-700 italic">{example}</td>
                    <td className="px-4 py-2 border border-gray-100 text-gray-500">{translation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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

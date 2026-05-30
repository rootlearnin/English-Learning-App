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

const PRESENTE = [
  ['I',         'am',  "I'm",     'Ai-m',  'I am a student.',      'Eu sou / Eu estou'],
  ['You',       'are', "You're",  'Iur',   'You are smart.',        'Você é / Você está'],
  ['He',        'is',  "He's",    'Riz',   'He is tall.',           'Ele é / Ele está'],
  ['She',       'is',  "She's",   'Shiz',  'She is happy.',         'Ela é / Ela está'],
  ['It',        'is',  "It's",    'Its',   'It is cold.',           'É / Está (coisas, lugares ou animais)'],
  ['We',        'are', "We're",   'Uí-ar', 'We are friends.',       'Nós somos / Nós estamos'],
  ['You (pl.)', 'are', "You're",  'Iur',   'You are welcome.',      'Vocês são / Vocês estão'],
  ['They',      'are', "They're", 'Dér',   'They are teachers.',    'Eles(as) são / Eles(as) estão'],
];

const PASSADO = [
  ['I',         'was',  'I was tired yesterday.',    'Eu estava cansado ontem.'],
  ['You',       'were', 'You were right.',            'Você estava certo.'],
  ['He',        'was',  'He was at home.',            'Ele estava em casa.'],
  ['She',       'was',  'She was happy.',             'Ela estava feliz.'],
  ['It',        'was',  'It was cold.',               'Estava frio.'],
  ['We',        'were', 'We were students.',          'Nós éramos estudantes.'],
  ['You (pl.)', 'were', 'You were late.',             'Vocês estavam atrasados.'],
  ['They',      'were', 'They were busy.',            'Eles estavam ocupados.'],
];

const FUTURO = [
  ['I',         'will be', "I'll be",    'I will be there soon.',     'Eu vou estar lá em breve.'],
  ['You',       'will be', "You'll be",  'You will be fine.',          'Você vai ficar bem.'],
  ['He',        'will be', "He'll be",   'He will be late.',           'Ele vai se atrasar.'],
  ['She',       'will be', "She'll be",  'She will be happy.',         'Ela vai ficar feliz.'],
  ['It',        'will be', "It'll be",   'It will be cold tomorrow.',  'Vai estar frio amanhã.'],
  ['We',        'will be', "We'll be",   'We will be ready.',          'Nós vamos estar prontos.'],
  ['You (pl.)', 'will be', "You'll be",  'You will be welcome.',       'Vocês serão bem-vindos.'],
  ['They',      'will be', "They'll be", 'They will be here at 8.',    'Eles vão estar aqui às 8.'],
];

const NEGATIVA = [
  ['Negativa (pres.)',         'Sujeito + am/is/are + not', "I am not tired. / She is not here.",          "Não estou cansado. / Ela não está aqui."],
  ['Negativa (passado)',       'Sujeito + was/were + not',  "He was not ready. / They were not late.",     "Ele não estava pronto. / Eles não estavam atrasados."],
  ['Negativa (futuro)',        "Sujeito + won't be",        "I won't be home. / They won't be late.",      "Não vou estar em casa. / Eles não vão se atrasar."],
  ['Interrogativa (pres.)',    'Am/Is/Are + sujeito + ?',   "Are you ready? / Is she home?",               "Você está pronto? / Ela está em casa?"],
  ['Interrogativa (passado)',  'Was/Were + sujeito + ?',    "Was he at school? / Were they happy?",        "Ele estava na escola? / Eles estavam felizes?"],
  ['Interrogativa (futuro)',   'Will + sujeito + be + ?',   "Will you be there? / Will it be cold?",       "Você vai estar lá? / Vai estar frio?"],
  ["Neg. contraída (pres.)",   "isn't / aren't",            "He isn't tall. / They aren't here.",          "Ele não é alto. / Eles não estão aqui."],
  ["Neg. contraída (passado)", "wasn't / weren't",          "She wasn't busy. / We weren't late.",         "Ela não estava ocupada. / Não estávamos atrasados."],
  ["Neg. contraída (futuro)",  "won't be",                  "I won't be ready. / She won't be home.",      "Não vou estar pronto. / Ela não vai estar em casa."],
];

function TbHeader({ color, children }) {
  return (
    <th className={`text-left px-3 py-2 text-xs font-semibold uppercase tracking-wide border ${color}`}>
      {children}
    </th>
  );
}

function TbCell({ children, className = '' }) {
  return (
    <td className={`px-3 py-2 border border-gray-100 text-sm ${className}`}>
      {children}
    </td>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [lessons, setLessons] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/lessons'), api.get('/users/stats')])
      .then(([lr, sr]) => { setLessons(lr.data); setStats(sr.data); })
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
      <div className="w-full px-8 py-8">

        {/* Cabeçalho + Stats */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            Olá, {user.name.split(' ')[0]}! 👋
          </h1>
          <p className="text-gray-500 mb-6">Continue de onde parou e evolua no inglês.</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Pontos',        value: stats?.total_points || 0,                    icon: <Star size={18} className="text-yellow-500" />,  bg: 'bg-yellow-50 border-yellow-200' },
              { label: 'Lições',        value: `${completedCount}/${lessons.length}`,        icon: <CheckCircle size={18} className="text-green-500" />, bg: 'bg-green-50 border-green-200' },
              { label: 'Taxa de Acerto',value: `${stats?.accuracy || 0}%`,                  icon: <TrendingUp size={18} className="text-blue-500" />,   bg: 'bg-blue-50 border-blue-200' },
              { label: 'Exercícios',    value: stats?.total_exercises || 0,                 icon: <Clock size={18} className="text-purple-500" />,      bg: 'bg-purple-50 border-purple-200' },
            ].map((s, i) => (
              <div key={i} className={`${s.bg} border rounded-xl p-4 flex items-center gap-4`}>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-1">
                    {s.icon}
                    <span className="text-xs text-gray-500 font-medium">{s.label}</span>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{s.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Layout principal: sidebar esquerda + conteúdo direita */}
        <div className="flex gap-6 items-start">

          {/* SIDEBAR ESQUERDA — Progresso + Lições */}
          <div className="w-80 xl:w-96 flex-shrink-0 flex flex-col gap-4">

            {/* Progresso */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold text-gray-900 text-sm">Progresso Geral</h2>
                <span className="text-sm text-indigo-600 font-bold">{progressPercent}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5 mb-2">
                <div
                  className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="text-xs text-gray-500">{completedCount} de {lessons.length} lições completadas</p>
            </div>

            {/* Lista de Lições */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2 text-sm">
                <BookOpen size={16} className="text-indigo-600" />
                Suas Lições
              </h2>
              <div className="flex flex-col gap-3">
                {lessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className={`rounded-lg border p-3 flex items-center gap-3 ${lesson.completed ? 'border-green-200 bg-green-50/40' : 'border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/30'} transition`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${lesson.completed ? 'bg-green-100' : 'bg-indigo-100'}`}>
                      {lesson.completed
                        ? <CheckCircle size={16} className="text-green-600" />
                        : <BookOpen size={16} className="text-indigo-600" />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <p className="font-semibold text-gray-900 text-sm truncate">{lesson.title}</p>
                        <span className={`text-xs px-1.5 py-0.5 rounded-full flex-shrink-0 ${difficultyColor[lesson.difficulty]}`}>
                          {difficultyLabel[lesson.difficulty]}
                        </span>
                      </div>
                      {lesson.completed && (
                        <p className="text-xs text-green-600 mt-0.5">✓ Completo — {lesson.score}%</p>
                      )}
                    </div>
                    <Link
                      to={`/lesson/${lesson.id}`}
                      className={`flex items-center gap-0.5 px-3 py-1.5 rounded-lg text-xs font-semibold flex-shrink-0 transition ${
                        lesson.completed
                          ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          : 'bg-indigo-600 text-white hover:bg-indigo-700'
                      }`}
                    >
                      {lesson.completed ? 'Revisar' : 'Iniciar'}
                      <ChevronRight size={12} />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CONTEÚDO PRINCIPAL — Tabela TO BE ocupa o espaço restante */}
          <div className="flex-1 min-w-0 bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-1 flex items-center gap-2">
              📌 Verbo TO BE — Referência Rápida
            </h2>
            <p className="text-sm text-gray-500 mb-6">Conjugação completa com pronúncia e tradução (ser / estar)</p>

            {/* Presente */}
            <h3 className="text-xs font-bold text-indigo-700 uppercase tracking-widest mb-2">Presente (Present)</h3>
            <div className="overflow-x-auto mb-6">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-indigo-50">
                    {['Pronome','To Be','Contração','Pronúncia','Exemplo','Tradução'].map(h => (
                      <TbHeader key={h} color="border-indigo-100 text-indigo-700">{h}</TbHeader>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {PRESENTE.map(([pronoun, verb, contraction, pron, example, translation], i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-indigo-50/20'}>
                      <TbCell className="font-semibold text-gray-800">{pronoun}</TbCell>
                      <TbCell className="text-indigo-600 font-bold">{verb}</TbCell>
                      <TbCell className="text-purple-600 font-mono font-semibold">{contraction}</TbCell>
                      <TbCell className="text-orange-500 font-mono text-xs">({pron})</TbCell>
                      <TbCell className="italic text-gray-700">{example}</TbCell>
                      <TbCell className="text-gray-600 font-medium">{translation}</TbCell>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Passado */}
            <h3 className="text-xs font-bold text-amber-700 uppercase tracking-widest mb-2">Passado (Past)</h3>
            <div className="overflow-x-auto mb-6">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-amber-50">
                    {['Pronome','To Be','Exemplo','Tradução'].map(h => (
                      <TbHeader key={h} color="border-amber-100 text-amber-700">{h}</TbHeader>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {PASSADO.map(([pronoun, verb, example, translation], i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-amber-50/20'}>
                      <TbCell className="font-semibold text-gray-800">{pronoun}</TbCell>
                      <TbCell className="text-amber-600 font-bold">{verb}</TbCell>
                      <TbCell className="italic text-gray-700">{example}</TbCell>
                      <TbCell className="text-gray-500">{translation}</TbCell>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Futuro */}
            <h3 className="text-xs font-bold text-green-700 uppercase tracking-widest mb-2">Futuro (Future — Will Be)</h3>
            <div className="overflow-x-auto mb-6">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-green-50">
                    {['Pronome','To Be','Contração','Exemplo','Tradução'].map(h => (
                      <TbHeader key={h} color="border-green-100 text-green-700">{h}</TbHeader>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {FUTURO.map(([pronoun, verb, contraction, example, translation], i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-green-50/20'}>
                      <TbCell className="font-semibold text-gray-800">{pronoun}</TbCell>
                      <TbCell className="text-green-600 font-bold">{verb}</TbCell>
                      <TbCell className="text-teal-600 font-mono">{contraction}</TbCell>
                      <TbCell className="italic text-gray-700">{example}</TbCell>
                      <TbCell className="text-gray-500">{translation}</TbCell>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Negativa e Interrogativa */}
            <h3 className="text-xs font-bold text-red-700 uppercase tracking-widest mb-2">Negativa e Interrogativa</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-red-50">
                    {['Forma','Estrutura','Exemplo','Tradução'].map(h => (
                      <TbHeader key={h} color="border-red-100 text-red-700">{h}</TbHeader>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {NEGATIVA.map(([form, structure, example, translation], i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-red-50/20'}>
                      <TbCell className="font-semibold text-gray-800 whitespace-nowrap">{form}</TbCell>
                      <TbCell className="text-red-600 font-mono text-xs whitespace-nowrap">{structure}</TbCell>
                      <TbCell className="italic text-gray-700">{example}</TbCell>
                      <TbCell className="text-gray-500">{translation}</TbCell>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

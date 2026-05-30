import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, ChevronRight, Loader, Trophy, RotateCcw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import api from '../services/api';

const difficultyLabel = { beginner: 'Iniciante', intermediate: 'Intermediário', advanced: 'Avançado' };

export default function Lesson() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [phase, setPhase] = useState('content'); // 'content' | 'quiz' | 'result'
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get(`/lessons/${id}`)
      .then(res => setLesson(res.data))
      .catch(() => navigate('/dashboard'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSelectAnswer = (idx) => {
    if (showFeedback) return;
    setSelected(idx);
  };

  const handleNext = () => {
    if (selected === null) return;
    const newAnswers = [...answers, selected];
    setAnswers(newAnswers);

    if (!showFeedback) {
      setShowFeedback(true);
      return;
    }

    if (currentQ + 1 < lesson.exercises.length) {
      setCurrentQ(currentQ + 1);
      setSelected(null);
      setShowFeedback(false);
    } else {
      submitQuiz(newAnswers);
    }
  };

  const submitQuiz = async (finalAnswers) => {
    setSubmitting(true);
    try {
      const res = await api.post(`/lessons/${id}/complete`, { answers: finalAnswers });
      setResult(res.data);
      setPhase('result');
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const restartQuiz = () => {
    setPhase('quiz');
    setCurrentQ(0);
    setAnswers([]);
    setSelected(null);
    setShowFeedback(false);
    setResult(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="animate-spin text-indigo-600" size={40} />
      </div>
    );
  }

  const exercise = lesson?.exercises?.[currentQ];
  const isCorrect = showFeedback && selected === exercise?.correct_answer;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/dashboard" className="text-gray-400 hover:text-gray-700 transition">
            <ArrowLeft size={22} />
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{lesson.title}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
                {difficultyLabel[lesson.difficulty]}
              </span>
              <span className="text-xs text-gray-400">
                {lesson.exercises.length} exercícios
              </span>
            </div>
          </div>
        </div>

        {/* FASE: Conteúdo */}
        {phase === 'content' && (
          <>
            <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-6 prose max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{lesson.content}</ReactMarkdown>
            </div>
            <button
              onClick={() => setPhase('quiz')}
              className="w-full bg-indigo-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-indigo-700 transition flex items-center justify-center gap-2"
            >
              Iniciar Quiz
              <ChevronRight size={20} />
            </button>
          </>
        )}

        {/* FASE: Quiz */}
        {phase === 'quiz' && exercise && (
          <>
            {/* Progresso */}
            <div className="mb-6">
              <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                <span>Questão {currentQ + 1} de {lesson.exercises.length}</span>
                <span>{Math.round(((currentQ) / lesson.exercises.length) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all"
                  style={{ width: `${((currentQ) / lesson.exercises.length) * 100}%` }}
                />
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-4">
              <p className="text-xl font-semibold text-gray-900 mb-6">{exercise.question}</p>

              <div className="space-y-3">
                {exercise.options.map((opt, i) => {
                  let className = 'w-full text-left px-5 py-4 rounded-xl border-2 font-medium transition ';
                  if (!showFeedback) {
                    className += selected === i
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 text-gray-700';
                  } else {
                    if (i === exercise.correct_answer) {
                      className += 'border-green-500 bg-green-50 text-green-700';
                    } else if (i === selected && selected !== exercise.correct_answer) {
                      className += 'border-red-400 bg-red-50 text-red-700';
                    } else {
                      className += 'border-gray-200 text-gray-500 opacity-60';
                    }
                  }

                  return (
                    <button key={i} onClick={() => handleSelectAnswer(i)} className={className}>
                      <span className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold border-current">
                          {String.fromCharCode(65 + i)}
                        </span>
                        {opt}
                        {showFeedback && i === exercise.correct_answer && (
                          <CheckCircle size={18} className="ml-auto text-green-600" />
                        )}
                        {showFeedback && i === selected && selected !== exercise.correct_answer && (
                          <XCircle size={18} className="ml-auto text-red-500" />
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>

              {showFeedback && (
                <div className={`mt-5 p-4 rounded-xl ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                  <p className={`font-semibold mb-1 ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                    {isCorrect ? '✓ Correto!' : '✗ Incorreto'}
                  </p>
                  {exercise.explanation && (
                    <p className={`text-sm ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                      {exercise.explanation}
                    </p>
                  )}
                </div>
              )}
            </div>

            <button
              onClick={handleNext}
              disabled={selected === null || submitting}
              className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-semibold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <><Loader size={18} className="animate-spin" /> Processando...</>
              ) : !showFeedback ? (
                'Confirmar resposta'
              ) : currentQ + 1 < lesson.exercises.length ? (
                <> Próxima questão <ChevronRight size={18} /></>
              ) : (
                <> Ver resultado <Trophy size={18} /></>
              )}
            </button>
          </>
        )}

        {/* FASE: Resultado */}
        {phase === 'result' && result && (
          <div className="text-center">
            <div className="bg-white rounded-2xl border border-gray-200 p-10 mb-6">
              <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${result.score >= 70 ? 'bg-green-100' : 'bg-yellow-100'}`}>
                <Trophy size={48} className={result.score >= 70 ? 'text-green-600' : 'text-yellow-600'} />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {result.score >= 70 ? 'Excelente!' : result.score >= 40 ? 'Bom trabalho!' : 'Continue praticando!'}
              </h2>
              <p className="text-gray-500 mb-8">
                {result.score >= 70 ? 'Você dominou esta lição!' : 'Revise o conteúdo e tente novamente.'}
              </p>

              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-indigo-50 rounded-xl p-4">
                  <p className="text-3xl font-bold text-indigo-600">{result.score}%</p>
                  <p className="text-sm text-gray-500 mt-1">Pontuação</p>
                </div>
                <div className="bg-green-50 rounded-xl p-4">
                  <p className="text-3xl font-bold text-green-600">{result.correct}/{result.total}</p>
                  <p className="text-sm text-gray-500 mt-1">Acertos</p>
                </div>
                <div className="bg-yellow-50 rounded-xl p-4">
                  <p className="text-3xl font-bold text-yellow-600">+{result.points}</p>
                  <p className="text-sm text-gray-500 mt-1">Pontos</p>
                </div>
              </div>

              {/* Detalhes por questão */}
              <div className="text-left space-y-2 mb-8">
                {result.results.map((r, i) => (
                  <div key={i} className={`flex items-center gap-3 p-3 rounded-lg ${r.correct ? 'bg-green-50' : 'bg-red-50'}`}>
                    {r.correct
                      ? <CheckCircle size={18} className="text-green-600 flex-shrink-0" />
                      : <XCircle size={18} className="text-red-500 flex-shrink-0" />
                    }
                    <span className={`text-sm font-medium ${r.correct ? 'text-green-700' : 'text-red-600'}`}>
                      Questão {i + 1}: {r.correct ? 'Correto' : 'Incorreto'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={restartQuiz}
                className="flex-1 flex items-center justify-center gap-2 border-2 border-indigo-200 text-indigo-600 py-3 rounded-xl font-semibold hover:bg-indigo-50 transition"
              >
                <RotateCcw size={18} />
                Tentar novamente
              </button>
              <Link
                to="/dashboard"
                className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition"
              >
                Voltar ao Dashboard
                <ChevronRight size={18} />
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

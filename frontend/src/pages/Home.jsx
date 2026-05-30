import { Link } from 'react-router-dom';
import { BookOpen, Zap, Award, BarChart2, CheckCircle, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 py-24 text-center">
        <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
          <Globe size={14} />
          Plataforma gratuita de aprendizado
        </div>
        <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
          Aprenda Inglês de Forma<br />
          <span className="text-indigo-600">Interativa e Eficaz</span>
        </h1>
        <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
          Lições estruturadas, quizzes interativos e acompanhamento de progresso.
          Tudo o que você precisa para dominar o inglês.
        </p>
        <div className="flex gap-4 justify-center">
          {user ? (
            <Link
              to="/dashboard"
              className="bg-indigo-600 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200"
            >
              Ir para o Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="bg-indigo-600 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200"
              >
                Começar Agora — Grátis
              </Link>
              <Link
                to="/login"
                className="border-2 border-indigo-200 text-indigo-600 px-8 py-3.5 rounded-xl font-semibold hover:bg-indigo-50 transition"
              >
                Já tenho conta
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Stats */}
      <section className="bg-indigo-600 py-12">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-3 gap-8 text-center text-white">
          <div>
            <p className="text-4xl font-bold">5+</p>
            <p className="text-indigo-200 mt-1">Lições disponíveis</p>
          </div>
          <div>
            <p className="text-4xl font-bold">25+</p>
            <p className="text-indigo-200 mt-1">Exercícios interativos</p>
          </div>
          <div>
            <p className="text-4xl font-bold">100%</p>
            <p className="text-indigo-200 mt-1">Gratuito</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Por que nossa plataforma?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <BookOpen size={32} className="text-indigo-600" />,
              title: 'Lições Estruturadas',
              desc: 'Conteúdo organizado do básico ao avançado, com exemplos claros e objetivos definidos.',
              bg: 'bg-indigo-50'
            },
            {
              icon: <Zap size={32} className="text-yellow-500" />,
              title: 'Quizzes Interativos',
              desc: 'Teste seu conhecimento após cada lição com exercícios de múltipla escolha e feedback imediato.',
              bg: 'bg-yellow-50'
            },
            {
              icon: <BarChart2 size={32} className="text-green-500" />,
              title: 'Progresso em Tempo Real',
              desc: 'Acompanhe sua pontuação, taxa de acerto e lições completadas no seu dashboard.',
              bg: 'bg-green-50'
            },
            {
              icon: <Award size={32} className="text-purple-500" />,
              title: 'Sistema de Pontos',
              desc: 'Ganhe pontos a cada exercício correto e veja sua evolução ao longo do tempo.',
              bg: 'bg-purple-50'
            },
            {
              icon: <CheckCircle size={32} className="text-blue-500" />,
              title: 'Conteúdo Prático',
              desc: 'Foco em vocabulário e gramática do cotidiano: verbos, rotina diária e muito mais.',
              bg: 'bg-blue-50'
            },
            {
              icon: <Globe size={32} className="text-red-400" />,
              title: 'Acesso em Qualquer Lugar',
              desc: 'Plataforma responsiva que funciona no celular, tablet e computador.',
              bg: 'bg-red-50'
            }
          ].map((f, i) => (
            <div key={i} className={`${f.bg} p-8 rounded-2xl`}>
              <div className="mb-4">{f.icon}</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Lições disponíveis */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            O que você vai aprender
          </h2>
          <p className="text-center text-gray-500 mb-10">Currículo atual da plataforma</p>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { title: 'Verbo TO BE', level: 'Iniciante', desc: 'A base de tudo: am, is, are' },
              { title: 'Verbos Irregulares', level: 'Iniciante', desc: 'Go, Have, Do, See e mais' },
              { title: 'Present Continuous', level: 'Intermediário', desc: 'Ações que acontecem agora' },
              { title: 'Vocabulário: Rotina Diária', level: 'Iniciante', desc: 'Palavras do cotidiano' },
              { title: 'Simple Past', level: 'Intermediário', desc: 'Fale sobre o passado' },
            ].map((l, i) => (
              <div key={i} className="bg-white p-5 rounded-xl border border-gray-200 flex items-center gap-4">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold flex-shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900">{l.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${l.level === 'Iniciante' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {l.level}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5">{l.desc}</p>
                </div>
                <CheckCircle size={18} className="text-gray-300 flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Pronto para começar?
        </h2>
        <p className="text-gray-500 mb-8">Crie sua conta grátis e comece a aprender agora.</p>
        <Link
          to="/login"
          className="bg-indigo-600 text-white px-10 py-4 rounded-xl font-semibold text-lg hover:bg-indigo-700 transition shadow-lg shadow-indigo-200"
        >
          Criar conta grátis
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 text-center text-gray-400 text-sm">
        <p>English Learning Platform — Aprenda inglês gratuitamente</p>
      </footer>
    </div>
  );
}

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
  ['I',         'am',  "I'm",     'Ai-m',  'I am a very dedicated student at the university.',         'Ai âm ê véri dédikêitid stúdent êt dê iunivérsiti.',      'Eu sou um estudante muito dedicado na universidade.'],
  ['You',       'are', "You're",  'Iur',   'You are one of the smartest people I have ever met.',      'Iú ar uán ov dê smartest pípl Ai hâv éver mét.',           'Você é uma das pessoas mais inteligentes que já conheci.'],
  ['He',        'is',  "He's",    'Riz',   'He is a tall and very confident young man.',               'Hi iz ê tól ênd véri kónfident iâng mên.',                 'Ele é um jovem alto e muito confiante.'],
  ['She',       'is',  "She's",   'Shiz',  'She is extremely happy with her brand new job.',           'Shi iz ikstrímli hâpi uid hér brând niú djób.',             'Ela está extremamente feliz com o seu novo emprego.'],
  ['It',        'is',  "It's",    'Its',   'It is very cold and windy outside today.',                 'It iz véri kóuld ênd uíndi áutsáid tudêi.',                'Está muito frio e ventando lá fora hoje.'],
  ['We',        'are', "We're",   'Uí-ar', 'We are the best of friends since our early childhood.',   'Uí ar dê bést ov frends sins áuer érli tcháildhud.',        'Nós somos os melhores amigos desde a nossa infância.'],
  ['You (pl.)', 'are', "You're",  'Iur',   'You are all very welcome to join our amazing team.',      'Iú ar ól véri uélkam tu djóin áuer êméizing tím.',          'Vocês são todos muito bem-vindos para entrar no nosso time.'],
  ['They',      'are', "They're", 'Dér',   'They are experienced and truly dedicated teachers.',       'Déi ar ekspíriênsd ênd trúli dédikêitid títchers.',         'Eles(as) são professores(as) experientes e verdadeiramente dedicados.'],
];

const PASSADO = [
  ['I',         'was',  'Waz',  'I was very tired after a long day at work yesterday.',           'Ai waz véri táierd âfter ê lóng dei êt wérk iésterdêi.',      'Eu estava muito cansado depois de um longo dia de trabalho ontem.'],
  ['You',       'were', 'Wer',  'You were absolutely right about everything you said.',           'Iú wer êbsolútli ráit êbaút évrithing iú sed.',                'Você estava absolutamente certo sobre tudo que você disse.'],
  ['He',        'was',  'Waz',  'He was at home watching TV when I called him.',                  'Hi waz êt hôum uátching tivi uén Ai kóld him.',               'Ele estava em casa assistindo TV quando eu liguei para ele.'],
  ['She',       'was',  'Waz',  'She was so happy when she received the wonderful news.',         'Shi waz sô hâpi uén shi risívd dê uânderful niuz.',            'Ela estava tão feliz quando recebeu as notícias maravilhosas.'],
  ['It',        'was',  'Waz',  'It was extremely cold and snowy the entire week.',               'It waz ikstrímli kóuld ênd snôui dê entáier uík.',             'Estava extremamente frio e nevando durante a semana inteira.'],
  ['We',        'were', 'Wer',  'We were students at the same school for many years.',            'Uí wer stúdents êt dê sêim skúl for méni iíers.',             'Nós éramos alunos na mesma escola por muitos anos.'],
  ['You (pl.)', 'were', 'Wer',  'You were all late for the most important meeting of the year.', 'Iú wer ól léit for dê môust impórtênt míting ov dê iíer.',    'Vocês estavam todos atrasados para a reunião mais importante do ano.'],
  ['They',      'were', 'Wer',  'They were extremely busy preparing for the big presentation.',  'Déi wer ikstrímli bízi pripéring for dê big prezentéishon.',   'Eles(as) estavam extremamente ocupados preparando para a grande apresentação.'],
];

const FUTURO = [
  ['I',         'will be', "I'll be",    'Ai-l bi',  'I will be there to support you as soon as possible.',          'Ai uíl bi dér tu supórt iú êz sun êz pósibl.',             'Eu vou estar lá para te apoiar o mais rápido possível.'],
  ['You',       'will be', "You'll be",  'Iúl bi',   'You will be perfectly fine after some rest and good sleep.',   'Iú uíl bi pérfektli fáin âfter sam rést ênd gud slíp.',     'Você vai ficar perfeitamente bem depois de um pouco de descanso.'],
  ['He',        'will be', "He'll be",   'Híl bi',   'He will be late again because of the heavy traffic.',          'Hi uíl bi léit êguén bikóz ov dê hévi trâfik.',            'Ele vai se atrasar de novo por causa do trânsito intenso.'],
  ['She',       'will be', "She'll be",  'Shíl bi',  'She will be so happy when she finally hears the good news.',   'Shi uíl bi sô hâpi uén shi fáinêli híers dê gud niuz.',     'Ela vai ficar tão feliz quando finalmente ouvir as boas notícias.'],
  ['It',        'will be', "It'll be",   'Ítl bi',   'It will be extremely cold and rainy all weekend long.',        'It uíl bi ikstrímli kóuld ênd réini ól uíkend lóng.',       'Vai estar extremamente frio e chuvoso durante todo o fim de semana.'],
  ['We',        'will be', "We'll be",   'Uíl bi',   'We will all be ready to start the new project next Monday.',  'Uí uíl ól bi rédi tu stárt dê niú pródjekt néxt mândei.',  'Nós vamos estar todos prontos para começar o novo projeto na segunda.'],
  ['You (pl.)', 'will be', "You'll be",  'Iúl bi',   'You will all be most welcome at our grand opening ceremony.', 'Iú uíl ól bi môust uélkam êt áuer grând ópening sérimoni.', 'Vocês serão todos muito bem-vindos na nossa cerimônia de inauguração.'],
  ['They',      'will be', "They'll be", 'Déil bi',  'They will be here at exactly eight o\'clock in the morning.', 'Déi uíl bi hír êt igzâktli éit ôklók in dê mórning.',      'Eles(as) vão estar aqui às exatamente oito horas da manhã.'],
];

const NEGATIVA = [
  ['Negativa (pres.)',         'Sujeito + am/is/are + not', 'âm nót / iz nót / ar nót',  "I am not tired at all. / She is not here right now.",                        "Ai âm nót táierd êt ól. / Shi iz nót hír ráit náu.",                  "Eu não estou cansado de jeito nenhum. / Ela não está aqui agora."],
  ['Negativa (passado)',       'Sujeito + was/were + not',  'wóz nót / wér nót',          "He was not ready when the boss arrived. / They were not late for once.",     "Hi waz nót rédi uén dê bós êráivd. / Déi wer nót léit for uáns.",     "Ele não estava pronto quando o chefe chegou. / Eles não se atrasaram dessa vez."],
  ['Negativa (futuro)',        "Sujeito + won't be",        'uónt bi',                    "I won't be at home tomorrow evening. / They won't be late this time.",       "Ai uónt bi êt hôum tumórou ívning. / Déi uónt bi léit dis táim.",     "Eu não vou estar em casa amanhã à noite. / Eles não vão se atrasar dessa vez."],
  ['Interrogativa (pres.)',    'Am/Is/Are + sujeito + ?',   'Âm / Íz / Ar',              "Are you ready to start the exam right now? / Is she still at home?",        "Ar iú rédi tu stárt dê igzâm ráit náu? / Iz shi stíl êt hôum?",      "Você está pronto para começar a prova agora? / Ela ainda está em casa?"],
  ['Interrogativa (passado)',  'Was/Were + sujeito + ?',    'Wóz / Wér',                 "Was he at school when you tried to call him? / Were they happy with it?",   "Wóz hi êt skúl uén iú tráid tu kól him? / Wer déi hâpi uid it?",     "Ele estava na escola quando você tentou ligar? / Eles estavam felizes com isso?"],
  ['Interrogativa (futuro)',   'Will + sujeito + be + ?',   'Uíl',                       "Will you be at the party tonight? / Will it be cold enough to snow?",       "Uíl iú bi êt dê párti tunáit? / Uíl it bi kóuld ináf tu snô?",       "Você vai estar na festa hoje à noite? / Vai estar frio o suficiente para nevar?"],
  ["Neg. contraída (pres.)",   "isn't / aren't",            "Íz-nt / Ar-nt",             "He isn't as tall as his older brother. / They aren't here yet, please wait.", "Hi íznt êz tól êz hiz ôulder bráder. / Déi árnt hír iét, plíz uéit.", "Ele não é tão alto quanto o irmão mais velho. / Eles ainda não chegaram, por favor espere."],
  ["Neg. contraída (passado)", "wasn't / weren't",          "Wóz-nt / Wér-nt",           "She wasn't too busy to help us out. / We weren't late for the big meeting.", "Shi wóznt tú bízi tu hélp us áut. / Uí wérnt léit for dê big míting.", "Ela não estava ocupada demais para nos ajudar. / Nós não chegamos atrasados para a reunião."],
  ["Neg. contraída (futuro)",  "won't be",                  "Uónt bi",                   "I won't be ready on time today. / She won't be home until midnight.",        "Ai uónt bi rédi ón táim tudêi. / Shi uónt bi hôum untíl midnáit.",    "Eu não vou estar pronto a tempo hoje. / Ela não vai estar em casa até meia-noite."],
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
                  {PRESENTE.map(([pronoun, verb, contraction, pron, example, exPron, translation], i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-indigo-50/20'}>
                      <TbCell className="font-semibold text-gray-800">{pronoun}</TbCell>
                      <TbCell className="text-indigo-600 font-bold">{verb}</TbCell>
                      <TbCell className="text-purple-600 font-mono font-semibold">{contraction}</TbCell>
                      <TbCell className="text-orange-500 font-mono text-xs">({pron})</TbCell>
                      <TbCell>
                        <span className="italic text-gray-700 block">{example}</span>
                        <span className="text-orange-400 font-mono text-xs block mt-0.5">({exPron})</span>
                      </TbCell>
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
                    {['Pronome','To Be','Pronúncia','Exemplo','Tradução'].map(h => (
                      <TbHeader key={h} color="border-amber-100 text-amber-700">{h}</TbHeader>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {PASSADO.map(([pronoun, verb, pron, example, exPron, translation], i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-amber-50/20'}>
                      <TbCell className="font-semibold text-gray-800">{pronoun}</TbCell>
                      <TbCell className="text-amber-600 font-bold">{verb}</TbCell>
                      <TbCell className="text-orange-500 font-mono text-xs">({pron})</TbCell>
                      <TbCell>
                        <span className="italic text-gray-700 block">{example}</span>
                        <span className="text-orange-400 font-mono text-xs block mt-0.5">({exPron})</span>
                      </TbCell>
                      <TbCell className="text-gray-600 font-medium">{translation}</TbCell>
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
                    {['Pronome','To Be','Contração','Pronúncia','Exemplo','Tradução'].map(h => (
                      <TbHeader key={h} color="border-green-100 text-green-700">{h}</TbHeader>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {FUTURO.map(([pronoun, verb, contraction, pron, example, exPron, translation], i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-green-50/20'}>
                      <TbCell className="font-semibold text-gray-800">{pronoun}</TbCell>
                      <TbCell className="text-green-600 font-bold">{verb}</TbCell>
                      <TbCell className="text-teal-600 font-mono font-semibold">{contraction}</TbCell>
                      <TbCell className="text-orange-500 font-mono text-xs">({pron})</TbCell>
                      <TbCell>
                        <span className="italic text-gray-700 block">{example}</span>
                        <span className="text-orange-400 font-mono text-xs block mt-0.5">({exPron})</span>
                      </TbCell>
                      <TbCell className="text-gray-600 font-medium">{translation}</TbCell>
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
                    {['Forma','Estrutura','Pronúncia','Exemplo','Tradução'].map(h => (
                      <TbHeader key={h} color="border-red-100 text-red-700">{h}</TbHeader>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {NEGATIVA.map(([form, structure, pron, example, exPron, translation], i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-red-50/20'}>
                      <TbCell className="font-semibold text-gray-800 whitespace-nowrap">{form}</TbCell>
                      <TbCell className="text-red-600 font-mono text-xs">{structure}</TbCell>
                      <TbCell className="text-orange-500 font-mono text-xs">{pron}</TbCell>
                      <TbCell>
                        <span className="italic text-gray-700 block">{example}</span>
                        <span className="text-orange-400 font-mono text-xs block mt-0.5">({exPron})</span>
                      </TbCell>
                      <TbCell className="text-gray-600 font-medium">{translation}</TbCell>
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

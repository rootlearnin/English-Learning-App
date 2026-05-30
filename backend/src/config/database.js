import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.resolve(__dirname, '../../database.sqlite');

const db = new Database(dbPath);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS lessons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    content TEXT NOT NULL,
    difficulty TEXT CHECK(difficulty IN ('beginner','intermediate','advanced')) DEFAULT 'beginner',
    order_num INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS exercises (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lesson_id INTEGER NOT NULL,
    question TEXT NOT NULL,
    options TEXT NOT NULL,
    correct_answer INTEGER NOT NULL,
    explanation TEXT,
    FOREIGN KEY (lesson_id) REFERENCES lessons(id)
  );

  CREATE TABLE IF NOT EXISTS user_progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    lesson_id INTEGER NOT NULL,
    completed INTEGER DEFAULT 0,
    score INTEGER DEFAULT 0,
    completed_at DATETIME,
    UNIQUE(user_id, lesson_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (lesson_id) REFERENCES lessons(id)
  );

  CREATE TABLE IF NOT EXISTS user_stats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL UNIQUE,
    total_points INTEGER DEFAULT 0,
    total_exercises INTEGER DEFAULT 0,
    total_correct INTEGER DEFAULT 0,
    streak INTEGER DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
`);

// ─── Dados completos de cada lição ────────────────────────────────────────────

const LESSONS_DATA = [
  {
    order_num: 1,
    title: 'Verbo TO BE',
    description: 'Aprenda o verbo mais importante do inglês',
    difficulty: 'beginner',
    content: `## Verbo TO BE

O verbo **to be** significa "ser" ou "estar". É o verbo mais usado em inglês.

### Conjugação no Presente

| Pronome | To Be | Contração |
|---------|-------|-----------|
| I | am | I'm |
| You | are | You're |
| He/She/It | is | He's / She's / It's |
| We | are | We're |
| They | are | They're |

### Exemplos

- **I am** a student. (Eu sou um estudante)
- **You are** smart. (Você é inteligente)
- **He is** tall. (Ele é alto)
- **She is** happy. (Ela está feliz)
- **We are** friends. (Nós somos amigos)
- **They are** teachers. (Eles são professores)

### Forma Negativa

Adicione **not** depois do to be:
- I am **not** tired. (Eu não estou cansado)
- He is **not** here. (Ele não está aqui)

### Forma Interrogativa

Inverta o sujeito e o to be:
- **Are** you ready? (Você está pronto?)
- **Is** she at home? (Ela está em casa?)`,
    exercises: [
      { q: 'I ___ a student.',                                   opts: '["am","is","are","be"]',                              c: 0, e: 'Com "I" usamos sempre "am".' },
      { q: 'She ___ happy.',                                     opts: '["am","is","are","be"]',                              c: 1, e: 'Com "She/He/It" usamos "is".' },
      { q: 'They ___ teachers.',                                 opts: '["am","is","are","be"]',                              c: 2, e: 'Com "They/We/You" usamos "are".' },
      { q: 'He ___ tall.',                                       opts: '["am","is","are","be"]',                              c: 1, e: 'Com "He" usamos "is".' },
      { q: 'We ___ friends.',                                    opts: '["am","is","are","be"]',                              c: 2, e: 'Com "We" usamos "are".' },
      { q: 'It ___ cold today.',                                 opts: '["am","is","are","be"]',                              c: 1, e: 'Com "It" usamos "is".' },
      { q: 'You ___ my best friend.',                            opts: '["am","is","are","be"]',                              c: 2, e: 'Com "You" usamos "are".' },
      { q: 'Como se diz "Ela não está aqui" em inglês?',         opts: '["She not is here.","She is not here.","She are not here.","She am not here."]', c: 1, e: 'Negativa: sujeito + is + not.' },
      { q: '___ she a doctor?',                                  opts: '["Am","Is","Are","Be"]',                              c: 1, e: 'Com "she" a pergunta começa com "Is".' },
      { q: 'The cats ___ hungry.',                               opts: '["am","is","are","be"]',                              c: 2, e: '"The cats" é plural, equivale a "They" → "are".' },
    ]
  },
  {
    order_num: 2,
    title: 'Verbos Irregulares',
    description: 'Os verbos mais usados no dia a dia',
    difficulty: 'beginner',
    content: `## Verbos Irregulares

Verbos irregulares não seguem o padrão regular de conjugação. Memorize os mais comuns!

### Top 10 Verbos Irregulares

| Verbo | Passado | Particípio | Significado |
|-------|---------|------------|-------------|
| go | went | gone | ir |
| have | had | had | ter |
| do | did | done | fazer |
| say | said | said | dizer |
| come | came | come | vir |
| see | saw | seen | ver |
| get | got | gotten | obter |
| make | made | made | fazer/criar |
| know | knew | known | saber |
| think | thought | thought | pensar |

### Exemplos no Passado

- Yesterday, I **went** to school. (Ontem eu fui à escola)
- She **said** hello to me. (Ela me disse olá)
- We **saw** a great movie. (Nós vimos um ótimo filme)
- He **made** dinner. (Ele fez o jantar)
- They **knew** the answer. (Eles sabiam a resposta)`,
    exercises: [
      { q: 'Yesterday, I ___ to school. (go)',           opts: '["go","went","gone","goes"]',             c: 1, e: '"Went" é o passado de "go".' },
      { q: 'She ___ hello to me. (say)',                 opts: '["say","sayed","said","says"]',           c: 2, e: '"Said" é o passado de "say".' },
      { q: 'We ___ a movie. (see)',                      opts: '["see","sawn","saw","seen"]',             c: 2, e: '"Saw" é o passado de "see".' },
      { q: 'He ___ dinner. (make)',                      opts: '["maked","made","makes","make"]',         c: 1, e: '"Made" é o passado de "make".' },
      { q: 'They ___ the answer. (know)',                opts: '["know","knowed","knew","known"]',        c: 2, e: '"Knew" é o passado de "know".' },
      { q: 'I ___ a great idea. (have)',                 opts: '["have","haved","had","has"]',            c: 2, e: '"Had" é o passado de "have".' },
      { q: 'She ___ to school early. (come)',            opts: '["come","comed","came","comes"]',         c: 2, e: '"Came" é o passado de "come".' },
      { q: 'He ___ very tired after work. (get)',        opts: '["get","getted","gots","got"]',           c: 3, e: '"Got" é o passado de "get".' },
      { q: 'They ___ about the problem. (think)',        opts: '["think","thinked","thought","thunk"]',   c: 2, e: '"Thought" é o passado de "think".' },
      { q: 'We ___ our homework last night. (do)',       opts: '["do","does","done","did"]',              c: 3, e: '"Did" é o passado de "do".' },
    ]
  },
  {
    order_num: 3,
    title: 'Present Continuous',
    description: 'Expressando ações que acontecem agora',
    difficulty: 'intermediate',
    content: `## Present Continuous (Presente Contínuo)

Usado para ações que estão acontecendo **agora** ou em progresso.

### Formação

**Sujeito + to be (am/is/are) + verbo + -ing**

### Regras para adicionar -ing

1. **Regra geral**: add -ing → work → **working**
2. **Verbo termina em -e**: retire o -e → make → **making**
3. **Verbo curto + consoante**: dobre a consoante → run → **running**

### Exemplos

- I **am studying** English. (Eu estou estudando inglês)
- She **is working** now. (Ela está trabalhando agora)
- They **are playing** soccer. (Eles estão jogando futebol)
- He **is making** lunch. (Ele está fazendo o almoço)
- We **are running** in the park. (Nós estamos correndo no parque)

### Quando usar?

✅ Ação acontecendo agora: *"I am eating."*
✅ Ação temporária: *"She is living in Paris this month."*
✅ Planos futuros: *"We are meeting tomorrow."*`,
    exercises: [
      { q: 'She ___ (study) English right now.',         opts: '["study","studies","is studying","are studying"]',   c: 2, e: 'She + is + verb-ing = "is studying".' },
      { q: 'They ___ (play) soccer now.',                opts: '["play","plays","is playing","are playing"]',        c: 3, e: 'They + are + verb-ing = "are playing".' },
      { q: 'What is the -ing form of "make"?',           opts: '["makeing","making","makking","maked"]',             c: 1, e: 'Remove o -e antes de adicionar -ing: make → making.' },
      { q: 'What is the -ing form of "run"?',            opts: '["runing","running","runeing","runs"]',              c: 1, e: 'Verbo curto termina em consoante: dobra antes de -ing.' },
      { q: 'I ___ (not/sleep) right now.',               opts: '["am not sleeping","is not sleeping","are not sleeping","not sleeping"]', c: 0, e: 'I + am not + verb-ing = "am not sleeping".' },
      { q: 'He ___ (write) a letter at the moment.',     opts: '["write","is writing","are writing","writes"]',      c: 1, e: 'He + is + verb-ing = "is writing".' },
      { q: 'We ___ (have) dinner right now.',            opts: '["have","is having","are having","haves"]',          c: 2, e: 'We + are + verb-ing = "are having". Remove o -e de "have".' },
      { q: 'What is the -ing form of "swim"?',           opts: '["swiming","swimeing","swimming","swims"]',          c: 2, e: 'Verbo curto (cvc): dobra o "m" → swimming.' },
      { q: 'The dog ___ (not/eat) its food.',            opts: '["is not eating","are not eating","not eating","does not eating"]', c: 0, e: '"The dog" = it → is not eating.' },
      { q: '___ they ___ (travel) to Paris?',            opts: '["Is / travelling","Are / travelling","Do / travelling","Am / travelling"]', c: 1, e: 'They → Are + verb-ing.' },
    ]
  },
  {
    order_num: 4,
    title: 'Vocabulário: Rotina Diária',
    description: 'Palavras essenciais para falar sobre o seu dia',
    difficulty: 'beginner',
    content: `## Rotina Diária em Inglês

### Atividades Matinais

| Inglês | Português |
|--------|-----------|
| wake up | acordar |
| get up | levantar da cama |
| take a shower | tomar banho |
| brush your teeth | escovar os dentes |
| get dressed | se vestir |
| have breakfast | tomar café da manhã |
| go to work/school | ir ao trabalho/escola |

### Atividades da Tarde e Noite

| Inglês | Português |
|--------|-----------|
| have lunch | almoçar |
| come back home | voltar para casa |
| do homework | fazer lição de casa |
| have dinner | jantar |
| watch TV | assistir TV |
| read a book | ler um livro |
| go to bed | ir dormir |

### Exemplo de Rotina

*"I **wake up** at 7am. I **take a shower** and **have breakfast**. Then I **go to school**. After school, I **do homework** and **have dinner** with my family. I **go to bed** at 10pm."*`,
    exercises: [
      { q: 'What does "wake up" mean?',                  opts: '["dormir","acordar","levantar","descansar"]',                         c: 1, e: '"Wake up" significa acordar.' },
      { q: 'How do you say "tomar café da manhã"?',      opts: '["have lunch","have dinner","have breakfast","have tea"]',            c: 2, e: '"Have breakfast" = tomar café da manhã.' },
      { q: 'What does "go to bed" mean?',                opts: '["sair da cama","ir trabalhar","ir dormir","fazer a cama"]',          c: 2, e: '"Go to bed" significa ir dormir.' },
      { q: '"Do homework" means:',                       opts: '["fazer a cama","fazer lição de casa","fazer o almoço","fazer exercícios"]', c: 1, e: '"Do homework" = fazer lição de casa.' },
      { q: 'How do you say "voltar para casa"?',         opts: '["go home","come back home","stay home","leave home"]',              c: 1, e: '"Come back home" = voltar para casa.' },
      { q: 'What does "take a shower" mean?',            opts: '["escovar os dentes","tomar banho","se vestir","lavar o rosto"]',    c: 1, e: '"Take a shower" = tomar banho.' },
      { q: 'How do you say "escovar os dentes"?',        opts: '["get dressed","wash your face","brush your teeth","comb your hair"]', c: 2, e: '"Brush your teeth" = escovar os dentes.' },
      { q: 'What does "get dressed" mean?',              opts: '["tomar banho","acordar","se vestir","sair de casa"]',               c: 2, e: '"Get dressed" = se vestir.' },
      { q: 'How do you say "assistir TV"?',              opts: '["read a book","watch TV","listen to music","play games"]',          c: 1, e: '"Watch TV" = assistir TV.' },
      { q: 'What does "have lunch" mean?',               opts: '["tomar café","almoçar","jantar","fazer um lanche"]',                c: 1, e: '"Have lunch" = almoçar.' },
    ]
  },
  {
    order_num: 5,
    title: 'Simple Past',
    description: 'Fale sobre eventos que já aconteceram',
    difficulty: 'intermediate',
    content: `## Simple Past (Passado Simples)

Usado para ações **completadas** no passado.

### Verbos Regulares

Adicione **-ed** ao verbo:

| Presente | Passado | Tradução |
|---------|---------|----------|
| work | worked | trabalhou |
| watch | watched | assistiu |
| play | played | jogou |
| study | studied | estudou |
| live | lived | morou |

### Regras especiais

- Verbo termina em **-e**: add -d → live → **lived**
- Verbo termina em consoante + y: troca y por **-ied** → study → **studied**
- Verbo curto + consoante: dobre → stop → **stopped**

### Forma Negativa

**did not (didn't) + verbo base**

- I **didn't work** yesterday. (Eu não trabalhei ontem)
- She **didn't study**. (Ela não estudou)

### Forma Interrogativa

**Did + sujeito + verbo base?**

- **Did** you **work** yesterday? (Você trabalhou ontem?)
- **Did** she **study**? (Ela estudou?)

### Exemplos

- Last night, I **watched** a movie. (Ontem à noite eu assisti um filme)
- She **studied** hard for the test. (Ela estudou muito para a prova)
- He **didn't go** to the party. (Ele não foi à festa)`,
    exercises: [
      { q: 'Yesterday, she ___ (work) all day.',         opts: '["work","works","worked","working"]',                              c: 2, e: 'Passado regular de "work" é "worked".' },
      { q: 'Como se diz "Eu não fui" em inglês?',        opts: '["I not went","I didn\'t go","I didn\'t went","I not go"]',       c: 1, e: 'Negativa no passado: didn\'t + verbo base.' },
      { q: '___ you watch TV last night?',               opts: '["Do","Does","Did","Was"]',                                        c: 2, e: 'Perguntas no passado usam "Did".' },
      { q: 'What is the past of "study"?',               opts: '["studyed","studied","studid","studieded"]',                      c: 1, e: 'study → studied (y vira ied).' },
      { q: 'What is the past of "stop"?',                opts: '["stoped","stoppped","stopped","stopted"]',                       c: 2, e: 'Verbo curto + consoante: dobra antes de -ed.' },
      { q: 'She ___ (play) tennis yesterday.',           opts: '["play","plaied","played","plays"]',                              c: 2, e: 'Verbo regular: play + ed = played.' },
      { q: 'Como se diz "Ela assistiu um filme"?',       opts: '["She watch a movie.","She watched a movie.","She did watched a movie.","She watching a movie."]', c: 1, e: 'Passado de "watch" é "watched".' },
      { q: 'What is the past of "live"?',                opts: '["liveed","lived","livd","liven"]',                               c: 1, e: 'Verbo termina em -e: acrescenta só -d → lived.' },
      { q: '___ he study for the test?',                 opts: '["Do","Does","Did","Was"]',                                       c: 2, e: 'Perguntas no passado usam "Did" para todos os sujeitos.' },
      { q: 'They ___ (not/work) last week.',             opts: '["didn\'t worked","didn\'t work","not worked","don\'t work"]',    c: 1, e: 'Negativa: didn\'t + verbo base (sem -ed).' },
    ]
  }
];

// ─── Seed inicial (banco vazio) ───────────────────────────────────────────────

const seedCount = db.prepare('SELECT COUNT(*) as count FROM lessons').get();

if (seedCount.count === 0) {
  const insertLesson   = db.prepare('INSERT INTO lessons (title, description, content, difficulty, order_num) VALUES (?, ?, ?, ?, ?)');
  const insertExercise = db.prepare('INSERT INTO exercises (lesson_id, question, options, correct_answer, explanation) VALUES (?, ?, ?, ?, ?)');

  for (const lesson of LESSONS_DATA) {
    const { lastInsertRowid } = insertLesson.run(lesson.title, lesson.description, lesson.content, lesson.difficulty, lesson.order_num);
    for (const ex of lesson.exercises) {
      insertExercise.run(lastInsertRowid, ex.q, ex.opts, ex.c, ex.e);
    }
  }
}

// ─── Migração: adicionar exercícios extras em lições existentes ───────────────

else {
  const insertExercise = db.prepare('INSERT INTO exercises (lesson_id, question, options, correct_answer, explanation) VALUES (?, ?, ?, ?, ?)');

  for (const lessonData of LESSONS_DATA) {
    const lesson = db.prepare('SELECT id FROM lessons WHERE order_num = ?').get(lessonData.order_num);
    if (!lesson) continue;

    const existing = db.prepare('SELECT COUNT(*) as count FROM exercises WHERE lesson_id = ?').get(lesson.id);
    const needed = lessonData.exercises.length - existing.count;
    if (needed <= 0) continue;

    const toAdd = lessonData.exercises.slice(existing.count);
    for (const ex of toAdd) {
      insertExercise.run(lesson.id, ex.q, ex.opts, ex.c, ex.e);
    }
    console.log(`✚ ${needed} exercício(s) adicionado(s) à lição "${lessonData.title}"`);
  }
}

export default db;

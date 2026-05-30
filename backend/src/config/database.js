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

const seedLessons = db.prepare('SELECT COUNT(*) as count FROM lessons').get();
if (seedLessons.count === 0) {
  const insertLesson = db.prepare(
    'INSERT INTO lessons (title, description, content, difficulty, order_num) VALUES (?, ?, ?, ?, ?)'
  );
  const insertExercise = db.prepare(
    'INSERT INTO exercises (lesson_id, question, options, correct_answer, explanation) VALUES (?, ?, ?, ?, ?)'
  );

  const lessons = [
    {
      title: 'Verbo TO BE',
      description: 'Aprenda o verbo mais importante do inglês',
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
      difficulty: 'beginner',
      order_num: 1,
      exercises: [
        { question: 'I ___ a student.', options: ['["am","is","are","be"]'], correct: 0, explanation: 'Com "I" usamos sempre "am".' },
        { question: 'She ___ happy.', options: ['["am","is","are","be"]'], correct: 1, explanation: 'Com "She/He/It" usamos "is".' },
        { question: 'They ___ teachers.', options: ['["am","is","are","be"]'], correct: 2, explanation: 'Com "They/We/You" usamos "are".' },
        { question: 'He ___ tall.', options: ['["am","is","are","be"]'], correct: 1, explanation: 'Com "He" usamos "is".' },
        { question: 'We ___ friends.', options: ['["am","is","are","be"]'], correct: 2, explanation: 'Com "We" usamos "are".' },
      ]
    },
    {
      title: 'Verbos Irregulares',
      description: 'Os verbos mais usados no dia a dia',
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
      difficulty: 'beginner',
      order_num: 2,
      exercises: [
        { question: 'Yesterday, I ___ to school. (go)', options: ['["go","went","gone","goes"]'], correct: 1, explanation: '"Went" é o passado de "go".' },
        { question: 'She ___ hello to me. (say)', options: ['["say","sayed","said","says"]'], correct: 2, explanation: '"Said" é o passado de "say".' },
        { question: 'We ___ a movie. (see)', options: ['["see","sawn","saw","seen"]'], correct: 2, explanation: '"Saw" é o passado de "see".' },
        { question: 'He ___ dinner. (make)', options: ['["maked","made","makes","make"]'], correct: 1, explanation: '"Made" é o passado de "make".' },
        { question: 'They ___ the answer. (know)', options: ['["know","knowed","knew","known"]'], correct: 2, explanation: '"Knew" é o passado de "know".' },
      ]
    },
    {
      title: 'Present Continuous',
      description: 'Expressando ações que acontecem agora',
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
      difficulty: 'intermediate',
      order_num: 3,
      exercises: [
        { question: 'She ___ (study) English right now.', options: ['["study","studies","is studying","are studying"]'], correct: 2, explanation: 'She + is + verb-ing = "is studying".' },
        { question: 'They ___ (play) soccer now.', options: ['["play","plays","is playing","are playing"]'], correct: 3, explanation: 'They + are + verb-ing = "are playing".' },
        { question: 'What is the -ing form of "make"?', options: ['["makeing","making","makking","maked"]'], correct: 1, explanation: 'Remove o -e antes de adicionar -ing: make → making.' },
        { question: 'What is the -ing form of "run"?', options: ['["runing","running","runeing","runs"]'], correct: 1, explanation: 'Verbo curto com consoante dupla: run → running.' },
        { question: 'I ___ (not/sleep) right now.', options: ['["am not sleeping","is not sleeping","are not sleeping","not sleeping"]'], correct: 0, explanation: 'I + am not + verb-ing = "am not sleeping".' },
      ]
    },
    {
      title: 'Vocabulário: Rotina Diária',
      description: 'Palavras essenciais para falar sobre o seu dia',
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
      difficulty: 'beginner',
      order_num: 4,
      exercises: [
        { question: 'What does "wake up" mean?', options: ['["dormir","acordar","levantar","descansar"]'], correct: 1, explanation: '"Wake up" significa acordar.' },
        { question: 'How do you say "tomar café da manhã"?', options: ['["have lunch","have dinner","have breakfast","have tea"]'], correct: 2, explanation: '"Have breakfast" = tomar café da manhã.' },
        { question: 'What does "go to bed" mean?', options: ['["sair da cama","ir trabalhar","ir dormir","fazer a cama"]'], correct: 2, explanation: '"Go to bed" significa ir dormir.' },
        { question: '"Do homework" means:', options: ['["fazer a cama","fazer lição de casa","fazer o almoço","fazer exercícios"]'], correct: 1, explanation: '"Do homework" = fazer lição de casa.' },
        { question: 'How do you say "voltar para casa"?', options: ['["go home","come back home","stay home","leave home"]'], correct: 1, explanation: '"Come back home" = voltar para casa.' },
      ]
    },
    {
      title: 'Simple Past',
      description: 'Fale sobre eventos que já aconteceram',
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
      difficulty: 'intermediate',
      order_num: 5,
      exercises: [
        { question: 'Yesterday, she ___ (work) all day.', options: ['["work","works","worked","working"]'], correct: 2, explanation: 'Passado regular de "work" é "worked".' },
        { question: 'How do you say "Eu não fui" in English?', options: ['["I not went","I didn\'t go","I didn\'t went","I not go"]'], correct: 1, explanation: 'Negativa no passado: didn\'t + verbo base.' },
        { question: '___ you watch TV last night?', options: ['["Do","Does","Did","Was"]'], correct: 2, explanation: 'Perguntas no passado usam "Did".' },
        { question: 'What is the past of "study"?', options: ['["studyed","studied","studid","studieded"]'], correct: 1, explanation: 'study → studied (troca o y por ied).' },
        { question: 'He ___ stop the car quickly.', options: ['["stoped","stoppped","stopped","stopted"]'], correct: 2, explanation: 'Verbo curto termina em consoante: dobra a consoante + ed.' },
      ]
    }
  ];

  for (const lesson of lessons) {
    const result = insertLesson.run(
      lesson.title,
      lesson.description,
      lesson.content,
      lesson.difficulty,
      lesson.order_num
    );
    for (const ex of lesson.exercises) {
      insertExercise.run(
        result.lastInsertRowid,
        ex.question,
        ex.options[0],
        ex.correct,
        ex.explanation
      );
    }
  }
}

export default db;

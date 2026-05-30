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
  },

  // ── Lição 6 ──────────────────────────────────────────────────────────────────
  {
    order_num: 6,
    title: 'Simple Present',
    description: 'Como falar sobre hábitos e fatos no presente',
    difficulty: 'beginner',
    content: `## Simple Present (Presente Simples)

Usado para **hábitos**, **fatos** e **rotinas**.

### Formação

| Sujeito | Verbo | Exemplo |
|---------|-------|---------|
| I / You / We / They | verbo base | I **work** every day. |
| He / She / It | verbo + **s** ou **es** | She **works** every day. |

### Regras para He/She/It

| Regra | Exemplo |
|-------|---------|
| Maioria dos verbos: add **-s** | work → works, play → plays |
| Terminam em -s, -sh, -ch, -x, -o: add **-es** | watch → watches, go → goes |
| Terminam em consoante + y: troca **y** por **-ies** | study → studies |

### Forma Negativa

| Sujeito | Negativa |
|---------|----------|
| I / You / We / They | **don't** + verbo base |
| He / She / It | **doesn't** + verbo base |

- I **don't** like coffee. (Eu não gosto de café)
- She **doesn't** work on Sundays. (Ela não trabalha aos domingos)

### Forma Interrogativa

- **Do** you like music? (Você gosta de música?)
- **Does** he live here? (Ele mora aqui?)`,
    exercises: [
      { q: 'She ___ (work) every day.',                  opts: '["work","works","working","worked"]',                             c: 1, e: 'Com He/She/It adiciona-se -s: works.' },
      { q: 'They ___ (study) English at school.',        opts: '["studies","studys","study","studyed"]',                          c: 2, e: 'Com I/You/We/They usa-se o verbo base: study.' },
      { q: 'He ___ (watch) TV every night.',             opts: '["watch","watchs","watched","watches"]',                          c: 3, e: 'Verbo termina em -ch: adiciona -es → watches.' },
      { q: 'I ___ (not/like) coffee.',                   opts: '["doesn\'t like","don\'t like","not like","don\'t likes"]',       c: 1, e: 'Com I/You/We/They a negativa é "don\'t + verbo base".' },
      { q: 'She ___ (not/eat) meat.',                    opts: '["don\'t eat","doesn\'t eat","not eats","doesn\'t eats"]',        c: 1, e: 'Com She/He/It a negativa é "doesn\'t + verbo base".' },
      { q: '___ you live near here?',                    opts: '["Does","Do","Is","Are"]',                                        c: 1, e: 'Com You/I/We/They a pergunta usa "Do".' },
      { q: '___ she speak Spanish?',                     opts: '["Do","Is","Does","Has"]',                                        c: 2, e: 'Com She/He/It a pergunta usa "Does".' },
      { q: 'What is the Simple Present of "study" for "he"?', opts: '["studys","study","studied","studies"]',                     c: 3, e: 'Consoante + y → troca y por -ies: studies.' },
      { q: 'My dog ___ (go) for a walk every morning.',  opts: '["go","gos","goes","going"]',                                     c: 2, e: 'Verbo termina em -o: adiciona -es → goes.' },
      { q: 'Como se diz "Eu não trabalho aos sábados"?', opts: '["I doesn\'t work on Saturdays.","I not work on Saturdays.","I don\'t work on Saturdays.","I don\'t works on Saturdays."]', c: 2, e: 'I + don\'t + verbo base.' },
    ]
  },

  // ── Lição 7 ──────────────────────────────────────────────────────────────────
  {
    order_num: 7,
    title: 'Artigos: A, An e The',
    description: 'Quando usar a, an e the corretamente',
    difficulty: 'beginner',
    content: `## Artigos em Inglês: A, An e The

### Artigo Indefinido: A ou An

Usado com substantivos **não específicos** (mencionados pela primeira vez).

| Artigo | Quando usar | Exemplos |
|--------|-------------|---------|
| **a** | antes de som de **consoante** | a book, a car, a university |
| **an** | antes de som de **vogal** | an apple, an hour, an umbrella |

> ⚠️ A regra é pelo **som**, não pela letra!
> - "a university" (som de "you" = consoante)
> - "an hour" (som de "aur" = vogal — o h é mudo)

### Artigo Definido: The

Usado quando o substantivo é **específico** ou já conhecido.

- I saw **a** dog. **The** dog was big. (primeiro: a → depois: the)
- **The** sun rises in the east. (único no mundo)
- **The** Amazon River is in Brazil. (nome geográfico específico)

### Sem artigo (Zero Article)

- Nomes próprios: *Brazil, Maria, London*
- Plurais genéricos: *I like **dogs**.* (cachorros em geral)
- Refeições: *I have **breakfast** at 7am.*
- Esportes: *She plays **tennis**.*`,
    exercises: [
      { q: 'I have ___ apple for lunch.',                opts: '["a","an","the","—"]',                                            c: 1, e: '"apple" começa com som de vogal → "an".' },
      { q: 'She is ___ engineer.',                       opts: '["a","an","the","—"]',                                            c: 1, e: '"engineer" começa com som de vogal → "an".' },
      { q: 'I bought ___ new car yesterday.',            opts: '["a","an","the","—"]',                                            c: 0, e: '"car" começa com som de consoante → "a".' },
      { q: 'Please close ___ door.',                     opts: '["a","an","the","—"]',                                            c: 2, e: 'A porta específica que está aberta → "the".' },
      { q: '___ sun is very hot today.',                 opts: '["A","An","The","—"]',                                            c: 2, e: 'O sol é único → "The".' },
      { q: 'She plays ___ tennis every weekend.',        opts: '["a","an","the","—"]',                                            c: 3, e: 'Esportes não usam artigo.' },
      { q: 'I saw ___ old man in the park.',             opts: '["a","an","the","—"]',                                            c: 1, e: '"old" começa com som de vogal → "an old man".' },
      { q: 'He is ___ university student.',              opts: '["a","an","the","—"]',                                            c: 0, e: '"university" tem som de "you" (consoante) → "a".' },
      { q: 'I have ___ breakfast at 7am.',               opts: '["a","an","the","—"]',                                            c: 3, e: 'Nomes de refeições não usam artigo.' },
      { q: 'She is ___ best student in the class.',      opts: '["a","an","the","—"]',                                            c: 2, e: 'Superlativo sempre usa "the".' },
    ]
  },

  // ── Lição 8 ──────────────────────────────────────────────────────────────────
  {
    order_num: 8,
    title: 'Modal Verbs: Can e Could',
    description: 'Expressar habilidade, permissão e pedidos',
    difficulty: 'intermediate',
    content: `## Modal Verbs: Can e Could

Modais **não mudam** com o sujeito (sem -s para he/she/it) e são seguidos pelo **verbo base**.

### CAN — Presente

| Uso | Exemplo | Tradução |
|-----|---------|----------|
| Habilidade | I **can** swim. | Eu sei nadar. |
| Permissão informal | **Can** I use your phone? | Posso usar seu telefone? |
| Possibilidade | It **can** be very cold here. | Pode ser muito frio aqui. |

### COULD — Passado / Formal

| Uso | Exemplo | Tradução |
|-----|---------|----------|
| Habilidade no passado | I **could** run fast when I was young. | Eu conseguia correr rápido quando era jovem. |
| Pedido formal/educado | **Could** you help me, please? | Você poderia me ajudar? |
| Possibilidade | It **could** rain tomorrow. | Pode chover amanhã. |

### Forma Negativa

- I **can't** (cannot) drive. (Eu não sei dirigir)
- She **couldn't** come yesterday. (Ela não conseguiu vir ontem)

### Estrutura

**Sujeito + can/could + verbo base (sem to)**

✅ She **can speak** French.
❌ She **can speaks** French.
❌ She **can to speak** French.`,
    exercises: [
      { q: 'She ___ speak three languages.',             opts: '["can","cans","could to","to can"]',                              c: 0, e: 'Modal "can" não muda com o sujeito: can.' },
      { q: 'When I was young, I ___ run very fast.',     opts: '["can","could","couldn\'t","cans"]',                              c: 1, e: '"Could" expressa habilidade no passado.' },
      { q: '___ I open the window, please?',             opts: '["Could","Coulds","Can to","Am I"]',                              c: 0, e: '"Could" para pedidos educados/formais.' },
      { q: 'He ___ swim when he was five.',              opts: '["can\'t","couldn\'t","could","can"]',                            c: 2, e: 'Habilidade no passado → "could".' },
      { q: 'I ___ (not) find my keys anywhere.',         opts: '["can\'t","coulds not","could to not","cannot to"]',              c: 0, e: 'Incapacidade no presente → "can\'t" (cannot).' },
      { q: 'Which sentence is correct?',                 opts: '["She can speaks English.","She can to speak English.","She can speak English.","She cans speak English."]', c: 2, e: 'Modal + verbo base (sem -s e sem "to").' },
      { q: '___ you help me with this exercise?',        opts: '["Can","Could","Both are correct","Cans"]',                       c: 2, e: '"Can" (informal) e "could" (mais formal/educado) são ambos corretos aqui.' },
      { q: 'It ___ be dangerous at night.',              opts: '["can","could","Both are correct","cans"]',                       c: 2, e: '"Can" e "could" expressam possibilidade — ambos corretos.' },
      { q: 'Como se diz "Eu não consigo dormir"?',       opts: '["I couldn\'t sleep.","I can\'t sleep.","I cannot to sleep.","I not can sleep."]', c: 1, e: 'Incapacidade no presente → "can\'t sleep".' },
      { q: 'When she was a child, she ___ play the piano.', opts: '["can","cans","could","could to"]',                            c: 2, e: 'Habilidade no passado → "could".' },
    ]
  },

  // ── Lição 9 ──────────────────────────────────────────────────────────────────
  {
    order_num: 9,
    title: 'Future: Will e Going To',
    description: 'Como falar sobre o futuro em inglês',
    difficulty: 'intermediate',
    content: `## Future: Will e Going To

### WILL — Decisão espontânea / Previsão

| Uso | Exemplo | Tradução |
|-----|---------|----------|
| Decisão no momento | I **will** help you. | Eu vou te ajudar (decidi agora). |
| Promessa | I **will** call you later. | Eu vou te ligar depois. |
| Previsão sem evidência | I think it **will** rain. | Acho que vai chover. |

**Estrutura:** Sujeito + **will** + verbo base
**Negativa:** Sujeito + **won't** (will not) + verbo base

### GOING TO — Plano / Intenção / Evidência

| Uso | Exemplo | Tradução |
|-----|---------|----------|
| Plano já decidido | I **am going to** study tonight. | Vou estudar esta noite (já planejei). |
| Intenção | She **is going to** start a new job. | Ela vai começar um novo emprego. |
| Evidência visível | Look at those clouds! It **is going to** rain! | Olha as nuvens! Vai chover! |

**Estrutura:** Sujeito + **am/is/are going to** + verbo base

### Comparação

| Situação | Use |
|----------|-----|
| "O telefone está tocando. Eu ___." | **will** answer it. (decisão agora) |
| "Comprei os ingressos. Eu ___ ao show." | **am going to** go to the show. (plano) |`,
    exercises: [
      { q: '"The phone is ringing." — "I ___ answer it."', opts: '["am going to","will","going to","am will"]',                  c: 1, e: 'Decisão tomada no momento → "will".' },
      { q: 'I bought tickets. I ___ go to the concert.', opts: '["will","am going to","goes to","am will"]',                     c: 1, e: 'Plano já feito anteriormente → "am going to".' },
      { q: 'She ___ (not/come) to the party tomorrow.', opts: '["won\'t come","going not to come","will not comes","not will come"]', c: 0, e: 'Negativa de will → won\'t + verbo base.' },
      { q: 'Look at those clouds! It ___ rain!',         opts: '["will","is going to","goes to","am going to"]',                  c: 1, e: 'Evidência visível de algo prestes a acontecer → going to.' },
      { q: '___ you help me with this later?',           opts: '["Are going to","Will","Going to","Is"]',                         c: 1, e: 'Pergunta com "will" para pedir ajuda.' },
      { q: 'I think Brazil ___ win the World Cup.',      opts: '["is going to","will","are going to","goes to"]',                 c: 1, e: 'Previsão pessoal sem evidência concreta → will.' },
      { q: 'They ___ get married next year. (plano)',    opts: '["will","are going to","is going to","going"]',                   c: 1, e: 'Plano definido anteriormente → are going to.' },
      { q: 'Como se diz "Ela não vai vir" (decisão agora)?', opts: '["She won\'t come.","She isn\'t going to come.","She goes not come.","She will not comes."]', c: 0, e: 'Negativa de will → won\'t.' },
      { q: 'I ___ study tonight. I already made a plan.', opts: '["will","am going to","goes to","am will to"]',                  c: 1, e: 'Plano já decidido → am going to.' },
      { q: 'What does "won\'t" mean?',                   opts: '["will not","would not","was not","want not"]',                   c: 0, e: '"Won\'t" é a contração de "will not".' },
    ]
  },

  // ── Lição 10 ─────────────────────────────────────────────────────────────────
  {
    order_num: 10,
    title: 'Números, Datas e Horas',
    description: 'Conte, diga datas e horas em inglês',
    difficulty: 'beginner',
    content: `## Números, Datas e Horas

### Números Cardinais

| 1–10 | 11–20 | Dezenas |
|------|-------|---------|
| one, two, three | eleven, twelve, thirteen | twenty, thirty, forty |
| four, five, six | fourteen, fifteen, sixteen | fifty, sixty, seventy |
| seven, eight, nine, ten | seventeen, eighteen, nineteen, twenty | eighty, ninety, one hundred |

> Números compostos: **twenty-one** (21), **forty-five** (45), **ninety-nine** (99)

### Números Ordinais (para datas)

| Número | Ordinal | Abreviação |
|--------|---------|------------|
| 1 | first | 1st |
| 2 | second | 2nd |
| 3 | third | 3rd |
| 4–20 | fourth, fifth... | 4th, 5th... |
| 21 | twenty-first | 21st |

### Datas

- **May 5th** ou **the 5th of May** = 5 de maio
- **July 4th, 1776** = 4 de julho de 1776

### Meses do Ano

January, February, March, April, May, June, July, August, September, October, November, December

### Horas

| Expressão | Significado |
|-----------|-------------|
| It's 3 o'clock | São 3 horas |
| It's half past 3 | São 3 e meia |
| It's quarter past 3 | São 3 e quinze |
| It's quarter to 4 | São 15 para as 4 |`,
    exercises: [
      { q: 'How do you say "25" in English?',            opts: '["two five","twenty-five","twentyfive","two tens and five"]',     c: 1, e: 'Dezenas compostas usam hífen: twenty-five.' },
      { q: 'What is the ordinal of "3"?',                opts: '["threeth","therd","third","thrird"]',                            c: 2, e: '"Third" é o ordinal de 3 (irregular).' },
      { q: 'How do you say "1st" out loud?',             opts: '["oneth","first","onest","frist"]',                               c: 1, e: '"1st" = first (ordinal irregular).' },
      { q: '"It\'s half past 3" means:',                 opts: '["3:15","3:45","3:30","3:00"]',                                   c: 2, e: '"Half past" = e meia → 3:30.' },
      { q: 'What month is after July?',                  opts: '["June","September","August","October"]',                         c: 2, e: 'A ordem é: ...June, July, **August**, September...' },
      { q: 'How do you say the date "May 5th"?',         opts: '["May fifty","the fifth of May","May five","fifth May"]',         c: 1, e: '"The fifth of May" ou "May fifth" são as formas corretas.' },
      { q: '"It\'s quarter to 4" means:',                opts: '["4:15","3:45","4:45","3:15"]',                                   c: 1, e: '"Quarter to 4" = 15 minutos antes das 4 = 3:45.' },
      { q: 'How do you say "100" in English?',           opts: '["one hundred","ten tens","a hundreds","hundredth"]',             c: 0, e: '"100" = one hundred.' },
      { q: 'What is the ordinal of "2"?',                opts: '["twoth","secund","second","twoest"]',                            c: 2, e: '"Second" é o ordinal de 2 (irregular).' },
      { q: '"It\'s quarter past 3" means:',              opts: '["3:45","3:30","3:00","3:15"]',                                   c: 3, e: '"Quarter past" = e quinze → 3:15.' },
    ]
  }
];

// ─── Seed / migração unificada ────────────────────────────────────────────────
// Roda sempre: insere lições novas e completa exercícios faltantes.

const insertLesson   = db.prepare('INSERT INTO lessons (title, description, content, difficulty, order_num) VALUES (?, ?, ?, ?, ?)');
const insertExercise = db.prepare('INSERT INTO exercises (lesson_id, question, options, correct_answer, explanation) VALUES (?, ?, ?, ?, ?)');

for (const lessonData of LESSONS_DATA) {
  let lesson = db.prepare('SELECT id FROM lessons WHERE order_num = ?').get(lessonData.order_num);

  if (!lesson) {
    const { lastInsertRowid } = insertLesson.run(
      lessonData.title, lessonData.description, lessonData.content,
      lessonData.difficulty, lessonData.order_num
    );
    lesson = { id: lastInsertRowid };
    for (const ex of lessonData.exercises) {
      insertExercise.run(lesson.id, ex.q, ex.opts, ex.c, ex.e);
    }
    console.log(`✚ Lição "${lessonData.title}" adicionada (${lessonData.exercises.length} exercícios)`);
  } else {
    const existing = db.prepare('SELECT COUNT(*) as count FROM exercises WHERE lesson_id = ?').get(lesson.id);
    const needed = lessonData.exercises.length - existing.count;
    if (needed > 0) {
      for (const ex of lessonData.exercises.slice(existing.count)) {
        insertExercise.run(lesson.id, ex.q, ex.opts, ex.c, ex.e);
      }
      console.log(`✚ ${needed} exercício(s) adicionado(s) à lição "${lessonData.title}"`);
    }
  }
}

export default db;

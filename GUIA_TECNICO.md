# FlowLife — Guia Técnico (uso interno da equipe)

Este documento **não faz parte do aplicativo** e não deve ser mostrado à banca como tela do
app — é o material de apoio para vocês implementarem a versão real em **React Native**,
already citado como código-fonte a ser depositado no seu repositório GitHub. O protótipo
funcional entregue neste projeto (pasta `src/`) é uma versão web interativa do FlowLife,
pensada para ser demonstrada na apresentação (pitch) e simula 100% dos fluxos, incluindo
cache local, sincronização, IA de acessibilidade, comandos de voz e alto contraste.

Abaixo está o passo a passo para transformar esse protótipo em um app **React Native**
publicável, com **Supabase** no backend, **Room** para cache offline e **GitHub Actions**
gerando o APK automaticamente.

---

## 1. Criando o projeto React Native

```bash
npx create-expo-app flowlife --template blank-typescript
cd flowlife
npx expo install expo-dev-client @supabase/supabase-js @react-native-async-storage/async-storage
```

> Usamos Expo (com "prebuild"/dev client) porque ele facilita a geração de APK via
> GitHub Actions sem precisar configurar manualmente o Android Studio, mas o projeto
> continua 100% nativo (você pode rodar `npx expo prebuild` para gerar as pastas
> `android/` e `ios/` nativas quando precisar usar Room via módulo nativo/Kotlin).

Estrutura sugerida:

```
flowlife/
├── android/                # gerado pelo `expo prebuild` (contém o módulo Room)
├── src/
│   ├── screens/
│   ├── components/
│   ├── context/
│   ├── services/
│   │   ├── supabase.ts
│   │   ├── auth.ts
│   │   └── gemini.ts
│   └── db/
│       ├── AppDatabase.kt      # Room (código nativo Android)
│       ├── DonorDao.kt
│       └── entities/
├── app.json
└── .github/workflows/build-apk.yml
```

---

## 2. Criando o banco de dados no Supabase

### 2.1 Criar o projeto
1. Acesse **supabase.com** → *New project*.
2. Escolha nome (`flowlife-db`), senha do banco e região `South America (São Paulo)`.
3. Aguarde o provisionamento (~2 min).

### 2.2 Criar as tabelas
No painel do Supabase, abra **SQL Editor** e execute:

```sql
-- Perfis de usuário (estende auth.users)
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null,
  email text not null,
  blood_type text check (blood_type in ('A+','A-','B+','B-','AB+','AB-','O+','O-')),
  city text,
  donations_count int default 0,
  eligible boolean default true,
  created_at timestamptz default now()
);

-- Postos de coleta
create table public.centers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text not null,
  city text not null,
  lat double precision,
  lng double precision,
  hours text
);

-- Estoque de tipos sanguíneos por posto
create table public.stock (
  id uuid primary key default gen_random_uuid(),
  center_id uuid references public.centers (id) on delete cascade,
  blood_type text not null,
  level int not null check (level between 0 and 100),
  updated_at timestamptz default now()
);

-- Agendamentos de doação
create table public.donations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles (id) on delete cascade,
  center_id uuid references public.centers (id),
  scheduled_at timestamptz not null,
  status text default 'agendada' check (status in ('agendada','concluida','cancelada')),
  created_at timestamptz default now()
);

-- Campanhas e notificações
create table public.campaigns (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  tag text check (tag in ('urgente','novidade','evento')),
  created_at timestamptz default now()
);

-- Conquistas (gamificação)
create table public.achievements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles (id) on delete cascade,
  code text not null,
  unlocked_at timestamptz default now()
);

-- === SISTEMA DE GAMIFICAÇÃO (Gotas + Recompensas) ===

-- Saldo e nível de cada usuário
create table public.wallets (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  points int default 0,
  total_earned int default 0,
  updated_at timestamptz default now()
);

-- Histórico de pontuação (auditoria: cada Got ganha/gasta)
create table public.point_ledger (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles (id) on delete cascade,
  amount int not null,            -- positivo = ganhou, negativo = gastou
  reason text not null,
  created_at timestamptz default now()
);

-- Catálogo de parceiros e recompensas (Pague Menos, iFood, 99, hospitais...)
create table public.partners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text check (category in ('farmacia','restaurante','transporte','loja','saude','brinde')),
  offer text not null,
  cost int not null,
  active boolean default true
);

-- Vouchers resgatados pelos usuários
create table public.vouchers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles (id) on delete cascade,
  partner_id uuid references public.partners (id),
  code text not null,
  cost int not null,
  status text default 'ativo' check (status in ('ativo','usado','expirado')),
  redeemed_at timestamptz default now()
);
```

### 2.3 Ativar o Realtime (sincronização em tempo real)
No painel: **Database → Replication**, ative a replicação para as tabelas `stock`,
`campaigns` e `donations`. Isso permite que o app React Native "escute" mudanças
via `supabase.channel(...)` e atualize o Room instantaneamente.

### 2.4 Proteger os dados com Row Level Security (RLS)
```sql
alter table public.profiles enable row level security;
alter table public.donations enable row level security;
alter table public.achievements enable row level security;
alter table public.wallets enable row level security;
alter table public.point_ledger enable row level security;
alter table public.vouchers enable row level security;

create policy "usuário vê e edita apenas o próprio perfil"
  on public.profiles for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "usuário vê e edita apenas suas doações"
  on public.donations for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "postos e estoque são públicos para leitura"
  on public.centers for select using (true);

create policy "usuário acessa apenas sua carteira de Gotas"
  on public.wallets for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "usuário vê apenas seu histórico de pontos"
  on public.point_ledger for select using (auth.uid() = user_id);

create policy "usuário vê e cria apenas seus vouchers"
  on public.vouchers for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "parceiros são públicos para leitura"
  on public.partners for select using (true);
```

> As **Gotas** (pontuação) nunca devem ser somadas direto pelo app — use uma
> *Edge Function* ou *Postgres function* `SECURITY DEFINER` que valida a ação
> (ex.: doação confirmada no Hemope) e credita as Gotas. Assim um usuário não
> consegue "inflar" seu saldo alterando o app. O resgate de vouchers também
> deve passar por uma função server-side que debita o saldo de forma atômica.

Isso garante que **nenhuma banca/avaliador** consiga ver dados de outro usuário mesmo
inspecionando requisições — é o backend, não o app, controlando o acesso.

---

## 3. Configurando a autenticação (Supabase Auth)

1. No painel, vá em **Authentication → Providers** e ative **Email**.
2. Em **Authentication → URL Configuration**, configure o *redirect URL* do app
   (ex.: `flowlife://auth-callback`).
3. Crie um *trigger* para popular `profiles` automaticamente ao cadastrar:

```sql
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, email)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', split_part(new.email,'@',1)), new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

4. No app (`src/services/supabase.ts`):

```ts
import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
  { auth: { storage: AsyncStorage, autoRefreshToken: true, persistSession: true } },
);

export const signUp = (email: string, password: string, name: string) =>
  supabase.auth.signUp({ email, password, options: { data: { name } } });

export const signIn = (email: string, password: string) =>
  supabase.auth.signInWithPassword({ email, password });
```

> **Importante para a apresentação:** nunca exiba, imprima em log ou deixe visível na UI
> qualquer URL/chave do Supabase. Use variáveis de ambiente (`.env`, carregado via
> `expo-constants`/`EXPO_PUBLIC_*`) e nunca mostre telas de "debug" para a banca.

---

## 4. Room para cache offline + sincronização em tempo real

O **Room** é a camada de persistência local do Android (SQLite com ORM). No app em
React Native, ele é usado através de um **módulo nativo Android** (Kotlin), acessado por
uma *bridge*/`TurboModule`, ou substituído por **WatermelonDB/expo-sqlite** se toda a
equipe programar apenas em TypeScript. Caso a equipe queira realmente usar Room (código
nativo Kotlin, como pedido), o fluxo é:

1. Rodar `npx expo prebuild` para gerar a pasta `android/`.
2. Em `android/app/src/main/java/.../db/`, criar as entidades e o DAO:

```kotlin
@Entity(tableName = "donations")
data class DonationEntity(
    @PrimaryKey val id: String,
    val centerName: String,
    val scheduledAt: Long,
    val status: String,
    val synced: Boolean = false
)

@Dao
interface DonationDao {
    @Query("SELECT * FROM donations ORDER BY scheduledAt DESC")
    fun observeAll(): Flow<List<DonationEntity>>

    @Upsert
    suspend fun upsert(donation: DonationEntity)

    @Query("SELECT * FROM donations WHERE synced = 0")
    suspend fun pendingSync(): List<DonationEntity>
}

@Database(entities = [DonationEntity::class], version = 1)
abstract class AppDatabase : RoomDatabase() {
    abstract fun donationDao(): DonationDao
}
```

3. Criar um módulo nativo (`DonationCacheModule.kt`) exposto ao React Native via
   `ReactContextBaseJavaModule`, com métodos `@ReactMethod` para `saveLocal`,
   `getLocal` e `getPendingSync`.
4. Estratégia de sincronização (offline-first):
   - Toda escrita do usuário (agendar doação, atualizar perfil) grava **primeiro no
     Room** (`synced = false`) e atualiza a tela imediatamente.
   - Um `WorkManager` periódico (ou listener de conectividade) envia os registros
     pendentes ao Supabase (`insert`/`upsert`) e marca `synced = true`.
   - O app assina o canal Realtime do Supabase
     (`supabase.channel('stock-changes').on('postgres_changes', ...)`) e, a cada
     evento, grava no Room — assim o app volta a funcionar 100% offline depois,
     sempre com o último dado sincronizado.

Esse é o mesmo padrão replicado no protótipo web entregue (veja `src/lib/sync.ts` e o
`localStorage` em `src/context/AuthContext.tsx`), simulando cache local + sincronização
em segundo plano para a demonstração.

---

## 4-bis. Sistema de Gamificação e Recompensas

O FlowLife é gamificado para reter doadores. A unidade é a **Gota** 💧, ganha por
ações e trocada por recompensas reais (descontos em farmácias, restaurantes,
transporte e hospitais).

**Como ganhar Gotas** (no protótipo, `src/context/GamificationContext.tsx` +
`src/data/rewards.ts`):
- Visita diária: +10  ·  Cadastrar tipo sanguíneo: +50  ·  Agendar doação: +100
- Acertar o quiz ABO/Rh: +30  ·  Convidar amigo: +50  ·  Concluir doação: +200

**Níveis:** Iniciante 🌱 → Solidário 🤝 → Herói 🦸 → Guardião 🛡️ → Lenda da Vida 💎.

**Parceiros reais de exemplo** (configuráveis na tabela `partners`): Pague Menos,
RD Saúde, iFood, 99, Amazon, Mercado Livre, Real Hospital Português e Hemope.

No React Native, o fluxo de resgate chama uma *Edge Function* do Supabase que:
1. valida o saldo atual do usuário (`wallets.points`);
2. debita o `cost` de forma atômica (`update ... set points = points - cost`);
3. insere um `voucher` com código único e devolve o código ao app;
4. registra no `point_ledger` (amount negativo) para auditoria.

O app exibe o voucher (`FL-...`) e o parceiro valida o código no momento do uso.
No protótipo, todo esse fluxo é simulado offline com persistência local
(`localStorage`), garantindo uma demonstração fluida mesmo sem backend.

---

## 5. Integrando a IA Gemini (acessibilidade)

1. Gere uma chave em **aistudio.google.com/app/apikey**.
2. **Nunca** coloque a chave direto no app publicado. Crie uma *Edge Function* no
   Supabase que repassa a pergunta ao Gemini, mantendo a chave só no servidor:

```ts
// supabase/functions/vita-ai/index.ts
import { serve } from "https://deno.land/std/http/server.ts";

serve(async (req) => {
  const { message, history } = await req.json();
  const key = Deno.env.get("GEMINI_API_KEY");
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [...history, { role: "user", parts: [{ text: message }] }] }),
    },
  );
  const data = await res.json();
  return new Response(JSON.stringify({ text: data.candidates?.[0]?.content?.parts?.[0]?.text }), {
    headers: { "Content-Type": "application/json" },
  });
});
```

Deploy: `supabase functions deploy vita-ai` e `supabase secrets set GEMINI_API_KEY=...`.

3. No app, o serviço `services/gemini.ts` chama apenas
   `supabase.functions.invoke('vita-ai', { body: { message, history } })` — o app nunca
   fala diretamente com a Google nem expõe a chave.

No protótipo web entregue, para simplificar a demonstração sem backend, a chamada é
feita com uma chave opcional guardada localmente (`src/lib/ai.ts`) e, sem chave, a Vita
responde com uma base de conhecimento local (garantindo que a demo **sempre funcione**
mesmo sem internet/chave durante a apresentação).

---

## 6. Gerando o APK automaticamente no GitHub Actions

Crie `.github/workflows/build-apk.yml`:

```yaml
name: Build APK

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20

      - uses: actions/setup-java@v4
        with:
          distribution: temurin
          java-version: 17

      - name: Install dependencies
        run: npm ci

      - name: Prebuild native Android project
        run: npx expo prebuild --platform android

      - name: Create .env with secrets
        run: |
          echo "EXPO_PUBLIC_SUPABASE_URL=${{ secrets.SUPABASE_URL }}" >> .env
          echo "EXPO_PUBLIC_SUPABASE_ANON_KEY=${{ secrets.SUPABASE_ANON_KEY }}" >> .env

      - name: Grant execute permission to gradlew
        run: chmod +x android/gradlew

      - name: Build release APK
        run: cd android && ./gradlew assembleRelease

      - name: Upload APK artifact
        uses: actions/upload-artifact@v4
        with:
          name: flowlife-apk
          path: android/app/build/outputs/apk/release/app-release.apk
```

Configuração necessária:
1. Em **Settings → Secrets and variables → Actions**, cadastre `SUPABASE_URL` e
   `SUPABASE_ANON_KEY` (chave pública/anon, nunca a `service_role`).
2. Para assinar o APK para publicação (opcional), gere um keystore
   (`keytool -genkeypair ...`), converta para base64 e adicione como secret
   (`SIGNING_KEY`, `KEY_ALIAS`, `KEY_PASSWORD`), decodificando-o em um passo antes do
   `assembleRelease`.
3. Ao final do workflow, o APK fica disponível na aba **Actions → Artifacts** do
   repositório, pronto para instalar no celular da banca.

---

## 7. Segurança para a apresentação (checklist)

- [ ] `RLS` ativo em todas as tabelas com dados de usuário.
- [ ] Chave `service_role` do Supabase **nunca** aparece no app ou no repositório.
- [ ] Nenhuma tela, log ou menu de desenvolvedor visível no build de demonstração
      (`__DEV__` desabilitado, remova `console.log` de produção).
- [ ] Senhas nunca armazenadas em texto puro (o Supabase Auth já faz hash).
- [ ] HTTPS obrigatório em todas as chamadas (padrão do Supabase).
- [ ] Termos de uso/LGPD citados na tela de cadastro (já presente no protótipo).
- [ ] APK testado em modo avião para validar o cache offline (Room) antes da banca.

---

## 8. Resumo para o pitch (5 minutos)

1. **Problema:** estoques críticos de sangue no Hemope-PE, sem distinção de tipo.
2. **Público-alvo:** jovens/universitários 18–25 anos que nunca doaram por falta de
   informação e medo — grupo com potencial doador alto e baixa adesão atual.
3. **Solução:** FlowLife, app mobile que educa sobre ABO/Rh, mostra estoque em tempo
   real, agenda doações e usa IA + acessibilidade para incluir todos os públicos.
4. **Demonstração:** abrir o protótipo, mostrar cadastro → tipo sanguíneo →
   compatibilidade → alerta de estoque crítico → agendamento → assistente Vita com
   comando de voz e alto contraste.
5. **Diferencial:** compatibilidade sanguínea explicada com Biologia real,
   acessibilidade (voz, contraste, IA) e sincronização offline-first.
6. **Impacto social esperado:** mais doações recorrentes, redução do desabastecimento
   e inclusão de pessoas com deficiência no processo de doação.

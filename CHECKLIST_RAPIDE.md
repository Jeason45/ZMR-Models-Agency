# ✅ CHECKLIST RAPIDE - MISE EN PRODUCTION
## Actions jour par jour

---

## 🔴 JOUR 1 : SÉCURITÉ CREDENTIALS (8h)

### Matin (4h) : Protéger .env
```bash
# 1. Backup
cp .env .env.backup.local

# 2. Gitignore
echo -e "\n.env\n.env*.local\n.env.production" >> .gitignore

# 3. Retirer Git
git rm --cached .env
git add .gitignore
git commit -m "Security: Remove .env"

# 4. Nettoyer historique (IMPORTANT!)
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env" \
  --prune-empty --tag-name-filter cat -- --all
git push origin --force --all

# 5. Régénérer secrets
openssl rand -base64 32  # → NEXTAUTH_SECRET
# Supabase → Reset password
# Gmail → Nouveau app password
# Resend → Nouvelle API key
```

- [ ] .env retiré du Git
- [ ] Historique nettoyé
- [ ] Tous secrets régénérés
- [ ] .env.example créé

---

### Après-midi (4h) : Protéger APIs

**1. Créer helper (15min)**
```bash
mkdir -p lib
touch lib/apiAuth.ts
```

```typescript
// lib/apiAuth.ts
import { auth } from '@/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function requireAuth(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return {
      error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
      session: null
    };
  }
  return { error: null, session };
}
```

**2. Modifier 34 API routes (3h)**

Trouver toutes les routes :
```bash
find app/api -name "route.ts" | grep -v "auth" | grep -v "sign/verify"
```

Ajouter dans chaque GET/POST/PUT/DELETE :
```typescript
const { error, session } = await requireAuth(request);
if (error) return error;
```

**3. Tester (15min)**
```bash
npm run dev
# Test sans auth
curl http://localhost:3000/api/contacts  # → doit retourner 401
# Test avec auth (navigateur après login) → doit fonctionner
```

- [ ] Helper créé
- [ ] 34 routes modifiées
- [ ] Toutes routes retournent 401 sans auth

---

## 🔴 JOUR 2 : USERS EN DB (6h)

### Matin (3h) : Script admin

**1. Créer script (30min)**
```bash
mkdir -p scripts
touch scripts/create-admin.ts
```

```typescript
// scripts/create-admin.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const password = process.env.ADMIN_PASSWORD;
  if (!password || password.length < 12) {
    console.error('❌ Password invalide (min 12 car)');
    process.exit(1);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@zmrmodels.com' },
    update: { password: hashedPassword, role: 'admin' },
    create: {
      email: 'admin@zmrmodels.com',
      password: hashedPassword,
      name: 'Admin ZMR',
      role: 'admin'
    }
  });

  console.log('✅ Admin créé:', admin.email);
}

main().finally(() => prisma.$disconnect());
```

**2. Exécuter (5min)**
```bash
ADMIN_PASSWORD="VotreMotDePasseSecure123!@#" npx tsx scripts/create-admin.ts
```

- [ ] Script créé
- [ ] Admin créé en DB
- [ ] Mot de passe fort (>12 car, maj+min+chiffres)

---

### Après-midi (3h) : Modifier auth.ts

```typescript
// auth.ts - Dans CredentialsProvider
authorize: async (credentials) => {
  const { email, password } = credentials;

  // NOUVEAU: Chercher en DB
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return null;

  // Vérifier password
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return null;

  return { id: user.id, email: user.email, name: user.name, role: user.role };
}

// Dans signIn callback (Google)
if (account?.provider === 'google') {
  const existingUser = await prisma.user.findUnique({
    where: { email: user.email! }
  });
  if (!existingUser) return false;
  user.role = existingUser.role;
}
```

**Tester** :
```bash
npm run dev
# Aller sur http://localhost:3000/admin/login
# Se connecter avec admin@zmrmodels.com + votre mot de passe
```

- [ ] auth.ts modifié
- [ ] Login fonctionne
- [ ] Utilisateur hardcodé supprimé

---

## 🟠 JOUR 3 : VALIDATION ZOD (8h)

### Installation (5min)
```bash
npm install zod
mkdir -p lib/validations
```

### Créer 5 schemas (4h)

**1. Contact (45min)**
```typescript
// lib/validations/contact.ts
import { z } from 'zod';

export const ContactCreateSchema = z.object({
  name: z.string().min(2).max(100).trim(),
  email: z.string().email().toLowerCase().trim(),
  phone: z.string().regex(/^[\d\s\+\-\(\)]+$/).optional().nullable(),
  message: z.string().max(5000).optional().nullable(),
  type: z.enum(['professional', 'model']).optional().nullable(),
  status: z.enum(['new', 'contacted', 'qualified', 'client', 'lost']).default('new'),
  contactType: z.enum(['particulier', 'entreprise', 'agence']).optional().nullable(),
  siret: z.string().regex(/^\d{14}$/).optional().nullable(),
  code_postal: z.string().regex(/^\d{5}$/).optional().nullable(),
});

export const ContactUpdateSchema = ContactCreateSchema.partial();
```

**2-5. Document, Appointment, Talent, Signature (3h)**
Copier depuis ROADMAP_PRODUCTION_COMPLETE.md lignes 742-994

### Helper validation (15min)
```typescript
// lib/validateRequest.ts
import { z } from 'zod';
import { NextResponse } from 'next/server';

export function validateRequest<T extends z.ZodType>(schema: T, data: unknown) {
  const result = schema.safeParse(data);
  if (!result.success) {
    return {
      success: false,
      error: NextResponse.json(
        { error: 'Validation failed', details: result.error.flatten() },
        { status: 400 }
      )
    };
  }
  return { success: true, data: result.data };
}
```

### Utiliser dans APIs (3h)
```typescript
// app/api/contacts/route.ts
import { validateRequest } from '@/lib/validateRequest';
import { ContactCreateSchema } from '@/lib/validations/contact';

export async function POST(request: NextRequest) {
  const { error, session } = await requireAuth(request);
  if (error) return error;

  const body = await request.json();
  const validation = validateRequest(ContactCreateSchema, body);
  if (!validation.success) return validation.error;

  const contact = await prisma.contact.create({ data: validation.data });
  return NextResponse.json(contact, { status: 201 });
}
```

Modifier dans :
- `app/api/contacts/route.ts`
- `app/api/documents/route.ts`
- `app/api/appointments/route.ts`
- `app/api/talents/route.ts`
- `app/api/sign/submit/route.ts`

- [ ] Zod installé
- [ ] 5 schemas créés
- [ ] Helper créé
- [ ] Toutes routes POST/PUT valident

---

## 🟠 JOUR 4 : RATE LIMITING (4h)

### Setup Upstash (30min)
1. Aller sur https://console.upstash.com
2. Créer compte
3. Créer database Redis
4. Copier REST URL et TOKEN

```bash
npm install @upstash/ratelimit @upstash/redis
```

```env
# Ajouter à .env
UPSTASH_REDIS_REST_URL="https://xxxx.upstash.io"
UPSTASH_REDIS_REST_TOKEN="AXxxxxxx"
```

### Créer rate limiters (30min)
```typescript
// lib/ratelimit.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

export const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(100, '15 m'),
  prefix: 'zmr',
});

export const strictRatelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1 m'),
  prefix: 'zmr-strict',
});
```

### Appliquer (2-3h)
```typescript
// app/api/contacts/route.ts
import { ratelimit } from '@/lib/ratelimit';

export async function POST(request: NextRequest) {
  const { error, session } = await requireAuth(request);
  if (error) return error;

  const { success } = await ratelimit.limit(session.user.email);
  if (!success) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  // ... reste
}
```

Appliquer sur :
- Toutes API routes → `ratelimit`
- `/api/send-document` → `strictRatelimit`
- `/api/upload` → `strictRatelimit`

- [ ] Upstash configuré
- [ ] Rate limiters créés
- [ ] Appliqué sur toutes routes

---

## 🟡 JOUR 5-6 : REACT QUERY (2 jours)

### Installation (10min)
```bash
npm install @tanstack/react-query @tanstack/react-query-devtools
```

### Provider (30min)
```typescript
// app/providers.tsx
'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export function Providers({ children }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

```typescript
// app/layout.tsx
import { Providers } from './providers';

export default function RootLayout({ children }) {
  return (
    <html><body>
      <Providers>{children}</Providers>
    </body></html>
  );
}
```

### Hooks (4h)
```bash
mkdir -p lib/hooks
```

Créer :
- `lib/hooks/useContacts.ts` (1h)
- `lib/hooks/useDocuments.ts` (1h)
- `lib/hooks/useAppointments.ts` (1h)
- `lib/hooks/useTalents.ts` (1h)

Voir ROADMAP_PRODUCTION_COMPLETE.md lignes 1340-1460

### Optimiser SmartDocumentForm (2h)
```typescript
import { memo, useMemo, useCallback } from 'react';

export const SmartDocumentForm = memo(function SmartDocumentForm({ ... }) {
  const groupedFields = useMemo(() => {
    return groupFieldsBySection(fieldMapping);
  }, [fieldMapping]);

  const totals = useMemo(() => {
    return calculateTotals(formData);
  }, [formData]);

  const handleFieldChange = useCallback((field, value) => {
    // ...
  }, [formData]);

  return (/* ... */);
});
```

### Utiliser dans pages (2h)
```typescript
// app/admin/contacts/page.tsx
import { useContacts } from '@/lib/hooks/useContacts';

export default function ContactsPage() {
  const { data: contacts, isLoading } = useContacts();

  if (isLoading) return <div>Chargement...</div>;

  return (/* ... */);
}
```

- [ ] React Query installé
- [ ] Provider configuré
- [ ] 4 hooks créés
- [ ] SmartDocumentForm optimisé
- [ ] Pages utilisent les hooks

---

## 🟡 JOUR 6 PM : NEXT/IMAGE (3h)

### Trouver images
```bash
grep -r "<img" app/ components/ --include="*.tsx"
```

### Remplacer
```tsx
// ❌ AVANT
<img src="/model.jpg" alt="Model" />

// ✅ APRÈS
import Image from 'next/image';

<Image
  src="/model.jpg"
  alt="Model"
  width={800}
  height={1200}
  sizes="(max-width: 768px) 100vw, 50vw"
/>
```

### Config
```typescript
// next.config.ts
export default {
  images: {
    domains: ['fzsmjingetgyipevzuuv.supabase.co'],
  },
};
```

- [ ] Toutes images → next/image
- [ ] Config domaines

---

## 🟡 JOUR 7 : MONITORING (4h)

### Sentry (2h)
```bash
npx @sentry/wizard@latest -i nextjs
```

Ajouter à .env :
```env
SENTRY_DSN="https://xxx@sentry.io/xxx"
NEXT_PUBLIC_SENTRY_DSN="https://xxx@sentry.io/xxx"
```

### Winston (2h)
```bash
npm install winston winston-daily-rotate-file
```

```typescript
// lib/logger.ts
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

export default logger;
```

Remplacer `console.log` par `logger.info()`

- [ ] Sentry configuré
- [ ] Winston installé
- [ ] console.log remplacés

---

## 🔵 JOUR 8-9 : TESTS (2 jours)

### Setup Jest (1h)
```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom jest-environment-jsdom
```

```javascript
// jest.config.js
const nextJest = require('next/jest');
const createJestConfig = nextJest({ dir: './' });

module.exports = createJestConfig({
  testEnvironment: 'jest-environment-jsdom',
});
```

### Écrire tests (1 jour)

**1. Middleware** :
```typescript
// __tests__/middleware.test.ts
import middleware from '@/middleware';

test('redirige si non authentifié', async () => {
  const req = new NextRequest('http://localhost:3000/admin');
  const res = await middleware(req);
  expect(res.status).toBe(307);
});
```

**2. Validation** :
```typescript
// __tests__/validations/contact.test.ts
import { ContactCreateSchema } from '@/lib/validations/contact';

test('valide contact correct', () => {
  const result = ContactCreateSchema.safeParse({
    name: 'John',
    email: 'john@test.com'
  });
  expect(result.success).toBe(true);
});
```

**3. API routes** (mocké) :
Voir ROADMAP_PRODUCTION_COMPLETE.md lignes 1790-1820

- [ ] Jest configuré
- [ ] Tests middleware
- [ ] Tests validation
- [ ] Tests API routes
- [ ] >50% coverage

---

## 🔵 JOUR 9 PM : ACCESSIBILITÉ (4h)

### Labels inputs
```tsx
<label htmlFor="search" className="sr-only">Rechercher</label>
<input id="search" aria-label="Rechercher un contact" />
```

### Boutons
```tsx
<button aria-label="Supprimer le contact">
  <TrashIcon aria-hidden="true" />
</button>
```

### Modals
```bash
npm install react-focus-lock
```

```tsx
<FocusLock>
  <div role="dialog" aria-modal="true">
    {/* ... */}
  </div>
</FocusLock>
```

### Support ESC
```tsx
useEffect(() => {
  const handleEsc = (e) => {
    if (e.key === 'Escape') onClose();
  };
  window.addEventListener('keydown', handleEsc);
  return () => window.removeEventListener('keydown', handleEsc);
}, []);
```

- [ ] Labels sur tous inputs
- [ ] aria-label sur boutons
- [ ] Focus trap modals
- [ ] Support ESC
- [ ] Alt sur images

---

## 🔵 JOUR 10 : DOCUMENTATION & DEPLOY (8h)

### Documentation (3h)

**README.md** (1h)
```markdown
# ZMR Models Agency - CRM

## Installation
npm install
cp .env.example .env
npx prisma db push
ADMIN_PASSWORD="..." npx tsx scripts/create-admin.ts
npm run dev

## Connexion
http://localhost:3000/admin
Email: admin@zmrmodels.com
```

**docs/API.md** (1h)
Documenter routes principales

**DEPLOYMENT.md** (1h)
Guide déploiement Vercel

- [ ] README.md
- [ ] API.md
- [ ] DEPLOYMENT.md

### CI/CD (2h)
```yaml
# .github/workflows/ci.yml
name: CI
on: [push]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm ci
      - run: npm test
      - run: npm run build
```

- [ ] GitHub Actions configuré
- [ ] Tests automatiques

### Déploiement (3h)

```bash
# 1. Installer CLI
npm i -g vercel

# 2. Login
vercel login

# 3. Deploy
vercel --prod

# 4. Variables d'env (via Dashboard)
# DATABASE_URL
# NEXTAUTH_SECRET
# NEXTAUTH_URL
# ...

# 5. Créer admin production
ADMIN_PASSWORD="..." npx tsx scripts/create-admin.ts
```

- [ ] Déployé sur Vercel
- [ ] Variables d'env configurées
- [ ] Admin créé en prod
- [ ] SSL actif
- [ ] Domaine configuré (optionnel)

---

## 🎯 VALIDATION FINALE

### Checklist production
- [ ] .env retiré du Git
- [ ] Secrets régénérés
- [ ] APIs protégées (401 sans auth)
- [ ] Validation Zod active
- [ ] Rate limiting configuré
- [ ] React Query actif
- [ ] next/image utilisé
- [ ] Sentry + Winston actifs
- [ ] Tests >50% coverage
- [ ] Accessibilité basique OK
- [ ] Documentation complète
- [ ] CI/CD configuré
- [ ] Déployé en production
- [ ] Backups DB activés
- [ ] Monitoring actif

### Tests post-production
```bash
# 1. Santé API
curl https://votre-app.vercel.app/api/health

# 2. Login admin
# Aller sur /admin/login

# 3. Créer contact test
# Interface admin

# 4. Générer document test
# Vérifier PDF généré

# 5. Vérifier emails
# Test envoi email

# 6. Sentry
# Forcer une erreur, vérifier Sentry Dashboard
```

---

## 📊 TEMPS ESTIMÉ PAR PHASE

| Jour | Phase | Temps |
|------|-------|-------|
| J1 | Sécurité credentials + APIs | 8h |
| J2 | Users en DB | 6h |
| J3 | Validation Zod | 8h |
| J4 | Rate limiting | 4h |
| J5-6 | React Query | 2j |
| J6 PM | Next/Image | 3h |
| J7 | Monitoring | 4h |
| J8-9 | Tests | 2j |
| J9 PM | Accessibilité | 4h |
| J10 | Doc + Deploy | 8h |

**TOTAL : 9-10 jours**

---

**Bonne chance ! 🚀**

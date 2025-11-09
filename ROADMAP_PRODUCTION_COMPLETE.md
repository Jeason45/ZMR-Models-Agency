# 🚀 ROADMAP COMPLÈTE - MISE EN PRODUCTION
## ZMR Models Agency CRM

**Durée totale** : 9-13 jours (minimum recommandé pour production)
**Objectif** : CRM sécurisé, performant et production-ready

---

## 📊 TIMELINE VISUELLE

```
SEMAINE 1                          SEMAINE 2
├─────────────────────────────────┼─────────────────────────────┤
│                                 │                             │
│ 🔴 PHASE 1 (J1-J2)              │ 🟡 PHASE 3 (J5-J7)         │
│ ├─ .env sécurisation            │ ├─ React Query             │
│ ├─ Protéger APIs                │ ├─ Optimisations React     │
│ └─ Users en DB                  │ ├─ Next/Image              │
│                                 │ ├─ Sentry                  │
│ 🟠 PHASE 2 (J3-J4)              │ └─ Winston Logger          │
│ ├─ Validation Zod               │                             │
│ └─ Rate Limiting                │ 🔵 PHASE 4 (J8-J10)        │
│                                 │ ├─ Tests critiques         │
│                                 │ ├─ Accessibilité           │
│                                 │ ├─ Documentation           │
│                                 │ ├─ CI/CD                   │
│                                 │ └─ Déploiement             │
└─────────────────────────────────┴─────────────────────────────┘

🔴 = BLOQUANT vente/prod    🟠 = CRITIQUE prod
🟡 = IMPORTANT UX           🔵 = PRODUCTION READY
```

---

## ✅ CHECKLISTS DÉCISIONNELLES

### Quand puis-je démo le projet au client ?
- [x] Phase 1 complétée (sécurité bloquante)
- [x] Mot de passe admin changé
- [ ] Documentation README basique
- [ ] Déployé sur URL de démo

**→ Après Phase 1 (2-3 jours)**

### Quand puis-je signer le contrat de vente ?
- [x] Phase 1 + 2 complétées
- [x] Monitoring Sentry actif
- [ ] Tests critiques (30% coverage minimum)
- [ ] Documentation API complète

**→ Après Phase 2 (4-6 jours)**

### Quand puis-je mettre en production ?
- [x] Phase 1 + 2 + 3 complétées
- [x] Phase 4 au moins à 70%
- [x] Tests passent
- [x] Backups DB configurés
- [x] SSL/HTTPS actif
- [x] Variables d'env production

**→ Après Phase 4 (9-13 jours)**

---

## 🔴 PHASE 1 : SÉCURITÉ BLOQUANTE (2-3 JOURS)
### ⚠️ OBLIGATOIRE avant toute démo

### Jour 1 Matin : Retirer .env (2h)

#### Actions
```bash
# 1. Backup
cp .env .env.backup.local

# 2. Gitignore
cat >> .gitignore << 'EOF'
.env
.env*.local
.env.production
EOF

# 3. Retirer du Git
git rm --cached .env
git add .gitignore
git commit -m "Security: Remove .env"

# 4. Nettoyer historique (CRITIQUE)
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env" \
  --prune-empty --tag-name-filter cat -- --all

# 5. Force push
git push origin --force --all
```

#### Régénérer secrets
```bash
# NextAuth
openssl rand -base64 32

# Supabase → Dashboard > Reset password
# Gmail → https://myaccount.google.com/apppasswords
# Resend → https://resend.com/api-keys
```

#### Créer .env.example
```env
DATABASE_URL="postgresql://user:password@host:5432/dbname"
NEXTAUTH_SECRET="generate-with-openssl"
NEXTAUTH_URL="http://localhost:3000"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
RESEND_API_KEY="re_..."
SENTRY_DSN="https://..."
UPSTASH_REDIS_REST_URL="https://..."
UPSTASH_REDIS_REST_TOKEN="..."
```

---

### Jour 1 PM : Protéger APIs (4-6h)

#### 1. Créer helper auth
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

#### 2. Modifier 34 API routes

**Liste complète** :
```
✅ À protéger :
- app/api/contacts/route.ts
- app/api/contacts/[id]/route.ts
- app/api/documents/route.ts
- app/api/documents/[id]/route.ts
- app/api/documents/generate/route.ts
- app/api/appointments/route.ts
- app/api/appointments/[id]/route.ts
- app/api/templates/route.ts
- app/api/talents/route.ts
- app/api/upload/route.ts
- app/api/agency-settings/route.ts
... (toutes les routes métier)

❌ Ne PAS protéger :
- app/api/auth/** (NextAuth)
- app/api/sign/verify/[token]/route.ts
```

**Template** :
```typescript
// Ajouter en début de chaque fonction GET/POST/PUT/DELETE
const { error, session } = await requireAuth(request);
if (error) return error;
```

---

### Jour 2 : Users en DB (3-4h)

#### 1. Script création admin
```typescript
// scripts/create-admin.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const password = process.env.ADMIN_PASSWORD;
  if (!password || password.length < 12) {
    console.error('❌ Mot de passe invalide (min 12 caractères)');
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

**Exécuter** :
```bash
ADMIN_PASSWORD="VotreMotDePasseSecure123!@#" npx tsx scripts/create-admin.ts
```

#### 2. Modifier auth.ts
```typescript
// auth.ts - Dans CredentialsProvider
authorize: async (credentials) => {
  const { email, password } = credentials;

  // Chercher en DB
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return null;

  // Vérifier password
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return null;

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role
  };
}
```

### ✅ Validation Phase 1
- [ ] .env retiré du Git
- [ ] Secrets régénérés
- [ ] 34 API routes protégées
- [ ] Admin en DB
- [ ] Login fonctionne
- [ ] API retourne 401 sans auth

---

## 🟠 PHASE 2 : SÉCURITÉ CRITIQUE (2-3 JOURS)

### Jour 3 : Validation Zod (1 jour)

#### 1. Installation
```bash
npm install zod
```

#### 2. Créer schemas

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

**Créer aussi** :
- `lib/validations/document.ts`
- `lib/validations/appointment.ts`
- `lib/validations/talent.ts`
- `lib/validations/signature.ts`

#### 3. Helper validation
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

#### 4. Utiliser dans APIs
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

---

### Jour 4 : Rate Limiting (3-4h)

#### 1. Installer Upstash
```bash
npm install @upstash/ratelimit @upstash/redis
```

**Créer compte** : https://console.upstash.com

**Ajouter à .env** :
```env
UPSTASH_REDIS_REST_URL="https://xxxx.upstash.io"
UPSTASH_REDIS_REST_TOKEN="AXxxxxxx"
```

#### 2. Créer rate limiters
```typescript
// lib/ratelimit.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

export const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(100, '15 m'),
  analytics: true,
  prefix: 'zmr',
});

export const strictRatelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1 m'),
  prefix: 'zmr-strict',
});

export const uploadRatelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, '1 m'),
  prefix: 'zmr-upload',
});
```

#### 3. Utiliser dans APIs
```typescript
// app/api/contacts/route.ts
import { ratelimit } from '@/lib/ratelimit';

export async function POST(request: NextRequest) {
  const { error, session } = await requireAuth(request);
  if (error) return error;

  // Rate limit
  const { success, limit, reset, remaining } = await ratelimit.limit(session.user.email);
  if (!success) {
    return NextResponse.json(
      { error: 'Too many requests', limit, reset, remaining },
      { status: 429 }
    );
  }

  // ... reste
}
```

**Appliquer sur** :
- `/api/send-document` → strictRatelimit
- `/api/upload` → uploadRatelimit
- `/api/documents/generate` → strictRatelimit
- Toutes les autres → ratelimit

### ✅ Validation Phase 2
- [ ] Zod installé
- [ ] 5 schemas créés
- [ ] Toutes routes POST/PUT valident
- [ ] Upstash Redis configuré
- [ ] Rate limiting actif
- [ ] Retourne 400 avec détails si validation échoue
- [ ] Retourne 429 si rate limit dépassé

---

## 🟡 PHASE 3 : PERFORMANCE & UX (3-4 JOURS)

### Jour 5-6 : React Query (1-2 jours)

#### 1. Installation
```bash
npm install @tanstack/react-query @tanstack/react-query-devtools
```

#### 2. Setup Provider
```typescript
// app/providers.tsx
'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        gcTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

```typescript
// app/layout.tsx
import { Providers } from './providers';

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

#### 3. Créer hooks personnalisés

**useContacts** :
```typescript
// lib/hooks/useContacts.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function useContacts() {
  return useQuery({
    queryKey: ['contacts'],
    queryFn: async () => {
      const res = await fetch('/api/contacts');
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    }
  });
}

export function useCreateContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });
}

export function useUpdateContact(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch(`/api/contacts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });
}
```

**Créer aussi** :
- `lib/hooks/useDocuments.ts`
- `lib/hooks/useAppointments.ts`
- `lib/hooks/useTalents.ts`

#### 4. Utiliser dans composants
```typescript
// app/admin/contacts/page.tsx
'use client';
import { useContacts, useCreateContact } from '@/lib/hooks/useContacts';

export default function ContactsPage() {
  const { data: contacts, isLoading, error } = useContacts();
  const createContact = useCreateContact();

  if (isLoading) return <div>Chargement...</div>;
  if (error) return <div>Erreur</div>;

  return (
    <div>
      {contacts.map(contact => (
        <ContactCard key={contact.id} contact={contact} />
      ))}
    </div>
  );
}
```

#### 5. Optimiser SmartDocumentForm
```typescript
// components/SmartDocumentForm.tsx
import { memo, useMemo, useCallback } from 'react';

export const SmartDocumentForm = memo(function SmartDocumentForm({
  templateId, onDataChange
}) {
  // Mémoriser calculs lourds
  const groupedFields = useMemo(() => {
    if (!fieldMapping) return {};
    return groupFieldsBySection(fieldMapping);
  }, [fieldMapping]);

  const totals = useMemo(() => {
    return calculateTotals(formData);
  }, [formData]);

  // Mémoriser callbacks
  const handleFieldChange = useCallback((field: string, value: any) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    onDataChange(newData);
  }, [formData, onDataChange]);

  return (/* ... */);
});
```

---

### Jour 6 PM : Next/Image (2-3h)

#### 1. Trouver images
```bash
grep -r "<img" app/ components/ --include="*.tsx"
```

#### 2. Remplacer
```tsx
// ❌ AVANT
<img src="/images/model.jpg" alt="Model" style={{ width: '100%' }} />

// ✅ APRÈS
import Image from 'next/image';

<Image
  src="/images/model.jpg"
  alt="Model"
  width={800}
  height={1200}
  sizes="(max-width: 768px) 100vw, 50vw"
  quality={85}
  priority={false}
/>
```

#### 3. Configuration
```typescript
// next.config.ts
export default {
  images: {
    domains: ['fzsmjingetgyipevzuuv.supabase.co'],
    remotePatterns: [
      { protocol: 'https', hostname: '**.supabase.co' },
    ],
  },
};
```

---

### Jour 7 Matin : Monitoring (1-2h)

#### 1. Installer Sentry
```bash
npx @sentry/wizard@latest -i nextjs
```

**Ajouter à .env** :
```env
SENTRY_DSN="https://xxx@sentry.io/xxx"
NEXT_PUBLIC_SENTRY_DSN="https://xxx@sentry.io/xxx"
```

#### 2. Utiliser dans APIs
```typescript
import * as Sentry from '@sentry/nextjs';

export async function POST(request: NextRequest) {
  try {
    // ... code
  } catch (error) {
    Sentry.captureException(error, {
      tags: { api: 'contacts' },
      extra: { method: 'POST' }
    });
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
```

---

### Jour 7 PM : Winston Logger (2h)

#### 1. Installer
```bash
npm install winston winston-daily-rotate-file
```

#### 2. Configuration
```typescript
// lib/logger.ts
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    new DailyRotateFile({
      filename: 'logs/application-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d'
    }),
    new DailyRotateFile({
      level: 'error',
      filename: 'logs/error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '30d'
    })
  ]
});

export default logger;
```

#### 3. Remplacer console.log
```typescript
// ❌ AVANT
console.log('User created:', user);
console.error('Error:', error);

// ✅ APRÈS
import logger from '@/lib/logger';

logger.info('User created', { userId: user.id });
logger.error('Error creating user', { error: error.message, stack: error.stack });
```

**Ajouter logs/.gitignore** :
```bash
mkdir logs
echo "*" > logs/.gitignore
echo "!.gitignore" >> logs/.gitignore
```

### ✅ Validation Phase 3
- [ ] React Query installé
- [ ] 4 hooks créés (contacts, documents, appointments, talents)
- [ ] SmartDocumentForm optimisé (memo, useMemo)
- [ ] Toutes images → next/image
- [ ] Sentry configuré
- [ ] Winston logger actif
- [ ] console.log remplacés

---

## 🔵 PHASE 4 : PRODUCTION READY (2-3 JOURS)

### Jour 8-9 : Tests critiques (1-2 jours)

#### 1. Installer Jest
```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom
```

#### 2. Configuration
```javascript
// jest.config.js
const nextJest = require('next/jest');

const createJestConfig = nextJest({ dir: './' });

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
};

module.exports = createJestConfig(customJestConfig);
```

```javascript
// jest.setup.js
import '@testing-library/jest-dom';
```

#### 3. Tests prioritaires

**1. Middleware auth** :
```typescript
// __tests__/middleware.test.ts
import { NextRequest } from 'next/server';
import middleware from '@/middleware';

describe('Middleware', () => {
  it('redirige vers login si non authentifié', async () => {
    const request = new NextRequest('http://localhost:3000/admin');
    const response = await middleware(request as any);

    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toContain('/admin/login');
  });
});
```

**2. Validation Zod** :
```typescript
// __tests__/validations/contact.test.ts
import { ContactCreateSchema } from '@/lib/validations/contact';

describe('ContactCreateSchema', () => {
  it('valide un contact correct', () => {
    const result = ContactCreateSchema.safeParse({
      name: 'John Doe',
      email: 'john@example.com'
    });

    expect(result.success).toBe(true);
  });

  it('rejette email invalide', () => {
    const result = ContactCreateSchema.safeParse({
      name: 'John Doe',
      email: 'invalid-email'
    });

    expect(result.success).toBe(false);
  });
});
```

**3. API routes** :
```typescript
// __tests__/api/contacts.test.ts
import { POST } from '@/app/api/contacts/route';

// Mock Prisma
jest.mock('@prisma/client');
jest.mock('@/auth');

describe('POST /api/contacts', () => {
  it('crée un contact avec données valides', async () => {
    const request = new NextRequest('http://localhost:3000/api/contacts', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Test',
        email: 'test@test.com'
      })
    });

    const response = await POST(request);
    expect(response.status).toBe(201);
  });
});
```

#### 4. Scripts package.json
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

**Target** : >50% coverage sur routes critiques

---

### Jour 9 PM : Accessibilité (4-6h)

#### 1. Labels sur inputs
```tsx
// ❌ AVANT
<input type="text" placeholder="Rechercher..." />

// ✅ APRÈS
<label htmlFor="search" className="sr-only">Rechercher</label>
<input
  id="search"
  type="text"
  placeholder="Rechercher..."
  aria-label="Rechercher un contact"
/>
```

**CSS pour sr-only** :
```css
/* globals.css */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

#### 2. Boutons avec aria-label
```tsx
// ❌ AVANT
<button onClick={handleDelete}>
  <TrashIcon />
</button>

// ✅ APRÈS
<button
  onClick={handleDelete}
  aria-label="Supprimer le contact"
  title="Supprimer"
>
  <TrashIcon aria-hidden="true" />
</button>
```

#### 3. Focus trap modals
```bash
npm install react-focus-lock
```

```tsx
import FocusLock from 'react-focus-lock';

<FocusLock>
  <div
    role="dialog"
    aria-modal="true"
    aria-labelledby="modal-title"
  >
    <h2 id="modal-title">Titre du modal</h2>
    {/* ... */}
  </div>
</FocusLock>
```

#### 4. Support ESC et clavier
```tsx
useEffect(() => {
  const handleEsc = (e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  };

  window.addEventListener('keydown', handleEsc);
  return () => window.removeEventListener('keydown', handleEsc);
}, [onClose]);
```

#### 5. Alt sur images
```tsx
<Image
  src="/model.jpg"
  alt="Portrait professionnel de Marie Dupont, mannequin mode"
  width={800}
  height={1200}
/>
```

**Fichiers à modifier** (priorités) :
- `app/admin/contacts/page.tsx`
- `components/LeadDetailModal.tsx`
- `components/SmartDocumentForm.tsx`
- `app/admin/documents/page.tsx`
- Tous les modals

---

### Jour 10 Matin : Documentation (3-4h)

#### 1. README.md principal
```markdown
# ZMR Models Agency - CRM

CRM professionnel pour agence de mannequins avec génération de documents, signatures électroniques et gestion des talents.

## 🚀 Démarrage rapide

### Prérequis
- Node.js 18+
- PostgreSQL 14+
- LibreOffice (pour DOCX → PDF)

### Installation
\`\`\`bash
git clone https://github.com/votre-repo/zmr-models.git
cd zmr-models
npm install

cp .env.example .env
# Éditer .env avec vos credentials

npx prisma db push
ADMIN_PASSWORD="VotreMotDePasse123!@#" npx tsx scripts/create-admin.ts

npm run dev
\`\`\`

Accès : http://localhost:3000
Admin : http://localhost:3000/admin

## 🔐 Connexion
Email : admin@zmrmodels.com
Password : (celui défini lors du script)

## 📁 Structure
\`\`\`
/app/admin      - Interface administration
/app/api        - API routes protégées
/components     - Composants React
/lib            - Utilitaires (PDF, email, auth)
/prisma         - Schema base de données
\`\`\`

## 🧪 Tests
\`\`\`bash
npm test              # Run tests
npm run test:coverage # Coverage report
\`\`\`

## 🚀 Déploiement
Voir [DEPLOYMENT.md](./DEPLOYMENT.md)

## 📚 Documentation
- [API Documentation](./docs/API.md)
- [Guide utilisateur](./docs/USER_GUIDE.md)

## 📄 Licence
Propriétaire - ZMR Models Agency
```

#### 2. docs/API.md
```markdown
# API Documentation

## Authentification
Toutes les routes `/api/*` nécessitent authentification NextAuth.

## Rate Limiting
- Standard : 100 req / 15 min
- Strict (emails/PDF) : 10 req / min
- Upload : 5 fichiers / min

## Endpoints

### Contacts

**GET /api/contacts**
Liste tous les contacts

Response 200 :
\`\`\`json
[{
  "id": "clxxx",
  "name": "John Doe",
  "email": "john@example.com",
  "status": "new",
  "createdAt": "2025-11-09T..."
}]
\`\`\`

**POST /api/contacts**
Crée un contact

Body :
\`\`\`json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+33 6 12 34 56 78",
  "type": "professional"
}
\`\`\`

Response 201 :
\`\`\`json
{
  "id": "clxxx",
  "name": "John Doe",
  ...
}
\`\`\`

Errors :
- 400 : Validation failed
- 401 : Unauthorized
- 429 : Too many requests
- 500 : Server error

... (documenter toutes les routes principales)
```

#### 3. DEPLOYMENT.md
```markdown
# Guide de Déploiement

## Vercel (recommandé)

### 1. Push sur GitHub
\`\`\`bash
git add .
git commit -m "Production ready"
git push origin main
\`\`\`

### 2. Importer sur Vercel
1. https://vercel.com/new
2. Import Git Repository
3. Sélectionner le repo

### 3. Variables d'environnement
Dans Settings > Environment Variables :
\`\`\`
DATABASE_URL = postgresql://...
NEXTAUTH_SECRET = (openssl rand -base64 32)
NEXTAUTH_URL = https://votre-app.vercel.app
SMTP_HOST = smtp.gmail.com
SMTP_USER = your-email@gmail.com
SMTP_PASSWORD = your-app-password
RESEND_API_KEY = re_...
SENTRY_DSN = https://...
NEXT_PUBLIC_SENTRY_DSN = https://...
UPSTASH_REDIS_REST_URL = https://...
UPSTASH_REDIS_REST_TOKEN = ...
\`\`\`

### 4. Deploy
Cliquer "Deploy"

### 5. Post-déploiement
\`\`\`bash
# Créer admin en production
vercel env pull .env.production.local
ADMIN_PASSWORD="..." npx tsx scripts/create-admin.ts
\`\`\`

## Supabase Database

### Configuration
1. Aller sur https://supabase.com
2. Copier Direct URL (pas Pooler!)
3. Ajouter dans Vercel env vars

### Backups
Settings > Database > Backup

## Monitoring

### Sentry
- Erreurs front/back
- Performance monitoring
- https://sentry.io/organizations/votre-org/issues/

### Uptime
- Configurer UptimeRobot
- Ping toutes les 5 minutes

## SSL/HTTPS
Automatique sur Vercel

## Domaine personnalisé
Settings > Domains > Add Domain
```

---

### Jour 10 PM : CI/CD (2-3h)

#### Créer GitHub Actions
```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Run tests
        run: npm test -- --coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info

      - name: Build
        run: npm run build
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          NEXTAUTH_SECRET: ${{ secrets.NEXTAUTH_SECRET }}

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
      - uses: actions/checkout@v3

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

**Configurer secrets GitHub** :
Settings > Secrets > Actions :
- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

---

### Jour 10 Soir : Déploiement final (2-3h)

#### Checklist pré-déploiement
```bash
# 1. Tests passent
npm test
# ✅ All tests passed

# 2. Build fonctionne
npm run build
# ✅ Build successful

# 3. Linter OK
npm run lint
# ✅ No warnings

# 4. Variables d'env prêtes
# ✅ .env.example à jour
# ✅ Secrets régénérés

# 5. Documentation complète
# ✅ README.md
# ✅ API.md
# ✅ DEPLOYMENT.md
```

#### Déploiement Vercel
```bash
# 1. Installer CLI
npm i -g vercel

# 2. Login
vercel login

# 3. Link project
vercel link

# 4. Configurer env vars
vercel env add DATABASE_URL production
vercel env add NEXTAUTH_SECRET production
vercel env add NEXTAUTH_URL production
# ... (toutes les vars)

# 5. Deploy
vercel --prod

# 6. Vérifier
curl https://votre-app.vercel.app/api/health
```

#### Post-déploiement
```bash
# 1. Créer admin en production
vercel env pull .env.production.local
ADMIN_PASSWORD="VotreMotDePasseSecure123!@#" npx tsx scripts/create-admin.ts

# 2. Tester login
# Aller sur https://votre-app.vercel.app/admin/login

# 3. Configurer backups Supabase
# Dashboard > Database > Backup > Enable Point-in-Time Recovery

# 4. Configurer monitoring
# Sentry : vérifier que les erreurs sont trackées
# Uptime Robot : ajouter monitor

# 5. Domaine personnalisé (optionnel)
# Vercel Dashboard > Settings > Domains > Add
```

### ✅ Validation Phase 4
- [ ] Tests écrits (>50% coverage)
- [ ] Accessibilité basique OK
- [ ] README.md complet
- [ ] API.md documentée
- [ ] DEPLOYMENT.md créé
- [ ] CI/CD configuré
- [ ] Déployé sur Vercel
- [ ] Admin créé en production
- [ ] Backups DB configurés
- [ ] Monitoring actif

---

## 🟢 PHASE 5 : POST-PRODUCTION (OPTIONNEL)

### Améliorations futures (3-5 jours)

#### 1. Queue emails/PDF (1 jour)
```bash
npm install bullmq ioredis
```

**Bénéfice** : Éviter timeout sur génération PDF

#### 2. RBAC avancé (1 jour)
Système de rôles/permissions granulaires

#### 3. Webhooks (1 jour)
Intégrations tierces (Zapier, Make, n8n)

#### 4. Export données (0.5 jour)
CSV, Excel, PDF des rapports

#### 5. PWA (1 jour)
Service workers, mode offline

#### 6. Calendrier sync (1 jour)
Google Calendar, Outlook integration

---

## 📊 RÉCAPITULATIF FINAL

### Timeline complète

| Phase | Durée | Actions | Livrable |
|-------|-------|---------|----------|
| **Phase 1** | 2-3j | Sécurité bloquante | Démo possible |
| **Phase 2** | 2-3j | Sécurité critique | Vendable |
| **Phase 3** | 3-4j | Performance & UX | Production-ready |
| **Phase 4** | 2-3j | Tests & deploy | En ligne |
| **Phase 5** | 3-5j | Optimisations | Entreprise-grade |

**Total minimum** : 9-13 jours (Phase 1-4)
**Total complet** : 15-20 jours (avec Phase 5)

---

### Checklists décisionnelles

#### ✅ Prêt pour DÉMO client
- [x] Phase 1 complétée
- [x] Mot de passe admin changé
- [x] API protégées
- [ ] README basique
- [ ] Déployé sur URL test

**→ Après 2-3 jours**

#### ✅ Prêt pour VENTE
- [x] Phase 1 + 2 complétées
- [x] Validation Zod active
- [x] Rate limiting configuré
- [ ] Monitoring Sentry
- [ ] Tests critiques (30%)
- [ ] Documentation API

**→ Après 4-6 jours**

#### ✅ Prêt pour PRODUCTION
- [x] Phase 1-4 complétées
- [x] Tests passent (>50%)
- [x] Accessibilité basique
- [x] Documentation complète
- [x] CI/CD configuré
- [x] Backups DB
- [x] SSL/HTTPS
- [x] Monitoring actif

**→ Après 9-13 jours**

---

## 🎯 PRIORITÉS PAR OBJECTIF

### Si objectif = Démo rapide (2-3 jours)
**FAIRE** :
- ✅ Phase 1 complète
- ✅ README basique
- ✅ Deploy sur Vercel

**REPORTER** :
- Phases 2-5

### Si objectif = Vendre le projet (4-6 jours)
**FAIRE** :
- ✅ Phase 1 + 2 complètes
- ✅ Monitoring Sentry
- ✅ Documentation API
- ✅ Tests critiques minimum

**REPORTER** :
- Optimisations React (Phase 3)
- Accessibilité (Phase 4)

### Si objectif = Production client (9-13 jours)
**FAIRE** :
- ✅ Phase 1-4 complètes
- ✅ Tout ce qui est marqué "IMPORTANT"

**REPORTER** :
- Phase 5 (post-production)

---

## 🛠️ OUTILS & RESSOURCES

### Comptes à créer
- [ ] Upstash Redis : https://console.upstash.com
- [ ] Sentry : https://sentry.io
- [ ] Vercel : https://vercel.com
- [ ] UptimeRobot : https://uptimerobot.com

### Documentation
- Next.js 14 : https://nextjs.org/docs
- Prisma : https://www.prisma.io/docs
- React Query : https://tanstack.com/query/latest/docs
- Zod : https://zod.dev
- Sentry : https://docs.sentry.io/platforms/javascript/guides/nextjs

### Extensions VS Code recommandées
- ESLint
- Prettier
- Prisma
- Tailwind CSS IntelliSense
- Jest Runner

---

## 📞 SUPPORT

### En cas de problème

**Sécurité** :
- [ ] Vérifier .env bien retiré du Git
- [ ] Tester APIs sans auth → 401
- [ ] Vérifier secrets régénérés

**Performance** :
- [ ] React Query DevTools pour debug
- [ ] Sentry pour erreurs
- [ ] Chrome DevTools > Network

**Déploiement** :
- [ ] Logs Vercel : Dashboard > Deployments > View Logs
- [ ] Vérifier env vars : Settings > Environment Variables
- [ ] Test santé : `curl https://app.vercel.app/api/health`

---

**BONNE CHANCE POUR LA MISE EN PRODUCTION ! 🚀**

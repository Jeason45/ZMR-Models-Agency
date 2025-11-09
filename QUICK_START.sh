#!/bin/bash

# ============================================
# QUICK START - MISE EN PRODUCTION ZMR MODELS
# ============================================
#
# Ce script contient toutes les commandes à exécuter
# Décommentez et exécutez section par section
#
# IMPORTANT: Ne JAMAIS exécuter tout le script d'un coup !
# Suivre étape par étape
# ============================================

set -e  # Arrêter si erreur

# ============================================
# JOUR 1 MATIN : PROTÉGER .ENV (2h)
# ============================================

# 1. Backup
# cp .env .env.backup.local

# 2. Gitignore
# cat >> .gitignore << 'EOF'
#
# # Environment variables
# .env
# .env*.local
# .env.production
# .env.development
# EOF

# 3. Retirer du Git
# git rm --cached .env
# git add .gitignore
# git commit -m "Security: Remove .env from tracking"

# 4. Nettoyer historique (CRITIQUE!)
# git filter-branch --force --index-filter \
#   "git rm --cached --ignore-unmatch .env" \
#   --prune-empty --tag-name-filter cat -- --all

# 5. Force push (ATTENTION: Vérifier avant!)
# git push origin --force --all
# git push origin --force --tags

# 6. Régénérer secrets
# echo "NEXTAUTH_SECRET=$(openssl rand -base64 32)"
# echo "→ Aller sur Supabase Dashboard pour reset password"
# echo "→ Aller sur Gmail pour nouveau app password"
# echo "→ Aller sur Resend pour nouvelle API key"

# ============================================
# JOUR 1 PM : CRÉER lib/apiAuth.ts (15min)
# ============================================

# mkdir -p lib

# Créer lib/apiAuth.ts avec ce contenu:
# import { auth } from '@/auth';
# import { NextRequest, NextResponse } from 'next/server';
#
# export async function requireAuth(request: NextRequest) {
#   const session = await auth();
#   if (!session?.user) {
#     return {
#       error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
#       session: null
#     };
#   }
#   return { error: null, session };
# }

# ============================================
# JOUR 1 PM : TROUVER ROUTES À MODIFIER (5min)
# ============================================

# Lister toutes les API routes
# find app/api -name "route.ts" -o -name "route.tsx" | grep -v "auth" | grep -v "sign/verify"

# Compter
# find app/api -name "route.ts" -o -name "route.tsx" | grep -v "auth" | grep -v "sign/verify" | wc -l

# ============================================
# JOUR 2 : CRÉER SCRIPT ADMIN
# ============================================

# mkdir -p scripts

# Créer scripts/create-admin.ts avec le code du CHECKLIST_RAPIDE.md

# Exécuter (REMPLACER LE MOT DE PASSE!)
# ADMIN_PASSWORD="VotreMotDePasseSecure123!@#" npx tsx scripts/create-admin.ts

# ============================================
# JOUR 3 : INSTALLER ZOD
# ============================================

# npm install zod
# mkdir -p lib/validations

# Créer les 5 schemas (copier depuis ROADMAP ou CHECKLIST)
# - lib/validations/contact.ts
# - lib/validations/document.ts
# - lib/validations/appointment.ts
# - lib/validations/talent.ts
# - lib/validations/signature.ts

# Créer lib/validateRequest.ts

# ============================================
# JOUR 4 : RATE LIMITING
# ============================================

# Upstash
# npm install @upstash/ratelimit @upstash/redis

# Créer lib/ratelimit.ts

# Ajouter à .env:
# UPSTASH_REDIS_REST_URL="..."
# UPSTASH_REDIS_REST_TOKEN="..."

# ============================================
# JOUR 5-6 : REACT QUERY
# ============================================

# npm install @tanstack/react-query @tanstack/react-query-devtools
# mkdir -p lib/hooks

# Créer app/providers.tsx
# Modifier app/layout.tsx
# Créer hooks:
# - lib/hooks/useContacts.ts
# - lib/hooks/useDocuments.ts
# - lib/hooks/useAppointments.ts
# - lib/hooks/useTalents.ts

# ============================================
# JOUR 6 PM : NEXT/IMAGE
# ============================================

# Trouver toutes les images
# grep -r "<img" app/ components/ --include="*.tsx"

# Remplacer manuellement par next/image

# ============================================
# JOUR 7 : MONITORING
# ============================================

# Sentry
# npx @sentry/wizard@latest -i nextjs

# Winston
# npm install winston winston-daily-rotate-file
# mkdir logs
# echo "*" > logs/.gitignore
# echo "!.gitignore" >> logs/.gitignore

# ============================================
# JOUR 8-9 : TESTS
# ============================================

# npm install --save-dev jest @testing-library/react @testing-library/jest-dom jest-environment-jsdom
# mkdir -p __tests__

# Créer jest.config.js et jest.setup.js
# Écrire tests

# ============================================
# JOUR 9 PM : ACCESSIBILITÉ
# ============================================

# npm install react-focus-lock

# Modifier composants pour ajouter:
# - labels
# - aria-labels
# - focus trap
# - support ESC

# ============================================
# JOUR 10 : DÉPLOIEMENT
# ============================================

# Tests locaux
# npm test
# npm run build
# npm run lint

# Installer Vercel CLI
# npm i -g vercel

# Login
# vercel login

# Link project
# vercel link

# Configurer env vars (via Dashboard ou CLI)
# vercel env add DATABASE_URL production
# vercel env add NEXTAUTH_SECRET production
# vercel env add NEXTAUTH_URL production
# ... (toutes les vars)

# Deploy
# vercel --prod

# Créer admin en production
# vercel env pull .env.production.local
# ADMIN_PASSWORD="VotreMotDePasseProd123!@#" npx tsx scripts/create-admin.ts

# ============================================
# VALIDATION FINALE
# ============================================

# Test santé
# curl https://votre-app.vercel.app/api/health

# Test login
# echo "Aller sur https://votre-app.vercel.app/admin/login"

# Test API sans auth
# curl https://votre-app.vercel.app/api/contacts
# → Doit retourner 401

# Vérifier Sentry
# echo "Dashboard Sentry: https://sentry.io"

# Configurer backups Supabase
# echo "Supabase > Database > Backup > Enable Point-in-Time Recovery"

# ============================================
# DONE! 🚀
# ============================================

echo "✅ Félicitations! Votre CRM est production-ready!"
echo ""
echo "Prochaines étapes:"
echo "1. Tester toutes les fonctionnalités en production"
echo "2. Configurer monitoring uptime (UptimeRobot)"
echo "3. Domaine personnalisé (optionnel)"
echo "4. Formation client"
echo ""
echo "📚 Documentation:"
echo "- ROADMAP_PRODUCTION_COMPLETE.md (détails)"
echo "- CHECKLIST_RAPIDE.md (jour par jour)"
echo "- README.md (guide utilisateur)"
echo ""
echo "🎉 Bonne vente!"

import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@zmrmodels.com';
  const password = 'Admin123!'; // Changez ce mot de passe après la première connexion

  // Hasher le mot de passe
  const hashedPassword = await bcrypt.hash(password, 10);

  // Créer l'utilisateur admin
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name: 'Admin ZMR',
      role: 'admin',
    },
  });

  console.log('✅ Utilisateur admin créé avec succès!');
  console.log('📧 Email:', email);
  console.log('🔑 Mot de passe:', password);
  console.log('\n⚠️  IMPORTANT: Changez ce mot de passe après votre première connexion!\n');
}

main()
  .catch((e) => {
    console.error('❌ Erreur:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

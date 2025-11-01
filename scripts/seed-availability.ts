import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding availability data...');

  // Créer des disponibilités pour les jours de la semaine (Lundi à Vendredi)
  const availabilities = [
    { dayOfWeek: 1, startTime: '09:00', endTime: '18:00' }, // Lundi
    { dayOfWeek: 2, startTime: '09:00', endTime: '18:00' }, // Mardi
    { dayOfWeek: 3, startTime: '09:00', endTime: '18:00' }, // Mercredi
    { dayOfWeek: 4, startTime: '09:00', endTime: '18:00' }, // Jeudi
    { dayOfWeek: 5, startTime: '09:00', endTime: '18:00' }, // Vendredi
  ];

  for (const availability of availabilities) {
    await prisma.availability.create({
      data: {
        ...availability,
        isActive: true,
      },
    });
  }

  console.log('✅ Availability data seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

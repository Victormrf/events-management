const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  await prisma.event.deleteMany({});
  console.log('Events deleted');
}
main().finally(() => prisma.$disconnect());

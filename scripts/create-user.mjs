import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const args = process.argv.slice(2);
  if (args.length < 2 || args.length > 3) {
    console.error('Usage: node scripts/create-user.mjs <email> <password> [--admin]');
    process.exit(1);
  }

  const [email, password, roleFlag] = args;
  const role = roleFlag === '--admin' ? 'ADMIN' : 'USER';

  if (!email || !password) {
    console.error('Email and password are required.');
    process.exit(1);
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role,
      },
    });

    console.log(`Successfully created user:`);
    console.log(`- Email: ${user.email}`);
    console.log(`- Role: ${user.role}`);
    console.log(`- ID: ${user.id}`);

  } catch (error) {
    if (error.code === 'P2002') {
      console.error(`Error: A user with the email "${email}" already exists.`);
    } else {
      console.error('Failed to create user:', error);
    }
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();


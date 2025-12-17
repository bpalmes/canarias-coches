import bcrypt from 'bcryptjs';

async function hashPassword() {
  const password = 'password123';
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log(hashedPassword);
}

hashPassword();


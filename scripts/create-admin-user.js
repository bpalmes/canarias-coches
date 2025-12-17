const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const readline = require('readline');

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

function questionHidden(prompt) {
  return new Promise((resolve) => {
    process.stdout.write(prompt);
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    
    let password = '';
    
    process.stdin.on('data', function(char) {
      char = char + '';
      
      switch(char) {
        case '\n':
        case '\r':
        case '\u0004':
          process.stdin.setRawMode(false);
          process.stdin.pause();
          process.stdout.write('\n');
          resolve(password);
          break;
        case '\u0003':
          process.exit();
          break;
        case '\u007f': // backspace
          if (password.length > 0) {
            password = password.slice(0, -1);
            process.stdout.write('\b \b');
          }
          break;
        default:
          password += char;
          process.stdout.write('*');
          break;
      }
    });
  });
}

async function createAdminUser() {
  try {
    console.log('🔧 Creador de Usuario Administrador\n');
    
    const email = await question('Email del administrador: ');
    
    if (!email || !email.includes('@')) {
      console.log('❌ Email inválido');
      process.exit(1);
    }
    
    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    
    if (existingUser) {
      console.log('❌ Ya existe un usuario con este email');
      process.exit(1);
    }
    
    const password = await questionHidden('Contraseña: ');
    
    if (!password || password.length < 6) {
      console.log('\n❌ La contraseña debe tener al menos 6 caracteres');
      process.exit(1);
    }
    
    const confirmPassword = await questionHidden('Confirmar contraseña: ');
    
    if (password !== confirmPassword) {
      console.log('\n❌ Las contraseñas no coinciden');
      process.exit(1);
    }
    
    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Crear el usuario
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: 'ADMIN'
      }
    });
    
    console.log('\n✅ Usuario administrador creado exitosamente:');
    console.log(`   Email: ${user.email}`);
    console.log(`   ID: ${user.id}`);
    console.log(`   Rol: ${user.role}`);
    console.log(`   Creado: ${user.createdAt}`);
    
  } catch (error) {
    console.error('❌ Error al crear el usuario:', error);
    process.exit(1);
  } finally {
    rl.close();
    await prisma.$disconnect();
  }
}

// Función para crear usuarios por defecto (solo para desarrollo)
async function createDefaultUsers() {
  try {
    console.log('🔧 Creando usuarios por defecto para desarrollo...\n');
    
    const defaultUsers = [
      {
        email: 'admin@miguelleon.com',
        password: 'admin123',
        role: 'ADMIN'
      },
      {
        email: 'test@miguelleon.com', 
        password: 'test123',
        role: 'ADMIN'
      }
    ];
    
    for (const userData of defaultUsers) {
      // Verificar si ya existe
      const existing = await prisma.user.findUnique({
        where: { email: userData.email }
      });
      
      if (existing) {
        console.log(`⚠️  Usuario ${userData.email} ya existe, saltando...`);
        continue;
      }
      
      // Crear usuario
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      const user = await prisma.user.create({
        data: {
          email: userData.email,
          password: hashedPassword,
          role: userData.role
        }
      });
      
      console.log(`✅ Usuario creado: ${user.email} (${user.role})`);
    }
    
    console.log('\n✅ Usuarios por defecto creados exitosamente');
    
  } catch (error) {
    console.error('❌ Error al crear usuarios por defecto:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Verificar argumentos de línea de comandos
const args = process.argv.slice(2);

if (args.includes('--default')) {
  createDefaultUsers();
} else {
  createAdminUser();
}









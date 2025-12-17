# 👥 Gestión de Usuarios Administradores

## 🚀 Usuarios Creados

Se han creado los siguientes usuarios administradores por defecto:

### Usuario Principal
- **Email:** `admin@miguelleon.com`
- **Contraseña:** `admin123`
- **Rol:** ADMIN

### Usuario de Prueba
- **Email:** `test@miguelleon.com`
- **Contraseña:** `test123`
- **Rol:** ADMIN

## 🔧 Scripts Disponibles

### Crear Usuario Administrador Interactivo
```bash
npm run create-admin
```
Este script te permite crear un nuevo usuario administrador de forma interactiva, solicitando email y contraseña de forma segura.

### Crear Usuarios por Defecto
```bash
npm run create-default-users
```
Crea automáticamente los usuarios por defecto mencionados arriba (útil después de resetear la base de datos).

### Resetear Base de Datos
```bash
npm run db:reset
```
Resetea completamente la base de datos y ejecuta las migraciones.

### Ejecutar Seed
```bash
npm run db:seed
```
Ejecuta el archivo de seed para poblar la base de datos.

## 🖥️ Interfaz de Gestión de Usuarios

### Acceso
1. Inicia sesión con cualquiera de los usuarios administradores
2. Ve a `/admin/manage-users` o usa el panel de administración

### Funcionalidades Disponibles

#### ✅ Crear Usuarios
- Formulario para crear nuevos usuarios
- Validación de email único
- Selección de rol (USER/ADMIN)
- Contraseña segura requerida

#### ✅ Editar Usuarios
- Modificar email y rol
- Cambiar contraseña (opcional)
- Validaciones completas

#### ✅ Eliminar Usuarios
- Confirmación antes de eliminar
- No se puede eliminar el último administrador

#### ✅ Visualización
- Tabla con todos los usuarios
- Información de creación y última actualización
- Indicadores visuales de roles
- Búsqueda y filtrado

## 🔐 Seguridad

### Contraseñas
- Hasheadas con bcrypt (12 rounds)
- Mínimo 6 caracteres
- No se almacenan en texto plano

### Autenticación
- JWT tokens para sesiones
- Verificación de rol ADMIN para operaciones sensibles
- Middleware de autenticación en todas las rutas admin

### Validaciones
- Email único en la base de datos
- Formato de email válido
- Roles válidos (USER/ADMIN)

## 📝 Estructura de Base de Datos

```sql
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String   // Hasheada con bcrypt
  role      Role     @default(USER) // USER | ADMIN
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## 🚨 Comandos de Emergencia

### Si pierdes acceso a todos los usuarios administradores:

1. **Crear nuevo admin desde línea de comandos:**
   ```bash
   npm run create-admin
   ```

2. **Recrear usuarios por defecto:**
   ```bash
   npm run create-default-users
   ```

3. **Acceso directo a base de datos (si tienes acceso):**
   ```bash
   npx prisma studio
   ```

## 🔄 Flujo de Trabajo Recomendado

1. **Desarrollo Local:**
   - Usa los usuarios por defecto para desarrollo
   - Crea usuarios específicos según necesites

2. **Producción:**
   - Elimina los usuarios por defecto
   - Crea usuarios con contraseñas seguras usando `npm run create-admin`
   - Usa emails corporativos reales

3. **Mantenimiento:**
   - Revisa regularmente los usuarios activos
   - Elimina usuarios que ya no necesiten acceso
   - Actualiza contraseñas periódicamente

## 📞 Soporte

Si tienes problemas con la gestión de usuarios:

1. Verifica que la base de datos esté funcionando
2. Comprueba que las migraciones estén aplicadas
3. Revisa los logs del servidor para errores específicos
4. Usa `npm run create-admin` para crear un nuevo usuario si es necesario

## 🎯 Próximas Mejoras

- [ ] Recuperación de contraseña por email
- [ ] Autenticación de dos factores (2FA)
- [ ] Logs de actividad de usuarios
- [ ] Roles más granulares
- [ ] Integración con sistemas de autenticación externos









# Sistema de Cookies y Política de Privacidad - Grupo Miguel León

## 📋 Descripción General

Se ha implementado un sistema completo de gestión de cookies y política de privacidad que cumple con el **Reglamento General de Protección de Datos (RGPD)** y las normativas españolas de protección de datos.

## 🍪 Componentes del Sistema de Cookies

### 1. **CookieConsent** (`src/components/CookieConsent.tsx`)
- **Banner principal** que aparece en la primera visita
- **Modal de configuración** para personalizar preferencias
- **Opciones disponibles**:
  - ✅ **Cookies Necesarias** (siempre activas)
  - 📊 **Cookies Analíticas** (opcional)
  - 🎯 **Cookies de Marketing** (opcional)
  - ⚙️ **Cookies de Preferencias** (opcional)

### 2. **CookieManager** (`src/components/CookieManager.tsx`)
- **Botón en el footer** para gestionar cookies en cualquier momento
- **Modal de configuración** accesible desde cualquier página
- **Opción para eliminar** todas las preferencias

### 3. **useCookieConsent** (`src/hooks/useCookieConsent.ts`)
- **Hook personalizado** para gestionar el estado de cookies
- **Persistencia en localStorage**
- **Funciones de utilidad** para verificar permisos

## 🎯 Funcionalidades Implementadas

### ✅ **Cumplimiento RGPD**
- **Consentimiento explícito** antes de usar cookies no esenciales
- **Opciones granulares** para cada tipo de cookie
- **Derecho de retirada** del consentimiento en cualquier momento
- **Información transparente** sobre el uso de cookies

### 🔧 **Gestión de Preferencias**
- **Aceptar todas** las cookies
- **Rechazar todas** las cookies no esenciales
- **Configuración personalizada** por tipo
- **Persistencia** de preferencias del usuario

### 📱 **Experiencia de Usuario**
- **Banner no intrusivo** en la parte inferior
- **Modal responsive** para dispositivos móviles
- **Acceso fácil** desde el footer
- **Interfaz intuitiva** y clara

## 🚀 Instalación y Uso

### 1. **Integración Automática**
El sistema se integra automáticamente en todas las páginas a través del layout principal:

```tsx
// src/app/layout.tsx
import CookieConsent from "@/components/CookieConsent";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {/* ... otros componentes ... */}
        <CookieConsent />
      </body>
    </html>
  );
}
```

### 2. **Uso del Hook**
```tsx
import { useCookieConsent } from '@/hooks/useCookieConsent';

function MyComponent() {
  const { 
    preferences, 
    hasConsented, 
    canUseAnalytics, 
    canUseMarketing 
  } = useCookieConsent();

  // Solo usar analytics si el usuario ha dado consentimiento
  if (canUseAnalytics()) {
    // Código de Google Analytics, etc.
  }
}
```

### 3. **Gestor de Cookies en Footer**
```tsx
import CookieManager from '@/components/CookieManager';

function Footer() {
  return (
    <footer>
      {/* ... otros enlaces ... */}
      <CookieManager />
    </footer>
  );
}
```

## 📄 Página de Política de Privacidad

### **Ruta**: `/politica-privacidad`
- **Información completa** sobre el tratamiento de datos
- **Derechos del usuario** según RGPD
- **Información de contacto** para ejercer derechos
- **Proceso de compra-tasación** detallado
- **Comunicaciones comerciales** y marketing

### **Secciones Principales**:
1. **Información de la Empresa**
2. **Información al Usuario**
3. **Criterios de Conservación de Datos**
4. **Derechos del Usuario**
5. **Proceso de Compra-Tasación**
6. **Comunicaciones Comerciales**
7. **Medidas de Seguridad**

## 🔒 Tipos de Cookies Gestionadas

### **🍪 Cookies Necesarias**
- **Propósito**: Funcionamiento esencial del sitio web
- **Ejemplos**: Sesión, autenticación, seguridad
- **Estado**: Siempre activas (no se pueden desactivar)
- **Base legal**: Interés legítimo

### **📊 Cookies Analíticas**
- **Propósito**: Mejorar la experiencia del usuario
- **Ejemplos**: Google Analytics, métricas de uso
- **Estado**: Opcional (requiere consentimiento)
- **Base legal**: Consentimiento del usuario

### **🎯 Cookies de Marketing**
- **Propósito**: Publicidad personalizada
- **Ejemplos**: Anuncios dirigidos, remarketing
- **Estado**: Opcional (requiere consentimiento)
- **Base legal**: Consentimiento del usuario

### **⚙️ Cookies de Preferencias**
- **Propósito**: Configuraciones personalizadas
- **Ejemplos**: Idioma, región, temas
- **Estado**: Opcional (requiere consentimiento)
- **Base legal**: Consentimiento del usuario

## 🛡️ Seguridad y Privacidad

### **Almacenamiento**
- **LocalStorage**: Preferencias del usuario
- **Sin cookies de terceros** hasta consentimiento
- **Encriptación**: No almacena datos sensibles

### **Cumplimiento Legal**
- **RGPD**: Reglamento UE 2016/679
- **LOPDGDD**: Ley Orgánica 3/2018
- **AEPD**: Agencia Española de Protección de Datos

### **Derechos del Usuario**
- ✅ **Acceso** a sus datos personales
- ✅ **Rectificación** de datos incorrectos
- ✅ **Portabilidad** de datos
- ✅ **Supresión** (derecho al olvido)
- ✅ **Limitación** del tratamiento
- ✅ **Oposición** al tratamiento
- ✅ **Retirada** del consentimiento

## 🔧 Personalización

### **Estilos**
El sistema utiliza Tailwind CSS y se puede personalizar fácilmente:
- **Colores**: Cambiar clases de color en los componentes
- **Espaciado**: Modificar clases de padding/margin
- **Tipografía**: Ajustar tamaños y pesos de fuente

### **Funcionalidad**
- **Tipos de cookies**: Agregar o quitar categorías
- **Persistencia**: Cambiar de localStorage a cookies o base de datos
- **Idiomas**: Implementar internacionalización

## 📱 Responsive Design

### **Dispositivos Móviles**
- **Banner adaptativo** que se apila verticalmente
- **Modal optimizado** para pantallas pequeñas
- **Botones táctiles** con tamaño adecuado

### **Dispositivos de Escritorio**
- **Layout horizontal** para mejor aprovechamiento del espacio
- **Modal centrado** con ancho máximo optimizado
- **Hover effects** para mejor interactividad

## 🧪 Testing

### **Funcionalidades a Probar**
1. **Primera visita**: Banner aparece correctamente
2. **Aceptar todas**: Todas las cookies se activan
3. **Rechazar todas**: Solo cookies necesarias
4. **Configuración personalizada**: Cambios se guardan
5. **Persistencia**: Preferencias se mantienen entre sesiones
6. **Gestor de cookies**: Acceso desde footer funciona
7. **Responsive**: Funciona en móvil y escritorio

### **Casos Edge**
- **Sin JavaScript**: Fallback apropiado
- **LocalStorage bloqueado**: Manejo de errores
- **Cookies de terceros**: Solo se cargan con consentimiento

## 🚀 Despliegue

### **Build**
```bash
npm run build
```

### **Verificación**
- ✅ Compilación exitosa
- ✅ Sin errores de TypeScript
- ✅ Componentes renderizan correctamente
- ✅ Funcionalidad de cookies funciona

## 📞 Soporte

### **Contacto Técnico**
- **Email**: info@miguelleon.es
- **Teléfono**: 928 222 324

### **Protección de Datos**
- **Email**: atencionalcliente@miguelleon.es
- **Teléfono**: 928 222 324 ext. 2000

## 📋 Checklist de Cumplimiento

- [x] **Banner de cookies** visible en primera visita
- [x] **Consentimiento explícito** antes de cookies no esenciales
- [x] **Opciones granulares** por tipo de cookie
- [x] **Derecho de retirada** del consentimiento
- [x] **Información transparente** sobre uso de cookies
- [x] **Página de política de privacidad** completa
- [x] **Gestor de cookies** accesible desde footer
- [x] **Persistencia** de preferencias del usuario
- [x] **Responsive design** para todos los dispositivos
- [x] **Cumplimiento RGPD** completo
- [x] **Documentación** del sistema

---

**Última actualización**: Diciembre 2023  
**Versión**: 1.0.0  
**Estado**: ✅ Implementado y funcional

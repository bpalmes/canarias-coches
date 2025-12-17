# Sistema de Sincronización con Limpieza Automática

## Descripción General

Este sistema implementa una sincronización inteligente del feed de coches que incluye:

1. **Sincronización por lotes** del feed XML
2. **Limpieza automática** que marca como vendidos los coches que ya no están en el feed
3. **Seguimiento del origen** de cada coche (feed vs manual)
4. **Gestión manual** de coches vendidos

## Características Principales

### 🔄 Sincronización Inteligente
- Procesa el feed por lotes de 50 coches
- Actualiza coches existentes o crea nuevos
- Marca automáticamente como vendidos los coches que ya no están en el feed

### 🧹 Limpieza Automática
- **Activada por defecto** en la interfaz
- Compara todos los SKUs del feed con la base de datos
- Marca como vendidos los coches que ya no aparecen en el feed
- Solo afecta a coches con `source: "feed"`

### 📊 Seguimiento de Origen
- **`source: "feed"`**: Coches que vienen del feed XML
- **`source: "manual"`**: Coches importados manualmente (CSV, campañas)
- Permite diferenciar entre coches del feed y coches manuales

### 🗑️ Gestión de Coches Vendidos
- Los coches vendidos se mantienen en la base de datos
- Se pueden eliminar manualmente si es necesario
- No aparecen en las búsquedas normales

## Flujo de Trabajo Recomendado

### 1. Primera Ejecución (Después de la Actualización)
```
1. Ir a Admin > Sync
2. Hacer clic en "Actualizar Origen de Coches Existentes"
3. Esto marca todos los coches existentes como source: "feed"
```

### 2. Sincronización Regular
```
1. Activar "Limpieza automática" (recomendado)
2. Hacer clic en "Iniciar Sincronización Ahora"
3. El sistema procesará el feed y marcará como vendidos los coches ausentes
```

### 3. Gestión de Coches Vendidos (Opcional)
```
1. Hacer clic en "Contar Coches Vendidos"
2. Revisar cuántos coches están marcados como vendidos
3. Opcionalmente eliminar los coches vendidos del feed
```

## Beneficios del Sistema

### ✅ Ventajas
- **Inventario siempre actualizado** con el feed
- **No más coches obsoletos** en tu web
- **Diferencia clara** entre coches del feed y manuales
- **Limpieza automática** sin intervención manual
- **Auditoría completa** de coches vendidos

### 🔍 Casos de Uso
- **Sincronización diaria** del feed
- **Limpieza semanal** de coches vendidos
- **Mantenimiento** de coches importados manualmente
- **Auditoría** del inventario

## Configuración Técnica

### Base de Datos
- Campo `source` en la tabla `Car`
- Campo `isSold` para estado de venta
- Migración automática de coches existentes

### API Endpoints
- `POST /api/cars/sync` - Sincronización principal
- `POST /api/cars/update-source` - Actualización de origen
- `POST /api/cars/cleanup-sold` - Limpieza de vendidos

### Parámetros de Sincronización
```json
{
  "offset": 0,
  "limit": 50,
  "cleanupMode": true
}
```

## Solución al Problema Original

### ❌ Problema Identificado
- Sistema anterior solo sincronizaba por lotes
- No eliminaba coches que ya no estaban en el feed
- Acumulación de coches obsoletos en la base de datos
- Discrepancia entre feed (470) y base de datos (muchos más)

### ✅ Solución Implementada
- **Limpieza automática** en cada sincronización
- **Marcado automático** como vendidos
- **Seguimiento de origen** para diferenciar tipos de coches
- **Gestión manual** de coches vendidos

### 📈 Resultado Esperado
- Base de datos siempre sincronizada con el feed
- Coches vendidos marcados automáticamente
- Inventario limpio y actualizado
- Posibilidad de limpieza manual cuando sea necesario

## Notas Importantes

### ⚠️ Consideraciones
- La limpieza automática solo afecta a coches con `source: "feed"`
- Los coches importados manualmente (`source: "manual"`) no se marcan como vendidos
- Los coches vendidos se mantienen en la base de datos por defecto
- Se pueden eliminar manualmente si es necesario

### 🔧 Mantenimiento
- Ejecutar sincronización regularmente (diaria/semanal)
- Revisar coches vendidos periódicamente
- Limpiar coches vendidos cuando sea apropiado
- Monitorear el estado de la sincronización

### 📊 Monitoreo
- Revisar logs de sincronización
- Contar coches vendidos regularmente
- Verificar estadísticas de origen (feed vs manual)
- Usar el visor de base de datos para auditoría

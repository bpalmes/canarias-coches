# 🧮 Sistema de Calculadora Financiera - Genesis Dynamics

> **Documentación Técnica Completa**  
> Sistema de cálculo de financiación de vehículos con arquitectura multi-tenant, configuración dinámica y compatibilidad Laravel.

---

## 📋 Tabla de Contenidos

1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [Arquitectura General](#arquitectura-general)
3. [Base de Datos](#base-de-datos)
4. [Backend](#backend)
5. [Frontend](#frontend)
6. [Flujos de Datos](#flujos-de-datos)
7. [Configuración y Gestión](#configuración-y-gestión)
8. [Archivos del Proyecto](#archivos-del-proyecto)

---

## 🎯 Resumen Ejecutivo

### ¿Qué es la Calculadora Financiera?

La **Calculadora Financiera** es un sistema completo para calcular opciones de financiación de vehículos basado en:

- **Datos del vehículo**: Precio, edad (fecha de matriculación)
- **Parámetros de financiación**: Monto a financiar, entrada, plazo deseado, tasa de interés
- **Entidades financieras**: Bancos y financieras configurables (Santander, BBVA, Cetelem, etc.)
- **Reglas dinámicas**: Coeficientes y rentabilidades almacenadas en base de datos

### Características Principales

✅ **Multi-tenant**: Cada organización puede tener sus propias configuraciones  
✅ **Configuración dinámica**: Reglas financieras gestionadas desde base de datos  
✅ **Carga masiva CSV**: Importación de reglas por lotes  
✅ **Compatible con Laravel**: Mantiene compatibilidad con sistema anterior  
✅ **Motor de cálculo avanzado**: Pipeline funcional con validaciones y auditoría  
✅ **Historial y auditoría**: Cada cálculo se registra para análisis  

---

## 🏗️ Arquitectura General

### Diagrama de Componentes

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (Next.js 15)                    │
│                                                                   │
│  ┌──────────────────┐    ┌─────────────────┐                   │
│  │ CalculatorForm   │    │ ConfigPage      │                   │
│  │ (Calculadora)    │    │ (Administración)│                   │
│  └─────────┬────────┘    └────────┬────────┘                   │
│            │                      │                              │
│            │                      │                              │
└────────────┼──────────────────────┼──────────────────────────────┘
             │                      │
             │ POST /financial/     │ POST /financing/rules/
             │      calculate       │      bulk-upload
             │                      │
┌────────────▼──────────────────────▼──────────────────────────────┐
│                         NGINX (Proxy)                             │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ location ~ ^/api/(financial|financing)(/|$)             │    │
│  │   → proxy_pass http://backend:3001                      │    │
│  └─────────────────────────────────────────────────────────┘    │
└────────────┬──────────────────────┬──────────────────────────────┘
             │                      │
┌────────────▼──────────────────────▼──────────────────────────────┐
│                      BACKEND (NestJS)                             │
│                                                                   │
│  ┌──────────────────────────────────────────────────────┐       │
│  │              FINANCIAL MODULE                         │       │
│  │  ┌────────────────┐  ┌─────────────────────────┐    │       │
│  │  │ Controllers:   │  │ Services:               │    │       │
│  │  │ - Calculator   │  │ - CalculationEngine     │    │       │
│  │  │ - Laravel      │  │ - LaravelCalculator     │    │       │
│  │  └────────────────┘  └─────────────────────────┘    │       │
│  │                                                       │       │
│  │  ┌────────────────┐  ┌─────────────────────────┐    │       │
│  │  │ Entities:      │  │ Config:                 │    │       │
│  │  │ - FinancialLog │  │ - Rules (código)        │    │       │
│  │  │ - OrgConfig    │  │ - Limits                │    │       │
│  │  └────────────────┘  └─────────────────────────┘    │       │
│  └──────────────────────────────────────────────────────┘       │
│                                                                   │
│  ┌──────────────────────────────────────────────────────┐       │
│  │           FINANCING MODULE (Sistema V2)               │       │
│  │  ┌────────────────┐  ┌─────────────────────────┐    │       │
│  │  │ Controllers:   │  │ Services:               │    │       │
│  │  │ - RulesCtrl    │  │ - RulesService          │    │       │
│  │  │ - EntitiesCtrl │  │ - EntitiesService       │    │       │
│  │  └────────────────┘  └─────────────────────────┘    │       │
│  │                                                       │       │
│  │  ┌────────────────────────────────────────────┐     │       │
│  │  │ Entities V2:                               │     │       │
│  │  │ - FinancialEntity                          │     │       │
│  │  │ - FinancialEntityConfiguration             │     │       │
│  │  │ - FinancialConfigurationDetail             │     │       │
│  │  │ - FinancialInterestRate                    │     │       │
│  │  │ - FinancialLoanTerm                        │     │       │
│  │  │ - FinancialCampaign                        │     │       │
│  │  │ - FinancialConfigurationRule               │     │       │
│  │  │ - FinancialAuditTrail                      │     │       │
│  │  └────────────────────────────────────────────┘     │       │
│  └──────────────────────────────────────────────────────┘       │
└───────────────────────────┬───────────────────────────────────────┘
                            │
┌───────────────────────────▼───────────────────────────────────────┐
│                   BASE DE DATOS (PostgreSQL)                       │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │ TABLAS SISTEMA V2 (Configuración Dinámica)              │    │
│  │ - financial_entities (7 registros precargados)          │    │
│  │ - financial_interest_rates (11 tasas: 4.99% - 11.99%)   │    │
│  │ - financial_loan_terms (9 plazos: 24m - 120m)           │    │
│  │ - financial_campaigns (2: VN, VO)                        │    │
│  │ - financial_entity_configurations (configuraciones)      │    │
│  │ - financial_configuration_details (coef y rent)          │    │
│  │ - financial_configuration_rules (reglas de aplicación)   │    │
│  │ - financial_audit_trails (auditoría de cambios)          │    │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │ TABLAS DE LOGS Y AUDITORÍA                              │    │
│  │ - financial_calculation_logs (historial de cálculos)     │    │
│  │ - financial_organization_configuration (config por org)  │    │
│  │ - financial_global_configuration (config global)         │    │
│  └──────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
```

### Flujo General del Sistema

1. **Usuario accede a la calculadora** (`/financial`)
2. **Introduce datos** del vehículo y parámetros de financiación
3. **Frontend envía request** a `/api/financial/calculate`
4. **Backend valida** y ejecuta pipeline de cálculo
5. **Motor de cálculo**:
   - Consulta entidades financieras activas
   - Busca configuraciones aplicables (coeficientes/rentabilidades)
   - Calcula opciones para todas las combinaciones válidas
   - Aplica comisiones y garantías
   - Calcula TAE
   - Ordena por mejor opción
6. **Backend registra** el cálculo en `financial_calculation_logs`
7. **Frontend muestra** resultados ordenados al usuario

---

## 🗄️ Base de Datos

### Esquema de Tablas

La base de datos PostgreSQL contiene **8 tablas principales** para el sistema financiero V2:

#### 1️⃣ `financial_entities` - Entidades Financieras

Almacena los bancos y financieras disponibles (Santander, BBVA, Cetelem, etc.).

```sql
CREATE TABLE financial_entities (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,           -- 'Santander Consumer Finance'
  code VARCHAR(50) NOT NULL,            -- 'SANTANDER', 'BBVA', etc.
  description TEXT,
  logo VARCHAR,                         -- URL del logo
  isActive BOOLEAN DEFAULT true,
  organizationId INTEGER NULL,          -- NULL = global, ID = específica
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW(),
  
  INDEX (organizationId, isActive)
);
```

**Datos precargados**: 7 entidades (Santander, BBVA, CaixaBank, Cetelem, Lendrock, Sofinco, Confia)

#### 2️⃣ `financial_interest_rates` - Tasas de Interés

Catálogo de tasas de interés disponibles (TIN).

```sql
CREATE TABLE financial_interest_rates (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,           -- '5,99%', '6,99%'
  value DECIMAL(5,2) NOT NULL,          -- 5.99, 6.99
  isActive BOOLEAN DEFAULT true,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);
```

**Datos precargados**: 11 tasas (4.99%, 5.99%, 6.99%, 7.49%, 7.99%, 8.49%, 8.99%, 9.49%, 9.99%, 10.99%, 11.99%)

#### 3️⃣ `financial_loan_terms` - Plazos de Financiación

Plazos disponibles en meses.

```sql
CREATE TABLE financial_loan_terms (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,           -- '60 meses'
  durationMonths INTEGER NOT NULL UNIQUE, -- 60
  isActive BOOLEAN DEFAULT true,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);
```

**Datos precargados**: 9 plazos (24, 36, 48, 60, 72, 84, 96, 108, 120 meses)

#### 4️⃣ `financial_campaigns` - Campañas

Categorías de vehículos (VN = Vehículo Nuevo, VO = Vehículo Ocasión).

```sql
CREATE TABLE financial_campaigns (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,           -- 'Vehículos Nuevos'
  code VARCHAR(255) NOT NULL UNIQUE,    -- 'vn', 'vo'
  minVehiculoAgeMonths INTEGER,        -- 0 para VN, 13 para VO
  maxVehiculoAgeMonths INTEGER,        -- 12 para VN, NULL para VO
  isActive BOOLEAN DEFAULT true,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);
```

**Datos precargados**: 2 campañas (VN: 0-12 meses, VO: 13+ meses)

#### 5️⃣ `financial_entity_configurations` - Configuraciones de Entidad

Configuraciones específicas por entidad financiera (versionado).

```sql
CREATE TABLE financial_entity_configurations (
  id SERIAL PRIMARY KEY,
  entityId INTEGER NOT NULL,            -- FK a financial_entities
  name VARCHAR(255) NOT NULL,           -- 'Configuración Laravel Santander'
  version INTEGER UNSIGNED DEFAULT 1,   -- Versionado de configuraciones
  parentId INTEGER NULL,                -- Para historial de versiones
  isLive BOOLEAN DEFAULT false,         -- ¿Está activa para cálculos?
  publishedAt TIMESTAMP NULL,           -- Cuándo se publicó
  userIdPublisher INTEGER NULL,         -- Quién la publicó
  priority INTEGER DEFAULT 0,           -- Prioridad para resolver conflictos
  isActive BOOLEAN DEFAULT true,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW(),
  
  INDEX (entityId, isLive)
);
```

**Relación**: Cada entidad puede tener múltiples configuraciones (diferentes versiones).

#### 6️⃣ `financial_configuration_details` - Detalles de Configuración

**⚡ LA TABLA MÁS IMPORTANTE** - Contiene los coeficientes y rentabilidades para cada combinación.

```sql
CREATE TABLE financial_configuration_details (
  id SERIAL PRIMARY KEY,
  configurationId INTEGER NOT NULL,     -- FK a financial_entity_configurations
  campaignId INTEGER NOT NULL,          -- FK a financial_campaigns (VN/VO)
  interestRateId INTEGER NOT NULL,      -- FK a financial_interest_rates
  loanTermId INTEGER NOT NULL,          -- FK a financial_loan_terms
  
  -- CÁLCULO PRINCIPAL
  calculationType VARCHAR(20) NOT NULL, -- 'coeficiente' o 'rentabilidad'
  value DECIMAL(10,6) NOT NULL,         -- 3.269800, 5.50, etc.
  
  -- RANGOS OPCIONALES
  minLoanAmount DECIMAL(12,2) NULL,
  maxLoanAmount DECIMAL(12,2) NULL,
  minVehiculoAgeMonths INTEGER NULL,
  maxVehiculoAgeMonths INTEGER NULL,
  
  -- COMISIONES
  openingCommissionPercentage DECIMAL(5,2) NULL,     -- 2.50 = 2.50%
  openingCommissionFixed DECIMAL(10,2) NULL,         -- 350.00€
  studyCommissionPercentage DECIMAL(5,2) NULL,       -- 1.50 = 1.50%
  studyCommissionFixed DECIMAL(10,2) NULL,           -- 180.00€
  otherFees JSON NULL,                               -- Otras comisiones
  
  isActive BOOLEAN DEFAULT true,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW(),
  
  UNIQUE (configurationId, campaignId, interestRateId, loanTermId, calculationType),
  INDEX (configurationId, campaignId, interestRateId, loanTermId),
  INDEX (calculationType, isActive)
);
```

**Ejemplo de datos**:
```
id=1, configurationId=1, campaignId=1 (VN), interestRateId=2 (5.99%), 
loanTermId=4 (60m), calculationType='coeficiente', value=2.1355

id=2, configurationId=1, campaignId=1 (VN), interestRateId=2 (5.99%), 
loanTermId=4 (60m), calculationType='rentabilidad', value=6.0
```

**Interpretación**:
- Para Santander, vehículo nuevo (VN), tasa 5.99%, plazo 60 meses:
  - **Coeficiente**: 2.1355 (para calcular cuota financiada)
  - **Rentabilidad**: 6.0% (para calcular cuota al contado)

#### 7️⃣ `financial_configuration_rules` - Reglas de Configuración

Reglas adicionales de validación por parámetros.

```sql
CREATE TABLE financial_configuration_rules (
  id SERIAL PRIMARY KEY,
  configurationId INTEGER NOT NULL,     -- FK a financial_entity_configurations
  parameterType VARCHAR(255) NOT NULL,  -- 'vehiculo_age_months', 'loan_amount'
  operator VARCHAR(255) NOT NULL,       -- '>', '<', '<=', '>=', '=', '!=', 'between'
  value1 VARCHAR(255) NOT NULL,         -- Primer valor
  value2 VARCHAR(255) NULL,             -- Segundo valor (para 'between')
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);
```

**Ejemplo**: "Solo aplicar si loan_amount > 10000 AND vehiculo_age_months <= 120"

#### 8️⃣ `financial_audit_trails` - Auditoría

Registro de cambios en configuraciones.

```sql
CREATE TABLE financial_audit_trails (
  id SERIAL PRIMARY KEY,
  configurationId INTEGER NOT NULL,     -- FK a financial_entity_configurations
  userId INTEGER NULL,                  -- Quién hizo el cambio
  action VARCHAR(255) NOT NULL,         -- 'created', 'updated', 'deleted', 'published'
  oldValues JSON NULL,                  -- Valores anteriores
  newValues JSON NULL,                  -- Valores nuevos
  description TEXT NULL,                -- Descripción del cambio
  metadata JSON NULL,                   -- Metadatos adicionales
  createdAt TIMESTAMP DEFAULT NOW()
);
```

### Migraciones

#### Migración Principal: `1759200000000-CreateFinancialV2Tables.ts`

**Ubicación**: `backend/src/database/migrations/1759200000000-CreateFinancialV2Tables.ts`

Crea las 8 tablas del sistema financiero V2 con índices optimizados.

**Características**:
- ✅ Definición completa de tablas con comentarios descriptivos
- ✅ Índices compuestos para queries frecuentes
- ✅ Unique constraints para evitar duplicados
- ✅ Foreign keys para integridad referencial (definidas en entidades TypeORM)

#### Migración de Datos: `1759300000000-InsertRealLaravelIndexesData.ts`

**Ubicación**: `backend/src/database/migrations/1759300000000-InsertRealLaravelIndexesData.ts`

Inserta datos precargados del sistema Laravel original (1109 registros).

**Datos insertados**:
- 11 tasas de interés
- 9 plazos de financiación
- 2 campañas (VN, VO)
- 7 configuraciones base (una por entidad)
- ~1060 detalles de configuración (coeficientes y rentabilidades)

**Entidades precargadas**:
1. Santander Consumer Finance (id=1)
2. BBVA Consumer Finance (id=2)
3. CaixaBank Consumer Finance (id=3)
4. Cetelem BNP Paribas (id=4)
5. Lendrock Finance (id=5)
6. Sofinco (id=6)
7. Confia Finance (id=7)

### Logs y Auditoría

#### `financial_calculation_logs` - Historial de Cálculos

**Propósito**: Registrar todos los cálculos realizados para auditoría y analytics.

```sql
CREATE TABLE financial_calculation_logs (
  id UUID PRIMARY KEY,
  
  -- MULTI-TENANCY
  organizationId INTEGER NOT NULL,      -- ⚠️ OBLIGATORIO para segregación
  userId INTEGER NULL,
  
  -- DATOS DEL CÁLCULO
  input JSONB NOT NULL,                 -- Input completo del cálculo
  results JSONB NOT NULL,               -- Array de resultados generados
  resultCount INTEGER NOT NULL,         -- Número de opciones calculadas
  bestMonthlyPayment DECIMAL(10,2),     -- Mejor cuota encontrada
  bestTAE DECIMAL(5,2),                 -- Mejor TAE encontrada
  
  -- METADATOS TÉCNICOS
  calculationMethod VARCHAR(50) NOT NULL,     -- 'french_amortization'
  processingTimeMs INTEGER NOT NULL,          -- Tiempo de procesamiento
  calculationMetadata JSONB,                  -- Versión, config usada, filtros
  
  -- INFORMACIÓN DE SESIÓN
  clientIP INET,
  userAgent TEXT,
  sessionId VARCHAR(100),
  
  -- ANALYTICS
  vehiculoCategory VARCHAR(50),         -- 'new', 'recent', 'used', 'old'
  priceCategory VARCHAR(50),            -- 'premium', 'high', 'medium', etc.
  requestedLoanAmount DECIMAL(10,2),
  requestedTermMonths INTEGER,
  requestedRate DECIMAL(5,2),
  requestedGuarantees TEXT[],
  
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW(),
  
  INDEX (organizationId, createdAt),
  INDEX (userId, createdAt)
);
```

**Uso**: Cada vez que se ejecuta un cálculo, se crea un registro con toda la información.

---

## 🔧 Backend

### Estructura de Módulos

El backend NestJS se organiza en **2 módulos principales**:

1. **`FinancialModule`**: Motor de cálculo y lógica de negocio
2. **`FinancingModule`**: Gestión de reglas y configuraciones (CRUD)

### 1. FinancialModule

**Ubicación**: `backend/src/financial/`

#### Controladores

##### `calculator.controller.ts`

**Endpoints principales**:

```typescript
POST   /financial/calculate         // Calcular opciones de financiación
GET    /financial/entities          // Listar entidades disponibles
GET    /financial/guarantees        // Listar garantías disponibles
GET    /financial/limits            // Obtener límites del sistema
```

**Request de cálculo**:
```typescript
{
  "vehiculoPrice": 25000,          // Precio del vehículo
  "vehiculoAge": 24,               // Edad en meses
  "loanAmount": 20000,             // Monto a financiar (opcional)
  "downPayment": 5000,             // Entrada (opcional)
  "preferredTerm": 60,             // Plazo deseado (opcional)
  "preferredRate": 6.99,           // Tasa deseada (opcional)
  "guarantees": ["life-insurance"] // Garantías (opcional)
}
```

**Response**:
```typescript
{
  "success": true,
  "message": "15 opciones de financiación generadas exitosamente",
  "data": [
    {
      "entityName": "Santander Consumer Finance",
      "entityId": "santander-consumer",
      "monthlyPayment": 557.74,
      "totalCost": 33464.40,
      "interestPaid": 3464.40,
      "effectiveRate": 6.85,
      "applicableTerm": 60,
      "appliedRate": 6.99,
      "commissions": [...],
      "guaranteeCosts": [...],
      "metadata": {
        "ranking": 1,
        "recommendationScore": 85,
        "tags": ["tasa-baja", "mejor-opcion"],
        "warnings": []
      }
    },
    // ... más opciones
  ],
  "statusCode": 200,
  "timestamp": "2025-12-18T10:30:00.000Z"
}
```

##### `laravel-calculator.controller.ts`

**Endpoint compatible con Laravel**:

```typescript
POST   /financial/laravel/calculate  // Formato Laravel legacy
POST   /financial/laravel/info        // Info del sistema
```

**Request Laravel**:
```typescript
{
  "registration_date": "2020-05-15",  // Fecha de matriculación
  "loan_rate": 6.99,                  // TIN
  "time_to_repay": 60,                // Plazo en meses
  "loan_principle": 25000,            // Importe a financiar
  "whole_price": 25000,               // Precio total
  "whole_rate": 6.99,                 // Tasa para contado (opcional)
  "guarantee": 500                    // Garantía (opcional)
}
```

**Response Laravel** (sin wrapper `ApiResponse`):
```typescript
{
  "financiado": [
    {
      "bank_name": "Santander Consumer Finance",
      "coef_fee": "557,74",
      "coef_ref": "C002168",
      "loan_term": 60,
      "max_loan_term_display": "135 meses",
      "coef_rate": 6.99
    },
    // ... más bancos
  ],
  "contado": [
    {
      "bank_name": "Santander Consumer Finance",
      "cont_fee": "546,80",
      "cont_ref": "C002125",
      "loan_term": 60,
      "max_loan_term_display": "135 meses",
      "cont_rate": 6.99
    },
    // ... más bancos
  ]
}
```

#### Servicios

##### `calculation-engine.service.ts`

**Motor de cálculo principal** - Pipeline funcional con 9 pasos.

```typescript
@Injectable()
export class CalculationEngineService {
  async calculate(
    input: FinancialCalculationInput, 
    user: User
  ): Promise<FinancialResult[]> {
    // 1️⃣ Validar entrada
    // 2️⃣ Enriquecer con contexto organizacional
    // 3️⃣ Cargar configuración de BD
    // 4️⃣ Determinar opciones aplicables
    // 5️⃣ Calcular todas las combinaciones en paralelo
    // 6️⃣ Aplicar comisiones
    // 7️⃣ Añadir costes de garantías
    // 8️⃣ Calcular TAE
    // 9️⃣ Ordenar y rankear resultados
  }
}
```

**Pipeline funcional**:
```typescript
const results = await this.pipe(
  this.validateInput,
  this.enrichWithContext,
  this.loadOrganizationConfiguration,
  this.determineApplicableOptions,
  this.calculateParallelResults,
  this.applyCommissionsAndFees,
  this.addGuaranteeCosts,
  this.calculateTAE,
  this.sortAndRankResults,
)(input, currentUser);
```

**Método de cálculo**:
- **Amortización francesa**: Cuota constante durante todo el préstamo
- **Fórmula**: `Cuota = Préstamo * (r * (1+r)^n) / ((1+r)^n - 1)`
  - `r` = tasa mensual = `(TIN/100) / 12`
  - `n` = número de meses

##### `laravel-calculator.service.ts`

Servicio compatible con calculadora Laravel original.

**Diferencias con `calculation-engine.service.ts`**:
- Calcula dos tipos: **financiado** (con coeficientes) y **contado** (con rentabilidad)
- Usa formato de response legacy de Laravel
- Consulta directamente a `financial_configuration_details` filtrando por `calculationType`

#### Configuración

##### `financial-rules.config.ts`

**Configuración como código** - Reglas de negocio predefinidas.

```typescript
// 🚗 REGLAS POR EDAD DE VEHÍCULO
export const VEHICULO_AGE_RULES = {
  new: {
    maxAgeMonths: 12,
    maxTermMonths: 96,
    baseRateModifier: 1.0,
    description: 'Vehículo nuevo o seminuevo'
  },
  recent: {
    maxAgeMonths: 36,
    maxTermMonths: 84,
    baseRateModifier: 1.15
  },
  used: {
    maxAgeMonths: 120,
    maxTermMonths: 60,
    baseRateModifier: 1.35
  },
  old: {
    maxAgeMonths: 240,
    maxTermMonths: 48,
    baseRateModifier: 1.6
  }
};

// 🏦 CONFIGURACIONES BASE DE ENTIDADES
export const FINANCIAL_BASE_ENTITIES = {
  'santander-consumer': {
    name: 'Santander Consumer Finance',
    baseRates: [4.99, 5.99, 6.99, 7.99, 8.99],
    termOptions: [12, 24, 36, 48, 60, 72, 84, 96],
    loanLimits: { min: 3000, max: 75000 },
    commissions: {
      opening: { type: 'percentage', value: 2.5, max: 350 },
      study: { type: 'fixed', value: 180 }
    }
  },
  // ... más entidades
};

// 💰 FILTROS DE TASA POR PRECIO
export const VEHICULO_PRICE_FILTERS = {
  premium: { minPrice: 50000, minRate: 4.99 },
  high: { minPrice: 30000, minRate: 5.99 },
  medium: { minPrice: 20000, minRate: 6.99 },
  standard: { minPrice: 10000, minRate: 7.99 },
  basic: { minPrice: 0, minRate: 8.99 }
};

// 🛡️ GARANTÍAS DISPONIBLES
export const GUARANTEE_OPTIONS = {
  'extended-warranty': {
    name: 'Garantía Mecánica Extendida',
    costCalculation: 'percentage',
    costValue: 6.5,
    minLoanAmount: 10000,
    maxVehiculoAge: 60
  },
  'life-insurance': {
    name: 'Seguro de Vida',
    costCalculation: 'percentage',
    costValue: 2.8,
    minLoanAmount: 3000
  }
  // ... más garantías
};

// 🎯 LÍMITES DEL SISTEMA
export const SYSTEM_LIMITS = {
  global: {
    maxLoanAmount: 500000,
    maxTermMonths: 120,
    minLoanAmount: 1000
  },
  interestRates: {
    minRate: 0,
    maxRate: 25,
    defaultRate: 7.99
  }
};
```

#### Entidades TypeORM

**Principales entidades**:

1. **`FinancialEntity`**: Entidades financieras (bancos)
2. **`FinancialInterestRate`**: Catálogo de tasas
3. **`FinancialLoanTerm`**: Catálogo de plazos
4. **`FinancialCampaign`**: Campañas (VN/VO)
5. **`FinancialEntityConfiguration`**: Configuraciones por entidad
6. **`FinancialConfigurationDetail`**: **⚡ Coeficientes y rentabilidades**
7. **`FinancialConfigurationRule`**: Reglas de aplicación
8. **`FinancialAuditTrail`**: Auditoría de cambios
9. **`FinancialCalculationLog`**: Logs de cálculos

**Métodos útiles en `FinancialConfigurationDetail`**:

```typescript
// Verificar si aplica a una operación
isApplicable(loanAmount: number, vehiculoAgeMonths: number): boolean

// Calcular comisión de apertura
calculateOpeningCommission(loanAmount: number): number

// Calcular comisión de estudio
calculateStudyCommission(loanAmount: number): number

// Calcular todas las comisiones
calculateAllCommissions(loanAmount: number): { opening, study, other, total }

// Descripción legible
getDescription(): string // "VN - 6.99% - 60m - coeficiente"
```

### 2. FinancingModule

**Ubicación**: `backend/src/financing/`

#### Controladores

##### `rules.controller.ts`

**Endpoints de gestión de reglas**:

```typescript
GET    /financing/rules              // Listar reglas con filtros
POST   /financing/rules              // Crear regla
GET    /financing/rules/:id          // Ver regla específica
PUT    /financing/rules/:id          // Actualizar regla
DELETE /financing/rules/:id          // Eliminar regla
PATCH  /financing/rules/:id/toggle   // Activar/Desactivar regla
POST   /financing/rules/bulk-upload  // Carga masiva CSV
```

**Filtros disponibles**:
```typescript
{
  "entityId": 1,           // Filtrar por entidad
  "campañaTipo": 1,        // 1=VO, 2=VN, 3=ALL
  "activeOnly": true       // Solo activas
}
```

**Carga masiva CSV**:
```typescript
POST /financing/rules/bulk-upload

Body: {
  "rules": [
    {
      "entity_id": 1,
      "name": "Santander VN 5.99% 60m Coef",
      "campaña_tipo": 1,        // 1=VO, 2=VN
      "calculo_tipo": 0,        // 0=coef, 1=rent, 2=rent SS, 3=coef SS
      "tin": 5.99,
      "plazo": 60,
      "valor": 2.1355,
      "activo": true
    },
    // ... más reglas
  ]
}

Response: {
  "success": true,
  "data": {
    "message": "Reglas procesadas correctamente",
    "created": 10,
    "updated": 5,
    "errors": 0,
    "errorDetails": []
  }
}
```

##### `entities.controller.ts`

**Endpoints de gestión de entidades**:

```typescript
GET    /financing/entities           // Listar entidades
POST   /financing/entities           // Crear entidad
GET    /financing/entities/:id       // Ver entidad
PUT    /financing/entities/:id       // Actualizar entidad
DELETE /financing/entities/:id       // Eliminar entidad
PATCH  /financing/entities/:id/toggle // Activar/Desactivar
```

#### Servicios

##### `rules.service.ts`

Gestiona el CRUD completo de reglas financieras.

**Métodos principales**:
```typescript
async findAll(filters: FinancingRulesFilters): Promise<FinancingRule[]>
async findOne(id: number): Promise<FinancingRule>
async create(dto: CreateFinancingRuleDto): Promise<FinancingRule>
async update(id: number, dto: UpdateFinancingRuleDto): Promise<FinancingRule>
async remove(id: number): Promise<void>
async toggleActive(id: number): Promise<FinancingRule>
async bulkUpload(rules: CsvRule[]): Promise<BulkUploadResponse>
```

**Lógica de carga masiva**:
```typescript
async bulkUpload(rules: CsvRule[]): Promise<BulkUploadResponse> {
  let created = 0, updated = 0, errors = 0;
  const errorDetails = [];

  for (const rule of rules) {
    try {
      // Buscar si ya existe (por entity_id + name + campaña + cálculo + tin + plazo)
      const existing = await this.findExisting(rule);
      
      if (existing) {
        // Actualizar regla existente
        await this.update(existing.id, rule);
        updated++;
      } else {
        // Crear nueva regla
        await this.create(rule);
        created++;
      }
    } catch (error) {
      errors++;
      errorDetails.push({ row: rules.indexOf(rule) + 2, error: error.message });
    }
  }

  return { message, created, updated, errors, errorDetails };
}
```

##### `entities.service.ts`

Gestiona las entidades financieras.

---

## 🎨 Frontend

### Estructura de Páginas

```
frontend/src/
├── app/(auth)/
│   └── financial/
│       ├── page.tsx              # Página calculadora principal
│       └── config/
│           └── page.tsx          # Página de configuración
└── components/
    └── financial/
        ├── CalculatorForm.tsx    # Formulario de cálculo
        ├── FinancialConfigPage.tsx  # Layout configuración
        ├── CsvUploadSection.tsx  # Sección de carga CSV
        └── RulesTable.tsx        # Tabla de reglas
```

### 1. Página Principal de Calculadora

**Archivo**: `frontend/src/app/(auth)/financial/page.tsx`

**Funcionalidad**:
- ✅ Verificación de permisos (`READ_FINANCIAL`, `VIEW_FINANCIAL_DATA`)
- ✅ Botón de configuración para admins
- ✅ Renderiza `<CalculatorForm />`

**Permisos requeridos**:
```typescript
const hasFinancialAccess = 
  user.permissionNames?.includes('READ_FINANCIAL') ||
  user.permissionNames?.includes('VIEW_FINANCIAL_DATA') ||
  user.permissionNames?.includes('ADMIN') ||
  user.permissionNames?.includes('SUPER_ADMIN');
```

### 2. Formulario de Calculadora

**Archivo**: `frontend/src/components/financial/CalculatorForm.tsx`

**Campos del formulario**:
```typescript
{
  vehiculoPrice: number,      // Precio del vehículo
  vehiculoAge: number,        // Edad en meses
  loanAmount: number,         // Monto a financiar
  downPayment: number,        // Entrada
  preferredTerm: number,      // Plazo deseado
  preferredRate: number,      // Tasa deseada
  guarantees: string[]        // IDs de garantías
}
```

**Flujo de cálculo**:
```typescript
const handleCalculate = async () => {
  setLoading(true);
  setError(null);
  
  try {
    const response = await fetch('/api/financial/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(formData)
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || 'Error en el cálculo');
    }
    
    setResults(result.data);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};
```

**Visualización de resultados**:
- Tabla ordenada por mejor opción
- Columnas: Entidad, Cuota mensual, Coste total, Intereses, TAE, Plazo, Tasa
- Badges para destacar mejor opción
- Expansión de detalles (comisiones, garantías)

### 3. Página de Configuración

**Archivo**: `frontend/src/app/(auth)/financial/config/page.tsx`

**Funcionalidad**:
- ✅ Verificación de permisos (`CONFIGURE_ENTITIES` o `SUPER_ADMIN`)
- ✅ Renderiza `<FinancialConfigPage />`

**Permisos requeridos**:
```typescript
const hasConfigAccess = 
  permissions?.permissionNames?.includes('CONFIGURE_ENTITIES') ||
  permissions?.permissionNames?.includes('SUPER_ADMIN');
```

### 4. Sección de Carga CSV

**Archivo**: `frontend/src/components/financial/CsvUploadSection.tsx`

**Características**:
- ✅ Descargar plantilla CSV con headers correctos
- ✅ Subir archivo CSV con preview
- ✅ Validación de formato
- ✅ Vista previa de primeras 10 reglas
- ✅ Envío a `/api/financing/rules/bulk-upload`
- ✅ Mostrar resumen de resultados (creadas/actualizadas/errores)

**Formato CSV**:
```csv
entity_id,name,campaña_tipo,calculo_tipo,tin,plazo,valor,activo
1,Santander VN 5.99% 60m Coef,1,0,5.99,60,2.1355,true
1,Santander VN 5.99% 60m Rent,1,1,5.99,60,6.0,true
```

**Códigos**:
- `campaña_tipo`: `0=VO, 1=VN`
- `calculo_tipo`: `0=coeficiente, 1=rentabilidad, 2=rent sin seguro, 3=coef sin seguro`

**Parseo de CSV**:
```typescript
const parseCSV = (csvText: string): CsvRule[] => {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',');
  
  return lines.slice(1).map((line, idx) => {
    const values = line.split(',');
    return {
      entity_id: parseInt(values[0]),
      name: values[1],
      campaña_tipo: parseInt(values[2]),
      calculo_tipo: parseInt(values[3]),
      tin: parseFloat(values[4]),
      plazo: parseInt(values[5]),
      valor: parseFloat(values[6]),
      activo: values[7].toLowerCase() === 'true'
    };
  });
};
```

### 5. Tabla de Reglas

**Archivo**: `frontend/src/components/financial/RulesTable.tsx`

**Características**:
- ✅ Listado completo de reglas
- ✅ Filtros: Entidad, Tipo campaña, Estado (activo/inactivo)
- ✅ Búsqueda por nombre
- ✅ Ordenamiento por TIN, Plazo, Valor
- ✅ Botones de acción: Activar/Desactivar, Eliminar
- ✅ Paginación automática

**Filtros disponibles**:
```typescript
interface FinancingRulesFilters {
  entityId?: number;
  campañaTipo?: 1 | 2 | 3;  // VO | VN | ALL
  activeOnly?: boolean;
}
```

**Request de listado**:
```typescript
GET /api/financing/rules?entityId=1&campañaTipo=1&activeOnly=true
```

**Acciones**:
```typescript
// Activar/Desactivar
const toggleRule = async (id: number) => {
  await fetch(`/api/financing/rules/${id}/toggle`, {
    method: 'PATCH',
    credentials: 'include'
  });
  await fetchRules(); // Recargar
};

// Eliminar
const deleteRule = async (id: number) => {
  if (!confirm('¿Estás seguro?')) return;
  
  await fetch(`/api/financing/rules/${id}`, {
    method: 'DELETE',
    credentials: 'include'
  });
  await fetchRules(); // Recargar
};
```

---

## 🔄 Flujos de Datos

### Flujo 1: Cálculo de Financiación

```
┌──────────────┐
│   USUARIO    │
│ Introduce    │
│ datos del    │
│ vehículo     │
└──────┬───────┘
       │
       ▼
┌──────────────────────────────┐
│   CalculatorForm (Frontend)  │
│ - Valida formulario          │
│ - POST /api/financial/       │
│        calculate             │
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│      NGINX (Proxy)           │
│ Redirige a backend:3001      │
└──────────┬───────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────────┐
│   CalculatorController (Backend)                    │
│ 1. Valida permisos (JwtAuthGuard + OrganizationGuard) │
│ 2. Valida DTO (class-validator)                     │
│ 3. Ejecuta validateBusinessRules()                  │
│ 4. Llama CalculationEngineService.calculate()      │
└──────────┬───────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────────┐
│   CalculationEngineService (Pipeline)               │
│                                                      │
│ PASO 1: validateInput()                             │
│ → Validar límites del sistema                       │
│ → Calcular categoría de edad                        │
│ → Calcular categoría de precio                      │
│                                                      │
│ PASO 2: enrichWithContext()                         │
│ → Cargar entidades disponibles                      │
│ → Cargar garantías disponibles                      │
│                                                      │
│ PASO 3: loadOrganizationConfiguration()             │
│ → Buscar configuración específica de organización   │
│                                                      │
│ PASO 4: determineApplicableOptions()                │
│ → Filtrar tasas aplicables según precio             │
│ → Filtrar plazos aplicables según edad vehículo     │
│ → Filtrar garantías aplicables                      │
│                                                      │
│ PASO 5: calculateParallelResults()                  │
│ → Generar combinaciones (entidad × tasa × plazo)    │
│ → Calcular cuota mensual por amortización francesa  │
│ → Calcular coste total e intereses                  │
│   ┌─────────────────────────────────────────┐      │
│   │ QUERY A BASE DE DATOS                   │      │
│   │ SELECT * FROM                            │      │
│   │   financial_configuration_details        │      │
│   │ WHERE                                    │      │
│   │   configurationId = :configId AND        │      │
│   │   campaignId = :campaignId AND           │      │
│   │   interestRateId = :rateId AND           │      │
│   │   loanTermId = :termId AND               │      │
│   │   calculationType = 'coeficiente' AND    │      │
│   │   isActive = true                        │      │
│   └─────────────────────────────────────────┘      │
│                                                      │
│ PASO 6: applyCommissionsAndFees()                   │
│ → Calcular comisión de apertura                     │
│ → Calcular comisión de estudio                      │
│ → Aplicar otras comisiones desde BD                 │
│                                                      │
│ PASO 7: addGuaranteeCosts()                         │
│ → Calcular costes de garantías seleccionadas        │
│                                                      │
│ PASO 8: calculateTAE()                              │
│ → Calcular TAE incluyendo comisiones                │
│                                                      │
│ PASO 9: sortAndRankResults()                        │
│ → Ordenar por cuota mensual (ascendente)            │
│ → Asignar ranking                                   │
│ → Calcular recommendation score                     │
│ → Generar tags y warnings                           │
└──────────┬───────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────────┐
│   Guardar en financial_calculation_logs             │
│ - Input completo                                     │
│ - Resultados generados                               │
│ - Tiempo de procesamiento                            │
│ - Metadatos (user, org, session)                    │
└──────────┬───────────────────────────────────────────┘
           │
           ▼
┌──────────────────────────────┐
│   Return ApiResponse         │
│ {                            │
│   success: true,             │
│   data: FinancialResult[],   │
│   message: "...",            │
│   statusCode: 200            │
│ }                            │
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│   CalculatorForm (Frontend)  │
│ - Muestra resultados         │
│ - Ordena por ranking         │
│ - Destaca mejor opción       │
└──────────────────────────────┘
```

### Flujo 2: Carga Masiva de Reglas CSV

```
┌──────────────┐
│   ADMIN      │
│ Descarga     │
│ plantilla    │
│ CSV          │
└──────┬───────┘
       │
       ▼
┌──────────────────────────────┐
│ CsvUploadSection (Frontend)  │
│ downloadTemplate()           │
│ → Genera CSV con headers     │
└──────────────────────────────┘
       │
       ▼
┌──────────────┐
│   ADMIN      │
│ Edita CSV    │
│ con reglas   │
└──────┬───────┘
       │
       ▼
┌──────────────────────────────┐
│ CsvUploadSection (Frontend)  │
│ 1. Selecciona archivo        │
│ 2. parseCSV()                │
│ 3. Muestra preview (10)      │
│ 4. Usuario confirma          │
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│ CsvUploadSection (Frontend)  │
│ handleUpload()               │
│ POST /api/financing/rules/   │
│      bulk-upload             │
│ Body: { rules: CsvRule[] }   │
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│      NGINX (Proxy)           │
│ Redirige a backend:3001      │
└──────────┬───────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────────┐
│   RulesController (Backend)                         │
│ POST /financing/rules/bulk-upload                   │
│ 1. Valida permisos (CONFIGURE_ENTITIES)             │
│ 2. Valida DTO                                        │
│ 3. Llama RulesService.bulkUpload()                  │
└──────────┬───────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────────┐
│   RulesService.bulkUpload()                         │
│                                                      │
│ FOR EACH rule IN rules:                             │
│   1. Buscar entidad (financial_entities)            │
│   2. Buscar tasa (financial_interest_rates)         │
│   3. Buscar plazo (financial_loan_terms)            │
│   4. Buscar campaña (financial_campaigns)           │
│   5. Buscar configuración (entity_configurations)   │
│                                                      │
│   6. Buscar si regla ya existe:                     │
│      WHERE configurationId = X AND                  │
│            campaignId = Y AND                       │
│            interestRateId = Z AND                   │
│            loanTermId = W AND                       │
│            calculationType = 'coeficiente'          │
│                                                      │
│   7. Si existe → UPDATE                             │
│      Si no existe → INSERT                          │
│                                                      │
│   8. CATCH errores → agregar a errorDetails[]       │
│                                                      │
│ RETURN {                                            │
│   created: N,                                       │
│   updated: M,                                       │
│   errors: E,                                        │
│   errorDetails: [...]                               │
│ }                                                    │
└──────────┬───────────────────────────────────────────┘
           │
           ▼
┌──────────────────────────────┐
│   Guardar en                 │
│   financial_audit_trails     │
│ (Registro de cambios)        │
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│   Return BulkUploadResponse  │
│ {                            │
│   message: "...",            │
│   created: 10,               │
│   updated: 5,                │
│   errors: 0                  │
│ }                            │
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│ CsvUploadSection (Frontend)  │
│ - Muestra resumen            │
│ - Limpiar formulario         │
│ - Recargar tabla             │
└──────────────────────────────┘
```

### Flujo 3: Consulta y Filtrado de Reglas

```
┌──────────────┐
│   ADMIN      │
│ Filtra por   │
│ entidad,     │
│ campaña,     │
│ estado       │
└──────┬───────┘
       │
       ▼
┌──────────────────────────────┐
│   RulesTable (Frontend)      │
│ fetchRules()                 │
│ GET /api/financing/rules?    │
│     entityId=1&              │
│     campañaTipo=1&           │
│     activeOnly=true          │
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│   RulesController (Backend)  │
│ GET /financing/rules         │
│ Query params → Filters       │
└──────────┬───────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────────┐
│   RulesService.findAll(filters)                     │
│                                                      │
│ SELECT                                              │
│   fcd.*,                                            │
│   fe.name as entityName,                            │
│   fc.name as campaignName,                          │
│   fir.value as tin,                                 │
│   flt.durationMonths as plazo                       │
│ FROM financial_configuration_details fcd            │
│ JOIN financial_entity_configurations fec            │
│   ON fcd.configurationId = fec.id                   │
│ JOIN financial_entities fe                          │
│   ON fec.entityId = fe.id                           │
│ JOIN financial_campaigns fc                         │
│   ON fcd.campaignId = fc.id                         │
│ JOIN financial_interest_rates fir                   │
│   ON fcd.interestRateId = fir.id                    │
│ JOIN financial_loan_terms flt                       │
│   ON fcd.loanTermId = flt.id                        │
│ WHERE                                               │
│   fec.entityId = :entityId AND                      │
│   fcd.campaignId = :campañaTipo AND                 │
│   fcd.isActive = :activeOnly                        │
│ ORDER BY fcd.id DESC                                │
└──────────┬───────────────────────────────────────────┘
           │
           ▼
┌──────────────────────────────┐
│   Return FinancingRule[]     │
│ [                            │
│   {                          │
│     id: 1,                   │
│     entityId: 1,             │
│     name: "...",             │
│     tin: 5.99,               │
│     plazo: 60,               │
│     valor: 2.1355,           │
│     activo: true             │
│   },                         │
│   ...                        │
│ ]                            │
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│   RulesTable (Frontend)      │
│ - Renderiza tabla            │
│ - Aplica filtros adicionales │
│ - Permite ordenamiento       │
│ - Botones de acción          │
└──────────────────────────────┘
```

---

## ⚙️ Configuración y Gestión

### Acceso a Configuración

**URL**: `/financial/config`

**Permisos requeridos**:
- `CONFIGURE_ENTITIES`
- `SUPER_ADMIN`

### Componentes de Configuración

#### 1. CsvUploadSection

**Funciones principales**:
- ✅ Descargar plantilla CSV con formato correcto
- ✅ Subir archivo CSV
- ✅ Preview de datos antes de subir
- ✅ Validación de formato
- ✅ Envío masivo al backend

**Formato de plantilla CSV**:
```csv
entity_id,name,campaña_tipo,calculo_tipo,tin,plazo,valor,activo
1,Santander VN 5.99% 60m Coef,1,0,5.99,60,2.1355,true
```

**Ejemplo de datos**:
- `entity_id`: ID de la entidad financiera (1-7)
- `name`: Nombre descriptivo de la regla
- `campaña_tipo`: 0=VO (Vehículo Ocasión), 1=VN (Vehículo Nuevo)
- `calculo_tipo`: 0=coeficiente, 1=rentabilidad, 2=rent sin seguro, 3=coef sin seguro
- `tin`: Tasa de interés nominal (5.99, 6.99, etc.)
- `plazo`: Plazo en meses (24, 36, 48, 60, 72, 84, 96, 108, 120)
- `valor`: Valor del coeficiente o rentabilidad (2.1355, 6.0, etc.)
- `activo`: true/false

#### 2. RulesTable

**Funciones principales**:
- ✅ Listar todas las reglas financieras
- ✅ Filtrar por entidad, campaña, estado
- ✅ Buscar por nombre
- ✅ Ordenar por TIN, plazo, valor
- ✅ Activar/Desactivar reglas
- ✅ Eliminar reglas

**Columnas de la tabla**:
| Columna       | Descripción                              |
|---------------|------------------------------------------|
| ID            | ID interno de la regla                   |
| Entidad       | Nombre de la entidad financiera          |
| Nombre        | Nombre descriptivo                       |
| Campaña       | VO / VN / ALL                            |
| Cálculo       | COEFICIENTE / RENTABILIDAD / ...         |
| TIN           | Tasa de interés nominal                  |
| Plazo         | Plazo en meses                           |
| Valor         | Valor del coeficiente/rentabilidad       |
| Estado        | Activa / Inactiva                        |
| Acciones      | Activar/Desactivar, Eliminar             |

### Gestión de Entidades

**Entidades precargadas**:
1. Santander Consumer Finance
2. BBVA Consumer Finance
3. CaixaBank Consumer Finance
4. Cetelem BNP Paribas
5. Lendrock Finance
6. Sofinco
7. Confia Finance

**CRUD de entidades**: Disponible en `/api/financing/entities`

---

## 📁 Archivos del Proyecto

### Backend

#### Módulo Financial

| Archivo | Ruta | Descripción |
|---------|------|-------------|
| **Module** | `backend/src/financial/financial.module.ts` | Módulo principal NestJS con imports de entidades y servicios |
| **Controllers** | | |
| Calculator Controller | `backend/src/financial/controllers/calculator.controller.ts` | Endpoint principal `/financial/calculate` |
| Laravel Calculator | `backend/src/financial/controllers/laravel-calculator.controller.ts` | Endpoint compatible Laravel `/financial/laravel/calculate` |
| **Services** | | |
| Calculation Engine | `backend/src/financial/services/calculation-engine.service.ts` | Motor de cálculo con pipeline funcional (9 pasos) |
| Laravel Calculator | `backend/src/financial/services/laravel-calculator.service.ts` | Servicio compatible con formato Laravel |
| **Config** | | |
| Financial Rules | `backend/src/financial/config/financial-rules.config.ts` | Configuración como código (reglas de negocio, límites, garantías) |
| **Types** | | |
| Calculation Types | `backend/src/financial/types/calculation.types.ts` | Interfaces TypeScript para cálculos |
| Laravel Compatible | `backend/src/financial/types/laravel-compatible.types.ts` | Interfaces compatibles con Laravel |
| Import Types | `backend/src/financial/types/import.types.ts` | Tipos para importación CSV |

#### Módulo Financing (Sistema V2)

| Archivo | Ruta | Descripción |
|---------|------|-------------|
| **Controllers** | | |
| Rules Controller | `backend/src/financing/controllers/rules.controller.ts` | CRUD de reglas financieras + bulk upload |
| Entities Controller | `backend/src/financing/controllers/entities.controller.ts` | CRUD de entidades financieras |
| **Services** | | |
| Rules Service | `backend/src/financing/services/rules.service.ts` | Lógica de negocio para reglas |
| Entities Service | `backend/src/financing/services/entities.service.ts` | Lógica de negocio para entidades |

#### Entidades TypeORM

| Archivo | Ruta | Descripción |
|---------|------|-------------|
| Financial Entity | `backend/src/database/entities/financial-entity.entity.ts` | Entidades financieras (bancos) |
| Entity Configuration | `backend/src/database/entities/financial-entity-configuration.entity.ts` | Configuraciones por entidad (versionado) |
| Configuration Detail | `backend/src/database/entities/financial-configuration-detail.entity.ts` | ⚡ **Coeficientes y rentabilidades** |
| Configuration Rule | `backend/src/database/entities/financial-configuration-rule.entity.ts` | Reglas de aplicación |
| Interest Rate | `backend/src/database/entities/financial-interest-rate.entity.ts` | Catálogo de tasas de interés |
| Loan Term | `backend/src/database/entities/financial-loan-term.entity.ts` | Catálogo de plazos |
| Campaign | `backend/src/database/entities/financial-campaign.entity.ts` | Campañas (VN/VO) |
| Audit Trail | `backend/src/database/entities/financial-audit-trail.entity.ts` | Auditoría de cambios |
| Calculation Log | `backend/src/database/entities/financial-calculation-log.entity.ts` | Logs de cálculos |
| Org Configuration | `backend/src/database/entities/financial-organization-configuration.entity.ts` | Configuración por organización |
| Global Configuration | `backend/src/database/entities/financial-global-configuration.entity.ts` | Configuración global |

#### Migraciones

| Archivo | Ruta | Descripción |
|---------|------|-------------|
| Create Tables | `backend/src/database/migrations/1759200000000-CreateFinancialV2Tables.ts` | Crea 8 tablas del sistema V2 |
| Insert Data | `backend/src/database/migrations/1759300000000-InsertRealLaravelIndexesData.ts` | Inserta 1109 registros precargados |

### Frontend

| Archivo | Ruta | Descripción |
|---------|------|-------------|
| **Páginas** | | |
| Financial Page | `frontend/src/app/(auth)/financial/page.tsx` | Página principal de calculadora |
| Config Page | `frontend/src/app/(auth)/financial/config/page.tsx` | Página de configuración (solo admins) |
| **Componentes** | | |
| Calculator Form | `frontend/src/components/financial/CalculatorForm.tsx` | Formulario de cálculo de financiación |
| Config Page Layout | `frontend/src/components/financial/FinancialConfigPage.tsx` | Layout de página de configuración |
| CSV Upload Section | `frontend/src/components/financial/CsvUploadSection.tsx` | Sección de carga masiva CSV |
| Rules Table | `frontend/src/components/financial/RulesTable.tsx` | Tabla de reglas con filtros y acciones |
| **Types** | | |
| API Types | `frontend/src/types/api/financing-rules.d.ts` | Interfaces TypeScript para API |

### Configuración

| Archivo | Ruta | Descripción |
|---------|------|-------------|
| Nginx Config | `nginx-genesis-dev-fixed.conf` | Configuración Nginx con routing `/api/` |
| Docker Compose | `docker-compose.yml` | Configuración de servicios (backend, frontend, nginx, postgres) |

---

## 🔑 Conceptos Clave

### Coeficiente vs Rentabilidad

**Coeficiente**:
- Usado para calcular cuota **financiada** (con entrada)
- Multiplicador aplicado al monto a financiar
- Fórmula: `Cuota = Monto × Coeficiente / 1000`
- Ejemplo: Coeficiente 2.1355 para 30000€ → Cuota = 30000 × 2.1355 / 1000 = 64.065€

**Rentabilidad**:
- Usado para calcular cuota **al contado** (sin entrada)
- Porcentaje de beneficio sobre el precio total
- Fórmula: `Cuota = (Precio × (1 + Rentabilidad/100)) / Plazo`
- Ejemplo: Rentabilidad 6% para 30000€ a 60m → Cuota = (30000 × 1.06) / 60 = 530€

### Campañas VN vs VO

**VN (Vehículo Nuevo)**:
- Edad: 0-12 meses desde matriculación
- Mejores tasas de interés
- Plazos más largos disponibles (hasta 120 meses)
- Mejores condiciones de financiación

**VO (Vehículo Ocasión)**:
- Edad: 13+ meses desde matriculación
- Tasas ligeramente superiores
- Plazos limitados según edad
- Modificadores de tasa aplicados

### Multi-Tenancy

**Segregación por organización**:
- Cada cálculo se registra con `organizationId`
- Configuraciones específicas por organización
- Entidades financieras globales o específicas
- Logs segregados por organización

### TAE (Tasa Anual Equivalente)

**Incluye**:
- ✅ Tasa de interés nominal (TIN)
- ✅ Comisión de apertura
- ✅ Comisión de estudio
- ✅ Otras comisiones

**NO incluye**:
- ❌ Garantías opcionales (vida, mecánica, etc.)
- ❌ Seguros adicionales

---

## 🚀 Casos de Uso

### Caso 1: Usuario Calcula Financiación

**Escenario**: Usuario quiere financiar un coche usado de 25000€ con entrada de 5000€ a 60 meses.

**Pasos**:
1. Accede a `/financial`
2. Introduce:
   - Precio: 25000€
   - Edad: 36 meses (VO)
   - Entrada: 5000€
   - Plazo: 60 meses
3. Click en "Calcular"
4. Sistema muestra 15+ opciones ordenadas por cuota mensual
5. Usuario ve detalles de cada opción (comisiones, TAE, total)
6. Usuario puede seleccionar garantías opcionales

### Caso 2: Admin Carga Nuevas Reglas CSV

**Escenario**: Admin recibe nuevo archivo CSV con reglas actualizadas de BBVA.

**Pasos**:
1. Accede a `/financial/config`
2. Descarga plantilla CSV
3. Edita CSV con nuevas reglas BBVA
4. Sube archivo CSV
5. Sistema muestra preview de 10 primeras reglas
6. Admin confirma carga
7. Sistema procesa: 20 creadas, 5 actualizadas, 0 errores
8. Admin ve reglas actualizadas en tabla

### Caso 3: SuperAdmin Gestiona Reglas Globales

**Escenario**: SuperAdmin necesita desactivar temporalmente todas las reglas de Cetelem.

**Pasos**:
1. Accede a `/financial/config`
2. Filtra por "Entidad: Cetelem"
3. Ve 50 reglas activas
4. Selecciona todas y hace clic en "Desactivar"
5. Sistema actualiza `isActive = false` en todas
6. Calculadora ya no muestra opciones de Cetelem

---

## 📊 Estadísticas del Sistema

**Base de datos**:
- 8 tablas principales
- 1109 registros precargados
- 7 entidades financieras
- 11 tasas de interés (4.99% - 11.99%)
- 9 plazos (24m - 120m)
- 2 campañas (VN, VO)

**Backend**:
- 2 módulos principales
- 4 controladores
- 4 servicios principales
- 11 entidades TypeORM
- Pipeline de 9 pasos

**Frontend**:
- 2 páginas
- 4 componentes principales
- 100% TypeScript
- Validación completa de formularios

---

## 🎓 Conclusión

El **Sistema de Calculadora Financiera** de Genesis Dynamics es una solución completa y robusta para:

✅ **Calcular opciones de financiación** de vehículos en tiempo real  
✅ **Gestionar reglas financieras** de forma dinámica  
✅ **Mantener compatibilidad** con sistema Laravel anterior  
✅ **Segregar datos** por organización (multi-tenant)  
✅ **Auditar** todos los cálculos realizados  
✅ **Escalar** fácilmente a nuevas entidades y configuraciones  

El sistema está **completamente funcional** y listo para producción, con arquitectura moderna, pipeline optimizado y gestión administrativa completa.

---

**Generado por**: Genesis Dynamics Documentation System  
**Fecha**: 18 de Diciembre de 2025  
**Versión**: 1.0.0

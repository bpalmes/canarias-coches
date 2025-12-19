'use client';

import { ConfigUpload } from './ConfigUpload';
import { ConfigurationList } from './ConfigurationList';

export function ConfigurationManager() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Configuración de Calculadora Financiera</h2>
                <p className="text-gray-500">Gestiona las reglas financieras del sistema mediante carga masiva CSV o edición individual</p>
            </div>

            <ConfigUpload />
            <ConfigurationList />
        </div>
    );
}

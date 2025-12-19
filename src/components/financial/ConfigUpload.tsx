'use client';

import { useState, useTransition } from 'react';
import { Button } from "@/components/ui/button";
import { UploadCloud, CheckCircle, AlertCircle } from 'lucide-react';
import { uploadFinancialConfiguration } from '@/actions/financial-admin';
import { useRouter } from 'next/navigation';

export function ConfigUpload() {
    const [isPending, startTransition] = useTransition();
    const [result, setResult] = useState<any>(null);
    const router = useRouter();

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file);

        startTransition(async () => {
            const res = await uploadFinancialConfiguration(formData);
            setResult(res);
            if (res.success) {
                // Refresh current route to update tables if needed, though state is local in table
                // Ideally trigger a context refresh or similar, but simplified here:
                window.location.reload();
            }
        });
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-900">Carga Masiva de Reglas</h2>
                <Button variant="outline" size="sm" className="text-indigo-600 border-indigo-200">
                    Descargar Plantilla CSV
                </Button>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-md p-8 text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative">
                <input
                    type="file"
                    accept=".csv"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleUpload}
                    disabled={isPending}
                />
                <div className="flex flex-col items-center justify-center space-y-3">
                    {isPending ? (
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
                    ) : (
                        <UploadCloud className="h-10 w-10 text-gray-400" />
                    )}
                    <div className="text-sm text-gray-600">
                        <span className="font-semibold text-indigo-600">Seleccionar archivo CSV</span> o arrastrar aquí
                    </div>
                    <p className="text-xs text-gray-500">
                        Formato: entity_id, name, campaña_tipo, calculo_tipo, tin, plazo, valor, activo
                    </p>
                </div>
            </div>

            {result && (
                <div className={`mt-4 p-4 rounded-md flex items-start gap-3 ${result.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                    {result.success ? <CheckCircle className="h-5 w-5 mt-0.5" /> : <AlertCircle className="h-5 w-5 mt-0.5" />}
                    <div>
                        <p className="font-medium">{result.message}</p>
                        {result.stats && (
                            <p className="text-sm mt-1">
                                Total: {result.stats.total} | Creados: {result.stats.created} | Actualizados: {result.stats.updated} | Errores: {result.stats.errors}
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

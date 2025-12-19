import { useState, useEffect, useTransition } from 'react';
import { getFinancialConfigurations, getAllFinancialEntities, FinancialConfigRow, resetFinancialSystem } from '@/actions/financial-admin';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Loader2, Trash2, ArrowUpDown, ArrowUp, ArrowDown, RefreshCcw } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

export function ConfigurationList() {
    const [data, setData] = useState<FinancialConfigRow[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();

    // Filters
    const [page, setPage] = useState(1);
    const [entityId, setEntityId] = useState<string>("all");
    const [campaign, setCampaign] = useState<string>("all");
    const [entities, setEntities] = useState<{ id: number, name: string }[]>([]);

    // Sorting
    const [sortField, setSortField] = useState<string>('id');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    useEffect(() => {
        // Load entities for filter
        getAllFinancialEntities().then(setEntities);
    }, []);

    const fetchData = () => {
        setLoading(true);
        startTransition(async () => {
            try {
                const eid = entityId !== "all" ? parseInt(entityId) : undefined;
                const c = campaign !== "all" ? campaign : undefined;
                // Pass sort params
                const res = await getFinancialConfigurations(eid, c, page, 20, sortField, sortOrder);
                setData(res.data);
                setTotal(res.total);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        });
    };

    const handleReset = () => {
        if (!confirm("⚠️ ¿RESET SYSTEM? ⚠️\n\nEsto borrará TODAS las reglas y RESTAURARÁ las entidades a las 7 del CSV únicamente.\n\nEsta acción es DESTRUCTIVA e irreversble.")) return;

        startTransition(async () => {
            try {
                const res = await resetFinancialSystem();
                if (res.success) {
                    toast({ title: "Sistema Reseteado", description: res.message });
                    // Refresh everything
                    getAllFinancialEntities().then(setEntities);
                    setPage(1);
                    fetchData();
                } else {
                    toast({ variant: "destructive", title: "Error", description: res.message });
                }
            } catch (err) {
                toast({ variant: "destructive", title: "Error", description: "Fallo crítico al resetear." });
            }
        });
    };

    const handleSort = (field: string) => {
        if (sortField === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('asc'); // Default to asc for new field
        }
    };

    const renderSortIcon = (field: string) => {
        if (sortField !== field) return <ArrowUpDown className="h-4 w-4 ml-1 text-gray-400 inline" />;
        return sortOrder === 'asc' ? <ArrowUp className="h-4 w-4 ml-1 text-blue-500 inline" /> : <ArrowDown className="h-4 w-4 ml-1 text-blue-500 inline" />;
    };

    const SortableHeader = ({ field, label }: { field: string, label: string }) => (
        <th
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
            onClick={() => handleSort(field)}
        >
            <div className="flex items-center">
                {label}
                {renderSortIcon(field)}
            </div>
        </th>
    );

    useEffect(() => {
        fetchData();
    }, [page, entityId, campaign, sortField, sortOrder]);

    return (
        <div className="bg-white rounded-lg shadow-sm border p-6 mt-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-900">Reglas Financieras <span className="text-sm font-normal text-gray-500">({total})</span></h2>
                <div className="flex gap-2">
                    <Button variant="destructive" size="sm" onClick={handleReset} disabled={isPending}>
                        <RefreshCcw className="h-4 w-4 mr-2" />
                        Reset Sistema (Borrar Todo)
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Buscar</label>
                    <Input placeholder="Nombre o entidad..." disabled />
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Entidad</label>
                    <Select value={entityId} onValueChange={(val) => { setEntityId(val); setPage(1); }}>
                        <SelectTrigger><SelectValue placeholder="Todas" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todas</SelectItem>
                            {entities.map(e => (
                                <SelectItem key={e.id} value={e.id.toString()}>{e.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Tipo Campaña</label>
                    <Select value={campaign} onValueChange={(val) => { setCampaign(val); setPage(1); }}>
                        <SelectTrigger><SelectValue placeholder="Todas" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todas</SelectItem>
                            <SelectItem value="vn">VN (Nuevos)</SelectItem>
                            <SelectItem value="vo">VO (Ocasión)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <SortableHeader field="id" label="ID" />
                            <SortableHeader field="entity" label="Entidad" />
                            <SortableHeader field="campaign" label="Campaña" />
                            <SortableHeader field="type" label="Cálculo" />
                            <SortableHeader field="rate" label="TIN" />
                            <SortableHeader field="term" label="Plazo" />
                            <SortableHeader field="value" label="Valor" />
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                            <tr>
                                <td colSpan={8} className="px-6 py-12 text-center">
                                    <div className="flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-indigo-600" /></div>
                                </td>
                            </tr>
                        ) : data.length === 0 ? (
                            <tr><td colSpan={8} className="px-6 py-4 text-center text-gray-500">No hay reglas configuradas.</td></tr>
                        ) : (
                            data.map((row) => (
                                <tr key={row.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.entityName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <Badge variant="outline" className={row.campaign === 'VN' ? 'bg-blue-50 text-blue-700' : 'bg-orange-50 text-orange-700'}>
                                            {row.campaign}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <Badge variant="secondary">{row.type}</Badge>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.rate}%</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.term} meses</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{row.value.toFixed(5)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">Activa</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Simplest Pagination */}
            <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
                <div>Total: {total}</div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Anterior</Button>
                    <Button variant="outline" size="sm" onClick={() => setPage(p => p + 1)} disabled={data.length < 20}>Siguiente</Button>
                </div>
            </div>
        </div>
    );
}

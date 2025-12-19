'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FinancialCalculator } from "./FinancialCalculator";
import { ConfigurationManager } from "./ConfigurationManager";

interface CalculatorTabsProps {
    interestRates: { id: number, name: string, value: number }[]
    loanTerms: { id: number, name: string, months: number }[]
}

export function CalculatorTabs({ interestRates, loanTerms }: CalculatorTabsProps) {
    return (
        <Tabs defaultValue="simulator" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 h-12">
                <TabsTrigger value="simulator" className="text-md">Simulador</TabsTrigger>
                <TabsTrigger value="configuration" className="text-md">Configuración</TabsTrigger>
            </TabsList>
            <TabsContent value="simulator">
                <FinancialCalculator interestRates={interestRates} loanTerms={loanTerms} />
            </TabsContent>
            <TabsContent value="configuration">
                <ConfigurationManager />
            </TabsContent>
        </Tabs>
    );
}

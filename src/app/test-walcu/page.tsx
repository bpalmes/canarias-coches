import WalcuTestComponent from '@/components/WalcuTestComponent';

export default function TestWalcuPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          🧪 Página de Prueba - Integración Walcu CRM
        </h1>
        <WalcuTestComponent />
      </div>
    </div>
  );
}

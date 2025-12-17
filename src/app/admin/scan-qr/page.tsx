"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QrCode } from "lucide-react";

export default function ScanQrPage() {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">ESCANEAR QR</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            Acepte los permisos de ubicación y cámara para proceder a registrar la ubicación del vehículo.
          </p>
          <div className="flex justify-center py-8">
            <QrCode className="h-24 w-24 text-gray-300" />
          </div>
          <Button>
            Empezar escaneo
          </Button>
        </CardContent>
      </Card>
    </div>
  );
} 
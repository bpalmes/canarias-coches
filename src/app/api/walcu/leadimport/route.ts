import { NextRequest, NextResponse } from "next/server";
import { WalcuCRMService } from "@/services/walcu-crm";

export async function POST(request: NextRequest) {
  try {
    console.log("🚀 API Route: POST /api/walcu/leadimport iniciado");
    console.log("📅 Timestamp:", new Date().toISOString());

    const body = await request.json();
    console.log("📥 Body completo recibido:", JSON.stringify(body, null, 2));
    
    const { firstName, lastName, email, phone, message, car } = body;
    
    // Validar datos recibidos
    console.log("🔍 Validando datos recibidos:");
    console.log("  - firstName:", firstName);
    console.log("  - lastName:", lastName);
    console.log("  - email:", email);
    console.log("  - phone:", phone);
    console.log("  - message:", message);
    console.log("  - car:", JSON.stringify(car, null, 2));
    
    const walcuService = new WalcuCRMService();
    console.log("🔧 WalcuCRMService instanciado correctamente");
    
    // Crear payload según el formato oficial de Walcu (JSONLead)
    const leadPayload = {
      payload: {
        client: {
          foreign_id: `@${Date.now()}`,
          first_name: firstName,
          last_name: lastName,
          email: email,
          phone: phone || undefined
        },
        sales_lead: {
          foreign_id: `lead_${Date.now()}`,
          inquiry: message,
          source: body.source || 'Web Ofertas Marketing',
          medium: body.medium || 'https://ofertas.miguelleon.es/',
          campaign: body.campaign || 'car_interest',
          car: {
            make: car.make,
            model: car.model,
            year: car.year,
            license_plate: car.license_plate,
            stock_number: car.stock_number
          }
        },
        version: "1.0.0"
      }
    };
    
    console.log("📤 Payload que se enviará a Walcu CRM:");
    console.log(JSON.stringify(leadPayload, null, 2));
    
    console.log("🌐 Llamando a Walcu CRM endpoint: /leadimporttasks");
    const response = await walcuService.api.post("/leadimporttasks", leadPayload);
    
    console.log("✅ Respuesta exitosa de Walcu CRM:");
    console.log("  - Status:", response.status);
    console.log("  - Data:", JSON.stringify(response.data, null, 2));
    
    return NextResponse.json({
      success: true,
      message: "Lead creado exitosamente en Walcu CRM usando endpoint oficial",
      leadId: response.data._id,
      data: response.data
    });
    
  } catch (error) {
    console.error("❌ Error creando lead:", error);
    console.error("❌ Error stack:", error instanceof Error ? error.stack : 'No stack available');
    
    let errorMessage = "Error desconocido";
    let statusCode = 500;
    
    if (error instanceof Error) {
      errorMessage = error.message;
      console.error("❌ Error message:", error.message);

      if (error.message.includes("401")) {
        statusCode = 401;
        errorMessage = "Error de autenticación con Walcu CRM";
        console.error("🔐 Error 401: Problema de autenticación");
      } else if (error.message.includes("422")) {
        statusCode = 422;
        errorMessage = "Error de validación en Walcu CRM";
        console.error("📝 Error 422: Problema de validación");
      } else if (error.message.includes("500")) {
        statusCode = 500;
        errorMessage = "Error interno del servidor Walcu CRM";
        console.error("💥 Error 500: Error interno del servidor");
      } else if (error.message.includes("404")) {
        statusCode = 404;
        errorMessage = "Endpoint /leadimporttasks no encontrado en Walcu CRM";
        console.error("🔍 Error 404: Endpoint no encontrado");
      }
    }

    console.error("📤 Enviando respuesta de error al cliente:", { statusCode, errorMessage });

    return NextResponse.json({
      success: false,
      error: errorMessage,
      details: error instanceof Error ? error.message : "Error desconocido"
    }, { status: statusCode });
  }
}

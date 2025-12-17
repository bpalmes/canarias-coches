import { NextRequest, NextResponse } from "next/server";
import { WalcuCRMService } from "@/services/walcu-crm";

export async function GET(request: NextRequest) {
  try {
    console.log("🚀 API Route: GET /api/walcu/cars iniciado");
    
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit") || "50";
    const search = searchParams.get("search") || "";
    
    console.log("🔍 Parámetros de búsqueda:", { limit, search });
    
    // Crear instancia del servicio
    const walcuService = new WalcuCRMService();
    
    // Hacer la petición a Walcu CRM
    const response = await walcuService.api.get("/cars", {
      params: {
        limit: parseInt(limit),
        ...(search && { search })
      }
    });
    
    console.log("✅ Respuesta de Walcu CRM recibida");
    console.log("📊 Número de coches encontrados:", response.data?.length || 0);
    
    // Log del primer coche para ver la estructura
    if (response.data && response.data.length > 0) {
      console.log("🚗 Ejemplo de coche de Walcu CRM:", {
        _id: response.data[0]._id,
        make: response.data[0].make,
        model: response.data[0].model,
        year: response.data[0].year,
        stock_number: response.data[0].stock_number,
        license_plate: response.data[0].license_plate,
        price: response.data[0].prices?.retail?.current_price?.price
      });
    }
    
    return NextResponse.json({
      success: true,
      cars: response.data || [],
      total: response.data?.length || 0,
      message: `Se encontraron ${response.data?.length || 0} coches en Walcu CRM`
    });
    
  } catch (error) {
    console.error("💥 Error en GET /api/walcu/cars:", error);
    
    let errorMessage = "Error desconocido";
    let statusCode = 500;
    
    if (error instanceof Error) {
      errorMessage = error.message;
      
      if (error.message.includes("401")) {
        statusCode = 401;
        errorMessage = "Error de autenticación con Walcu CRM";
      } else if (error.message.includes("404")) {
        statusCode = 404;
        errorMessage = "Endpoint de coches no encontrado en Walcu CRM";
      }
    }
    
    return NextResponse.json({
      success: false,
      error: errorMessage,
      message: "Error obteniendo coches de Walcu CRM"
    }, { status: statusCode });
  }
}
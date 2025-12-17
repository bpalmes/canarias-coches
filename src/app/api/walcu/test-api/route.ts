import { NextRequest, NextResponse } from "next/server";
import { WalcuCRMService } from "@/services/walcu-crm";
import { WalcuCar } from "@/types/walcu-crm";

export async function POST(request: NextRequest) {
  try {
    console.log("🧪 API Route: POST /api/walcu/test-api iniciado");
    
         const { testType, licensePlate } = await request.json();
    const walcuService = new WalcuCRMService();
    
    console.log("🔍 Tipo de test:", testType);
    
    switch (testType) {
             case "search_by_license":
         // Test 1: Buscar coche por matrícula
         console.log("🔍 Test 1: Buscando coche por matrícula:", licensePlate);
         const searchResponse1 = await walcuService.api.get("/cars", {
           params: { search: licensePlate, limit: 10 }
         });
         
         console.log("📊 Resultado de búsqueda:", {
           total: searchResponse1.data?.length || 0,
           cars: searchResponse1.data?.map((car: WalcuCar) => ({
             _id: car._id,
             make: car.make,
             model: car.model,
             license_plate: car.license_plate
           }))
         });
         
         return NextResponse.json({
           success: true,
           testType: "search_by_license",
           result: {
             total: searchResponse1.data?.length || 0,
             cars: searchResponse1.data || []
           }
         });
         
       case "test_matching_real":
         // Test 2: Probar matching real con coches existentes
         console.log("🔍 Test 2: Probando matching real con coches existentes");
         
         // Buscar coches por matrícula real
         const searchResponse2 = await walcuService.api.get("/cars", {
           params: { limit: 20 }
         });
        
                 if (!searchResponse2.data || searchResponse2.data.length === 0) {
           return NextResponse.json({
             success: false,
             testType: "test_matching_real",
             error: "No se encontraron coches en Walcu CRM"
           });
         }
         
         // Tomar el primer coche que tenga matrícula
         const carWithLicense = searchResponse2.data.find((car: WalcuCar) => car.license_plate);
        
        if (!carWithLicense) {
          return NextResponse.json({
            success: false,
            testType: "test_matching_real",
            error: "No se encontraron coches con matrícula en Walcu CRM"
          });
        }
        
        console.log("🚗 Coche encontrado para test:", {
          _id: carWithLicense._id,
          make: carWithLicense.make,
          model: carWithLicense.model,
          license_plate: carWithLicense.license_plate
        });
        
        // Ahora probar si podemos crear un lead con este vehicle_id
        try {
                     // Crear cliente de prueba
           const clientData = {
             dealer_id: '60b73cded248d50098adc8cc', // Dealer ID hardcodeado para el test
            contacts: [{
              name: {
                first_name: "Test",
                last_name: "Matching",
                raw_name: "Test Matching",
                parsed: true
              },
              phones: ["+34600000000"],
              emails: ["test@matching.com"]
            }],
            primary_contact: {
              name: {
                first_name: "Test",
                last_name: "Matching",
                raw_name: "Test Matching",
                parsed: true
              },
              phones: ["+34600000000"],
              emails: ["test@matching.com"]
            }
          };
          
          const clientResponse = await walcuService.api.post("/clients", clientData);
          const clientId = clientResponse.data._id;
          console.log("👤 Cliente de prueba creado:", clientId);
          
                                // Intentar crear lead con vehicle_id del coche existente
           const leadData = {
             dealer_id: '60b73cded248d50098adc8cc', // Dealer ID hardcodeado para el test
             client_id: clientId,
             vehicle_id: carWithLicense._id,
             inquiry: "Test de matching real - Lead creado con coche existente",
             type: "car_interest",
             location: "api_test",
                                         origin: {
                source: "api_test",
                medium: "matching_test",
                campaign: "real_matching_verification"
              }
           };
          
          const leadResponse = await walcuService.api.post("/aftersaleleads", leadData);
          console.log("✅ Lead creado exitosamente con vehicle_id existente:", leadResponse.data._id);
          
          return NextResponse.json({
            success: true,
            testType: "test_matching_real",
            result: {
              message: "✅ Matching real exitoso - Lead creado con coche existente",
              carUsed: {
                _id: carWithLicense._id,
                make: carWithLicense.make,
                model: carWithLicense.model,
                license_plate: carWithLicense.license_plate
              },
              clientId,
              leadId: leadResponse.data._id,
              leadData: leadResponse.data
            }
          });
          
        } catch (leadError) {
          console.error("❌ Error creando lead con vehicle_id existente:", leadError);
          return NextResponse.json({
            success: false,
            testType: "test_matching_real",
            error: `Error creando lead: ${leadError instanceof Error ? leadError.message : 'Error desconocido'}`,
            carFound: {
              _id: carWithLicense._id,
              make: carWithLicense.make,
              model: carWithLicense.model,
              license_plate: carWithLicense.license_plate
            }
          });
        }
        
      default:
        return NextResponse.json({
          success: false,
          error: "Tipo de test no válido"
        }, { status: 400 });
    }
    
  } catch (error) {
    console.error("💥 Error en test de API:", error);
    
    let errorMessage = "Error desconocido";
    let statusCode = 500;
    
    if (error instanceof Error) {
      errorMessage = error.message;
      
      if (error.message.includes("401")) {
        statusCode = 401;
        errorMessage = "Error de autenticación con Walcu CRM";
      } else if (error.message.includes("422")) {
        statusCode = 422;
        errorMessage = "Error de validación en Walcu CRM";
      } else if (error.message.includes("404")) {
        statusCode = 404;
        errorMessage = "Endpoint no encontrado en Walcu CRM";
      }
    }
    
    return NextResponse.json({
      success: false,
      error: errorMessage,
      testType: "error",
      details: error instanceof Error ? error.message : "Error desconocido"
    }, { status: statusCode });
  }
}

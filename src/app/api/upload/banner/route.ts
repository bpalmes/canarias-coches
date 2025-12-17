import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export async function POST(request: NextRequest) {
  try {
    const file = request.body;
    const contentType = request.headers.get('content-type');
    const filename = request.headers.get('x-vercel-filename') || `banner-${Date.now()}.jpg`;

    if (!file || !contentType) {
      return NextResponse.json({ error: 'No file to upload or content type missing' }, { status: 400 });
    }

    // Validar tipo de archivo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(contentType)) {
      return NextResponse.json({ 
        error: 'Tipo de archivo no permitido. Solo se permiten: JPG, PNG, GIF, WebP' 
      }, { status: 400 });
    }

    // Verificar si estamos en producción y tenemos el token
    const isProduction = process.env.NODE_ENV === 'production';
    const hasBlobToken = process.env.BLOB_READ_WRITE_TOKEN;

    if (isProduction && hasBlobToken) {
      // Usar Vercel Blob en producción
      const blob = await put(filename, file, {
        access: 'public',
        contentType,
      });

      return NextResponse.json({ 
        success: true, 
        url: blob.url,
        fileName: filename
      });
    } else {
      // En desarrollo o sin token, usar base64
      const chunks = [];
      const reader = file.getReader();
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
      }
      
      const bytes = new Uint8Array(chunks.reduce((acc, chunk) => acc + chunk.length, 0));
      let offset = 0;
      for (const chunk of chunks) {
        bytes.set(chunk, offset);
        offset += chunk.length;
      }
      
      const buffer = Buffer.from(bytes);
      const base64 = buffer.toString('base64');
      const dataUrl = `data:${contentType};base64,${base64}`;

      return NextResponse.json({ 
        success: true, 
        url: dataUrl,
        fileName: filename,
        isBase64: true
      });
    }

  } catch (error) {
    console.error('Error uploading banner:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

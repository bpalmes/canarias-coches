"use client";
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit, Plus, Save, X, MoveUp, MoveDown } from 'lucide-react';
import Image from 'next/image';
import ImageUpload from '@/components/ImageUpload';

interface GalleryImage {
  id: number;
  title: string;
  description: string | null;
  imageUrl: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ImageForm {
  title: string;
  description: string;
  imageUrl: string;
  order: number;
}

export default function GalleryAdminPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<ImageForm>({
    title: '',
    description: '',
    imageUrl: '',
    order: 0
  });

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await fetch('/api/admin/gallery');
      const data = await response.json();
      setImages(data || []);
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingId ? `/api/admin/gallery/${editingId}` : '/api/admin/gallery';
      const method = editingId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        await fetchImages();
        resetForm();
      } else {
        console.error('Error saving image');
      }
    } catch (error) {
      console.error('Error saving image:', error);
    }
  };

  const handleEdit = (image: GalleryImage) => {
    setEditingId(image.id);
    setFormData({
      title: image.title,
      description: image.description || '',
      imageUrl: image.imageUrl,
      order: image.order
    });
    setShowAddForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta imagen?')) return;
    
    try {
      const response = await fetch(`/api/admin/gallery/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await fetchImages();
      }
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  const handleToggleActive = async (id: number, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/gallery/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive })
      });

      if (response.ok) {
        await fetchImages();
      }
    } catch (error) {
      console.error('Error toggling active status:', error);
    }
  };

  const handleMoveOrder = async (id: number, direction: 'up' | 'down') => {
    const image = images.find(img => img.id === id);
    if (!image) return;

    const newOrder = direction === 'up' ? image.order - 1 : image.order + 1;
    
    try {
      const response = await fetch(`/api/admin/gallery/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order: newOrder })
      });

      if (response.ok) {
        await fetchImages();
      }
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', imageUrl: '', order: 0 });
    setEditingId(null);
    setShowAddForm(false);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de Galería - Entregas que Apasionan</h1>
        <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Añadir Imagen
        </Button>
      </div>

      {/* Formulario de añadir/editar */}
      {showAddForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{editingId ? 'Editar Imagen' : 'Añadir Nueva Imagen'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Título</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Título de la imagen"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Descripción</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descripción opcional"
                  rows={3}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Imagen</label>
                <ImageUpload
                  value={formData.imageUrl || undefined}
                  onChange={(url) => setFormData(prev => ({ ...prev, imageUrl: url || '' }))}
                  accept="image/*"
                  maxSize={5}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Orden</label>
                <Input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                  placeholder="0"
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  {editingId ? 'Actualizar' : 'Crear'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm} className="flex items-center gap-2">
                  <X className="h-4 w-4" />
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Lista de imágenes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image) => (
          <Card key={image.id} className="overflow-hidden">
            <div className="relative h-48">
              <Image
                src={image.imageUrl}
                alt={image.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute top-2 right-2">
                <Badge variant={image.isActive ? "default" : "secondary"}>
                  {image.isActive ? 'Activa' : 'Inactiva'}
                </Badge>
              </div>
            </div>
            
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg">{image.title}</h3>
                <span className="text-sm text-gray-500">#{image.order}</span>
              </div>
              
              {image.description && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{image.description}</p>
              )}
              
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(image)}
                  className="flex items-center gap-1"
                >
                  <Edit className="h-3 w-3" />
                  Editar
                </Button>
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleMoveOrder(image.id, 'up')}
                  className="flex items-center gap-1"
                >
                  <MoveUp className="h-3 w-3" />
                </Button>
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleMoveOrder(image.id, 'down')}
                  className="flex items-center gap-1"
                >
                  <MoveDown className="h-3 w-3" />
                </Button>
                
                <Button
                  size="sm"
                  variant={image.isActive ? "secondary" : "default"}
                  onClick={() => handleToggleActive(image.id, image.isActive)}
                >
                  {image.isActive ? 'Desactivar' : 'Activar'}
                </Button>
                
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(image.id)}
                  className="flex items-center gap-1"
                >
                  <Trash2 className="h-3 w-3" />
                  Eliminar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {images.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No hay imágenes en la galería</p>
          <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-2 mx-auto">
            <Plus className="h-4 w-4" />
            Añadir Primera Imagen
          </Button>
        </div>
      )}
    </div>
  );
}

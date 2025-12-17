"use client";

interface ImageCropperProps {
  src: string;
  alt: string;
  className?: string;
  onError?: () => void;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
}

export default function ImageCropper({ 
  src, 
  alt, 
  className = "", 
  onError,
  objectFit = 'contain'
}: ImageCropperProps) {
  
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={onError}
      style={{
        objectFit: objectFit,
        objectPosition: 'center',
        width: '100%',
        height: '100%'
      }}
    />
  );
}

'use client';

import Image from 'next/image';
import { useState } from 'react';

type ImageSize = 'small' | 'medium' | 'large' | 'full';

type MDXImageProps = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  size?: ImageSize;
  caption?: string;
  className?: string;
};

export default function MDXImage({
  src,
  alt,
  width,
  height,
  size: propSize,
  caption: propCaption,
  className = '',
}: MDXImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  
  // Parse query parameters from src if present
  let parsedSrc = src;
  let size = propSize || 'medium';
  let caption = propCaption;
  
  if (src.includes('?')) {
    const [baseUrl, queryString] = src.split('?');
    parsedSrc = baseUrl;
    
    const params = new URLSearchParams(queryString);
    if (params.has('size')) {
      const sizeParam = params.get('size');
      if (sizeParam === 'small' || sizeParam === 'medium' || sizeParam === 'large' || sizeParam === 'full') {
        size = sizeParam;
      }
    }
    
    if (params.has('caption')) {
      caption = params.get('caption') || undefined;
    }
  }
  
  // Define size classes
  const sizeClasses = {
    small: 'max-w-sm mx-auto',
    medium: 'max-w-2xl mx-auto',
    large: 'max-w-4xl mx-auto',
    full: 'w-full',
  };
  
  const aspectRatio = width && height ? width / height : 16 / 9;
  
  return (
    <figure className={`my-8 ${sizeClasses[size]} ${className}`}>
      <div 
        className={`relative overflow-hidden rounded-lg ${
          isLoading ? 'animate-pulse bg-gray-200 dark:bg-gray-700' : ''
        }`}
        style={{ aspectRatio }}
      >
        <Image
          src={parsedSrc}
          alt={alt}
          width={width || 1200}
          height={height || Math.round(1200 / aspectRatio)}
          className={`w-full h-auto transition-opacity duration-300 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          }`}
          onLoadingComplete={() => setIsLoading(false)}
        />
      </div>
      {caption && (
        <figcaption className="text-center text-sm text-gray-600 dark:text-gray-400 mt-2 italic">
          {caption}
        </figcaption>
      )}
    </figure>
  );
} 
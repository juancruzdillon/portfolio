"use client";
import NextImage, { type ImageProps as NextImageProps } from 'next/image';
import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface ImageProps extends Omit<NextImageProps, 'src'> {
  src?: string;
  fallbackSrc?: string;
  alt: string;
  containerClassName?: string;
  imgClassName?: string;
  ['data-ai-hint']?: string;
  onLoadingComplete?: () => void;       // 1) Aceptar el callback
}

const Image: React.FC<ImageProps> = ({
  src,
  fallbackSrc = "https://picsum.photos/seed/fallback/400/300",
  alt,
  width,
  height,
  containerClassName,
  imgClassName,
  layout,
  objectFit,
  quality,
  priority,
  loading,
  unoptimized,
  placeholder,
  blurDataURL,
  "data-ai-hint": dataAiHint,
  onLoadingComplete,                  // 1) Desestructurar
  ...props
}) => {
  const [currentSrc, setCurrentSrc] = useState(src || fallbackSrc);
  const [hasError, setHasError] = useState(!src);

  React.useEffect(() => {
    if (src) {
      setCurrentSrc(src);
      setHasError(false);
    } else {
      setCurrentSrc(fallbackSrc);
      setHasError(true);
    }
  }, [src, fallbackSrc]);

  const handleError = () => {
    if (!hasError) {
      setCurrentSrc(fallbackSrc);
      setHasError(true);
    }
  };

  const imageBaseProps = {
    alt,
    onError: handleError,
    onLoadingComplete,                  // 2) Incluir aquí
    className: cn("transition-opacity duration-300", imgClassName, hasError && src !== fallbackSrc ? "opacity-50" : "opacity-100"),
    ...(dataAiHint && { "data-ai-hint": dataAiHint }),
    ...props,
  };

  if (layout === 'fill') {
    return (
      <div className={cn("relative overflow-hidden", containerClassName)}>
        <NextImage
          src={currentSrc}
          layout="fill"
          objectFit={objectFit || "cover"}
          quality={quality}
          priority={priority}
          loading={loading}
          unoptimized={unoptimized}
          placeholder={placeholder}
          blurDataURL={blurDataURL}
          {...imageBaseProps}            // 3) Propagar el callback
        />
      </div>
    );
  }

  if ((typeof width === 'number' && typeof height === 'number') || layout === 'intrinsic' || layout === 'fixed') {
     return (
      <div className={cn("relative", containerClassName)} style={(typeof width === 'number' && typeof height === 'number' && !layout) ? { aspectRatio: `${width}/${height}` } : {}}>
        <NextImage
          src={currentSrc}
          width={width}
          height={height}
          layout={layout}
          objectFit={objectFit}
          quality={quality}
          priority={priority}
          loading={loading}
          unoptimized={unoptimized}
          placeholder={placeholder}
          blurDataURL={blurDataURL}
          {...imageBaseProps}            // 3) Aquí también
        />
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden", containerClassName)}>
       <img
        src={currentSrc}
        alt={alt}
        width={typeof width === 'number' ? width : undefined}
        height={typeof height === 'number' ? height : undefined}
        className={cn(imageBaseProps.className, "w-full h-auto object-cover")}
        style={{
          objectFit: objectFit || 'cover',
          width: typeof width === 'string' ? width : undefined,
          height: typeof height === 'string' ? height : undefined,
        }}
        onError={handleError}
        data-ai-hint={dataAiHint}
      />
    </div>
  );
};

export default Image;

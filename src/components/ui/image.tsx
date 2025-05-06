
"use client";
import NextImage, { type ImageProps as NextImageProps } from 'next/image';
import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface ImageProps extends Omit<NextImageProps, 'src'> {
  src?: string; // Make src optional to handle potential undefined cases gracefully
  fallbackSrc?: string;
  alt: string; // Alt is always required
  containerClassName?: string;
  imgClassName?: string;
  ['data-ai-hint']?: string;
}

const Image: React.FC<ImageProps> = ({
  src,
  fallbackSrc = "https://picsum.photos/seed/fallback/400/300", // Default fallback
  alt,
  width,
  height,
  className,
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
    className: cn("transition-opacity duration-300", imgClassName, hasError && src !== fallbackSrc ? "opacity-50" : "opacity-100"),
    ...(dataAiHint && { "data-ai-hint": dataAiHint }),
    ...props,
  };

  // If layout is 'fill', NextImage handles responsiveness.
  // Otherwise, wrap with a div for aspect ratio if width/height are numbers.
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
          {...imageBaseProps}
        />
      </div>
    );
  }

  // For fixed or intrinsic, provide width and height
  if ((typeof width === 'number' && typeof height === 'number') || layout === 'intrinsic' || layout === 'fixed') {
     return (
      <div className={cn("relative", containerClassName)} style={ (typeof width === 'number' && typeof height === 'number' && !layout) ? { aspectRatio: `${width}/${height}` } : {}}>
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
          {...imageBaseProps}
        />
      </div>
    );
  }
  
  // Fallback for cases where Next/Image might not be ideal or props are missing
  // This will use a standard img tag
  // eslint-disable-next-line @next/next/no-img-element
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
          width: typeof width === 'string' ? width : undefined, // e.g., "100%"
          height: typeof height === 'string' ? height : undefined, // e.g., "auto"
        }}
        data-ai-hint={dataAiHint}
      />
    </div>
  );
};

export default Image;

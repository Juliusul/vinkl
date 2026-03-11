"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import type { ProductImage } from "@/types/product";

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
}

/**
 * Product Gallery — premium image viewer.
 *
 * Main image + thumbnail strip below.
 * Desktop: zoom on hover via CSS scale + transform-origin tracking.
 * Mobile: swipe left/right to navigate.
 * No external dependencies. No Shopify default styling.
 */
export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const touchStartRef = useRef<number>(0);
  const mainImageRef = useRef<HTMLDivElement>(null);

  const activeImage = images[activeIndex] ?? images[0];
  if (!activeImage) return null;

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setZoomPosition({ x, y });
    },
    [],
  );

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      touchStartRef.current = e.touches[0].clientX;
    },
    [],
  );

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const delta = touchStartRef.current - e.changedTouches[0].clientX;
      const threshold = 50;

      if (Math.abs(delta) > threshold) {
        if (delta > 0 && activeIndex < images.length - 1) {
          setActiveIndex((prev) => prev + 1);
        } else if (delta < 0 && activeIndex > 0) {
          setActiveIndex((prev) => prev - 1);
        }
      }
    },
    [activeIndex, images.length],
  );

  return (
    <div className="flex flex-col gap-3">
      {/* Main image — zoom on hover (desktop), swipe (mobile) */}
      <div
        ref={mainImageRef}
        className="relative aspect-square cursor-zoom-in overflow-hidden bg-bg-warm"
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <Image
          src={activeImage.url}
          alt={activeImage.altText || productName}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 58vw"
          className="object-cover transition-transform duration-300 ease-out"
          style={{
            transform: isZoomed ? "scale(2)" : "scale(1)",
            transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
          }}
        />

        {/* Mobile swipe indicator dots */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 lg:hidden">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`h-1.5 rounded-full transition-all duration-200 ${
                  i === activeIndex
                    ? "w-6 bg-ink-primary"
                    : "w-1.5 bg-ink-primary/30"
                }`}
                aria-label={`Image ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnails — horizontal strip */}
      {images.length > 1 && (
        <div className="hidden grid-cols-5 gap-2 lg:grid">
          {images.map((image, index) => (
            <button
              key={image.url}
              onClick={() => setActiveIndex(index)}
              className={`relative aspect-square overflow-hidden transition-opacity duration-200 ${
                index === activeIndex
                  ? "opacity-100 ring-1 ring-ink-primary"
                  : "opacity-60 hover:opacity-90"
              }`}
              aria-label={`${productName} — ${index + 1}`}
            >
              <Image
                src={image.url}
                alt=""
                fill
                sizes="12vw"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

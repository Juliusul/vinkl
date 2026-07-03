"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

/**
 * Hero Cinema — scroll-driven opening statement.
 *
 * A scroll runway (250vh mobile / 300vh desktop) pins a full-bleed
 * product film. Scroll position scrubs the camera: a slow dolly from
 * the wide room into the crooked corner where the shelf lives.
 *
 * Narrative mapped to scroll progress:
 *   0.00–0.35  headline over the wide scene ("Deine Wände…")
 *   0.35–0.60  headline recedes as the camera pushes in
 *   0.70–0.92  closing line + CTA settle over the close-up
 *
 * The film is a pre-extracted WebP frame sequence drawn to a
 * cover-fit canvas — deliberately NOT a scrubbed <video>. Scrubbing
 * video means a decoder seek per animation frame; with the sparse
 * keyframes of AI-generated footage every seek re-decodes from the
 * last keyframe, which stutters on desktop (4K AV1) and simply
 * freezes on phones (plus iOS paused-video painting quirks).
 * drawImage of decoded stills has no decoder in the loop and cannot
 * jank. Two sets, chosen once per visit by viewport:
 *   ≥1024px  hero-frames-hd  1920×1080 (from the 4K master), ~5 MB
 *   <1024px  hero-frames     1280×720, ~2.7 MB
 * Frames load progressively — the nearest loaded frame is drawn, so
 * the stage paints immediately and sharpens as the rest arrive.
 *
 * Implementation notes:
 * - Zero dependencies. One always-on rAF loop that polls scroll
 *   progress (scroll events are unreliable in some renderers; one
 *   rect read per frame is nothing). Hidden tabs pause rAF, which
 *   is exactly the right behavior for free.
 * - All per-frame style writes are imperative (refs), never React
 *   re-renders.
 * - prefers-reduced-motion collapses the runway to one static
 *   viewport: poster frame, full copy, zero scrubbing.
 */

const FRAME_COUNT = 90;

const frameSrc = (set: "hd" | "sd", i: number) =>
  `/${set === "hd" ? "hero-frames-hd" : "hero-frames"}/frame-${String(i).padStart(3, "0")}.webp`;

/** Smoothstep between two progress edges. */
function ramp(p: number, from: number, to: number): number {
  const t = Math.min(1, Math.max(0, (p - from) / (to - from)));
  return t * t * (3 - 2 * t);
}

export function HeroCinema() {
  const t = useTranslations("home.hero");
  const tImg = useTranslations("images");

  const wrapperRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const closingRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);

  const framesRef = useRef<HTMLImageElement[]>([]);
  const frameLoadedRef = useRef<boolean[]>([]);
  const lastDrawnRef = useRef(-1);

  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // ── Frame preload — one set per visit, progressive ──
  useEffect(() => {
    if (reducedMotion || framesRef.current.length) return;

    const set: "hd" | "sd" = window.innerWidth >= 1024 ? "hd" : "sd";
    const imgs: HTMLImageElement[] = [];
    const loaded: boolean[] = new Array(FRAME_COUNT).fill(false);

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.decoding = "async";
      img.onload = () => {
        loaded[i] = true;
        // Repaint as soon as a better frame for the current position
        // exists (first paint included).
        lastDrawnRef.current = -2;
      };
      img.src = frameSrc(set, i);
      imgs.push(img);
    }

    framesRef.current = imgs;
    frameLoadedRef.current = loaded;
  }, [reducedMotion]);

  // ── Scroll core ──
  useEffect(() => {
    if (reducedMotion) return;

    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d") ?? null;
    if (!wrapper || !canvas || !ctx) return;

    let progress = 0; // scroll target 0..1
    let shown = -1; // lerped playhead 0..1
    let rafId = 0;

    const readProgress = () => {
      const rect = wrapper.getBoundingClientRect();
      const runway = rect.height - window.innerHeight;
      progress = runway > 0 ? Math.min(1, Math.max(0, -rect.top / runway)) : 0;
    };

    const drawFrame = () => {
      // Keep the bitmap matched to the element (URL-bar collapse
      // resizes the stage on phones).
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cw = Math.round(canvas.clientWidth * dpr);
      const ch = Math.round(canvas.clientHeight * dpr);
      if (!cw || !ch) return;
      if (canvas.width !== cw || canvas.height !== ch) {
        canvas.width = cw;
        canvas.height = ch;
        lastDrawnRef.current = -2; // force redraw at the new size
      }

      const want = Math.round(shown * (FRAME_COUNT - 1));
      const loaded = frameLoadedRef.current;

      // Nearest loaded frame at or below the target, else first loaded.
      let idx = -1;
      for (let i = want; i >= 0; i--) {
        if (loaded[i]) {
          idx = i;
          break;
        }
      }
      if (idx === -1) idx = loaded.findIndex(Boolean);
      if (idx === -1 || idx === lastDrawnRef.current) return;

      const img = framesRef.current[idx];
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;
      if (!iw || !ih) return;

      // object-fit: cover
      const scale = Math.max(cw / iw, ch / ih);
      const dw = iw * scale;
      const dh = ih * scale;
      ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
      lastDrawnRef.current = idx;
    };

    const apply = () => {
      drawFrame();

      // Copy choreography — piecewise, all transform/opacity.
      const headlineOut = ramp(shown, 0.35, 0.6);
      const closingIn = ramp(shown, 0.7, 0.92);
      const hintOut = ramp(shown, 0.04, 0.14);

      if (headlineRef.current) {
        headlineRef.current.style.opacity = String(1 - headlineOut);
        headlineRef.current.style.transform = `translateY(${-32 * headlineOut}px)`;
      }
      if (closingRef.current) {
        closingRef.current.style.opacity = String(closingIn);
        closingRef.current.style.transform = `translateY(${16 * (1 - closingIn)}px)`;
        closingRef.current.style.pointerEvents = closingIn > 0.5 ? "auto" : "none";
      }
      if (hintRef.current) {
        // The idle pulse is a CSS animation on opacity; an animation
        // outranks inline style, so it must be switched off while the
        // hint is scroll-faded or it would keep flashing back in.
        hintRef.current.style.animation = hintOut > 0.01 ? "none" : "";
        hintRef.current.style.opacity = String(1 - hintOut);
      }
      wrapper.style.setProperty("--scrim", String(1 - headlineOut));
    };

    const frame = () => {
      // Poll progress every frame — no scroll listeners, no wake/sleep
      // machinery to go wrong. Hidden tabs pause rAF automatically.
      readProgress();
      shown = shown < 0 ? progress : shown + (progress - shown) * 0.14;
      apply();
      rafId = requestAnimationFrame(frame);
    };

    rafId = requestAnimationFrame(frame);

    return () => cancelAnimationFrame(rafId);
  }, [reducedMotion]);

  return (
    <section
      ref={wrapperRef}
      className={reducedMotion ? "relative" : "relative h-[250vh] lg:h-[300vh]"}
      aria-label={tImg("hero")}
    >
      <div
        className={`overflow-hidden ${
          reducedMotion ? "relative min-h-[92vh]" : "sticky top-0 h-svh"
        }`}
      >
        {/* Film layer — frame flipbook on a cover-fit canvas */}
        {!reducedMotion && (
          <canvas
            ref={canvasRef}
            aria-hidden="true"
            className="absolute inset-0 h-full w-full"
          />
        )}

        {/* Reduced motion: one honest still */}
        {reducedMotion && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={frameSrc("sd", 0)}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}

        {/* Legibility scrim — follows the headline out */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-bg-cream/60 via-bg-cream/20 to-transparent"
          style={{ opacity: "var(--scrim, 1)" }}
          aria-hidden="true"
        />

        {/* Headline — the wide-scene statement */}
        <div
          ref={headlineRef}
          className="absolute inset-x-0 bottom-[18vh] px-5 md:px-10 lg:bottom-[22vh] lg:px-16 will-change-transform"
        >
          <div className="mx-auto w-full max-w-[1440px]">
            <h1 className="font-serif font-light tracking-tight text-ink-primary">
              <span className="hero-animate block text-[clamp(2.25rem,5.5vw,4.5rem)] leading-[1.08]">
                {t("line1")}
              </span>
              <span className="hero-animate hero-animate-delay-1 block text-[clamp(2.25rem,5.5vw,4.5rem)] leading-[1.08]">
                {t("line2")}
              </span>
            </h1>
            {reducedMotion && (
              <>
                <p className="mt-6 font-serif text-[clamp(1.25rem,2.5vw,2rem)] font-light leading-snug text-ink-secondary">
                  {t("line3")}
                </p>
                <Link
                  href="/objects/vinkl"
                  className="mt-8 inline-block bg-ink-primary px-8 py-4 text-xs font-medium uppercase tracking-widest text-ink-inverse transition-[background-color,transform] duration-[--duration-normal] ease-[--ease-out] hover:bg-terracotta"
                >
                  {t("cta")}
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Closing line + CTA — settles over the close-up */}
        {!reducedMotion && (
          <div
            ref={closingRef}
            className="pointer-events-none absolute inset-x-0 bottom-[14vh] px-5 opacity-0 md:px-10 lg:px-16 will-change-transform"
          >
            <div className="mx-auto w-full max-w-[1440px]">
              <p className="max-w-[16ch] font-serif text-[clamp(1.75rem,4vw,3.25rem)] font-light leading-[1.15] tracking-tight text-ink-primary [text-wrap:balance]">
                {t("line3")}
              </p>
              <Link
                href="/objects/vinkl"
                className="mt-8 inline-block bg-ink-primary px-8 py-4 text-xs font-medium uppercase tracking-widest text-ink-inverse transition-[background-color,transform] duration-[--duration-normal] ease-[--ease-out] hover:bg-terracotta active:translate-y-px"
              >
                {t("cta")}
              </Link>
            </div>
          </div>
        )}

        {/* Scroll hint */}
        {!reducedMotion && (
          <div
            ref={hintRef}
            className="scroll-indicator absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3"
          >
            <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-ink-secondary">
              {t("scroll")}
            </span>
            <div className="h-8 w-px bg-ink-secondary" />
          </div>
        )}
      </div>
    </section>
  );
}

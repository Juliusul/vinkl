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
 * Two picture pipelines behind one scroll core:
 * - ≥1024px  "video": the 4K film, fully buffered via Blob URL,
 *   currentTime lerped toward the scroll target. (Blob because a
 *   scrub must be fully buffered anyway, and Chrome's progressive
 *   media path chokes on the AV1 4K master.)
 * - <1024px  "frames": 90 pre-extracted WebP frames drawn to a
 *   cover-fit canvas. Phones cannot scrub video reliably — sparse
 *   keyframes make every seek decode-from-keyframe (visible jank),
 *   and iOS adds its own paused-video painting quirks. Images have
 *   none of those failure modes, and they load progressively.
 *
 * Implementation notes:
 * - Zero dependencies. One rAF loop that polls scroll progress
 *   (scroll events are unreliable in some embedded renderers) and
 *   sleeps whenever the hero is off-screen and settled.
 * - All per-frame style writes are imperative (refs), never React
 *   re-renders.
 * - prefers-reduced-motion collapses the runway to one static
 *   viewport: poster frame, full copy, zero scrubbing.
 */

const FRAME_COUNT = 90;

const frameSrc = (i: number) =>
  `/hero-frames/frame-${String(i).padStart(3, "0")}.webp`;

/** Smoothstep between two progress edges. */
function ramp(p: number, from: number, to: number): number {
  const t = Math.min(1, Math.max(0, (p - from) / (to - from)));
  return t * t * (3 - 2 * t);
}

export function HeroCinema() {
  const t = useTranslations("home.hero");
  const tImg = useTranslations("images");

  const wrapperRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const closingRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);

  const framesRef = useRef<HTMLImageElement[]>([]);
  const frameLoadedRef = useRef<boolean[]>([]);
  const lastDrawnRef = useRef(-1);

  const [reducedMotion, setReducedMotion] = useState(false);
  // null until mount; SSR renders both (empty) picture layers so
  // hydration is always clean.
  const [mode, setMode] = useState<"video" | "frames" | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    setMode(window.innerWidth >= 1024 ? "video" : "frames");
  }, []);

  // ── Picture pipeline: video (desktop) ──
  useEffect(() => {
    if (mode !== "video") return;
    const video = videoRef.current;
    if (!video || video.src) return;

    let objectUrl: string | null = null;
    let cancelled = false;

    fetch("/videos/hero-wide-4k.mp4")
      .then((r) => (r.ok ? r.blob() : Promise.reject(new Error(String(r.status)))))
      .then((blob) => {
        if (cancelled) return;
        objectUrl = URL.createObjectURL(blob);
        video.src = objectUrl;
        video.load();
      })
      .catch(() => {
        // Progressive fallback — 720p H.264 streams reliably everywhere.
        if (!cancelled) {
          video.src = "/videos/hero-wide-720.mp4";
          video.load();
        }
      });

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [mode]);

  // ── Picture pipeline: frames (mobile / tablet) ──
  useEffect(() => {
    if (mode !== "frames" || reducedMotion) return;
    if (framesRef.current.length) return;

    const imgs: HTMLImageElement[] = [];
    const loaded: boolean[] = new Array(FRAME_COUNT).fill(false);

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.decoding = "async";
      img.onload = () => {
        loaded[i] = true;
        // Force a repaint pass so early frames appear as they arrive.
        if (lastDrawnRef.current === -1 || i === lastDrawnRef.current) {
          lastDrawnRef.current = -2;
        }
      };
      img.src = frameSrc(i);
      imgs.push(img);
    }

    framesRef.current = imgs;
    frameLoadedRef.current = loaded;
  }, [mode, reducedMotion]);

  // ── Scroll core ──
  useEffect(() => {
    if (reducedMotion || mode === null) return;

    const wrapper = wrapperRef.current;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!wrapper) return;

    // We drive the clock — the element never plays itself.
    video?.pause();

    const ctx = canvas?.getContext("2d") ?? null;

    let progress = 0; // scroll target 0..1
    let shown = -1; // lerped playhead 0..1
    let rafId = 0;
    let active = false; // rAF loop runs only while the hero is on screen
    let inView = true;

    const readProgress = () => {
      const rect = wrapper.getBoundingClientRect();
      const runway = rect.height - window.innerHeight;
      progress = runway > 0 ? Math.min(1, Math.max(0, -rect.top / runway)) : 0;
    };

    const drawFrame = () => {
      if (!canvas || !ctx) return;

      // Keep the bitmap matched to the element (URL-bar collapse
      // resizes the stage on phones).
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cw = Math.round(canvas.clientWidth * dpr);
      const ch = Math.round(canvas.clientHeight * dpr);
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
      if (mode === "video" && video) {
        if (video.readyState >= 2 && video.duration) {
          const target = shown * (video.duration - 0.05);
          if (Math.abs(video.currentTime - target) > 0.01) {
            video.currentTime = target;
          }
        }
      } else {
        drawFrame();
      }

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
      // Poll progress each frame — scroll events are unreliable in
      // some embedded renderers, and one rect read per frame is cheap.
      readProgress();
      shown = shown < 0 ? progress : shown + (progress - shown) * 0.14;
      apply();

      // Sleep only when the hero has left the viewport AND the
      // playhead has settled; the observer wakes us on re-entry.
      if (!inView && Math.abs(progress - shown) < 0.0006) {
        shown = progress;
        active = false;
        return;
      }
      rafId = requestAnimationFrame(frame);
    };

    const wake = () => {
      if (!active) {
        active = true;
        rafId = requestAnimationFrame(frame);
      }
    };

    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView) wake();
    });
    observer.observe(wrapper);
    wake();

    return () => {
      active = false;
      inView = false;
      cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, [reducedMotion, mode]);

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
        {/* Film layer — video on desktop glass */}
        {!reducedMotion && (
          <video
            ref={videoRef}
            muted
            playsInline
            preload="auto"
            disablePictureInPicture
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}

        {/* Film layer — frame flipbook on phones and tablets */}
        {!reducedMotion && (
          <canvas
            ref={canvasRef}
            aria-hidden="true"
            className={`absolute inset-0 h-full w-full ${
              mode === "frames" ? "" : "hidden"
            }`}
          />
        )}

        {/* Reduced motion: one honest still */}
        {reducedMotion && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={frameSrc(0)}
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

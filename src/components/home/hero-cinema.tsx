"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

/**
 * Hero Cinema — the opening statement, split by device class.
 *
 * DESKTOP (≥1024px): a 300vh scroll runway pins a full-bleed product
 * film. Scroll scrubs the camera — a slow dolly from the wide room
 * into the crooked corner where the shelf lives.
 *
 *   0.00–0.35  headline over the wide scene ("Deine Wände…")
 *   0.35–0.60  headline recedes as the camera pushes in
 *   0.70–0.92  closing line + CTA settle over the close-up
 *
 * The film is 90 WebP frames (2560×1440, cut from the 4K master)
 * drawn to a cover-fit canvas — deliberately NOT a scrubbed <video>:
 * decoder seeks stutter on desktop (4K AV1) and freeze on phones.
 * drawImage of decoded stills cannot jank.
 *
 * MOBILE / TABLET (<1024px): one sharp portrait still (1080×1920,
 * cut and cropped from the 4K master) with the full copy — no scrub.
 * Deliberate decision, not a fallback: phones scrub unreliably, a
 * 250vh runway is heavy thumb-work, a native-resolution still beats
 * an upscaled 16:9 frame on quality, and a single priority image
 * makes the LCP dramatically faster for 90% of traffic.
 *
 * The split is CSS-first (lg:hidden / hidden lg:block) so SSR markup
 * is stable — no mode flash, no hydration mismatch. Frame preloading
 * is width-guarded so phones never download the desktop film.
 */

const FRAME_COUNT = 90;

const frameSrc = (i: number) =>
  `/hero-frames-hd/frame-${String(i).padStart(3, "0")}.webp`;

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

  // ── Desktop film preload — progressive, never on phones ──
  useEffect(() => {
    if (reducedMotion || framesRef.current.length) return;
    if (window.innerWidth < 1024) return;

    const imgs: HTMLImageElement[] = [];
    const loaded: boolean[] = new Array(FRAME_COUNT).fill(false);

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new window.Image();
      img.decoding = "async";
      img.onload = () => {
        loaded[i] = true;
        // Repaint as soon as a better frame for the current position
        // exists (first paint included).
        lastDrawnRef.current = -2;
      };
      img.src = frameSrc(i);
      imgs.push(img);
    }

    framesRef.current = imgs;
    frameLoadedRef.current = loaded;
  }, [reducedMotion]);

  // ── Desktop scroll core ──
  useEffect(() => {
    if (reducedMotion) return;
    if (window.innerWidth < 1024) return;

    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d") ?? null;
    if (!wrapper || !canvas || !ctx) return;

    ctx.imageSmoothingQuality = "high";

    let progress = 0; // scroll target 0..1
    let shown = -1; // lerped playhead 0..1
    let rafId = 0;

    const readProgress = () => {
      const rect = wrapper.getBoundingClientRect();
      const runway = rect.height - window.innerHeight;
      progress = runway > 0 ? Math.min(1, Math.max(0, -rect.top / runway)) : 0;
    };

    const drawFrame = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cw = Math.round(canvas.clientWidth * dpr);
      const ch = Math.round(canvas.clientHeight * dpr);
      if (!cw || !ch) return;
      if (canvas.width !== cw || canvas.height !== ch) {
        canvas.width = cw;
        canvas.height = ch;
        ctx.imageSmoothingQuality = "high"; // reset by bitmap resize
        lastDrawnRef.current = -2;
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
      // Scrim tracks whichever copy block is on stage: full under the
      // headline, a brief clean-film dip mid-dolly, back for the close.
      wrapper.style.setProperty(
        "--scrim",
        String(Math.max(1 - headlineOut, closingIn)),
      );
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

  const cta = (
    <Link
      href="/objects/vinkl"
      className="mt-8 inline-block bg-ink-primary px-8 py-4 text-xs font-medium uppercase tracking-widest text-ink-inverse transition-[background-color,transform] duration-[--duration-normal] ease-[--ease-out] hover:bg-terracotta active:translate-y-px"
    >
      {t("cta")}
    </Link>
  );

  const hint = (
    <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-ink-secondary">
      {t("scroll")}
    </span>
  );

  return (
    <>
      {/* ── Mobile / tablet: sharp portrait still, full statement ── */}
      <section
        className="relative h-svh overflow-hidden lg:hidden"
        aria-label={tImg("hero")}
      >
        <Image
          src="/images/hero-still-mobile.webp"
          alt=""
          aria-hidden="true"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="hero-scrim absolute inset-0" aria-hidden="true" />

        <div className="absolute inset-x-0 bottom-[14vh] px-5 md:px-10">
          <h1 className="font-heading font-normal tracking-tight text-ink-primary">
            <span className="hero-animate block text-[clamp(2.25rem,8vw,3.5rem)] leading-[1.08]">
              {t("line1")}
            </span>
            <span className="hero-animate hero-animate-delay-1 block text-[clamp(2.25rem,8vw,3.5rem)] leading-[1.08]">
              {t("line2")}
            </span>
          </h1>
          <p className="hero-animate hero-animate-delay-2 mt-4 font-heading text-[clamp(1.125rem,4.5vw,1.5rem)] font-normal leading-snug text-ink-secondary">
            {t("line3")}
          </p>
          <div className="hero-animate hero-animate-delay-3">{cta}</div>
        </div>

        <div className="scroll-indicator absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2">
          {hint}
          <div className="h-6 w-px bg-ink-secondary" />
        </div>
      </section>

      {/* ── Desktop: scroll-scrubbed cinema ── */}
      <section
        ref={wrapperRef}
        className={`relative hidden lg:block ${reducedMotion ? "" : "h-[300vh]"}`}
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

          {/* Reduced motion: one honest still from the film */}
          {reducedMotion && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={frameSrc(0)}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}

          {/* Legibility scrims — present whenever copy is on stage,
              dipped in the pure-film middle. */}
          <div
            className="hero-scrim absolute inset-0"
            style={{ opacity: "var(--scrim, 1)" }}
            aria-hidden="true"
          />
          <div
            className="hero-scrim-side absolute inset-0"
            style={{ opacity: "var(--scrim, 1)" }}
            aria-hidden="true"
          />

          {/* Headline — the wide-scene statement */}
          <div
            ref={headlineRef}
            className="absolute inset-x-0 bottom-[22vh] px-16 will-change-transform"
          >
            <div className="mx-auto w-full max-w-[1440px]">
              <h1 className="font-heading font-normal tracking-tight text-ink-primary">
                <span className="hero-animate block text-[clamp(2.25rem,5.5vw,4.5rem)] leading-[1.08]">
                  {t("line1")}
                </span>
                <span className="hero-animate hero-animate-delay-1 block text-[clamp(2.25rem,5.5vw,4.5rem)] leading-[1.08]">
                  {t("line2")}
                </span>
              </h1>
              {reducedMotion && (
                <>
                  <p className="mt-6 font-heading text-[clamp(1.25rem,2.5vw,2rem)] font-normal leading-snug text-ink-secondary">
                    {t("line3")}
                  </p>
                  {cta}
                </>
              )}
            </div>
          </div>

          {/* Closing line + CTA — settles over the close-up */}
          {!reducedMotion && (
            <div
              ref={closingRef}
              className="pointer-events-none absolute inset-x-0 bottom-[14vh] px-16 opacity-0 will-change-transform"
            >
              <div className="mx-auto w-full max-w-[1440px]">
                <p className="max-w-[16ch] font-heading text-[clamp(1.75rem,4vw,3.25rem)] font-normal leading-[1.15] tracking-tight text-ink-primary [text-wrap:balance]">
                  {t("line3")}
                </p>
                {cta}
              </div>
            </div>
          )}

          {/* Scroll hint */}
          {!reducedMotion && (
            <div
              ref={hintRef}
              className="scroll-indicator absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3"
            >
              {hint}
              <div className="h-8 w-px bg-ink-secondary" />
            </div>
          )}
        </div>
      </section>
    </>
  );
}

"use client";

import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { getWrappedData, type WrappedData } from "@/app/actions/wrapped";
import { useAuth } from "@/app/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { getTeamLogo } from "@/lib/data";
import { clsx } from "clsx";
import {
  Trophy,
  Star,
  Heart,
  Users,
  X,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  useSpring,
  type Variants,
} from "framer-motion";

type Props = { raceRound: number; isSprint?: boolean };

/* ─────────────────────────────────────────────
   SPRING CONFIGS
   ───────────────────────────────────────────── */
const SPRING_BOUNCY = { type: "spring", stiffness: 400, damping: 25 } as const;
const SPRING_SOFT = { type: "spring", stiffness: 200, damping: 30 } as const;
const SPRING_HEAVY = { type: "spring", stiffness: 100, damping: 20 } as const;

/* ─────────────────────────────────────────────
   ANIMATION VARIANTS
   ───────────────────────────────────────────── */
const heroText: Variants = {
  hidden: { opacity: 0, y: 60, scale: 0.8, filter: "blur(20px)" },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { ...SPRING_HEAVY, delay: 0.2 },
  },
};

const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } },
};

const staggerItem: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: SPRING_SOFT,
  },
};

const popIn: Variants = {
  hidden: { opacity: 0, scale: 0, rotate: -20 },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: { ...SPRING_BOUNCY, delay: 0.1 },
  },
};

const slideFromLeft: Variants = {
  hidden: { opacity: 0, x: -80 },
  visible: { opacity: 1, x: 0, transition: SPRING_SOFT },
};

const slideFromRight: Variants = {
  hidden: { opacity: 0, x: 80 },
  visible: { opacity: 1, x: 0, transition: SPRING_SOFT },
};

const scaleReveal: Variants = {
  hidden: { opacity: 0, scale: 0.3, y: 40 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { ...SPRING_BOUNCY, delay: 0.4 },
  },
};

/* ─────────────────────────────────────────────
   ANIMATED COUNTER with spring
   ───────────────────────────────────────────── */
function AnimatedCounter({
  target,
  duration = 1800,
  suffix = "",
  className = "",
  delay = 0,
}: {
  target: number;
  duration?: number;
  suffix?: string;
  className?: string;
  delay?: number;
}) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    const t0 = performance.now();
    function tick(now: number) {
      const p = Math.min((now - t0) / duration, 1);
      // Anticipation: slight overshoot then settle
      const ease =
        p < 1
          ? 1 - Math.pow(1 - p, 4)
          : 1;
      const overshoot = p > 0.85 && p < 1 ? 1.02 : 1;
      setCount(Math.round(target * ease * overshoot));
      if (p < 1) raf.current = requestAnimationFrame(tick);
      else setCount(target);
    }
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [target, duration, started]);

  return <span className={className}>{count}{suffix}</span>;
}

/* ─────────────────────────────────────────────
   CONFETTI BURST
   ───────────────────────────────────────────── */
function ConfettiBurst({ active }: { active: boolean }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: 40 }, (_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 500,
        y: -(Math.random() * 400 + 200),
        rotate: Math.random() * 720 - 360,
        scale: Math.random() * 0.6 + 0.4,
        color: [
          "#E60000",
          "#FF6B6B",
          "#FFD700",
          "#10B981",
          "#8B5CF6",
          "#F59E0B",
          "#ffffff",
        ][Math.floor(Math.random() * 7)],
        delay: Math.random() * 0.3,
        w: Math.random() * 8 + 4,
        h: Math.random() * 6 + 2,
      })),
    [],
  );

  if (!active) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-50 overflow-hidden">
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          className="absolute left-1/2 top-1/2 rounded-sm"
          style={{
            width: p.w,
            height: p.h,
            backgroundColor: p.color,
          }}
          initial={{ x: 0, y: 0, rotate: 0, opacity: 1, scale: 0 }}
          animate={{
            x: p.x,
            y: [0, p.y * 0.3, p.y, p.y + 300],
            rotate: p.rotate,
            opacity: [0, 1, 1, 0],
            scale: [0, p.scale, p.scale, 0],
          }}
          transition={{
            duration: 2,
            delay: p.delay,
            ease: [0.2, 0.8, 0.4, 1],
          }}
        />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   PARTICLES (enhanced with motion)
   ───────────────────────────────────────────── */
function Particles({ color = "#E60000" }: { color?: string }) {
  const pts = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        k: i,
        w: Math.random() * 5 + 2,
        l: Math.random() * 100,
        t: Math.random() * 100,
        dur: Math.random() * 6 + 4,
        o: Math.random() * 0.35 + 0.1,
        dx: (Math.random() - 0.5) * 60,
        dy: (Math.random() - 0.5) * 60,
      })),
    [],
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {pts.map((p) => (
        <motion.div
          key={p.k}
          className="absolute rounded-full"
          style={{
            width: p.w,
            height: p.w,
            backgroundColor: color,
            left: `${p.l}%`,
            top: `${p.t}%`,
          }}
          animate={{
            x: [0, p.dx, -p.dx / 2, 0],
            y: [0, p.dy, -p.dy / 2, 0],
            opacity: [p.o, p.o * 2, p.o * 0.5, p.o],
            scale: [1, 1.5, 0.8, 1],
          }}
          transition={{
            duration: p.dur,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   PULSING GLOW RING
   ───────────────────────────────────────────── */
function GlowRing({
  color = "#E60000",
  size = 300,
  className = "",
}: {
  color?: string;
  size?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={`absolute rounded-full ${className}`}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, ${color}15 0%, transparent 70%)`,
      }}
      animate={{
        scale: [1, 1.3, 1],
        opacity: [0.3, 0.6, 0.3],
      }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

/* ─────────────────────────────────────────────
   STORY PROGRESS BARS (with real fill animation)
   ───────────────────────────────────────────── */
function StoryProgress({
  total,
  current,
}: {
  total: number;
  current: number;
}) {
  return (
    <div className="flex items-center gap-1 px-3">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/15"
        >
          <motion.div
            className="h-full rounded-full bg-white"
            initial={false}
            animate={{ width: i <= current ? "100%" : "0%" }}
            transition={{
              duration: i === current ? 0.5 : 0.3,
              ease: "easeOut",
            }}
          />
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   DRAMATIC REVEAL — "anticipation" wrapper
   Shows a teaser label → pause → then reveals content
   ───────────────────────────────────────────── */
function DramaticReveal({
  label,
  active,
  revealDelay = 1.2,
  children,
}: {
  label: string;
  active: boolean;
  revealDelay?: number;
  children: React.ReactNode;
}) {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (!active) {
      setRevealed(false);
      return;
    }
    const t = setTimeout(() => setRevealed(true), revealDelay * 1000);
    return () => clearTimeout(t);
  }, [active, revealDelay]);

  if (!active) return null;

  return (
    <AnimatePresence mode="wait">
      {!revealed ? (
        <motion.div
          key="teaser"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: [0.8, 1.05, 1] }}
          exit={{ opacity: 0, scale: 1.2, filter: "blur(10px)" }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <motion.div
            className="text-sm font-black uppercase tracking-[0.3em] text-white/40"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          >
            {label}
          </motion.div>
          <motion.div className="mt-3 flex justify-center gap-1.5">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="h-1.5 w-1.5 rounded-full bg-white/50"
                animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  delay: i * 0.15,
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={SPRING_BOUNCY}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ═══════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════ */
export default function WrappedContent({ raceRound, isSprint = false }: Props) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<WrappedData | null>(null);
  const [slide, setSlide] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const prevSlide = useRef(0);

  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const touchMoveX = useRef(0);
  const isSwiping = useRef(false);

  const totalSlides = 6;
  const returnPath = isSprint
    ? `/race/${raceRound}?tab=sprint`
    : `/race/${raceRound}?tab=race`;

  // Parallax mouse tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 50, damping: 20 });
  const bgX = useTransform(smoothX, [0, 1], [-15, 15]);
  const bgY = useTransform(smoothY, [0, 1], [-15, 15]);

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      mouseX.set(e.clientX / window.innerWidth);
      mouseY.set(e.clientY / window.innerHeight);
    },
    [mouseX, mouseY],
  );

  useEffect(() => {
    if (authLoading) return;
    getWrappedData(raceRound, isSprint)
      .then(setData)
      .finally(() => setLoading(false));
  }, [raceRound, isSprint, authLoading]);

  // Confetti on points slide
  useEffect(() => {
    if (slide === 1 && prevSlide.current !== 1 && data && data.userPoints > 0) {
      const t = setTimeout(() => setShowConfetti(true), 1600);
      const t2 = setTimeout(() => setShowConfetti(false), 4000);
      return () => {
        clearTimeout(t);
        clearTimeout(t2);
      };
    }
    prevSlide.current = slide;
  }, [slide, data]);

  const goNext = useCallback(
    () => setSlide((p) => Math.min(p + 1, totalSlides - 1)),
    [],
  );
  const goPrev = useCallback(
    () => setSlide((p) => Math.max(p - 1, 0)),
    [],
  );

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        goNext();
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      }
      if (e.key === "Escape") router.push(returnPath);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [goNext, goPrev, router, returnPath]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    touchMoveX.current = e.touches[0].clientX;
    isSwiping.current = false;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    touchMoveX.current = e.touches[0].clientX;
    const dx = Math.abs(e.touches[0].clientX - touchStartX.current);
    const dy = Math.abs(e.touches[0].clientY - touchStartY.current);
    if (dx > 10 && dx > dy) isSwiping.current = true;
  };
  const onTouchEnd = () => {
    if (!isSwiping.current) return;
    const diff = touchStartX.current - touchMoveX.current;
    if (diff > 60) goNext();
    else if (diff < -60) goPrev();
  };
  const onTap = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("button, a")) return;
    const x = e.clientX;
    const w = window.innerWidth;
    if (x < w * 0.33) goPrev();
    else if (x > w * 0.66) goNext();
  };

  /* ── LOADING STATE ── */
  if (loading)
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0D0D0D]">
        <motion.div
          className="relative"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={SPRING_BOUNCY}
        >
          <motion.div
            className="h-20 w-20 rounded-full border-2 border-[#E60000]/20 border-t-[#E60000]"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-0 h-20 w-20 rounded-full border border-[#E60000]/10"
            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>
        <motion.div
          className="mt-10 text-sm font-black uppercase tracking-[0.4em] text-[#E60000]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <motion.span
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            Przygotowuję podsumowanie...
          </motion.span>
        </motion.div>
      </div>
    );

  /* ── EMPTY STATE ── */
  if (!data)
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0D0D0D] p-8 text-center">
        <motion.div
          className="mb-6 text-6xl"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={SPRING_BOUNCY}
        >
          🏁
        </motion.div>
        <p className="text-xl font-black text-white">Brak danych</p>
        <p className="mt-2 text-sm text-gray-500">
          Wyścig nie został jeszcze zakończony
        </p>
        <motion.button
          onClick={() => router.push(returnPath)}
          className="mt-8 rounded-xl bg-[#E60000] px-8 py-3 font-bold text-white"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Wróć
        </motion.button>
      </div>
    );

  const s = (n: number) => slide === n;

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden bg-[#0D0D0D] select-none"
      style={{ height: "100dvh" }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onClick={onTap}
      onMouseMove={onMouseMove}
    >
      {/* Story bars */}
      <div className="absolute top-0 right-0 left-0 z-50 px-2 pb-1 pt-[env(safe-area-inset-top,8px)]">
        <StoryProgress total={totalSlides} current={slide} />
      </div>

      {/* Close */}
      <motion.button
        onClick={(e) => {
          e.stopPropagation();
          router.push(returnPath);
        }}
        className="absolute right-3 z-50 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 backdrop-blur-md"
        style={{ top: "calc(env(safe-area-inset-top, 8px) + 20px)" }}
        whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.2)" }}
        whileTap={{ scale: 0.9 }}
      >
        <X className="h-4 w-4 text-white" />
      </motion.button>

      {/* Slide track */}
      <motion.div
        className="flex h-full"
        animate={{ x: `-${slide * 100}%` }}
        transition={{ type: "spring", stiffness: 300, damping: 35 }}
      >
        {/* ════════════ SLIDE 0: INTRO ════════════ */}
        <Panel>
          <BG gradient="from-[#0D0D0D] via-[#1a0000] to-[#0D0D0D]">
            <Particles />
            <GlowRing
              color="#E60000"
              size={400}
              className="left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            />
            <motion.div
              className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center"
              style={{ x: bgX, y: bgY }}
            >
              <AnimatePresence>
                {s(0) && (
                  <motion.div
                    className="flex flex-col items-center"
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <motion.div
                      variants={popIn}
                      className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#E60000]/30 bg-[#E60000]/20 backdrop-blur-md"
                    >
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        <Sparkles className="h-8 w-8 text-[#E60000]" />
                      </motion.div>
                    </motion.div>

                    <motion.div
                      variants={staggerItem}
                      className="mb-2 text-[10px] font-black uppercase tracking-[0.4em] text-[#E60000]/80"
                    >
                      Runda {data.raceRound}
                    </motion.div>

                    <motion.h1
                      variants={heroText}
                      className="mb-1 text-3xl font-black uppercase leading-[0.9] tracking-tight text-white sm:text-5xl"
                    >
                      {data.raceName
                        .replace(" Grand Prix", "")
                        .replace("Grand Prix ", "")}
                    </motion.h1>

                    <motion.div
                      variants={{
                        hidden: { opacity: 0, y: 40, scale: 0.7 },
                        visible: {
                          opacity: 1,
                          y: 0,
                          scale: 1,
                          transition: { ...SPRING_HEAVY, delay: 0.5 },
                        },
                      }}
                      className={clsx(
                        "mb-5 bg-gradient-to-r bg-clip-text text-xl font-black uppercase text-transparent sm:text-3xl",
                        isSprint
                          ? "from-amber-500 to-amber-300"
                          : "from-[#E60000] to-[#FF6B6B]",
                      )}
                    >
                      {isSprint ? "SPRINT" : "Grand Prix"}
                    </motion.div>

                    <motion.div
                      variants={{
                        hidden: { opacity: 0, width: 0 },
                        visible: {
                          opacity: 1,
                          width: "auto",
                          transition: { delay: 0.7, duration: 0.6 },
                        },
                      }}
                      className="mb-8 flex items-center gap-2 overflow-hidden text-xs text-gray-400"
                    >
                      <motion.div
                        className="h-1.5 w-1.5 rounded-full bg-[#E60000]"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      <span className="whitespace-nowrap font-bold uppercase tracking-widest">
                        {data.raceLocation}
                      </span>
                    </motion.div>

                    <motion.div
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: {
                          opacity: 1,
                          y: 0,
                          transition: { delay: 1 },
                        },
                      }}
                      className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-md"
                    >
                      <span className="text-[11px] font-bold text-gray-400">
                        Stuknij, aby kontynuować
                      </span>
                      <motion.span
                        className="text-[#E60000]"
                        animate={{ x: [0, 6, 0] }}
                        transition={{
                          duration: 1.2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        <ChevronRight className="h-3.5 w-3.5" />
                      </motion.span>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </BG>
        </Panel>

        {/* ════════════ SLIDE 1: YOUR POINTS ════════════ */}
        <Panel>
          <BG gradient="from-[#0D0D0D] via-[#0a0a1a] to-[#0D0D0D]">
            <Particles color="#4F46E5" />
            <ConfettiBurst active={showConfetti} />
            <GlowRing
              color="#E60000"
              size={350}
              className="left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            />
            <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
              <DramaticReveal
                label="Twoje punkty..."
                active={s(1)}
                revealDelay={1.4}
              >
                <motion.div
                  className="flex flex-col items-center"
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                >
                  <motion.div
                    variants={popIn}
                    className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-[#E60000]/30 bg-[#E60000]/20"
                  >
                    <Trophy className="h-6 w-6 text-[#E60000]" />
                  </motion.div>

                  <motion.div
                    variants={staggerItem}
                    className="mb-2 text-[10px] font-black uppercase tracking-[0.3em] text-[#E60000]/80"
                  >
                    Twoje punkty
                  </motion.div>

                  <motion.div variants={scaleReveal} className="mb-3">
                    <AnimatedCounter
                      target={data.userPoints}
                      delay={200}
                      className="w-glow text-7xl font-black tabular-nums leading-none text-white sm:text-9xl"
                    />
                    <span className="ml-1 text-xl font-bold text-gray-600">
                      /{data.maxPoints}
                    </span>
                  </motion.div>

                  <motion.div
                    variants={staggerItem}
                    className="mb-5 h-2.5 w-44 overflow-hidden rounded-full bg-white/10"
                  >
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-[#E60000] to-[#FF6B6B]"
                      initial={{ width: "0%" }}
                      animate={{
                        width: `${Math.round(
                          (data.userPoints / data.maxPoints) * 100,
                        )}%`,
                      }}
                      transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                    />
                  </motion.div>

                  <motion.div
                    variants={staggerItem}
                    className="flex flex-wrap justify-center gap-1.5"
                  >
                    {data.perfectPredictions > 0 && (
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1.5"
                      >
                        <span className="text-xs text-emerald-400">✨</span>
                        <span className="text-[11px] font-bold text-emerald-400">
                          {data.perfectPredictions} idealnie
                        </span>
                      </motion.div>
                    )}
                    {data.bonusP1 > 0 && (
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center gap-1.5 rounded-lg border border-[#E60000]/30 bg-[#E60000]/10 px-2.5 py-1.5"
                      >
                        <span className="text-xs text-[#E60000]">🏆</span>
                        <span className="text-[11px] font-bold text-[#E60000]">
                          +{data.bonusP1} za P1
                        </span>
                      </motion.div>
                    )}
                    {data.bonusPodium > 0 && (
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1.5"
                      >
                        <span className="text-xs text-amber-400">🥇</span>
                        <span className="text-[11px] font-bold text-amber-400">
                          +{data.bonusPodium} za podium
                        </span>
                      </motion.div>
                    )}
                  </motion.div>
                </motion.div>
              </DramaticReveal>
            </div>
          </BG>
        </Panel>

        {/* ════════════ SLIDE 2: FAVORITE DRIVER ════════════ */}
        <Panel>
          <BG gradient="from-[#0D0D0D] via-[#001a00] to-[#0D0D0D]">
            <Particles color="#10B981" />
            <GlowRing
              color="#10B981"
              size={280}
              className="left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2"
            />
            <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
              <DramaticReveal
                label="Twój ulubiony kierowca..."
                active={s(2)}
                revealDelay={1.2}
              >
                <motion.div
                  className="flex flex-col items-center"
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                >
                  <motion.div
                    variants={popIn}
                    className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/20"
                  >
                    <Heart className="h-6 w-6 text-emerald-400" />
                  </motion.div>

                  <motion.div
                    variants={staggerItem}
                    className="mb-2 text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400/80"
                  >
                    Twój ulubiony kierowca
                  </motion.div>

                  {data.favoriteDriverName ? (
                    <>
                      <motion.h2
                        variants={heroText}
                        className="mb-5 text-2xl font-black text-white sm:text-4xl"
                      >
                        {data.favoriteDriverName}
                      </motion.h2>

                      <motion.div variants={scaleReveal}>
                        {data.favoriteDriverFinishPos !== null ? (
                          <motion.div
                            className={`inline-flex flex-col items-center gap-2 rounded-2xl px-6 py-4 ${
                              data.favoriteDriverFinishPos === 1
                                ? "border border-[#E60000]/40 bg-[#E60000]/10"
                                : data.favoriteDriverFinishPos <= 3
                                  ? "border border-amber-500/30 bg-amber-500/10"
                                  : data.favoriteDriverInTop10
                                    ? "border border-emerald-500/30 bg-emerald-500/10"
                                    : "border border-white/10 bg-white/5"
                            }`}
                            whileHover={{ scale: 1.02 }}
                          >
                            {/* Big emoji reaction */}
                            <motion.div
                              className="text-5xl"
                              initial={{ scale: 0, rotate: -20 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ ...SPRING_BOUNCY, delay: 0.2 }}
                            >
                              {data.favoriteDriverFinishPos === 1
                                ? "🏆"
                                : data.favoriteDriverFinishPos <= 3
                                  ? "🥇"
                                  : data.favoriteDriverFinishPos <= 10
                                    ? "👏"
                                    : data.favoriteDriverFinishPos <= 15
                                      ? "😐"
                                      : "😢"}
                            </motion.div>
                            <div className="flex items-center gap-3">
                              <motion.span
                                className="text-4xl font-black text-white"
                                initial={{ scale: 0, rotate: -20 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ ...SPRING_BOUNCY, delay: 0.3 }}
                              >
                                P{data.favoriteDriverFinishPos}
                              </motion.span>
                              <div className="text-left">
                                <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                                  Pozycja
                                </div>
                                <div
                                  className={`text-sm font-black ${
                                    data.favoriteDriverFinishPos === 1
                                      ? "text-[#E60000]"
                                      : data.favoriteDriverFinishPos <= 3
                                        ? "text-amber-400"
                                        : data.favoriteDriverInTop10
                                          ? "text-emerald-400"
                                          : "text-gray-400"
                                  }`}
                                >
                                  {data.favoriteDriverFinishPos === 1
                                    ? "Zwycięstwo!"
                                    : data.favoriteDriverFinishPos <= 3
                                      ? "Podium!"
                                      : data.favoriteDriverInTop10
                                        ? "W top 10"
                                        : data.favoriteDriverFinishPos <= 15
                                          ? "Poza top 10"
                                          : "Koniec stawki"}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ) : (
                          <div className="flex flex-col items-center gap-2 rounded-2xl border border-gray-600/30 bg-gray-600/10 px-5 py-4">
                            <span className="text-4xl">💀</span>
                            <span className="text-base font-black text-gray-400">
                              DNF
                            </span>
                          </div>
                        )}
                      </motion.div>

                      {data.favoriteDriverF1Points > 0 && (
                        <motion.div
                          variants={staggerItem}
                          className="mt-4 flex items-center justify-between rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-5 py-2.5"
                        >
                          <span className="text-xs font-black uppercase tracking-wider text-emerald-400/70">
                            Punkty F1
                          </span>
                          <span className="text-lg font-black text-emerald-400">
                            +{data.favoriteDriverF1Points} pkt
                          </span>
                        </motion.div>
                      )}
                    </>
                  ) : (
                    <motion.div
                      variants={staggerItem}
                      className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3"
                    >
                      <span className="text-base text-gray-500">
                        Nie wybrałeś ulubionego kierowcy
                      </span>
                    </motion.div>
                  )}
                </motion.div>
              </DramaticReveal>
            </div>
          </BG>
        </Panel>

        {/* ════════════ SLIDE 3: FAVORITE TEAM ════════════ */}
        <Panel>
          <BG gradient="from-[#0D0D0D] via-[#0a001a] to-[#0D0D0D]">
            <Particles color="#8B5CF6" />
            <GlowRing
              color="#8B5CF6"
              size={280}
              className="bottom-1/3 right-1/4"
            />
            <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
              <DramaticReveal
                label="Twój ulubiony zespół..."
                active={s(3)}
                revealDelay={1.2}
              >
                <motion.div
                  className="flex flex-col items-center"
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                >
                  <motion.div
                    variants={popIn}
                    className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-purple-500/30 bg-purple-500/20"
                  >
                    <Star className="h-6 w-6 text-purple-400" />
                  </motion.div>

                  <motion.div
                    variants={staggerItem}
                    className="mb-2 text-[10px] font-black uppercase tracking-[0.3em] text-purple-400/80"
                  >
                    Twój ulubiony zespół
                  </motion.div>

                  {data.favoriteTeamName ? (
                    <>
                      <motion.div
                        variants={heroText}
                        className="mb-5 flex items-center gap-2.5"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <motion.img
                          src={getTeamLogo(data.favoriteTeamName)}
                          alt=""
                          className="h-8 w-8 object-contain brightness-0 invert opacity-80"
                          initial={{ rotate: -180, scale: 0 }}
                          animate={{ rotate: 0, scale: 1 }}
                          transition={{ ...SPRING_BOUNCY, delay: 0.5 }}
                        />
                        <h2 className="text-xl font-black text-white sm:text-3xl">
                          {data.favoriteTeamName}
                        </h2>
                      </motion.div>

                      <div className="w-full max-w-[280px] space-y-2.5">
                        {data.favoriteTeamDriverResults.map((dr, i) => (
                          <motion.div
                            key={dr.driverName}
                            variants={i === 0 ? slideFromLeft : slideFromRight}
                            className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3"
                            whileHover={{
                              scale: 1.02,
                              borderColor: "rgba(139,92,246,0.3)",
                            }}
                          >
                            <span className="text-sm font-bold text-white">
                              {dr.driverName}
                            </span>
                            <div className="flex items-center gap-2">
                              {/* Emoji reaction */}
                              <span className="text-base">
                                {dr.finishPos === null
                                  ? "💀"
                                  : dr.finishPos === 1
                                    ? "🏆"
                                    : dr.finishPos <= 3
                                      ? "🥇"
                                      : dr.finishPos <= 10
                                        ? "👍"
                                        : dr.finishPos <= 15
                                          ? "😐"
                                          : "😢"}
                              </span>
                              {dr.f1Points > 0 && (
                                <span className="rounded-md bg-purple-500/15 px-2 py-0.5 text-[10px] font-black text-purple-400">
                                  +{dr.f1Points} pkt
                                </span>
                              )}
                              <span
                                className={`text-lg font-black ${
                                  dr.finishPos !== null
                                    ? dr.finishPos <= 3
                                      ? "text-[#E60000]"
                                      : dr.finishPos <= 10
                                        ? "text-emerald-400"
                                        : "text-gray-400"
                                    : "text-gray-600"
                                }`}
                              >
                                {dr.finishPos !== null
                                  ? `P${dr.finishPos}`
                                  : "DNF"}
                              </span>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      {data.favoriteTeamTotalF1Points > 0 && (
                        <motion.div
                          variants={staggerItem}
                          className="mt-5 flex items-center justify-between rounded-xl border border-purple-500/20 bg-purple-500/5 px-5 py-2.5"
                        >
                          <span className="text-xs font-black uppercase tracking-wider text-purple-400/70">
                            Łącznie punktów F1
                          </span>
                          <span className="text-lg font-black text-purple-400">
                            +{data.favoriteTeamTotalF1Points} pkt
                          </span>
                        </motion.div>
                      )}
                    </>
                  ) : (
                    <motion.div
                      variants={staggerItem}
                      className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3"
                    >
                      <span className="text-base text-gray-500">
                        Nie wybrałeś ulubionego zespołu
                      </span>
                    </motion.div>
                  )}
                </motion.div>
              </DramaticReveal>
            </div>
          </BG>
        </Panel>

        {/* ════════════ SLIDE 4: COMPARISON ════════════ */}
        <Panel>
          <BG gradient="from-[#0D0D0D] via-[#1a0a00] to-[#0D0D0D]">
            <Particles color="#F59E0B" />
            <GlowRing
              color="#F59E0B"
              size={300}
              className="left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            />
            <div className="relative z-10 flex h-full flex-col items-center justify-center px-5 text-center">
              <DramaticReveal
                label="Na tle innych graczy..."
                active={s(4)}
                revealDelay={1.4}
              >
                <motion.div
                  className="flex flex-col items-center"
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                >
                  <motion.div
                    variants={popIn}
                    className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-500/30 bg-amber-500/20"
                  >
                    <Users className="h-6 w-6 text-amber-400" />
                  </motion.div>

                  <motion.div
                    variants={staggerItem}
                    className="mb-2 text-[10px] font-black uppercase tracking-[0.3em] text-amber-400/80"
                  >
                    Na tle innych
                  </motion.div>

                  <motion.div
                    variants={scaleReveal}
                    className="mb-1 flex items-baseline gap-1.5"
                  >
                    <AnimatedCounter
                      target={data.userRank}
                      delay={300}
                      className="text-6xl font-black tabular-nums leading-none text-white sm:text-8xl"
                    />
                    <span className="text-xl font-bold text-gray-500">
                      /{data.totalPlayers}
                    </span>
                  </motion.div>

                  <motion.div
                    variants={staggerItem}
                    className="mb-4 text-xs font-bold text-gray-400"
                  >
                    miejsce w rankingu
                  </motion.div>

                  {/* Ranking reaction */}
                  <motion.div
                    variants={staggerItem}
                    className={`mb-5 flex flex-col items-center gap-1 rounded-2xl border px-6 py-3 ${
                      data.userRank <= 2
                        ? "border-[#E60000]/30 bg-[#E60000]/10"
                        : data.userRank >= data.totalPlayers - 1
                          ? "border-gray-600/30 bg-gray-600/10"
                          : "border-amber-500/30 bg-amber-500/10"
                    }`}
                  >
                    <motion.span
                      className="text-4xl"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      {data.userRank <= 2
                        ? data.userRank === 1 ? "🥇" : "🥈"
                        : data.userRank >= data.totalPlayers - 1
                          ? data.userRank === data.totalPlayers ? "💀" : "😬"
                          : "💪"}
                    </motion.span>
                    <span className={`text-sm font-black ${
                      data.userRank <= 2
                        ? "text-[#E60000]"
                        : data.userRank >= data.totalPlayers - 1
                          ? "text-gray-400"
                          : "text-amber-400"
                    }`}>
                      {data.userRank === 1
                        ? "Jesteś na szczycie!"
                        : data.userRank === 2
                          ? "Prawie lider! 🔥"
                          : data.userRank >= data.totalPlayers
                            ? "Ostatnie miejsce 😅"
                            : data.userRank >= data.totalPlayers - 1
                              ? "Przedostatnie..."
                              : `Lepszy od ${data.playersBeaten} graczy 🔥`}
                    </span>
                  </motion.div>

                  <motion.div
                    variants={staggerItem}
                    className="w-full max-w-[300px] space-y-1.5"
                  >
                    {data.allScores.slice(0, 5).map((sc, i) => (
                      <motion.div
                        key={sc.userName + sc.rank}
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          ...SPRING_SOFT,
                          delay: 0.5 + i * 0.1,
                        }}
                        className={`flex items-center gap-2.5 rounded-xl px-3 py-2 ${
                          sc.isUser
                            ? "border border-[#E60000]/30 bg-[#E60000]/10"
                            : "bg-white/[0.03]"
                        }`}
                        whileHover={{
                          scale: 1.02,
                          backgroundColor: sc.isUser
                            ? "rgba(230,0,0,0.15)"
                            : "rgba(255,255,255,0.05)",
                        }}
                      >
                        <span
                          className={`w-5 shrink-0 text-xs font-black ${
                            sc.rank <= 3
                              ? "text-amber-400"
                              : "text-gray-500"
                          }`}
                        >
                          {sc.rank}
                        </span>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={sc.avatar}
                          alt=""
                          className="h-6 w-6 shrink-0 rounded-md object-cover"
                        />
                        <span
                          className={`flex-1 truncate text-left text-xs font-bold ${
                            sc.isUser ? "text-[#E60000]" : "text-white"
                          }`}
                        >
                          {sc.userName}
                          {sc.isUser && " (Ty)"}
                        </span>
                        <span className="shrink-0 text-xs font-black tabular-nums text-white">
                          {sc.points}
                        </span>
                      </motion.div>
                    ))}

                    {data.userRank > 5 && (
                      <>
                        <div className="flex justify-center gap-1 py-0.5">
                          {[0, 1, 2].map((i) => (
                            <motion.div
                              key={i}
                              className="h-0.5 w-0.5 rounded-full bg-gray-600"
                              animate={{
                                opacity: [0.3, 1, 0.3],
                              }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                                delay: i * 0.2,
                              }}
                            />
                          ))}
                        </div>
                        {data.allScores
                          .filter((sc) => sc.isUser)
                          .map((sc) => (
                            <motion.div
                              key="me"
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{
                                ...SPRING_BOUNCY,
                                delay: 1,
                              }}
                              className="flex items-center gap-2.5 rounded-xl border border-[#E60000]/30 bg-[#E60000]/10 px-3 py-2"
                            >
                              <span className="w-5 shrink-0 text-xs font-black text-gray-500">
                                {sc.rank}
                              </span>
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={sc.avatar}
                                alt=""
                                className="h-6 w-6 shrink-0 rounded-md object-cover"
                              />
                              <span className="flex-1 truncate text-left text-xs font-bold text-[#E60000]">
                                {sc.userName} (Ty)
                              </span>
                              <span className="shrink-0 text-xs font-black tabular-nums text-white">
                                {sc.points}
                              </span>
                            </motion.div>
                          ))}
                      </>
                    )}
                  </motion.div>

                  {data.pointsToFirst > 0 && (
                    <motion.div
                      variants={staggerItem}
                      className="mt-3 text-[10px] font-bold text-gray-500"
                    >
                      {data.pointsToFirst} pkt do lidera
                    </motion.div>
                  )}
                </motion.div>
              </DramaticReveal>
            </div>
          </BG>
        </Panel>

        {/* ════════════ SLIDE 5: SUMMARY (RECAP) ════════════ */}
        <Panel>
          <BG gradient="from-[#0D0D0D] via-[#120008] to-[#0D0D0D]">
            <Particles color="#E60000" />
            <GlowRing
              color="#E60000"
              size={350}
              className="left-1/2 top-1/4 -translate-x-1/2"
            />
            <GlowRing
              color="#8B5CF6"
              size={180}
              className="bottom-1/4 right-0"
            />
            <div className="relative z-10 flex h-full flex-col items-center justify-center overflow-y-auto px-5 py-20 text-center">
              <AnimatePresence>
                {s(5) && (
                  <motion.div
                    className="flex flex-col items-center"
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0 }}
                  >
                    {/* Title */}
                    <motion.div
                      variants={staggerItem}
                      className="mb-1 text-[10px] font-black uppercase tracking-[0.3em] text-[#E60000]/80"
                    >
                      Runda {data.raceRound} — Podsumowanie
                    </motion.div>
                    <motion.h2
                      variants={heroText}
                      className="mb-6 text-2xl font-black uppercase leading-tight text-white sm:text-3xl"
                    >
                      {data.raceName
                        .replace(" Grand Prix", "")
                        .replace("Grand Prix ", "")}{" "}
                      <span
                        className={clsx(
                          "bg-gradient-to-r bg-clip-text text-transparent",
                          isSprint
                            ? "from-amber-500 to-amber-300"
                            : "from-[#E60000] to-[#FF6B6B]",
                        )}
                      >
                        {isSprint ? "SPRINT" : "GP"}
                      </span>
                    </motion.h2>

                    {/* Points recap card */}
                    <motion.div
                      variants={scaleReveal}
                      className="mb-4 w-full max-w-sm rounded-2xl border border-[#E60000]/20 bg-[#E60000]/5 p-4"
                      whileHover={{ scale: 1.02, borderColor: "rgba(230,0,0,0.4)" }}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <Trophy className="h-5 w-5 text-[#E60000]" />
                          <span className="text-xs font-black uppercase tracking-wider text-[#E60000]/80">
                            Punkty
                          </span>
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-black tabular-nums text-white">
                            {data.userPoints}
                          </span>
                          <span className="text-sm text-gray-500">
                            /{data.maxPoints}
                          </span>
                        </div>
                      </div>
                      {(data.perfectPredictions > 0 ||
                        data.bonusP1 > 0 ||
                        data.bonusPodium > 0) && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {data.perfectPredictions > 0 && (
                            <span className="rounded-md bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                              ✨ {data.perfectPredictions} idealnie
                            </span>
                          )}
                          {data.bonusP1 > 0 && (
                            <span className="rounded-md bg-[#E60000]/15 px-2 py-0.5 text-[10px] font-bold text-[#E60000]">
                              🏆 +{data.bonusP1}
                            </span>
                          )}
                          {data.bonusPodium > 0 && (
                            <span className="rounded-md bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold text-amber-400">
                              🥇 +{data.bonusPodium}
                            </span>
                          )}
                        </div>
                      )}
                    </motion.div>

                    {/* Rank recap */}
                    <motion.div
                      variants={slideFromLeft}
                      className="mb-4 w-full max-w-sm rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <Users className="h-5 w-5 text-amber-400" />
                          <span className="text-xs font-black uppercase tracking-wider text-amber-400/80">
                            Ranking
                          </span>
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-black tabular-nums text-white">
                            {data.userRank}
                          </span>
                          <span className="text-sm text-gray-500">
                            /{data.totalPlayers}
                          </span>
                        </div>
                      </div>
                      {data.playersBeaten > 0 && (
                        <div className="mt-2 text-[11px] font-bold text-amber-400/70">
                          Lepszy od {data.playersBeaten} graczy 🔥
                        </div>
                      )}
                    </motion.div>

                    {/* Driver + Team recap */}
                    <motion.div
                      variants={slideFromRight}
                      className="mb-4 grid w-full max-w-sm grid-cols-2 gap-2"
                    >
                      <motion.div
                        className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-center"
                        whileHover={{ scale: 1.03, y: -2 }}
                      >
                        <Heart className="mx-auto mb-1.5 h-4 w-4 text-emerald-400" />
                        <div className="mb-1 text-[9px] font-black uppercase tracking-wider text-emerald-400/60">
                          Kierowca
                        </div>
                        <div className="truncate text-xs font-black text-white">
                          {data.favoriteDriverName?.split(" ").pop() || "—"}
                        </div>
                        <div
                          className={`mt-1 text-lg font-black ${
                            data.favoriteDriverFinishPos !== null
                              ? data.favoriteDriverFinishPos <= 3
                                ? "text-[#E60000]"
                                : data.favoriteDriverInTop10
                                  ? "text-emerald-400"
                                  : "text-gray-400"
                              : "text-gray-600"
                          }`}
                        >
                          {data.favoriteDriverFinishPos !== null
                            ? `P${data.favoriteDriverFinishPos}`
                            : "—"}
                        </div>
                      </motion.div>

                      <motion.div
                        className="rounded-2xl border border-purple-500/20 bg-purple-500/5 p-3 text-center"
                        whileHover={{ scale: 1.03, y: -2 }}
                      >
                        <Star className="mx-auto mb-1.5 h-4 w-4 text-purple-400" />
                        <div className="mb-1 text-[9px] font-black uppercase tracking-wider text-purple-400/60">
                          Zespół
                        </div>
                        <div className="truncate text-xs font-black text-white">
                          {data.favoriteTeamName || "—"}
                        </div>
                        <div
                          className={`mt-1 text-lg font-black ${
                            data.favoriteTeamBestPos !== null
                              ? data.favoriteTeamBestPos <= 3
                                ? "text-[#E60000]"
                                : data.favoriteTeamBestPos <= 10
                                  ? "text-purple-400"
                                  : "text-gray-400"
                              : "text-gray-600"
                          }`}
                        >
                          {data.favoriteTeamBestPos !== null
                            ? `P${data.favoriteTeamBestPos}`
                            : "—"}
                        </div>
                      </motion.div>
                    </motion.div>

                    {/* Random stats */}
                    <motion.div
                      variants={staggerItem}
                      className="mb-5 w-full max-w-sm space-y-2"
                    >
                      {data.randomStats.map((st, i) => (
                        <motion.div
                          key={st.id}
                          initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            ...SPRING_SOFT,
                            delay: 0.8 + i * 0.12,
                          }}
                          className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] px-3.5 py-2.5 text-left"
                          whileHover={{ scale: 1.02, x: 4 }}
                        >
                          <motion.span
                            className="shrink-0 text-xl"
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              delay: i * 0.3,
                            }}
                          >
                            {st.emoji}
                          </motion.span>
                          <div className="min-w-0 flex-1">
                            <div className="text-[9px] font-black uppercase tracking-wider text-gray-500">
                              {st.title}
                            </div>
                            <div className="text-sm font-black text-white">
                              {st.value}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>

                 {/* CTA */}
                    <motion.div variants={scaleReveal}>
                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(returnPath);
                        }}
                        className="group relative overflow-hidden rounded-xl bg-[#E60000] px-7 py-3 text-sm font-black text-white shadow-lg shadow-[#E60000]/30"
                        whileHover={{
                          scale: 1.08,
                          boxShadow: "0 0 40px rgba(230,0,0,0.5)",
                        }}
                        whileTap={{ scale: 0.92 }}
                        transition={SPRING_BOUNCY}
                      >
                        <span className="relative z-10">
                          Zobacz pełne wyniki →
                        </span>
                        <motion.div
                          className="absolute inset-0 bg-white/10"
                          initial={{ x: "-100%" }}
                          whileHover={{ x: "0%" }}
                          transition={{ duration: 0.3 }}
                        />
                      </motion.button>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </BG>
        </Panel>
      </motion.div>
    </div>
  );
}

/* ─── Layout helpers ─── */
function Panel({ children }: { children: React.ReactNode }) {
  return <div className="h-full w-full shrink-0">{children}</div>;
}

function BG({
  children,
  gradient,
}: {
  children: React.ReactNode;
  gradient: string;
}) {
  return (
    <div
      className={`relative h-full w-full overflow-hidden bg-gradient-to-b ${gradient}`}
    >
      {children}
    </div>
  );
}
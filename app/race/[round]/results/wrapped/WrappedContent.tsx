"use client";

import {
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
} from "react";
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
const SPRING_BOUNCY = {
  type: "spring",
  stiffness: 400,
  damping: 25,
} as const;
const SPRING_SOFT = {
  type: "spring",
  stiffness: 200,
  damping: 30,
} as const;
const SPRING_HEAVY = {
  type: "spring",
  stiffness: 100,
  damping: 20,
} as const;

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
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.3 },
  },
};

const staggerItem: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: SPRING_SOFT },
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
   PER-SLIDE TRANSITION VARIANTS
   enter  = how the new slide arrives
   center = resting state
   exit   = how the old slide leaves
   All transitions >= 2 s
   ───────────────────────────────────────────── */
const SLIDE_VARIANTS: Variants[] = Array.from({ length: 6 }, () => ({
  enter: { opacity: 0 },
  center: { opacity: 1, transition: { duration: 0.35, ease: "easeInOut" } },
  exit: { opacity: 0, transition: { duration: 0.25, ease: "easeInOut" } },
}));

/* ─────────────────────────────────────────────
   ANIMATED COUNTER
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
      const ease = p < 1 ? 1 - Math.pow(1 - p, 4) : 1;
      setCount(Math.round(target * ease));
      if (p < 1) raf.current = requestAnimationFrame(tick);
      else setCount(target);
    }
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [target, duration, started]);

  return (
    <span className={className}>
      {count}
      {suffix}
    </span>
  );
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
          style={{ width: p.w, height: p.h, backgroundColor: p.color }}
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
   PARTICLES
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
          transition={{ duration: p.dur, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   GLOW RING
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
      animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

/* ─────────────────────────────────────────────
   STORY PROGRESS BARS
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
   LAYOUT HELPERS
   ───────────────────────────────────────────── */
function Panel({ children }: { children: React.ReactNode }) {
  return <div className="h-full w-full">{children}</div>;
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

/* ═══════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════ */
export default function WrappedContent({
  raceRound,
  isSprint = false,
}: Props) {
  const { loading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<WrappedData | null>(null);
  const [slide, setSlide] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const prevSlide = useRef(0);

  const [slideLoading, setSlideLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Inicjalizacja podsumowania...");
  const [targetSlide, setTargetSlide] = useState(0);

  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const touchMoveX = useRef(0);
  const isSwiping = useRef(false);

  const totalSlides = 6;
  const returnPath = isSprint
    ? `/race/${raceRound}?tab=sprint`
    : `/race/${raceRound}?tab=race`;

  /* Parallax mouse */
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
      .finally(() => {
        setTargetSlide(0);
        setLoadingText("Inicjalizacja podsumowania...");
        setSlideLoading(true);
        setLoading(false);
        setTimeout(() => {
          setSlideLoading(false);
        }, 1500);
      });
  }, [raceRound, isSprint, authLoading]);

  /* Confetti on points slide */
  useEffect(() => {
    if (slide === 1 && prevSlide.current !== 1 && data && data.userPoints > 0) {
      const t = setTimeout(() => setShowConfetti(true), 400);
      const t2 = setTimeout(() => setShowConfetti(false), 3500);
      return () => {
        clearTimeout(t);
        clearTimeout(t2);
      };
    }
    prevSlide.current = slide;
  }, [slide, data]);

  const triggerSlideChange = useCallback((targetIndex: number) => {
    if (targetIndex === slide || slideLoading) return;
    
    setTargetSlide(targetIndex);

    // Choose loading text based on the target slide
    const texts = [
      "Inicjalizacja podsumowania...",
      "Podliczanie zdobyczy punktowych...",
      "Analizowanie typów kierowców...",
      "Porównywanie wyników zespołowych...",
      "Zestawianie wyników z rywalami...",
      "Generowanie podsumowania rundy..."
    ];
    setLoadingText(texts[targetIndex] || "Ładowanie danych...");
    setSlideLoading(true);

    // Swap the slide index at 900ms underneath the loader
    setTimeout(() => {
      setSlide(targetIndex);
    }, 900);

    // Hide the loader at 1500ms
    setTimeout(() => {
      setSlideLoading(false);
    }, 1500);
  }, [slide, slideLoading]);

  const goNext = useCallback(
    () => {
      const nextIdx = Math.min(slide + 1, totalSlides - 1);
      triggerSlideChange(nextIdx);
    },
    [slide, totalSlides, triggerSlideChange],
  );

  const goPrev = useCallback(
    () => {
      const prevIdx = Math.max(slide - 1, 0);
      triggerSlideChange(prevIdx);
    },
    [slide, triggerSlideChange],
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

  /* ── LOADING ── */
  if (loading)
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-[#0D0D0D]">
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              "radial-gradient(ellipse 60% 50% at 50% 50%, #E6000022 0%, transparent 70%)",
              "radial-gradient(ellipse 60% 50% at 50% 50%, #8B5CF622 0%, transparent 70%)",
              "radial-gradient(ellipse 60% 50% at 50% 50%, #F59E0B22 0%, transparent 70%)",
              "radial-gradient(ellipse 60% 50% at 50% 50%, #10B98122 0%, transparent 70%)",
              "radial-gradient(ellipse 60% 50% at 50% 50%, #E6000022 0%, transparent 70%)",
            ],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />

        <div
          className="relative flex items-center justify-center"
          style={{ width: 200, height: 200 }}
        >
          <motion.div
            className="absolute rounded-full"
            style={{
              width: 36,
              height: 36,
              background:
                "radial-gradient(circle, #E60000 0%, #FF6B6B 100%)",
            }}
            animate={{ scale: [1, 1.4, 1], opacity: [0.9, 0.5, 0.9] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute rounded-full border border-[#E60000]/40"
            style={{ width: 60, height: 60 }}
            animate={{ scale: [1, 1.8, 1], opacity: [0.4, 0, 0.4] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
          />

          <motion.div
            className="absolute"
            style={{ width: 110, height: 110 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
          >
            <motion.div
              className="absolute -top-3 left-1/2 h-6 w-6 -translate-x-1/2 rounded-full bg-[#E60000] shadow-lg shadow-[#E60000]/60"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1.1, repeat: Infinity }}
            />
          </motion.div>

          <motion.div
            className="absolute"
            style={{ width: 150, height: 150 }}
            animate={{ rotate: -360 }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
          >
            <motion.div
              className="absolute -top-3 left-1/2 h-6 w-6 -translate-x-1/2 bg-purple-500 shadow-lg shadow-purple-500/60"
              style={{ rotate: 45 }}
              animate={{ scale: [1, 1.2, 1], rotate: [45, 90, 45] }}
              transition={{ duration: 1.8, repeat: Infinity }}
            />
          </motion.div>

          <motion.div
            className="absolute"
            style={{ width: 195, height: 195 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "linear" }}
          >
            <motion.div
              className="absolute -top-3 left-1/2 -translate-x-1/2"
              style={{
                width: 0,
                height: 0,
                borderLeft: "8px solid transparent",
                borderRight: "8px solid transparent",
                borderBottom: "14px solid #F59E0B",
                filter: "drop-shadow(0 0 6px #F59E0B)",
              }}
              animate={{ scale: [1, 1.4, 1] }}
              transition={{ duration: 2.2, repeat: Infinity }}
            />
          </motion.div>

          <motion.div
            className="absolute"
            style={{ width: 130, height: 130 }}
            animate={{ rotate: -360 }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
          >
            <motion.div
              className="absolute bottom-0 left-1/2 h-5 w-5 -translate-x-1/2 rounded-sm bg-emerald-400 shadow-lg shadow-emerald-400/60"
              animate={{ scale: [1, 1.3, 1], rotate: [0, 45, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            />
          </motion.div>
        </div>

        <motion.div
          className="mt-10 flex gap-[2px]"
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: { staggerChildren: 0.06, delayChildren: 0.2 },
            },
          }}
        >
          {"F1 TYPY".split("").map((ch, i) => (
            <motion.span
              key={i}
              className={
                ch === " "
                  ? "w-3"
                  : "text-xs font-black uppercase tracking-[0.25em] text-[#E60000]"
              }
              variants={{
                hidden: { opacity: 0, y: 12, scale: 0.8 },
                visible: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: {
                    type: "spring",
                    stiffness: 400,
                    damping: 20,
                  },
                },
              }}
            >
              {ch}
            </motion.span>
          ))}
        </motion.div>

        <motion.div
          className="mt-6 h-[3px] w-40 overflow-hidden rounded-full bg-white/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{
              background:
                "linear-gradient(90deg, #E60000, #8B5CF6, #F59E0B, #10B981)",
            }}
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>

        <motion.p
          className="mt-4 text-[10px] font-bold uppercase tracking-[0.4em] text-gray-600"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          Przygotowuję podsumowanie
        </motion.p>
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
      className="fixed inset-0 z-50 select-none overflow-hidden bg-[#0D0D0D]"
      style={{ height: "100dvh" }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onClick={onTap}
      onMouseMove={onMouseMove}
    >
      {/* Story bars */}
      <div className="absolute left-0 right-0 top-0 z-50 px-2 pb-1 pt-[env(safe-area-inset-top,8px)]">
        <StoryProgress total={totalSlides} current={slide} />
      </div>

      {/* Close button */}
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

      {/* ── SLIDES ── */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={slide}
          className="absolute inset-0"
          variants={SLIDE_VARIANTS[slide] ?? SLIDE_VARIANTS[0]}
          initial="enter"
          animate="center"
          exit="exit"
          style={{ perspective: 1200 }}
        >
          <div className="h-full w-full">
            {/* ════════ SLIDE 0: INTRO ════════ */}
            {s(0) && (
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
                    <motion.div
                      className="flex flex-col items-center"
                      initial="hidden"
                      animate="visible"
                      variants={staggerContainer}
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
                          visible: { opacity: 1, y: 0, transition: { delay: 1 } },
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
                  </motion.div>
                </BG>
              </Panel>
            )}

            {/* ════════ SLIDE 1: YOUR POINTS ════════ */}
            {s(1) && (
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
                          className="text-7xl font-black tabular-nums leading-none text-white sm:text-9xl"
                        />
                        <span className="ml-1 text-xl font-bold text-gray-600">
                          /{data.maxPoints}
                        </span>
                      </motion.div>

                      <motion.div
                        variants={staggerItem}
                        className="mb-5 h-2.5 w-full max-w-[90vw] sm:max-w-[240px] overflow-hidden rounded-full bg-white/10"
                      >
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-[#E60000] to-[#FF6B6B]"
                          initial={{ width: "0%" }}
                          animate={{
                            width: `${Math.round(
                              (data.userPoints / data.maxPoints) * 100,
                            )}%`,
                          }}
                          transition={{
                            duration: 1.5,
                            delay: 0.5,
                            ease: "easeOut",
                          }}
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
                            <span className="text-xs text-emerald-400">
                              ✨
                            </span>
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
                  </div>
                </BG>
              </Panel>
            )}

            {/* ════════ SLIDE 2: FAVORITE DRIVER ════════ */}
            {s(2) && (
              <Panel>
                <BG gradient="from-[#0D0D0D] via-[#001a00] to-[#0D0D0D]">
                  <Particles color="#10B981" />
                  <GlowRing
                    color="#10B981"
                    size={280}
                    className="left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2"
                  />
                  <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
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
                  </div>
                </BG>
              </Panel>
            )}

            {/* ════════ SLIDE 3: FAVORITE TEAM ════════ */}
            {s(3) && (
              <Panel>
                <BG gradient="from-[#0D0D0D] via-[#0a001a] to-[#0D0D0D]">
                  <Particles color="#8B5CF6" />
                  <GlowRing
                    color="#8B5CF6"
                    size={280}
                    className="bottom-1/3 right-1/4"
                  />
                  <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
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

                          <div className="w-full max-w-[92vw] sm:max-w-[280px] space-y-2.5">
                            {data.favoriteTeamDriverResults.map((dr, i) => (
                              <motion.div
                                key={dr.driverName}
                                variants={
                                  i === 0 ? slideFromLeft : slideFromRight
                                }
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
                              className="mt-5 flex w-full max-w-[92vw] sm:max-w-[280px] items-center justify-between rounded-xl border border-purple-500/20 bg-purple-500/5 px-5 py-2.5"
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
                  </div>
                </BG>
              </Panel>
            )}

            {/* ════════ SLIDE 4: COMPARISON ════════ */}
            {s(4) && (
              <Panel>
                <BG gradient="from-[#0D0D0D] via-[#1a0a00] to-[#0D0D0D]">
                  <Particles color="#F59E0B" />
                  <GlowRing
                    color="#F59E0B"
                    size={300}
                    className="left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                  />
                  <div className="relative z-10 flex h-full flex-col items-center justify-center px-5 text-center">
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
                            ? data.userRank === 1
                              ? "🥇"
                              : "🥈"
                            : data.userRank >= data.totalPlayers - 1
                              ? data.userRank === data.totalPlayers
                                ? "💀"
                                : "😬"
                              : "💪"}
                        </motion.span>
                        <span
                          className={`text-sm font-black ${
                            data.userRank <= 2
                              ? "text-[#E60000]"
                              : data.userRank >= data.totalPlayers - 1
                                ? "text-gray-400"
                                : "text-amber-400"
                          }`}
                        >
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
                        className="w-full max-w-[92vw] sm:max-w-[300px] space-y-1.5"
                      >
                        {data.allScores.slice(0, 5).map((sc, i) => (
                          <motion.div
                            key={sc.userName + sc.rank}
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ ...SPRING_SOFT, delay: 0.5 + i * 0.1 }}
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
                                sc.rank <= 3 ? "text-amber-400" : "text-gray-500"
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
                                  animate={{ opacity: [0.3, 1, 0.3] }}
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
                                  transition={{ ...SPRING_BOUNCY, delay: 1 }}
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
                  </div>
                </BG>
              </Panel>
            )}

            {/* ════════ SLIDE 5: SUMMARY ════════ */}
            {s(5) && (
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
                    <motion.div
                      className="flex flex-col items-center"
                      variants={staggerContainer}
                      initial="hidden"
                      animate="visible"
                    >
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

                      {/* Points recap */}
                      <motion.div
                        variants={scaleReveal}
                        className="mb-4 w-full max-w-[92vw] sm:max-w-sm rounded-2xl border border-[#E60000]/20 bg-[#E60000]/5 p-4"
                        whileHover={{
                          scale: 1.02,
                          borderColor: "rgba(230,0,0,0.4)",
                        }}
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
                        className="mb-4 w-full max-w-[92vw] sm:max-w-sm rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4"
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
                        className="mb-4 grid w-full max-w-[92vw] sm:max-w-sm grid-cols-2 gap-2"
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
                        className="mb-5 w-full max-w-[92vw] sm:max-w-sm space-y-2"
                      >
                        {data.randomStats.map((st, i) => (
                          <motion.div
                            key={st.id}
                            initial={{
                              opacity: 0,
                              x: i % 2 === 0 ? -40 : 40,
                            }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ ...SPRING_SOFT, delay: 0.8 + i * 0.12 }}
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
                  </div>
                </BG>
              </Panel>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* ── FAKE SLIDE LOADING OVERLAY ── */}
      <AnimatePresence>
        {slideLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0D0D0D] overflow-hidden"
          >
            {/* Ambient glowing radial light */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              animate={{
                background: [
                  "radial-gradient(ellipse 60% 50% at 50% 50%, #E600001a 0%, transparent 70%)",
                  "radial-gradient(ellipse 60% 50% at 50% 50%, #FF78001a 0%, transparent 70%)",
                  "radial-gradient(ellipse 60% 50% at 50% 50%, #E600001a 0%, transparent 70%)",
                ],
              }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Orbiting Elements Themed Per Slide */}
            <div className="relative flex items-center justify-center" style={{ width: 220, height: 220 }}>
              {/* Target Slide 0: Intro (Original loading screen elements matching user screenshot) */}
              {targetSlide === 0 && (
                <>
                  <motion.div
                    className="absolute rounded-full"
                    style={{
                      width: 36,
                      height: 36,
                      background: "radial-gradient(circle, #E60000 0%, #FF6B6B 100%)",
                    }}
                    animate={{ scale: [1, 1.4, 1], opacity: [0.9, 0.5, 0.9] }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.div className="absolute rounded-full border border-[#E60000]/40" style={{ width: 60, height: 60 }} animate={{ scale: [1, 1.8, 1], opacity: [0.4, 0, 0.4] }} transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }} />
                  <motion.div className="absolute" style={{ width: 110, height: 110 }} animate={{ rotate: 360 }} transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}>
                    <motion.div className="absolute -top-3 left-1/2 h-6 w-6 -translate-x-1/2 rounded-full bg-[#E60000] shadow-lg shadow-[#E60000]/60" animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1.1, repeat: Infinity }} />
                  </motion.div>
                  <motion.div className="absolute" style={{ width: 150, height: 150 }} animate={{ rotate: -360 }} transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}>
                    <motion.div className="absolute -top-3 left-1/2 h-6 w-6 -translate-x-1/2 bg-purple-500 shadow-lg shadow-purple-500/60" style={{ rotate: 45 }} animate={{ scale: [1, 1.2, 1], rotate: [45, 90, 45] }} transition={{ duration: 1.8, repeat: Infinity }} />
                  </motion.div>
                  <motion.div className="absolute" style={{ width: 195, height: 195 }} animate={{ rotate: 360 }} transition={{ duration: 5.5, repeat: Infinity, ease: "linear" }}>
                    <motion.div className="absolute -top-3 left-1/2 -translate-x-1/2" style={{ width: 0, height: 0, borderLeft: "8px solid transparent", borderRight: "8px solid transparent", borderBottom: "14px solid #F59E0B", filter: "drop-shadow(0 0 6px #F59E0B)" }} animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 2.2, repeat: Infinity }} />
                  </motion.div>
                  <motion.div className="absolute" style={{ width: 130, height: 130 }} animate={{ rotate: -360 }} transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}>
                    <motion.div className="absolute bottom-0 left-1/2 h-5 w-5 -translate-x-1/2 rounded-sm bg-emerald-400 shadow-lg shadow-emerald-400/60" animate={{ scale: [1, 1.3, 1], rotate: [0, 45, 0] }} transition={{ duration: 0.8, repeat: Infinity }} />
                  </motion.div>
                </>
              )}

              {/* Target Slide 1: Points (Gold Stars & Dollar Spheres) */}
              {targetSlide === 1 && (
                <>
                  <motion.div
                    className="absolute rounded-full"
                    style={{
                      width: 36,
                      height: 36,
                      background: "radial-gradient(circle, #F59E0B 0%, #FFD700 100%)",
                    }}
                    animate={{ scale: [1, 1.4, 1], opacity: [0.9, 0.5, 0.9] }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.div className="absolute rounded-full border border-yellow-500/40" style={{ width: 60, height: 60 }} animate={{ scale: [1, 1.8, 1], opacity: [0.4, 0, 0.4] }} transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }} />
                  <motion.div className="absolute" style={{ width: 120, height: 120 }} animate={{ rotate: 360 }} transition={{ duration: 2.0, repeat: Infinity, ease: "linear" }}>
                    <motion.div className="absolute -top-3 left-1/2 h-5 w-5 -translate-x-1/2 bg-yellow-400 shadow-lg shadow-yellow-400/60 rounded-full flex items-center justify-center font-bold text-[10px] text-black" animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1.0, repeat: Infinity }}>★</motion.div>
                  </motion.div>
                  <motion.div className="absolute" style={{ width: 160, height: 160 }} animate={{ rotate: -360 }} transition={{ duration: 3.0, repeat: Infinity, ease: "linear" }}>
                    <motion.div className="absolute -top-3 left-1/2 h-6 w-6 -translate-x-1/2 bg-amber-500 shadow-lg shadow-amber-500/60 rounded-full flex items-center justify-center font-black text-[12px] text-white" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>$</motion.div>
                  </motion.div>
                  <motion.div className="absolute" style={{ width: 140, height: 140 }} animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}>
                    <motion.div className="absolute bottom-0 left-1/2 h-5 w-5 -translate-x-1/2 rounded-full bg-yellow-300 shadow-lg shadow-yellow-300/60 flex items-center justify-center text-[10px]" animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 0.75, repeat: Infinity }}>🏆</motion.div>
                  </motion.div>
                </>
              )}

              {/* Target Slide 2: Driver (Emerald Hearts & Squares) */}
              {targetSlide === 2 && (
                <>
                  <motion.div
                    className="absolute rounded-full"
                    style={{
                      width: 36,
                      height: 36,
                      background: "radial-gradient(circle, #10B981 0%, #34D399 100%)",
                    }}
                    animate={{ scale: [1, 1.4, 1], opacity: [0.9, 0.5, 0.9] }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.div className="absolute rounded-full border border-emerald-500/40" style={{ width: 60, height: 60 }} animate={{ scale: [1, 1.8, 1], opacity: [0.4, 0, 0.4] }} transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }} />
                  <motion.div className="absolute" style={{ width: 130, height: 130 }} animate={{ rotate: -360 }} transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}>
                    <motion.div className="absolute -top-3 left-1/2 h-6 w-6 -translate-x-1/2 bg-emerald-400 shadow-lg shadow-emerald-400/60 rounded-full flex items-center justify-center text-[11px]" animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1.25, repeat: Infinity }}>❤️</motion.div>
                  </motion.div>
                  <motion.div className="absolute" style={{ width: 170, height: 170 }} animate={{ rotate: 360 }} transition={{ duration: 4.0, repeat: Infinity, ease: "linear" }}>
                    <motion.div className="absolute -top-3 left-1/2 h-5 w-5 -translate-x-1/2 bg-teal-500 shadow-lg shadow-teal-500/60" style={{ rotate: 45 }} animate={{ scale: [1, 1.2, 1], rotate: [45, 90, 45] }} transition={{ duration: 2.0, repeat: Infinity }} />
                  </motion.div>
                  <motion.div className="absolute" style={{ width: 110, height: 110 }} animate={{ rotate: -360 }} transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}>
                    <motion.div className="absolute bottom-0 left-1/2 h-4 w-4 -translate-x-1/2 rounded-full bg-green-400 shadow-lg shadow-green-400/60" animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 0.9, repeat: Infinity }} />
                  </motion.div>
                </>
              )}

              {/* Target Slide 3: Team (Cyan Construction Elements) */}
              {targetSlide === 3 && (
                <>
                  <motion.div
                    className="absolute rounded-full"
                    style={{
                      width: 36,
                      height: 36,
                      background: "radial-gradient(circle, #06B6D4 0%, #38BDF8 100%)",
                    }}
                    animate={{ scale: [1, 1.4, 1], opacity: [0.9, 0.5, 0.9] }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.div className="absolute rounded-full border border-cyan-500/40" style={{ width: 60, height: 60 }} animate={{ scale: [1, 1.8, 1], opacity: [0.4, 0, 0.4] }} transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }} />
                  <motion.div className="absolute" style={{ width: 140, height: 140 }} animate={{ rotate: 360 }} transition={{ duration: 3.0, repeat: Infinity, ease: "linear" }}>
                    <motion.div className="absolute -top-3 left-1/2 -translate-x-1/2" style={{ width: 0, height: 0, borderLeft: "8px solid transparent", borderRight: "8px solid transparent", borderBottom: "14px solid #06B6D4", filter: "drop-shadow(0 0 6px #06B6D4)" }} animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
                  </motion.div>
                  <motion.div className="absolute" style={{ width: 180, height: 180 }} animate={{ rotate: -360 }} transition={{ duration: 5.0, repeat: Infinity, ease: "linear" }}>
                    <motion.div className="absolute -top-3 left-1/2 h-6 w-6 -translate-x-1/2 bg-sky-400 shadow-lg shadow-sky-400/60 rounded-full" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2.5, repeat: Infinity }} />
                  </motion.div>
                  <motion.div className="absolute" style={{ width: 115, height: 115 }} animate={{ rotate: 360 }} transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}>
                    <motion.div className="absolute bottom-0 left-1/2 h-5 w-5 -translate-x-1/2 bg-indigo-500 shadow-lg shadow-indigo-500/60" style={{ rotate: 45 }} animate={{ scale: [1, 1.3, 1], rotate: [0, 45, 0] }} transition={{ duration: 1.1, repeat: Infinity }} />
                  </motion.div>
                </>
              )}

              {/* Target Slide 4: Comparison (Red vs Blue Duel chasing) */}
              {targetSlide === 4 && (
                <>
                  <motion.div
                    className="absolute rounded-full"
                    style={{
                      width: 36,
                      height: 36,
                      background: "radial-gradient(circle, #8B5CF6 0%, #A78BFA 100%)",
                    }}
                    animate={{ scale: [1, 1.4, 1], opacity: [0.9, 0.5, 0.9] }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.div className="absolute rounded-full border border-purple-500/40" style={{ width: 60, height: 60 }} animate={{ scale: [1, 1.8, 1], opacity: [0.4, 0, 0.4] }} transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }} />
                  <motion.div className="absolute" style={{ width: 130, height: 130 }} animate={{ rotate: 360 }} transition={{ duration: 2.0, repeat: Infinity, ease: "linear" }}>
                    <motion.div className="absolute -top-3 left-1/2 h-6 w-6 -translate-x-1/2 bg-red-500 shadow-lg shadow-red-500/60 rounded-full" animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1.0, repeat: Infinity }} />
                  </motion.div>
                  <motion.div className="absolute" style={{ width: 130, height: 130 }} animate={{ rotate: 360 }} transition={{ duration: 2.0, repeat: Infinity, ease: "linear" }}>
                    <motion.div className="absolute bottom-0 left-1/2 h-6 w-6 -translate-x-1/2 bg-blue-500 shadow-lg shadow-blue-500/60 rounded-full" animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1.0, repeat: Infinity }} />
                  </motion.div>
                  <motion.div className="absolute" style={{ width: 170, height: 170 }} animate={{ rotate: -360 }} transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}>
                    <motion.div className="absolute -top-3 left-1/2 -translate-x-1/2" style={{ width: 0, height: 0, borderLeft: "7px solid transparent", borderRight: "7px solid transparent", borderBottom: "12px solid #8B5CF6", filter: "drop-shadow(0 0 5px #8B5CF6)" }} animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1.75, repeat: Infinity }} />
                  </motion.div>
                </>
              )}

              {/* Target Slide 5: Summary (Checkered Flag / All orbiter spin) */}
              {targetSlide === 5 && (
                <>
                  <motion.div
                    className="absolute rounded-full"
                    style={{
                      width: 36,
                      height: 36,
                      background: "radial-gradient(circle, #ffffff 0%, #9CA3AF 100%)",
                    }}
                    animate={{ scale: [1, 1.4, 1], opacity: [0.9, 0.5, 0.9] }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.div className="absolute rounded-full border border-gray-400/40" style={{ width: 60, height: 60 }} animate={{ scale: [1, 1.8, 1], opacity: [0.4, 0, 0.4] }} transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }} />
                  <motion.div className="absolute" style={{ width: 110, height: 110 }} animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}>
                    <motion.div className="absolute -top-3 left-1/2 h-5 w-5 -translate-x-1/2 rounded-full bg-[#E60000] shadow-lg shadow-[#E60000]/60" animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 0.75, repeat: Infinity }} />
                  </motion.div>
                  <motion.div className="absolute" style={{ width: 140, height: 140 }} animate={{ rotate: -360 }} transition={{ duration: 2.0, repeat: Infinity, ease: "linear" }}>
                    <motion.div className="absolute -top-3 left-1/2 h-6 w-6 -translate-x-1/2 bg-purple-500 shadow-lg shadow-purple-500/60" style={{ rotate: 45 }} animate={{ scale: [1, 1.2, 1], rotate: [45, 90, 45] }} transition={{ duration: 1.0, repeat: Infinity }} />
                  </motion.div>
                  <motion.div className="absolute" style={{ width: 175, height: 175 }} animate={{ rotate: 360 }} transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}>
                    <motion.div className="absolute -top-3 left-1/2 -translate-x-1/2" style={{ width: 0, height: 0, borderLeft: "8px solid transparent", borderRight: "8px solid transparent", borderBottom: "14px solid #F59E0B", filter: "drop-shadow(0 0 6px #F59E0B)" }} animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 1.25, repeat: Infinity }} />
                  </motion.div>
                  <motion.div className="absolute" style={{ width: 200, height: 200 }} animate={{ rotate: -360 }} transition={{ duration: 3.0, repeat: Infinity, ease: "linear" }}>
                    <motion.div className="absolute bottom-0 left-1/2 h-5 w-5 -translate-x-1/2 rounded-sm bg-emerald-400 shadow-lg shadow-emerald-400/60" animate={{ scale: [1, 1.3, 1], rotate: [0, 45, 0] }} transition={{ duration: 1.5, repeat: Infinity }} />
                  </motion.div>
                </>
              )}
            </div>

            {/* Staggered header text styling */}
            <motion.div
              className="mt-8 flex gap-[2px]"
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: { staggerChildren: 0.06, delayChildren: 0.2 },
                },
              }}
            >
              {"F1 TYPY".split("").map((ch, i) => (
                <motion.span
                  key={i}
                  className={
                    ch === " "
                      ? "w-3"
                      : "text-xs font-black uppercase tracking-[0.25em] text-[#E60000]"
                  }
                  variants={{
                    hidden: { opacity: 0, y: 12, scale: 0.8 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      transition: {
                        type: "spring",
                        stiffness: 400,
                        damping: 20,
                      },
                    },
                  }}
                >
                  {ch}
                </motion.span>
              ))}
            </motion.div>

            {/* Sweep progress bar with exact linear-gradient style */}
            <motion.div
              className="mt-6 h-[3px] w-40 overflow-hidden rounded-full bg-white/10 relative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{
                  background:
                    "linear-gradient(90deg, #E60000, #8B5CF6, #F59E0B, #10B981)",
                  width: "100%",
                  position: "absolute",
                }}
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>

            {/* Dynamic loading text */}
            <motion.p
              className="mt-4 text-[10px] font-bold uppercase tracking-[0.4em] text-gray-500"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              {loadingText}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
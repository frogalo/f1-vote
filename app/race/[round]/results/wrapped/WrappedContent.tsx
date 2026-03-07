"use client";

import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { getWrappedData, type WrappedData } from "@/app/actions/wrapped";
import { useAuth } from "@/app/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { getTeamLogo } from "@/lib/data";
import {
  Trophy,
  Star,
  Heart,
  Users,
  Zap,
  X,
  Sparkles,
} from "lucide-react";

type Props = { raceRound: number };

/* ─── Animated counter — animates on mount (A wrapper handles visibility) ─── */
function AnimatedCounter({
  target,
  duration = 1500,
  suffix = "",
  className = "",
}: {
  target: number;
  duration?: number;
  suffix?: string;
  className?: string;
}) {
  const [count, setCount] = useState(0);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const t0 = performance.now();
    function tick(now: number) {
      const p = Math.min((now - t0) / duration, 1);
      setCount(Math.round(target * (1 - Math.pow(1 - p, 4))));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    }
    raf.current = requestAnimationFrame(tick);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [target, duration]);

  return <span className={className}>{count}{suffix}</span>;
}

/* ─── Particles (memoized) ─── */
function Particles({ color = "#E60000" }: { color?: string }) {
  const pts = useMemo(
    () => Array.from({ length: 10 }, (_, i) => ({
      k: i, w: Math.random() * 4 + 2,
      l: Math.random() * 100, t: Math.random() * 100,
      d: Math.random() * 5, dur: Math.random() * 4 + 3,
      o: Math.random() * 0.4 + 0.1,
    })), []
  );
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {pts.map(p => (
        <div key={p.k} className="absolute rounded-full animate-float-particle"
          style={{ width: p.w, height: p.w, backgroundColor: color, opacity: p.o,
            left: `${p.l}%`, top: `${p.t}%`, animationDelay: `${p.d}s`, animationDuration: `${p.dur}s` }} />
      ))}
    </div>
  );
}

/* ─── Story progress bars ─── */
function StoryProgress({ total, current }: { total: number; current: number }) {
  return (
    <div className="flex items-center gap-1 px-3">
      {Array.from({ length: total }, (_, i) => (
        <div key={i} className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/15">
          <div className="h-full rounded-full bg-white transition-all duration-500 ease-out"
            style={{ width: i <= current ? "100%" : "0%" }} />
        </div>
      ))}
    </div>
  );
}

/* ─── Anim wrapper: renders children only when slide is active, applies anim ─── */
function A({ anim, delay, active, children }: {
  anim: string; delay?: string; active: boolean; children: React.ReactNode;
}) {
  if (!active) return null;
  return <div className={`${anim} ${delay || ""}`}>{children}</div>;
}

export default function WrappedContent({ raceRound }: Props) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<WrappedData | null>(null);
  const [slide, setSlide] = useState(0);

  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const touchMoveX = useRef(0);
  const isSwiping = useRef(false);

  const totalSlides = 6;

  useEffect(() => {
    if (authLoading) return;
    getWrappedData(raceRound).then(setData).finally(() => setLoading(false));
  }, [raceRound, authLoading]);

  const goNext = useCallback(() => setSlide(p => Math.min(p + 1, totalSlides - 1)), []);
  const goPrev = useCallback(() => setSlide(p => Math.max(p - 1, 0)), []);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); goNext(); }
      if (e.key === "ArrowLeft") { e.preventDefault(); goPrev(); }
      if (e.key === "Escape") router.push(`/race/${raceRound}/results`);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [goNext, goPrev, router, raceRound]);

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
    const x = e.clientX, w = window.innerWidth;
    if (x < w * 0.33) goPrev();
    else if (x > w * 0.66) goNext();
  };

  if (loading) return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0D0D0D]">
      <div className="relative">
        <div className="h-16 w-16 animate-spin rounded-full border-2 border-[#E60000]/20 border-t-[#E60000]" />
        <div className="absolute inset-0 h-16 w-16 animate-ping rounded-full border border-[#E60000]/10" />
      </div>
      <div className="mt-8 animate-pulse text-sm font-black uppercase tracking-[0.4em] text-[#E60000]">
        Przygotowuję podsumowanie...
      </div>
    </div>
  );

  if (!data) return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0D0D0D] p-8 text-center">
      <div className="mb-6 text-6xl">🏁</div>
      <p className="text-xl font-black text-white">Brak danych</p>
      <p className="mt-2 text-sm text-gray-500">Wyścig nie został jeszcze zakończony</p>
      <button onClick={() => router.push(`/race/${raceRound}/results`)}
        className="mt-8 rounded-xl bg-[#E60000] px-8 py-3 font-bold text-white active:scale-95">
        Wróć
      </button>
    </div>
  );

  const s = (n: number) => slide === n; // is slide active?

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#0D0D0D] select-none"
      style={{ height: "100dvh" }}
      onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}
      onClick={onTap}>

      {/* Story bars */}
      <div className="absolute top-0 left-0 right-0 z-50 pt-[env(safe-area-inset-top,8px)] px-2 pb-1">
        <StoryProgress total={totalSlides} current={slide} />
      </div>

      {/* Close */}
      <button onClick={e => { e.stopPropagation(); router.push(`/race/${raceRound}/results`); }}
        className="absolute right-3 z-50 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 active:scale-90"
        style={{ top: "calc(env(safe-area-inset-top, 8px) + 20px)" }}>
        <X className="h-4 w-4 text-white" />
      </button>

      {/* Slide track */}
      <div className="flex h-full transition-transform duration-400 ease-out"
        style={{ transform: `translateX(-${slide * 100}%)` }}>

        {/* ════════════ SLIDE 0: INTRO ════════════ */}
        <Panel>
          <BG gradient="from-[#0D0D0D] via-[#1a0000] to-[#0D0D0D]">
            <Particles />
            <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
              <A anim="w-pop" active={s(0)}>
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E60000]/20 backdrop-blur-md border border-[#E60000]/30">
                  <Sparkles className="h-8 w-8 text-[#E60000]" />
                </div>
              </A>
              <A anim="w-fade-down" delay="w-d2" active={s(0)}>
                <div className="mb-2 text-[10px] font-black uppercase tracking-[0.4em] text-[#E60000]/80">
                  Runda {data.raceRound}
                </div>
              </A>
              <A anim="w-blur-in" delay="w-d3" active={s(0)}>
                <h1 className="mb-1 text-3xl sm:text-5xl font-black uppercase leading-[0.9] tracking-tight text-white">
                  {data.raceName.replace(" Grand Prix", "").replace("Grand Prix ", "")}
                </h1>
              </A>
              <A anim="w-fade-up" delay="w-d4" active={s(0)}>
                <div className="mb-5 text-xl sm:text-3xl font-black uppercase bg-gradient-to-r from-[#E60000] to-[#FF6B6B] bg-clip-text text-transparent">
                  Grand Prix
                </div>
              </A>
              <A anim="w-fade-up" delay="w-d5" active={s(0)}>
                <div className="mb-8 flex items-center gap-2 text-xs text-gray-400">
                  <div className="h-1.5 w-1.5 rounded-full bg-[#E60000]" />
                  <span className="font-bold uppercase tracking-widest">{data.raceLocation}</span>
                </div>
              </A>
              <A anim="w-scale-up" delay="w-d6" active={s(0)}>
                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-md">
                  <span className="text-[11px] font-bold text-gray-400">Stuknij, aby kontynuować</span>
                  <span className="text-[#E60000] animate-pulse">→</span>
                </div>
              </A>
            </div>
          </BG>
        </Panel>

        {/* ════════════ SLIDE 1: YOUR POINTS ════════════ */}
        <Panel>
          <BG gradient="from-[#0D0D0D] via-[#0a0a1a] to-[#0D0D0D]">
            <Particles color="#4F46E5" />
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[300px] rounded-full bg-[#E60000]/10 blur-[100px]" />
            </div>
            <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
              <A anim="w-scale-up" active={s(1)}>
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E60000]/20 border border-[#E60000]/30">
                  <Trophy className="h-6 w-6 text-[#E60000]" />
                </div>
              </A>
              <A anim="w-fade-down" delay="w-d1" active={s(1)}>
                <div className="mb-2 text-[10px] font-black uppercase tracking-[0.3em] text-[#E60000]/80">
                  Twoje punkty
                </div>
              </A>
              <A anim="w-blur-in" delay="w-d2" active={s(1)}>
                <div className="mb-3">
                  <AnimatedCounter target={data.userPoints}
                    className="text-7xl sm:text-9xl font-black text-white tabular-nums leading-none w-glow" />
                  <span className="text-xl font-bold text-gray-600 ml-1">/{data.maxPoints}</span>
                </div>
              </A>
              <A anim="w-fade-up" delay="w-d3" active={s(1)}>
                <div className="mb-5 h-2.5 w-44 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-gradient-to-r from-[#E60000] to-[#FF6B6B] transition-all duration-1000 ease-out"
                    style={{ width: s(1) ? `${Math.round((data.userPoints / data.maxPoints) * 100)}%` : "0%" }} />
                </div>
              </A>
              <A anim="w-fade-up" delay="w-d4" active={s(1)}>
                <div className="flex flex-wrap justify-center gap-1.5">
                  {data.perfectPredictions > 0 && (
                    <div className="flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1.5">
                      <span className="text-emerald-400 text-xs">✨</span>
                      <span className="text-[11px] font-bold text-emerald-400">{data.perfectPredictions} idealnie</span>
                    </div>
                  )}
                  {data.bonusP1 > 0 && (
                    <div className="flex items-center gap-1.5 rounded-lg border border-[#E60000]/30 bg-[#E60000]/10 px-2.5 py-1.5">
                      <span className="text-[#E60000] text-xs">🏆</span>
                      <span className="text-[11px] font-bold text-[#E60000]">+{data.bonusP1} za P1</span>
                    </div>
                  )}
                  {data.bonusPodium > 0 && (
                    <div className="flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1.5">
                      <span className="text-amber-400 text-xs">🥇</span>
                      <span className="text-[11px] font-bold text-amber-400">+{data.bonusPodium} za podium</span>
                    </div>
                  )}
                </div>
              </A>
            </div>
          </BG>
        </Panel>

        {/* ════════════ SLIDE 2: FAVORITE DRIVER ════════════ */}
        <Panel>
          <BG gradient="from-[#0D0D0D] via-[#001a00] to-[#0D0D0D]">
            <Particles color="#10B981" />
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[250px] w-[250px] rounded-full bg-emerald-500/10 blur-[90px]" />
            </div>
            <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
              <A anim="w-pop" active={s(2)}>
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20 border border-emerald-500/30">
                  <Heart className="h-6 w-6 text-emerald-400" />
                </div>
              </A>
              <A anim="w-fade-down" delay="w-d1" active={s(2)}>
                <div className="mb-2 text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400/80">
                  Twój ulubiony kierowca
                </div>
              </A>
              {data.favoriteDriverName ? (
                <>
                  <A anim="w-blur-in" delay="w-d2" active={s(2)}>
                    <h2 className="mb-5 text-2xl sm:text-4xl font-black text-white">
                      {data.favoriteDriverName}
                    </h2>
                  </A>
                  <A anim="w-scale-up" delay="w-d4" active={s(2)}>
                    {data.favoriteDriverFinishPos !== null ? (
                      <div className={`inline-flex items-center gap-3 rounded-2xl px-5 py-3 ${
                        data.favoriteDriverFinishPos <= 3 ? "border border-[#E60000]/30 bg-[#E60000]/10"
                          : data.favoriteDriverInTop10 ? "border border-emerald-500/30 bg-emerald-500/10"
                          : "border border-white/10 bg-white/5"
                      }`}>
                        <span className="text-4xl font-black text-white">P{data.favoriteDriverFinishPos}</span>
                        <div className="text-left">
                          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Pozycja</div>
                          <div className={`text-sm font-black ${
                            data.favoriteDriverFinishPos === 1 ? "text-[#E60000]"
                              : data.favoriteDriverFinishPos <= 3 ? "text-amber-400"
                              : data.favoriteDriverInTop10 ? "text-emerald-400" : "text-gray-400"
                          }`}>
                            {data.favoriteDriverFinishPos === 1 ? "🏆 Zwycięstwo!"
                              : data.favoriteDriverFinishPos <= 3 ? "🥇 Podium!"
                              : data.favoriteDriverInTop10 ? "✅ W top 10" : "Poza top 10"}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="rounded-2xl border border-gray-600/30 bg-gray-600/10 px-5 py-3">
                        <span className="text-base font-black text-gray-400">Nie ukończył w top 20</span>
                      </div>
                    )}
                  </A>
                  {data.favoriteDriverF1Points > 0 && (
                    <A anim="w-fade-up" delay="w-d5" active={s(2)}>
                      <div className="mt-4 flex items-center justify-between rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-5 py-2.5">
                        <span className="text-xs font-black uppercase tracking-wider text-emerald-400/70">Punkty F1</span>
                        <span className="text-lg font-black text-emerald-400">+{data.favoriteDriverF1Points} pkt</span>
                      </div>
                    </A>
                  )}
                </>
              ) : (
                <A anim="w-fade-up" delay="w-d2" active={s(2)}>
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3">
                    <span className="text-base text-gray-500">Nie wybrałeś ulubionego kierowcy</span>
                  </div>
                </A>
              )}
            </div>
          </BG>
        </Panel>

        {/* ════════════ SLIDE 3: FAVORITE TEAM ════════════ */}
        <Panel>
          <BG gradient="from-[#0D0D0D] via-[#0a001a] to-[#0D0D0D]">
            <Particles color="#8B5CF6" />
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute bottom-1/3 right-1/4 h-[250px] w-[250px] rounded-full bg-purple-500/10 blur-[90px]" />
            </div>
            <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
              <A anim="w-fade-right" active={s(3)}>
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/20 border border-purple-500/30">
                  <Star className="h-6 w-6 text-purple-400" />
                </div>
              </A>
              <A anim="w-fade-left" delay="w-d1" active={s(3)}>
                <div className="mb-2 text-[10px] font-black uppercase tracking-[0.3em] text-purple-400/80">
                  Twój ulubiony zespół
                </div>
              </A>
              {data.favoriteTeamName ? (
                <>
                  <A anim="w-blur-in" delay="w-d2" active={s(3)}>
                    <div className="mb-5 flex items-center gap-2.5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={getTeamLogo(data.favoriteTeamName)} alt=""
                        className="h-8 w-8 object-contain brightness-0 invert opacity-80" />
                      <h2 className="text-xl sm:text-3xl font-black text-white">{data.favoriteTeamName}</h2>
                    </div>
                  </A>
                  <div className="space-y-2.5 w-full max-w-[280px]">
                    {data.favoriteTeamDriverResults.map((dr, i) => (
                      <A key={dr.driverName} anim="w-fade-left" delay={i === 0 ? "w-d3" : "w-d4"} active={s(3)}>
                        <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                          <span className="text-sm font-bold text-white">{dr.driverName}</span>
                          <div className="flex items-center gap-3">
                            {dr.f1Points > 0 && (
                              <span className="rounded-md bg-purple-500/15 px-2 py-0.5 text-[10px] font-black text-purple-400">+{dr.f1Points} pkt</span>
                            )}
                            <span className={`text-lg font-black ${
                              dr.finishPos !== null
                                ? dr.finishPos <= 3 ? "text-[#E60000]"
                                : dr.finishPos <= 10 ? "text-emerald-400" : "text-gray-400"
                                : "text-gray-600"
                            }`}>
                              {dr.finishPos !== null ? `P${dr.finishPos}` : "DNF"}
                            </span>
                          </div>
                        </div>
                      </A>
                    ))}
                  </div>
                  {data.favoriteTeamTotalF1Points > 0 && (
                    <A anim="w-fade-up" delay="w-d5" active={s(3)}>
                      <div className="mt-5 flex items-center justify-between rounded-xl border border-purple-500/20 bg-purple-500/5 px-5 py-2.5">
                        <span className="text-xs font-black uppercase tracking-wider text-purple-400/70">Łącznie punktów F1</span>
                        <span className="text-lg font-black text-purple-400">+{data.favoriteTeamTotalF1Points} pkt</span>
                      </div>
                    </A>
                  )}
                </>
              ) : (
                <A anim="w-fade-up" delay="w-d2" active={s(3)}>
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3">
                    <span className="text-base text-gray-500">Nie wybrałeś ulubionego zespołu</span>
                  </div>
                </A>
              )}
            </div>
          </BG>
        </Panel>

        {/* ════════════ SLIDE 4: COMPARISON ════════════ */}
        <Panel>
          <BG gradient="from-[#0D0D0D] via-[#1a0a00] to-[#0D0D0D]">
            <Particles color="#F59E0B" />
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[250px] w-[250px] rounded-full bg-amber-500/10 blur-[90px]" />
            </div>
            <div className="relative z-10 flex h-full flex-col items-center justify-center px-5 text-center">
              <A anim="w-fade-down" active={s(4)}>
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/20 border border-amber-500/30">
                  <Users className="h-6 w-6 text-amber-400" />
                </div>
              </A>
              <A anim="w-fade-down" delay="w-d1" active={s(4)}>
                <div className="mb-2 text-[10px] font-black uppercase tracking-[0.3em] text-amber-400/80">Na tle innych</div>
              </A>
              <A anim="w-pop" delay="w-d2" active={s(4)}>
                <div className="mb-1 flex items-baseline gap-1.5">
                  <AnimatedCounter target={data.userRank}
                    className="text-6xl sm:text-8xl font-black text-white tabular-nums leading-none" />
                  <span className="text-xl font-bold text-gray-500">/{data.totalPlayers}</span>
                </div>
              </A>
              <A anim="w-fade-up" delay="w-d3" active={s(4)}>
                <div className="mb-4 text-xs font-bold text-gray-400">miejsce w rankingu</div>
              </A>
              {data.playersBeaten > 0 && (
                <A anim="w-scale-up" delay="w-d3" active={s(4)}>
                  <div className="mb-4 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2">
                    <span className="text-xs font-black text-amber-400">Lepszy od {data.playersBeaten} graczy! 🔥</span>
                  </div>
                </A>
              )}
              <A anim="w-fade-up" delay="w-d4" active={s(4)}>
                <div className="w-full max-w-[300px] space-y-1.5">
                  {data.allScores.slice(0, 5).map(sc => (
                    <div key={sc.userName + sc.rank}
                      className={`flex items-center gap-2.5 rounded-xl px-3 py-2 ${
                        sc.isUser ? "border border-[#E60000]/30 bg-[#E60000]/10" : "bg-white/[0.03]"
                      }`}>
                      <span className={`text-xs font-black w-5 shrink-0 ${sc.rank <= 3 ? "text-amber-400" : "text-gray-500"}`}>{sc.rank}</span>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={sc.avatar} alt="" className="h-6 w-6 shrink-0 rounded-md object-cover" />
                      <span className={`flex-1 text-left text-xs font-bold truncate ${sc.isUser ? "text-[#E60000]" : "text-white"}`}>
                        {sc.userName}{sc.isUser && " (Ty)"}
                      </span>
                      <span className="text-xs font-black text-white tabular-nums shrink-0">{sc.points}</span>
                    </div>
                  ))}
                  {data.userRank > 5 && (
                    <>
                      <div className="flex justify-center gap-1 py-0.5">
                        {[0,1,2].map(i => <div key={i} className="h-0.5 w-0.5 rounded-full bg-gray-600" />)}
                      </div>
                      {data.allScores.filter(sc => sc.isUser).map(sc => (
                        <div key="me" className="flex items-center gap-2.5 rounded-xl px-3 py-2 border border-[#E60000]/30 bg-[#E60000]/10">
                          <span className="text-xs font-black w-5 shrink-0 text-gray-500">{sc.rank}</span>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={sc.avatar} alt="" className="h-6 w-6 shrink-0 rounded-md object-cover" />
                          <span className="flex-1 text-left text-xs font-bold text-[#E60000] truncate">{sc.userName} (Ty)</span>
                          <span className="text-xs font-black text-white tabular-nums shrink-0">{sc.points}</span>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </A>
              {data.pointsToFirst > 0 && (
                <A anim="w-fade-up" delay="w-d5" active={s(4)}>
                  <div className="mt-3 text-[10px] font-bold text-gray-500">{data.pointsToFirst} pkt do lidera</div>
                </A>
              )}
            </div>
          </BG>
        </Panel>

        {/* ════════════ SLIDE 5: SUMMARY (RECAP) ════════════ */}
        <Panel>
          <BG gradient="from-[#0D0D0D] via-[#120008] to-[#0D0D0D]">
            <Particles color="#E60000" />
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/4 left-1/2 -translate-x-1/2 h-[200px] w-[300px] rounded-full bg-[#E60000]/8 blur-[100px]" />
              <div className="absolute bottom-1/4 right-0 h-[150px] w-[150px] rounded-full bg-purple-500/8 blur-[80px]" />
            </div>
            <div className="relative z-10 flex h-full flex-col items-center justify-center px-5 text-center overflow-y-auto py-20">

              {/* Title */}
              <A anim="w-blur-in" active={s(5)}>
                <div className="mb-1 text-[10px] font-black uppercase tracking-[0.3em] text-[#E60000]/80">
                  Runda {data.raceRound} — Podsumowanie
                </div>
              </A>
              <A anim="w-fade-down" delay="w-d1" active={s(5)}>
                <h2 className="mb-6 text-2xl sm:text-3xl font-black uppercase text-white leading-tight">
                  {data.raceName.replace(" Grand Prix", "").replace("Grand Prix ", "")}{" "}
                  <span className="bg-gradient-to-r from-[#E60000] to-[#FF6B6B] bg-clip-text text-transparent">GP</span>
                </h2>
              </A>

              {/* Points recap card */}
              <A anim="w-scale-up" delay="w-d2" active={s(5)}>
                <div className="mb-4 w-full max-w-sm rounded-2xl border border-[#E60000]/20 bg-[#E60000]/5 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-[#E60000]" />
                      <span className="text-xs font-black uppercase tracking-wider text-[#E60000]/80">Punkty</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-white tabular-nums">{data.userPoints}</span>
                      <span className="text-sm text-gray-500">/{data.maxPoints}</span>
                    </div>
                  </div>
                  {(data.perfectPredictions > 0 || data.bonusP1 > 0 || data.bonusPodium > 0) && (
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
                </div>
              </A>

              {/* Rank recap */}
              <A anim="w-fade-left" delay="w-d3" active={s(5)}>
                <div className="mb-4 w-full max-w-sm rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-amber-400" />
                      <span className="text-xs font-black uppercase tracking-wider text-amber-400/80">Ranking</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-white tabular-nums">{data.userRank}</span>
                      <span className="text-sm text-gray-500">/{data.totalPlayers}</span>
                    </div>
                  </div>
                  {data.playersBeaten > 0 && (
                    <div className="mt-2 text-[11px] font-bold text-amber-400/70">
                      Lepszy od {data.playersBeaten} graczy 🔥
                    </div>
                  )}
                </div>
              </A>

              {/* Driver + Team recap side-by-side */}
              <A anim="w-fade-right" delay="w-d4" active={s(5)}>
                <div className="mb-4 grid grid-cols-2 gap-2 w-full max-w-sm">
                  {/* Fav driver */}
                  <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-center">
                    <Heart className="mx-auto mb-1.5 h-4 w-4 text-emerald-400" />
                    <div className="text-[9px] font-black uppercase tracking-wider text-emerald-400/60 mb-1">Kierowca</div>
                    <div className="text-xs font-black text-white truncate">
                      {data.favoriteDriverName?.split(" ").pop() || "—"}
                    </div>
                    <div className={`mt-1 text-lg font-black ${
                      data.favoriteDriverFinishPos !== null
                        ? data.favoriteDriverFinishPos <= 3 ? "text-[#E60000]"
                        : data.favoriteDriverInTop10 ? "text-emerald-400" : "text-gray-400"
                        : "text-gray-600"
                    }`}>
                      {data.favoriteDriverFinishPos !== null ? `P${data.favoriteDriverFinishPos}` : "—"}
                    </div>
                  </div>
                  {/* Fav team */}
                  <div className="rounded-2xl border border-purple-500/20 bg-purple-500/5 p-3 text-center">
                    <Star className="mx-auto mb-1.5 h-4 w-4 text-purple-400" />
                    <div className="text-[9px] font-black uppercase tracking-wider text-purple-400/60 mb-1">Zespół</div>
                    <div className="text-xs font-black text-white truncate">
                      {data.favoriteTeamName || "—"}
                    </div>
                    <div className={`mt-1 text-lg font-black ${
                      data.favoriteTeamBestPos !== null
                        ? data.favoriteTeamBestPos <= 3 ? "text-[#E60000]"
                        : data.favoriteTeamBestPos <= 10 ? "text-purple-400" : "text-gray-400"
                        : "text-gray-600"
                    }`}>
                      {data.favoriteTeamBestPos !== null ? `P${data.favoriteTeamBestPos}` : "—"}
                    </div>
                  </div>
                </div>
              </A>

              {/* Random stats */}
              <A anim="w-fade-up" delay="w-d5" active={s(5)}>
                <div className="mb-5 w-full max-w-sm space-y-2">
                  {data.randomStats.map(st => (
                    <div key={st.id} className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] px-3.5 py-2.5 text-left">
                      <span className="text-xl shrink-0">{st.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-[9px] font-black uppercase tracking-wider text-gray-500">{st.title}</div>
                        <div className="text-sm font-black text-white">{st.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </A>

              {/* CTA */}
              <A anim="w-scale-up" delay="w-d6" active={s(5)}>
                <button onClick={e => { e.stopPropagation(); router.push(`/race/${raceRound}/results`); }}
                  className="group relative overflow-hidden rounded-xl bg-[#E60000] px-7 py-3 font-black text-sm text-white shadow-lg shadow-[#E60000]/30 active:scale-95">
                  <span className="relative z-10">Zobacz pełne wyniki →</span>
                  <div className="absolute inset-0 -translate-x-full bg-white/10 transition-transform group-hover:translate-x-0" />
                </button>
              </A>
            </div>
          </BG>
        </Panel>
      </div>
    </div>
  );
}

/* ─── Layout helpers ─── */
function Panel({ children }: { children: React.ReactNode }) {
  return <div className="h-full w-full shrink-0">{children}</div>;
}

function BG({ children, gradient }: { children: React.ReactNode; gradient: string }) {
  return <div className={`relative h-full w-full overflow-hidden bg-gradient-to-b ${gradient}`}>{children}</div>;
}

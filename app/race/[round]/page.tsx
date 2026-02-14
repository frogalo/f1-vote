import { drivers, races } from "@/lib/data";
import { VoteComponent } from "./VoteComponent";

export async function generateStaticParams() {
  return races.map((r) => ({ round: r.round.toString() }));
}

export default async function Page({ params }: { params: Promise<{ round: string }> }) {
  // Server Component passes params to Client Component if needed
  // But to keep it simple and client-side interactive, we can make this file a Server Component 
  // that renders a Client Component.

  const { round: roundStr } = await params;
  const round = Number(roundStr);
  const race = races.find((r) => r.round === round);

  if (!race) return null;

  return <VoteComponent race={race} drivers={drivers} />;
}

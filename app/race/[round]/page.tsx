import { drivers, races } from "@/lib/data";
import { VoteComponent } from "./VoteComponent";

export async function generateStaticParams() {
  return races.map((r) => ({ round: r.round.toString() }));
}

export default function Page({ params }: { params: { round: string } }) {
  // Server Component passes params to Client Component if needed
  // But to keep it simple and client-side interactive, we can make this file a Server Component 
  // that renders a Client Component.
  
  const round = Number(params.round);
  const race = races.find((r) => r.round === round);
  
  if (!race) return null;

  return <VoteComponent race={race} drivers={drivers} />;
}

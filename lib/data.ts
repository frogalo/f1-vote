export type Driver = {
  id: string; // e.g. "ver"
  name: string; // "Max Verstappen"
  number: number; // 1
  team: string; // "Red Bull Racing"
  color: string; // Tailwind class "bg-red-600"
};

export const drivers: Driver[] = [
  {
    id: "ver",
    name: "Max Verstappen",
    number: 1,
    team: "Red Bull Racing",
    color: "bg-blue-900 border-red-600",
  },
  {
    id: "per",
    name: "Sergio Perez",
    number: 11,
    team: "Red Bull Racing",
    color: "bg-blue-900 border-red-600",
  },
  {
    id: "ham",
    name: "Lewis Hamilton",
    number: 44,
    team: "Ferrari",
    color: "bg-red-600 border-yellow-400",
  },
  {
    id: "lec",
    name: "Charles Leclerc",
    number: 16,
    team: "Ferrari",
    color: "bg-red-600 border-white",
  },
  {
    id: "rus",
    name: "George Russell",
    number: 63,
    team: "Mercedes",
    color: "bg-slate-300 border-cyan-400",
  },
  {
    id: "ant",
    name: "Kimi Antonelli",
    number: 12,
    team: "Mercedes",
    color: "bg-slate-300 border-cyan-400",
  },
  {
    id: "nor",
    name: "Lando Norris",
    number: 4,
    team: "McLaren",
    color: "bg-orange-500 border-black",
  },
  {
    id: "pia",
    name: "Oscar Piastri",
    number: 81,
    team: "McLaren",
    color: "bg-orange-500 border-black",
  },
  {
    id: "alo",
    name: "Fernando Alonso",
    number: 14,
    team: "Aston Martin",
    color: "bg-emerald-700 border-lime-400",
  },
  {
    id: "str",
    name: "Lance Stroll",
    number: 18,
    team: "Aston Martin",
    color: "bg-emerald-700 border-lime-400",
  },
  {
    id: "gas",
    name: "Pierre Gasly",
    number: 10,
    team: "Alpine",
    color: "bg-pink-500 border-blue-600",
  },
  {
    id: "doo",
    name: "Jack Doohan",
    number: 7,
    team: "Alpine",
    color: "bg-pink-500 border-blue-600",
  },
  {
    id: "alb",
    name: "Alex Albon",
    number: 23,
    team: "Williams",
    color: "bg-blue-800 border-blue-400",
  },
  {
    id: "sai",
    name: "Carlos Sainz",
    number: 55,
    team: "Williams",
    color: "bg-blue-800 border-blue-400",
  },
  {
    id: "oco",
    name: "Esteban Ocon",
    number: 31,
    team: "Haas",
    color: "bg-slate-100 border-red-600 text-black",
  }, // Haas white/red
  {
    id: "bea",
    name: "Oliver Bearman",
    number: 87,
    team: "Haas",
    color: "bg-slate-100 border-red-600 text-black",
  },
  {
    id: "hul",
    name: "Nico Hulkenberg",
    number: 27,
    team: "Sauber",
    color: "bg-green-400 border-black text-black",
  }, // Kick Green
  {
    id: "bor",
    name: "Gabriel Bortoleto",
    number: 5,
    team: "Sauber",
    color: "bg-green-400 border-black text-black",
  },
  {
    id: "tsu",
    name: "Yuki Tsunoda",
    number: 22,
    team: "RB",
    color: "bg-blue-600 border-white",
  },
  {
    id: "law",
    name: "Liam Lawson",
    number: 30,
    team: "RB",
    color: "bg-blue-600 border-white",
  },
];

export const races = [
  { round: 1, name: "Australian Grand Prix", date: "2025-03-16T05:00:00Z" }, // Example date
  { round: 2, name: "Chinese Grand Prix", date: "2025-03-23T07:00:00Z" },
  // ... can expand
];

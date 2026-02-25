export type Driver = {
  id: string; // e.g. "ver"
  name: string; // "Max Verstappen"
  number: number; // 1
  team: string; // "Red Bull Racing"
  color: string; // Tailwind class "bg-red-600"
  country: string; // ISO 3166-1 alpha-2 code (e.g. "NL", "GB")
  active?: boolean; // Default true
};

export type Race = {
  round: number;
  name: string;
  location: string;
  date: string; // ISO date of race day
  isTesting?: boolean;
};

export const getTeamLogo = (team: string) => {
  const slugs: Record<string, string> = {
    "Alpine": "alpine",
    "Aston Martin": "astonmartin",
    "Williams": "williams",
    "Audi": "audi",
    "Cadillac": "cadillac",
    "Ferrari": "ferrari",
    "Haas": "haas",
    "McLaren": "mclaren",
    "Mercedes": "mercedes",
    "Racing Bulls": "racingbulls",
    "Red Bull Racing": "redbullracing"
  };
  const slug = slugs[team] || team.toLowerCase().replace(/\s+/g, '');
  return `https://media.formula1.com/image/upload/c_lfill,w_48/q_auto/v1740000000/common/f1/2026/${slug}/2026${slug}logowhite.webp`;
};

export const drivers: Driver[] = [
  // Alpine
  {
    id: "gas",
    name: "Pierre Gasly",
    number: 43,
    team: "Alpine",
    color: "bg-pink-500 border-blue-600",
    country: "FR",
  },
  {
    id: "col",
    name: "Franco Colapinto",
    number: 10,
    team: "Alpine",
    color: "bg-pink-500 border-blue-600",
    country: "AR",
  },
  // Aston Martin
  {
    id: "alo",
    name: "Fernando Alonso",
    number: 14,
    team: "Aston Martin",
    color: "bg-emerald-700 border-lime-400",
    country: "ES",
  },
  {
    id: "str",
    name: "Lance Stroll",
    number: 18,
    team: "Aston Martin",
    color: "bg-emerald-700 border-lime-400",
    country: "CA",
  },
  // Williams
  {
    id: "alb",
    name: "Alexander Albon",
    number: 23,
    team: "Williams",
    color: "bg-blue-800 border-blue-400",
    country: "TH",
  },
  {
    id: "sai",
    name: "Carlos Sainz Jr.",
    number: 55,
    team: "Williams",
    color: "bg-blue-800 border-blue-400",
    country: "ES",
  },
  // Audi
  {
    id: "bor",
    name: "Gabriel Bortoleto",
    number: 5,
    team: "Audi",
    color: "bg-red-700 border-white",
    country: "BR",
  },
  {
    id: "hul",
    name: "Nico Hülkenberg",
    number: 27,
    team: "Audi",
    color: "bg-red-700 border-white",
    country: "DE",
  },
  // Cadillac
  {
    id: "per",
    name: "Sergio Pérez",
    number: 11,
    team: "Cadillac",
    color: "bg-slate-700 border-yellow-500",
    country: "MX",
  },
  {
    id: "bot",
    name: "Valtteri Bottas",
    number: 77,
    team: "Cadillac",
    color: "bg-slate-700 border-yellow-500",
    country: "FI",
  },
  // Ferrari
  {
    id: "lec",
    name: "Charles Leclerc",
    number: 16,
    team: "Ferrari",
    color: "bg-red-600 border-yellow-400",
    country: "MC",
  },
  {
    id: "ham",
    name: "Lewis Hamilton",
    number: 44,
    team: "Ferrari",
    color: "bg-red-600 border-yellow-400",
    country: "GB",
  },
  // Haas
  {
    id: "oco",
    name: "Esteban Ocon",
    number: 31,
    team: "Haas",
    color: "bg-slate-100 border-red-600 text-black",
    country: "FR",
  },
  {
    id: "bea",
    name: "Oliver Bearman",
    number: 87,
    team: "Haas",
    color: "bg-slate-100 border-red-600 text-black",
    country: "GB",
  },
  // McLaren
  {
    id: "nor",
    name: "Lando Norris",
    number: 1,
    team: "McLaren",
    color: "bg-orange-500 border-black",
    country: "GB",
  },
  {
    id: "pia",
    name: "Oscar Piastri",
    number: 81,
    team: "McLaren",
    color: "bg-orange-500 border-black",
    country: "AU",
  },
  // Mercedes
  {
    id: "ant",
    name: "Kimi Antonelli",
    number: 12,
    team: "Mercedes",
    color: "bg-slate-300 border-cyan-400 text-black",
    country: "IT",
  },
  {
    id: "rus",
    name: "George Russell",
    number: 63,
    team: "Mercedes",
    color: "bg-slate-300 border-cyan-400 text-black",
    country: "GB",
  },
  // Racing Bulls
  {
    id: "law",
    name: "Liam Lawson",
    number: 30,
    team: "Racing Bulls",
    color: "bg-blue-600 border-white",
    country: "NZ",
  },
  {
    id: "lin",
    name: "Arvid Lindblad",
    number: 41,
    team: "Racing Bulls",
    color: "bg-blue-600 border-white",
    country: "GB",
  },
  // Red Bull Racing
  {
    id: "ver",
    name: "Max Verstappen",
    number: 3,
    team: "Red Bull Racing",
    color: "bg-blue-900 border-red-600",
    country: "NL",
  },
  {
    id: "had",
    name: "Isack Hadjar",
    number: 6,
    team: "Red Bull Racing",
    color: "bg-blue-900 border-red-600",
    country: "FR",
  },
];

export const races: Race[] = [
  {
    round: 1,
    name: "Grand Prix Australii",
    location: "Melbourne",
    date: "2026-03-08T05:00:00Z",
  },
  {
    round: 2,
    name: "Grand Prix Chin",
    location: "Szanghaj",
    date: "2026-03-15T07:00:00Z",
  },
  {
    round: 3,
    name: "Grand Prix Japonii",
    location: "Suzuka",
    date: "2026-03-29T06:00:00Z",
  },
  {
    round: 4,
    name: "Grand Prix Bahrajnu",
    location: "Sakhir",
    date: "2026-04-12T15:00:00Z",
  },
  {
    round: 5,
    name: "Grand Prix Arabii Saudyjskiej",
    location: "Dżudda",
    date: "2026-04-19T19:00:00Z",
  },
  {
    round: 6,
    name: "Grand Prix Miami",
    location: "Miami",
    date: "2026-05-03T19:30:00Z",
  },
  {
    round: 7,
    name: "Grand Prix Kanady",
    location: "Montreal",
    date: "2026-05-24T19:00:00Z",
  },
  {
    round: 8,
    name: "Grand Prix Monako",
    location: "Monte Carlo",
    date: "2026-06-07T13:00:00Z",
  },
  {
    round: 9,
    name: "Grand Prix Barcelony",
    location: "Barcelona",
    date: "2026-06-14T13:00:00Z",
  },
  {
    round: 10,
    name: "Grand Prix Austrii",
    location: "Spielberg",
    date: "2026-06-28T13:00:00Z",
  },
  {
    round: 11,
    name: "Grand Prix Wielkiej Brytanii",
    location: "Silverstone",
    date: "2026-07-05T14:00:00Z",
  },
  {
    round: 12,
    name: "Grand Prix Belgii",
    location: "Spa-Francorchamps",
    date: "2026-07-19T13:00:00Z",
  },
  {
    round: 13,
    name: "Grand Prix Węgier",
    location: "Budapeszt",
    date: "2026-07-26T13:00:00Z",
  },
  {
    round: 14,
    name: "Grand Prix Holandii",
    location: "Zandvoort",
    date: "2026-08-23T13:00:00Z",
  },
  {
    round: 15,
    name: "Grand Prix Włoch",
    location: "Monza",
    date: "2026-09-06T13:00:00Z",
  },
  {
    round: 16,
    name: "Grand Prix Hiszpanii",
    location: "Madryt",
    date: "2026-09-13T13:00:00Z",
  },
  {
    round: 17,
    name: "Grand Prix Azerbejdżanu",
    location: "Baku",
    date: "2026-09-26T13:00:00Z",
  },
  {
    round: 18,
    name: "Grand Prix Singapuru",
    location: "Singapur",
    date: "2026-10-11T12:00:00Z",
  },
  {
    round: 19,
    name: "Grand Prix USA",
    location: "Austin",
    date: "2026-10-25T19:00:00Z",
  },
  {
    round: 20,
    name: "Grand Prix Meksyku",
    location: "Meksyk",
    date: "2026-11-01T19:00:00Z",
  },
  {
    round: 21,
    name: "Grand Prix Brazylii",
    location: "Sao Paulo",
    date: "2026-11-08T17:00:00Z",
  },
  {
    round: 22,
    name: "Grand Prix Las Vegas",
    location: "Las Vegas",
    date: "2026-11-21T06:00:00Z",
  },
  {
    round: 23,
    name: "Grand Prix Kataru",
    location: "Lusail",
    date: "2026-11-29T16:00:00Z",
  },
  {
    round: 24,
    name: "Grand Prix Abu Zabi",
    location: "Yas Marina",
    date: "2026-12-06T13:00:00Z",
  },
];

export const raceResults: { round: number; fullResults: string[] }[] = [];

export const actualSeasonStandings: string[] = [];

export type Driver = {
  id: string; // e.g. "ver"
  name: string; // "Max Verstappen"
  number: number; // 1
  team: string; // "Red Bull Racing"
  color: string; // Tailwind class "bg-red-600"
  country: string; // Country flag emoji or code
};

export type Race = {
  round: number;
  name: string;
  location: string;
  date: string; // ISO date of race day
  isTesting?: boolean;
};

export const drivers: Driver[] = [
  // Alpine
  {
    id: "gas",
    name: "Pierre Gasly",
    number: 43,
    team: "Alpine",
    color: "bg-pink-500 border-blue-600",
    country: "🇫🇷",
  },
  {
    id: "col",
    name: "Franco Colapinto",
    number: 10,
    team: "Alpine",
    color: "bg-pink-500 border-blue-600",
    country: "🇦🇷",
  },
  // Aston Martin
  {
    id: "alo",
    name: "Fernando Alonso",
    number: 14,
    team: "Aston Martin",
    color: "bg-emerald-700 border-lime-400",
    country: "🇪🇸",
  },
  {
    id: "str",
    name: "Lance Stroll",
    number: 18,
    team: "Aston Martin",
    color: "bg-emerald-700 border-lime-400",
    country: "🇨🇦",
  },
  // Williams
  {
    id: "alb",
    name: "Alexander Albon",
    number: 23,
    team: "Williams",
    color: "bg-blue-800 border-blue-400",
    country: "🇹🇭",
  },
  {
    id: "sai",
    name: "Carlos Sainz Jr.",
    number: 55,
    team: "Williams",
    color: "bg-blue-800 border-blue-400",
    country: "🇪🇸",
  },
  // Audi
  {
    id: "bor",
    name: "Gabriel Bortoleto",
    number: 5,
    team: "Audi",
    color: "bg-red-700 border-white",
    country: "🇧🇷",
  },
  {
    id: "hul",
    name: "Nico Hülkenberg",
    number: 27,
    team: "Audi",
    color: "bg-red-700 border-white",
    country: "🇩🇪",
  },
  // Cadillac
  {
    id: "per",
    name: "Sergio Pérez",
    number: 11,
    team: "Cadillac",
    color: "bg-slate-700 border-yellow-500",
    country: "🇲🇽",
  },
  {
    id: "bot",
    name: "Valtteri Bottas",
    number: 77,
    team: "Cadillac",
    color: "bg-slate-700 border-yellow-500",
    country: "🇫🇮",
  },
  // Ferrari
  {
    id: "lec",
    name: "Charles Leclerc",
    number: 16,
    team: "Ferrari",
    color: "bg-red-600 border-yellow-400",
    country: "🇲🇨",
  },
  {
    id: "ham",
    name: "Lewis Hamilton",
    number: 44,
    team: "Ferrari",
    color: "bg-red-600 border-yellow-400",
    country: "🇬🇧",
  },
  // Haas
  {
    id: "oco",
    name: "Esteban Ocon",
    number: 31,
    team: "Haas",
    color: "bg-slate-100 border-red-600 text-black",
    country: "🇫🇷",
  },
  {
    id: "bea",
    name: "Oliver Bearman",
    number: 87,
    team: "Haas",
    color: "bg-slate-100 border-red-600 text-black",
    country: "🇬🇧",
  },
  // McLaren
  {
    id: "nor",
    name: "Lando Norris",
    number: 1,
    team: "McLaren",
    color: "bg-orange-500 border-black",
    country: "🇬🇧",
  },
  {
    id: "pia",
    name: "Oscar Piastri",
    number: 81,
    team: "McLaren",
    color: "bg-orange-500 border-black",
    country: "🇦🇺",
  },
  // Mercedes
  {
    id: "ant",
    name: "Kimi Antonelli",
    number: 12,
    team: "Mercedes",
    color: "bg-slate-300 border-cyan-400 text-black",
    country: "🇮🇹",
  },
  {
    id: "rus",
    name: "George Russell",
    number: 63,
    team: "Mercedes",
    color: "bg-slate-300 border-cyan-400 text-black",
    country: "🇬🇧",
  },
  // Racing Bulls
  {
    id: "law",
    name: "Liam Lawson",
    number: 30,
    team: "Racing Bulls",
    color: "bg-blue-600 border-white",
    country: "🇳🇿",
  },
  {
    id: "lin",
    name: "Arvid Lindblad",
    number: 41,
    team: "Racing Bulls",
    color: "bg-blue-600 border-white",
    country: "🇬🇧",
  },
  // Red Bull Racing
  {
    id: "ver",
    name: "Max Verstappen",
    number: 3,
    team: "Red Bull Racing",
    color: "bg-blue-900 border-red-600",
    country: "🇳🇱",
  },
  {
    id: "had",
    name: "Isack Hadjar",
    number: 6,
    team: "Red Bull Racing",
    color: "bg-blue-900 border-red-600",
    country: "🇫🇷",
  },
];

export const races: Race[] = [
  {
    round: 1,
    name: "Australian Grand Prix",
    location: "Australia",
    date: "2026-03-08T05:00:00Z",
  },
  {
    round: 2,
    name: "Chinese Grand Prix",
    location: "China",
    date: "2026-03-15T07:00:00Z",
  },
  {
    round: 3,
    name: "Japanese Grand Prix",
    location: "Japan",
    date: "2026-03-29T06:00:00Z",
  },
  {
    round: 4,
    name: "Bahrain Grand Prix",
    location: "Bahrain",
    date: "2026-04-12T15:00:00Z",
  },
  {
    round: 5,
    name: "Saudi Arabian Grand Prix",
    location: "Saudi Arabia",
    date: "2026-04-19T19:00:00Z",
  },
  {
    round: 6,
    name: "Miami Grand Prix",
    location: "Miami",
    date: "2026-05-03T19:30:00Z",
  },
  {
    round: 7,
    name: "Canadian Grand Prix",
    location: "Canada",
    date: "2026-05-24T19:00:00Z",
  },
  {
    round: 8,
    name: "Monaco Grand Prix",
    location: "Monaco",
    date: "2026-06-07T13:00:00Z",
  },
  {
    round: 9,
    name: "Barcelona Grand Prix",
    location: "Barcelona-Catalunya",
    date: "2026-06-14T13:00:00Z",
  },
  {
    round: 10,
    name: "Austrian Grand Prix",
    location: "Austria",
    date: "2026-06-28T13:00:00Z",
  },
  {
    round: 11,
    name: "British Grand Prix",
    location: "Great Britain",
    date: "2026-07-05T14:00:00Z",
  },
  {
    round: 12,
    name: "Belgian Grand Prix",
    location: "Belgium",
    date: "2026-07-19T13:00:00Z",
  },
  {
    round: 13,
    name: "Hungarian Grand Prix",
    location: "Hungary",
    date: "2026-07-26T13:00:00Z",
  },
  {
    round: 14,
    name: "Dutch Grand Prix",
    location: "Netherlands",
    date: "2026-08-23T13:00:00Z",
  },
  {
    round: 15,
    name: "Italian Grand Prix",
    location: "Italy",
    date: "2026-09-06T13:00:00Z",
  },
  {
    round: 16,
    name: "Spanish Grand Prix",
    location: "Spain",
    date: "2026-09-13T13:00:00Z",
  },
  {
    round: 17,
    name: "Azerbaijan Grand Prix",
    location: "Azerbaijan",
    date: "2026-09-26T13:00:00Z",
  },
  {
    round: 18,
    name: "Singapore Grand Prix",
    location: "Singapore",
    date: "2026-10-11T12:00:00Z",
  },
  {
    round: 19,
    name: "United States Grand Prix",
    location: "United States",
    date: "2026-10-25T19:00:00Z",
  },
  {
    round: 20,
    name: "Mexico Grand Prix",
    location: "Mexico",
    date: "2026-11-01T19:00:00Z",
  },
  {
    round: 21,
    name: "Brazil Grand Prix",
    location: "Brazil",
    date: "2026-11-08T17:00:00Z",
  },
  {
    round: 22,
    name: "Las Vegas Grand Prix",
    location: "Las Vegas",
    date: "2026-11-21T06:00:00Z",
  },
  {
    round: 23,
    name: "Qatar Grand Prix",
    location: "Qatar",
    date: "2026-11-29T16:00:00Z",
  },
  {
    round: 24,
    name: "Abu Dhabi Grand Prix",
    location: "Abu Dhabi",
    date: "2026-12-06T13:00:00Z",
  },
];

export const raceResults = [
  { round: 1, fullResults: ["ver", "nor", "lec", "ham", "pia", "rus", "sai", "alo", "gas", "hul", "ant", "str", "alb", "col", "bor", "per", "oco", "bea", "law", "lin", "had", "bot"] },
  { round: 2, fullResults: ["lec", "ver", "nor", "ham", "pia", "rus", "gas", "sai", "alo", "ant", "hul", "str", "alb", "col", "bor", "per", "oco", "bea", "law", "lin", "had", "bot"] },
  { round: 3, fullResults: ["nor", "ver", "lec", "pia", "ham", "rus", "sai", "alo", "gas", "hul", "ant", "str", "alb", "col", "bor", "per", "oco", "bea", "law", "lin", "had", "bot"] },
  { round: 4, fullResults: ["ver", "lec", "nor", "ham", "pia", "rus", "sai", "gas", "alo", "hul", "ant", "str", "alb", "col", "bor", "per", "oco", "bea", "law", "lin", "had", "bot"] },
  { round: 5, fullResults: ["lec", "ver", "nor", "ham", "pia", "rus", "sai", "gas", "alo", "ant", "hul", "str", "alb", "col", "bor", "per", "oco", "bea", "law", "lin", "had", "bot"] },
  { round: 6, fullResults: ["nor", "lec", "ver", "pia", "ham", "rus", "sai", "alo", "gas", "hul", "ant", "str", "alb", "col", "bor", "per", "oco", "bea", "law", "lin", "had", "bot"] },
  { round: 7, fullResults: ["ham", "nor", "ver", "lec", "rus", "pia", "sai", "alo", "gas", "ant", "hul", "str", "alb", "col", "bor", "per", "oco", "bea", "law", "lin", "had", "bot"] },
  { round: 8, fullResults: ["lec", "nor", "ver", "ham", "pia", "rus", "sai", "gas", "alo", "hul", "ant", "str", "alb", "col", "bor", "per", "oco", "bea", "law", "lin", "had", "bot"] },
  { round: 9, fullResults: ["ver", "nor", "lec", "ham", "pia", "rus", "sai", "alo", "gas", "hul", "ant", "str", "alb", "col", "bor", "per", "oco", "bea", "law", "lin", "had", "bot"] },
  { round: 10, fullResults: ["nor", "ver", "lec", "pia", "ham", "rus", "sai", "alo", "gas", "ant", "hul", "str", "alb", "col", "bor", "per", "oco", "bea", "law", "lin", "had", "bot"] },
  { round: 11, fullResults: ["ham", "nor", "rus", "ver", "lec", "pia", "sai", "gas", "alo", "hul", "ant", "str", "alb", "col", "bor", "per", "oco", "bea", "law", "lin", "had", "bot"] },
  { round: 12, fullResults: ["ver", "lec", "nor", "ham", "pia", "rus", "sai", "alo", "gas", "hul", "ant", "str", "alb", "col", "bor", "per", "oco", "bea", "law", "lin", "had", "bot"] },
];

export const actualSeasonStandings = [
  "nor", "ver", "lec", "ham", "pia", "rus", "sai", "alo", "gas", "hul",
];

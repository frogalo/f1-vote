import type { Vote } from "./store";
import { nanoid } from "./utils";
import { raceResults, actualSeasonStandings } from "./data";

// Friend user IDs
export const friends = [
    { id: "user-jakub", name: "Jakub", team: "Red Bull Racing", avatar: "https://i.pravatar.cc/150?u=jakub" },
    { id: "user-agata", name: "Agata", team: "Ferrari", avatar: "https://i.pravatar.cc/150?u=agata" },
    { id: "user-kasia", name: "Kasia", team: "Mercedes", avatar: "https://i.pravatar.cc/150?u=kasia" },
    { id: "user-wiktoria", name: "Wiktoria", team: "McLaren", avatar: "https://i.pravatar.cc/150?u=wiktoria" },
    { id: "user-iga", name: "Iga", team: "Aston Martin", avatar: "https://i.pravatar.cc/150?u=iga" },
    { id: "user-rafal", name: "Rafał", team: "Alpine", avatar: "https://i.pravatar.cc/150?u=rafal" },
];

/**
 * BRAIN: Realistic Prediction Generator
 * Generates noise-infused predictions based on actual results.
 * - Max 3 perfect hits per round.
 * - Occasional massive errors (5-15 positions).
 */
function generateRealisticArray(actual: string[], seed: string): string[] {
    const result = [...actual];
    // Simple deterministic pseudo-random based on seed
    const hash = (s: string) => s.split('').reduce((a, b) => { a = ((a << 5) - a) + b.charCodeAt(0); return a & a; }, 0);
    let s = hash(seed);
    const rng = () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };

    // 1. Pick number of hits (0-3)
    const hitCount = Math.floor(rng() * 4);
    const hitIndices = new Set<number>();
    while (hitIndices.size < hitCount) {
        hitIndices.add(Math.floor(rng() * actual.length));
    }

    // 2. Identify indices to shuffle
    const toShuffle = result.map((_, i) => i).filter(i => !hitIndices.has(i));
    const valuesToShuffle = toShuffle.map(i => result[i]);

    // 3. Shuffle with "realistic" error (displacement)
    // We'll perform a biased shuffle where items can move far
    for (let i = valuesToShuffle.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [valuesToShuffle[i], valuesToShuffle[j]] = [valuesToShuffle[j], valuesToShuffle[i]];
    }

    // 4. Double check we didn't accidentally get more hits
    let j = 0;
    toShuffle.forEach(idx => {
        let val = valuesToShuffle[j++];
        // If it accidentally became a hit, swap it with another non-hit
        if (val === actual[idx]) {
            const swapWithIdx = (j % valuesToShuffle.length);
            [val, valuesToShuffle[swapWithIdx]] = [valuesToShuffle[swapWithIdx], val];
        }
        result[idx] = val;
    });

    return result;
}

// Season predictions for each friend (TOP 10)
export const seasonPredictions: Record<string, string[]> = {
    "user-agata": generateRealisticArray(actualSeasonStandings, "agata-season").slice(0, 10),
    "user-jakub": generateRealisticArray(actualSeasonStandings, "jakub-season").slice(0, 10),
    "user-kasia": generateRealisticArray(actualSeasonStandings, "kasia-season").slice(0, 10),
    "user-wiktoria": generateRealisticArray(actualSeasonStandings, "wiktoria-season").slice(0, 10),
    "user-iga": generateRealisticArray(actualSeasonStandings, "iga-season").slice(0, 10),
    "user-rafal": generateRealisticArray(actualSeasonStandings, "rafal-season").slice(0, 10),
};

// Race predictions generator
export const racePredictions: Record<string, Record<number, string[]>> = friends.reduce((acc, friend) => {
    acc[friend.id] = {};
    raceResults.forEach(res => {
        acc[friend.id][res.round] = generateRealisticArray(res.fullResults, `${friend.id}-race-${res.round}`);
    });
    return acc;
}, {} as Record<string, Record<number, string[]>>);


// Generate votes for a specific user from predictions
function getVotesForUser(userId: string): Vote[] {
    const votes: Vote[] = [];
    const baseTime = Date.now() - 30 * 24 * 60 * 60 * 1000;

    // Add season predictions
    const predictions = seasonPredictions[userId];
    if (predictions) {
        predictions.forEach((driverId, index) => {
            votes.push({
                id: nanoid(),
                userId,
                driverId,
                raceRound: `season-position-${index + 1}`,
                createdAt: baseTime + Math.random() * 1000000,
            });
        });
    }

    // Add race predictions
    const races = racePredictions[userId];
    if (races) {
        Object.entries(races).forEach(([round, driverIds]) => {
            driverIds.forEach((driverId, position) => {
                votes.push({
                    id: nanoid(),
                    userId,
                    driverId,
                    raceRound: `race-${round}-position-${position + 1}`,
                    createdAt: baseTime + parseInt(round) * 24 * 60 * 60 * 1000 + Math.random() * 1000000,
                });
            });
        });
    }

    return votes;
}

// Generate ALL mock votes for all friends
export function generateMockVotes(): Vote[] {
    return friends.flatMap(friend => getVotesForUser(friend.id));
}

// Special function to get only Jakub's votes (for initializing the user's store)
export function getJakubVotes(): Vote[] {
    return getVotesForUser("user-jakub");
}

// Re-export scoring functions from the dedicated scoring module
export { calculateRaceScore, calculateFriendScore } from './scoring';
export { raceResults, actualSeasonStandings };

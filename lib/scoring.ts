import { Vote } from "./store";
import { raceResults, actualSeasonStandings } from "./data";

/**
 * Calculate points for a single prediction based on distance
 * +5 for 0 diff, +4 for 1, +3 for 2, +2 for 3, +1 for 4, 0 for 5+
 */
export function calculatePointValue(predictedPosition: number, actualPosition: number): number {
    const distance = Math.abs(actualPosition - predictedPosition);
    return Math.max(0, 5 - distance);
}

/**
 * Calculate points for a single race prediction
 */
export function calculateRacePoints(predictedPosition: number, actualPosition: number): number {
    return calculatePointValue(predictedPosition, actualPosition);
}

/**
 * Calculate points for a friend in a specific race
 */
export function calculateRaceScore(userId: string, raceRound: number, userVotes: Vote[]) {
    const result = raceResults.find((r) => r.round === raceRound);
    if (!result) return { totalPoints: 0, perfectPredictions: 0, details: [] };

    const raceVotes = userVotes.filter(
        (v) => v.userId === userId && typeof v.raceRound === "string" && v.raceRound.startsWith(`race-${raceRound}-position-`)
    );

    let totalPoints = 0;
    let perfectPredictions = 0;
    const details: Array<{ driverId: string; predictedPos: number; actualPos: number; points: number }> = [];

    raceVotes.forEach((vote) => {
        const predictedPosition = parseInt((vote.raceRound as string).split("-")[3]) - 1; // 0-based
        const actualPosition = result.fullResults.indexOf(vote.driverId);

        if (actualPosition !== -1) {
            const points = calculateRacePoints(predictedPosition, actualPosition);
            totalPoints += points;

            if (predictedPosition === actualPosition) {
                perfectPredictions++;
            }

            details.push({
                driverId: vote.driverId,
                predictedPos: predictedPosition + 1,
                actualPos: actualPosition + 1,
                points,
            });
        }
    });

    return { totalPoints, perfectPredictions, details };
}

/**
 * Calculate season prediction points
 */
export function calculateSeasonPoints(userVotes: Vote[]): {
    totalPoints: number;
    perfectPredictions: number;
} {
    const seasonVotes = userVotes
        .filter((v) => typeof v.raceRound === "string" && v.raceRound.startsWith("season-position-"))
        .sort((a, b) => {
            const posA = parseInt((a.raceRound as string).split("-")[2] || "0");
            const posB = parseInt((b.raceRound as string).split("-")[2] || "0");
            return posA - posB;
        });

    let totalPoints = 0;
    let perfectPredictions = 0;

    seasonVotes.forEach((vote, index) => {
        const predictedPosition = index; // 0-based
        const actualPosition = actualSeasonStandings.indexOf(vote.driverId);

        if (actualPosition !== -1) {
            const points = calculatePointValue(predictedPosition, actualPosition);
            totalPoints += points;
            if (predictedPosition === actualPosition) {
                perfectPredictions++;
            }
        }
    });

    return { totalPoints, perfectPredictions };
}

/**
 * Calculate overall score for a friend
 */
export function calculateFriendScore(userId: string, userVotes: Vote[]) {
    let totalPoints = 0;
    let perfectPredictions = 0;
    let raceWins = 0;

    // Filter votes for this user just in case
    const filteredVotes = userVotes.filter(v => v.userId === userId);

    // Season points
    const season = calculateSeasonPoints(filteredVotes);
    totalPoints += season.totalPoints;
    perfectPredictions += season.perfectPredictions;

    // Race points
    raceResults.forEach((result) => {
        const race = calculateRaceScore(userId, result.round, filteredVotes);
        totalPoints += race.totalPoints;
        perfectPredictions += race.perfectPredictions;

        // Check for "win" (at least 3 perfect hits in a race)
        if (race.perfectPredictions >= 3) {
            raceWins++;
        }
    });

    // Calculate season prediction points
    const seasonScore = calculateSeasonPoints(userVotes);
    totalPoints += seasonScore.totalPoints;
    perfectPredictions += seasonScore.perfectPredictions;

    return {
        totalPoints,
        perfectPredictions,
        raceWins,
    };
}

/**
 * Test scoring logic to debug point calculation
 */

import { friends, generateMockVotes } from './mockData';
import { calculateFriendScore, calculateRaceScore } from './scoring';

// Generate test votes
const mockVotes = generateMockVotes();

console.log('=== SCORING DEBUG ===\n');
console.log(`Total votes generated: ${mockVotes.length}`);
console.log(`Expected: ${friends.length * (10 + 12 * 22)} votes`); // 10 season + 12 races * 22 drivers

// Test each friend
friends.forEach((friend) => {
    const userVotes = mockVotes.filter((v) => v.userId === friend.id);
    console.log(`\n${friend.name}:`);
    console.log(`  Votes: ${userVotes.length}`);

    const seasonVotes = userVotes.filter(v => typeof v.raceRound === 'string' && v.raceRound.startsWith('season-'));
    const raceVotes = userVotes.filter(v => typeof v.raceRound === 'string' && v.raceRound.startsWith('race-'));

    console.log(`  Season votes: ${seasonVotes.length}`);
    console.log(`  Race votes: ${raceVotes.length}`);

    // Calculate score
    const score = calculateFriendScore(friend.id, userVotes);
    console.log(`  Total Points: ${score.totalPoints}`);
    console.log(`  Perfect Predictions: ${score.perfectPredictions}`);
    console.log(`  Race Wins: ${score.raceWins}`);

    // Test first race
    const race1Score = calculateRaceScore(friend.id, 1, userVotes);
    console.log(`  Race 1 points: ${race1Score.totalPoints} (${race1Score.perfectPredictions} perfect)`);
});

console.log('\n=== END DEBUG ===');

// Generates the authoritative game map for a multiplayer room.
// Runs on the server so both players receive the exact same map state.

import { MapGenerator } from './mapGenerator.js';

const ROWS = 22;
const COLS = 19;
const SECTION_IDS = [3, 4, 5, 6, 7, 8, 9]; // Must match portfolioData keys
const FUN_FACTS_COUNT = 5;                   // Must match funFacts.length in portfolioData.js

export function generateGameMap() {
    const generator = new MapGenerator(ROWS, COLS);
    const mapData = generator.generate();
    // Deep-copy the map so we can mutate it without affecting the generator's state
    const map = mapData.map.map(row => [...row]);

    // --- Place big pellets (portfolio sections) ---
    // Collect all small-pellet cells as candidate spots
    let validSpots = [];
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if (map[r][c] === 1) validSpots.push({ r, c });
        }
    }

    let placedSpots = [];
    for (const id of SECTION_IDS) {
        let bestSpot = null;
        let bestIdx = -1;

        // Try up to 50 random candidates and pick one far enough from existing placements
        for (let attempt = 0; attempt < 50; attempt++) {
            const randIdx = Math.floor(Math.random() * validSpots.length);
            const candidate = validSpots[randIdx];
            const tooClose = placedSpots.some(
                placed => Math.hypot(placed.r - candidate.r, placed.c - candidate.c) < 4
            );
            if (!tooClose) { bestSpot = candidate; bestIdx = randIdx; break; }
        }

        // Fallback: accept any remaining spot
        if (!bestSpot) {
            bestIdx = Math.floor(Math.random() * validSpots.length);
            bestSpot = validSpots[bestIdx];
        }

        validSpots.splice(bestIdx, 1);
        placedSpots.push(bestSpot);
        map[bestSpot.r][bestSpot.c] = id;
    }

    // Calculate how many small pellets a player must eat to earn a fun-fact
    const smallPelletCount = validSpots.length;
    const pelletsPerFact = Math.max(1, Math.floor(smallPelletCount / FUN_FACTS_COUNT));

    return {
        map,
        playerStart: mapData.playerStart,
        ghostStarts: mapData.ghostStarts,
        smallPelletCount,
        pelletsPerFact,
    };
}

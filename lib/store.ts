import { create } from 'zustand';
import { get, set } from 'idb-keyval';
import { drivers as staticDrivers, Driver } from './data';
import { nanoid } from 'nanoid';

/** Read the userId cookie set by the server on login. */
function userId(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(/(?:^|;\s*)userId=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export type Vote = {
  id: string;
  userId: string;
  driverId: string;
  raceRound: number | string; // Allow strings for season predictions like "season-position-1"
  createdAt: number;
};

type Store = {
  drivers: Driver[];
  votes: Vote[];
  userId: string | null;
  setUserId: (id: string) => void;
  setDrivers: (d: Driver[]) => void;
  addVote: (v: Omit<Vote, "id" | "userId" | "createdAt">) => Promise<void>;
  setSessionVotes: (raceRoundPrefix: string, voterId: string, driverIds: string[]) => Promise<void>;
  loadFromIndexedDB: () => Promise<void>;
  persistToIndexedDB: () => Promise<void>;
};

export const useStore = create<Store>((setState, getState) => ({
  drivers: staticDrivers,
  votes: [],
  userId: userId() || null,

  setUserId: (id) => setState({ userId: id }),

  setDrivers: (drivers) => setState({ drivers }),

  addVote: async (voteData) => {
    let uid = getState().userId;
    if (!uid) {
        uid = userId();
    }
    
    // Safety check just in case logic fails
    if (!uid) {
        console.error("Cannot add vote: No user ID available");
        return;
    }

    const newVote: Vote = {
      id: nanoid(),
      userId: uid,
      createdAt: Date.now(),
      ...voteData,
    };

    // Optimistic update
    setState((state) => ({
      votes: [...state.votes, newVote],
      userId: uid 
    }));

    // Background persist
    try {
      await getState().persistToIndexedDB();
    } catch (e) {
      console.error("Failed to persist vote", e);
      // Revert or retry logic could go here
    }
  },

  setSessionVotes: async (raceRoundPrefix, voterId, driverIds) => {
    const uid: string = getState().userId || userId() || '';
    const now = Date.now();
    
    // Create new votes for this session
    const newVotes: Vote[] = driverIds.map((driverId, index) => ({
      id: nanoid(),
      userId: voterId || uid,
      driverId,
      raceRound: `${raceRoundPrefix}${index + 1}`,
      createdAt: now,
    }));

    setState((state) => {
      // Remove all previous votes for this user and this session
      const filteredVotes = state.votes.filter(v => {
        const isThisSession = String(v.raceRound).startsWith(raceRoundPrefix);
        const isThisUser = v.userId === (voterId || uid);
        return !(isThisSession && isThisUser);
      });

      return {
        votes: [...filteredVotes, ...newVotes],
        userId: uid
      };
    });

    try {
      await getState().persistToIndexedDB();
    } catch (e) {
      console.error("Failed to persist session votes", e);
    }
  },

  loadFromIndexedDB: async () => {
    if (typeof window === "undefined") return;
    try {
      const storedVotes = await get<Vote[]>('f1-votes');
      const uid = userId();
      setState({
        votes: storedVotes || [],
        userId: uid
      });
    } catch (e) {
      console.error("IDB load failed", e);
    }
  },

  persistToIndexedDB: async () => {
    if (typeof window === "undefined") return;
    try {
      await set('f1-votes', getState().votes);
    } catch (e) {
      console.error("IDB save failed", e);
    }
  },
}));

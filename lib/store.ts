import { create } from 'zustand';
import { get, set } from 'idb-keyval';
import { drivers as staticDrivers, Driver } from './data';
import { nanoid, userId } from './utils';

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
  userId: string;
  setDrivers: (d: Driver[]) => void;
  addVote: (v: Omit<Vote, "id" | "userId" | "createdAt">) => Promise<void>;
  loadFromIndexedDB: () => Promise<void>;
  persistToIndexedDB: () => Promise<void>;
};

export const useStore = create<Store>((setState, getState) => ({
  drivers: staticDrivers,
  votes: [],
  userId: "user-jakub",

  setDrivers: (drivers) => setState({ drivers }),

  addVote: async (voteData) => {
    const uid = getState().userId || userId();
    const newVote: Vote = {
      id: nanoid(),
      userId: uid,
      createdAt: Date.now(),
      ...voteData,
    };

    // Optimistic update
    setState((state) => ({
      votes: [...state.votes, newVote],
      userId: uid // ensure userId is set if not already
    }));

    // Background persist
    try {
      await getState().persistToIndexedDB();
    } catch (e) {
      console.error("Failed to persist vote", e);
      // Revert or retry logic could go here
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

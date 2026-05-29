import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface Participant {
  name: string;
  email?: string;
}

interface ParticipantState {
  name: string | null;
  email: string | null;
  hasJoined: boolean;
  register: (participant: Participant) => void;
  clearParticipant: () => void;
}

export const useParticipantStore = create<ParticipantState>()(
  persist(
    (set) => ({
      name: null,
      email: null,
      hasJoined: false,

      register: ({ name, email }) =>
        set({
          name: name.trim(),
          email: email?.trim() || null,
          hasJoined: true,
        }),

      clearParticipant: () =>
        set({
          name: null,
          email: null,
          hasJoined: false,
        }),
    }),
    {
      name: "banana-hunt-participant",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export const selectParticipantName = (state: ParticipantState) => state.name;

export const selectHasJoined = (state: ParticipantState) => state.hasJoined;

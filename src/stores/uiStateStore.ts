import { create } from "zustand";
import { createTauriStore } from "@tauri-store/zustand";

interface UiFilters {
  tags: string[];
  show18Plus: boolean;
  showOffline: boolean | null;
  showHubStatus: boolean;
  regions: string[];
  languages: string[];
  searchQuery: string;
}

type UiState = {
  [key: string]: unknown;
  lastPlayedServer: string | null;
  lastViewMode: string | null;
  lastReadAnnouncement: string | null;
  ageVerified: boolean;
  filters: UiFilters;
};

interface UiStateActions {
  setLastPlayedServer: (serverId: string) => void;
  setLastViewMode: (mode: string) => void;
  setLastReadAnnouncement: (id: string) => void;
  setAgeVerified: () => void;
  updateFilters: (patch: Partial<UiFilters>) => void;
}

export type { UiFilters };

export const useUiStateStore = create<UiState & UiStateActions>()((set, get) => ({
  lastPlayedServer: null,
  lastViewMode: null,
  lastReadAnnouncement: null,
  ageVerified: false,
  filters: {
    tags: [],
    show18Plus: false,
    showOffline: null,
    showHubStatus: false,
    regions: [],
    languages: [],
    searchQuery: "",
  },

  setLastPlayedServer: (serverId) => set({ lastPlayedServer: serverId }),
  setLastViewMode: (mode) => set({ lastViewMode: mode }),
  setLastReadAnnouncement: (id) => set({ lastReadAnnouncement: id }),
  setAgeVerified: () => set({ ageVerified: true }),
  updateFilters: (patch) => set({ filters: { ...get().filters, ...patch } }),
}));

export const uiStateTauriStore = createTauriStore("ui-state", useUiStateStore, {
  autoStart: true,
  saveOnChange: true,
  saveStrategy: "debounce",
  saveInterval: 500,
});

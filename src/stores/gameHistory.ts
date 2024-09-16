import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { GameResult } from "@/types";

export const useGameHistoryStore = defineStore(
  "gameHistory",
  () => {
    // State
    const history = ref<GameResult[]>([]);

    // Actions
    const addGameResult = (result: GameResult) => {
      history.value.unshift(result);
      if (history.value.length > 100) {
        history.value = history.value.slice(0, 100);
      }
    };

    const clearHistory = () => {
      history.value = [];
    };

    // Getters
    const recentHistory = computed(() => (maxEntries: number) => {
      return history.value.slice(0, maxEntries);
    });

    // Return state, actions, and getters
    return {
      history,
      addGameResult,
      clearHistory,
      recentHistory,
    };
  },
  {
    persist: true,
  },
);

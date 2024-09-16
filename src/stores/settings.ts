import { defineStore } from "pinia";
import { reactive } from "vue";
import type { Settings } from "@/types";

export const useSettingsStore = defineStore(
  "settings",
  () => {
    // State
    const settings = reactive<Settings>({
      timeLimit: 3,
      roundingOptions: [10, 100, 1000],
      showCountdown: true,
      showScore: true,
    });

    // Actions
    const updateSettings = (newSettings: Partial<Settings>) => {
      Object.assign(settings, newSettings);
    };

    // Return state and actions
    return {
      settings,
      updateSettings,
    };
  },
  {
    persist: true,
  },
);

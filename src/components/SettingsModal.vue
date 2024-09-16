<template>
  <PDialog
    header="Settings"
    :visible="visible"
    @update:visible="emitVisible"
    :modal="true"
    :closable="false"
    width="400"
  >
    <template #header>
      <div class="flex justify-between items-center w-full">
        <h2 class="text-xl font-bold">Settings</h2>
        <button @click="closeModal" aria-label="Close">
          <FontAwesome :icon="['fas', 'times']" class="text-xl" />
        </button>
      </div>
    </template>

    <!-- Settings Content -->
    <div class="mt-4">
      <div class="mb-4">
        <label class="block text-left mb-2 font-medium"
          >Time Limit (minutes):</label
        >
        <PInputNumber
          v-model="settingsStore.settings.timeLimit"
          :min="1"
          :max="10"
          suffix=" min"
          class="w-full"
        />
      </div>

      <div class="mb-4">
        <label class="block text-left mb-2 font-medium"
          >Rounding Options:</label
        >
        <PMultiSelect
          v-model="settingsStore.settings.roundingOptions"
          :options="availableRoundingOptions"
          optionLabel="label"
          optionValue="value"
          placeholder="Select Rounding Options"
          :show-toggle-all="false"
          class="w-full"
        />
      </div>

      <div class="mb-4">
        <label class="block text-left mb-2 font-medium">Show Countdown:</label>
        <PToggleButton
          v-model="settingsStore.settings.showCountdown"
          onLabel="Yes"
          offLabel="No"
          onIcon="pi pi-check"
          offIcon="pi pi-times"
          class="w-full"
        />
      </div>

      <div class="mb-4">
        <label class="block text-left mb-2 font-medium">Show Score:</label>
        <PToggleButton
          v-model="settingsStore.settings.showScore"
          onLabel="Yes"
          offLabel="No"
          onIcon="pi pi-check"
          offIcon="pi pi-times"
          class="w-full"
        />
      </div>

      <div class="flex justify-end mt-6">
        <PButton label="Save" @click="saveSettings" class="p-button-primary" />
      </div>
    </div>
  </PDialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import type { PropType } from "vue";
import { useSettingsStore } from "@/stores/settings";
import type { RoundingOption } from "@/types";

export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    availableRoundingOptions: {
      type: Array as PropType<RoundingOption[]>,
      required: true,
    },
  },
  emits: ["update:visible", "save-settings"],
  setup(props, { emit }) {
    const settingsStore = useSettingsStore();
    const closeModal = () => {
      emit("update:visible", false);
    };

    const saveSettings = () => {
      emit("save-settings");
    };

    const emitVisible = (visible: boolean) => {
      emit("update:visible", visible);
    };

    return {
      settingsStore: settingsStore,
      closeModal,
      saveSettings,
      emitVisible,
    };
  },
});
</script>

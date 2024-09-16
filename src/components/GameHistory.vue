<template>
  <div>
    <h2 class="text-2xl font-bold mb-4">Game History</h2>

    <PDataTable
      :value="historyWithCQPM"
      paginator
      :rows="10"
      :always-show-paginator="false"
    >
      <template #header>
        <PButton
          label="Clear History"
          icon="pi pi-trash"
          class="p-button-danger"
          @click="confirmClearHistory"
        />
      </template>
      <PColumn
        field="date"
        header="Date"
        :sortable="true"
        style="min-width: 180px"
      >
        <template #body="{ data }">
          {{ formatDate(data) }}
        </template>
      </PColumn>
      <PColumn
        field="correctCount"
        header="Correct Answers"
        :sortable="true"
        style="width: 150px; text-align: center"
      />
      <PColumn
        field="questionCount"
        header="Total Questions"
        :sortable="true"
        style="width: 150px; text-align: center"
      />
      <PColumn
        field="cqpm"
        header="Correct per Minute"
        :sortable="true"
        style="width: 150px; text-align: center"
      />
    </PDataTable>

    <!-- Confirmation Dialog -->
    <PConfirmDialog />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useConfirm } from "primevue/useconfirm";
import { useGameHistoryStore } from "@/stores/gameHistory";
import type { GameResult } from "@/types";

export default defineComponent({
  setup() {
    const confirm = useConfirm();
    const gameHistoryStore = useGameHistoryStore();

    // Compute CQPM for each result
    const historyWithCQPM = computed(() => {
      return gameHistoryStore.history.map((result) => {
        const cqpm = formatCQPM(calculateCQPM(result));
        return {
          ...result,
          cqpm,
        };
      });
    });

    const calculateCQPM = (result: GameResult): number | null => {
      if (result.duration && result.duration > 0) {
        const cqpm = result.correctCount / (result.duration / 60);
        return parseFloat(cqpm.toFixed(1));
      } else {
        return null;
      }
    };

    const formatDate = (data: GameResult): string => {
      const date = new Date(data.date);
      return date.toLocaleString();
    };

    const formatCQPM = (cqpm: number | null): string => {
      return cqpm !== null ? cqpm.toString() : "N/A";
    };

    const clearGameHistory = (): void => {
      gameHistoryStore.clearHistory();
    };

    const confirmClearHistory = (): void => {
      confirm.require({
        message: "Are you sure you want to clear your game history?",
        header: "Confirmation",
        icon: "pi pi-exclamation-triangle",
        acceptClass: "p-button-danger",
        accept: () => {
          clearGameHistory();
        },
        reject: () => {
          // Do nothing on reject
        },
      });
    };

    return {
      historyWithCQPM,
      formatDate,
      formatCQPM,
      confirmClearHistory,
    };
  },
});
</script>

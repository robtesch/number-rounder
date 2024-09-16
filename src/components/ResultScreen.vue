<template>
  <div class="mt-8">
    <h2 class="text-2xl font-bold mb-4">Time's Up!</h2>
    <p class="text-lg mb-6">
      You got {{ correctCount }} out of {{ questionCount }} correct.
    </p>
    <PButton
      label="Restart"
      @click="$emit('restart-quiz')"
      class="p-button-info"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    correctCount: {
      type: Number,
      required: true,
    },
    questionCount: {
      type: Number,
      required: true,
    },
  },
  emits: ["restart-quiz"],
});
</script>

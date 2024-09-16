<template>
  <div class="mt-8">
    <div class="flex justify-center divide-x-2 align-middle items-center mb-4">
      <PButton
        @click="quit"
        aria-label="Quit"
        class="p-button-text mx-2"
        severity="danger"
      >
        <FontAwesome :icon="['fas', 'circle-xmark']" />
      </PButton>
      <span
        class="text-xl font-semibold px-2"
        v-if="settingsStore.settings.showCountdown"
      >
        Time Left: {{ formattedTime }}
      </span>
      <span
        class="text-xl font-semibold px-2"
        v-if="settingsStore.settings.showScore"
      >
        Score: {{ correctCount }} / {{ questionCount }}
      </span>
    </div>

    <p class="text-2xl mb-6">
      Round <strong>{{ currentQuestion.number }}</strong> to the nearest
      <strong>{{ currentQuestion.roundToLabel }}</strong>
    </p>

    <!-- Answer Input -->
    <form class="mb-6" @submit.prevent="submitAnswer">
      <PInputNumber
        :model-value="userAnswer"
        @update:modelValue="emitUpdateAnswer"
        placeholder="Enter your answer"
        :useGrouping="false"
        class="w-48 mx-auto"
        autofocus
      />
      <!-- Feedback -->
      <div class="my-2">
        <div v-if="showFeedback">
          <p v-if="isAnswerCorrect" class="text-green-600 font-bold text-lg">
            Correct!
          </p>
          <p v-else class="text-red-600 font-bold text-lg">
            Incorrect. The correct answer is
            <strong>{{ correctAnswer }}</strong>
          </p>
        </div>
        <div v-else>
          <p class="text-lg opacity-0">Feedback</p>
        </div>
      </div>
    </form>

    <!-- NumPad -->
    <NumPad
      :userAnswer="userAnswer"
      :showFeedback="showFeedback"
      @input="handleNumPadInput"
      @delete="deleteLastDigit"
      @submit="submitAnswer"
    />

    <p class="mt-4 text-gray-500">
      <small
        ><i>Tip: You can use your keyboard OR the number pad above</i></small
      >
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import type { PropType } from "vue";
import NumPad from "@/components/NumPad.vue";
import type { CurrentQuestion } from "@/types";
import { useSettingsStore } from "@/stores/settings";

export default defineComponent({
  components: {
    NumPad,
  },
  props: {
    formattedTime: {
      type: String,
      required: true,
    },
    correctCount: {
      type: Number,
      required: true,
    },
    questionCount: {
      type: Number,
      required: true,
    },
    currentQuestion: {
      type: Object as PropType<CurrentQuestion>,
      required: true,
    },
    userAnswer: {
      type: Number as PropType<number | null>,
      default: null,
    },
    isAnswerCorrect: {
      type: Boolean,
      required: true,
    },
    correctAnswer: {
      type: Number as PropType<number | null>,
      default: null,
    },
    showFeedback: {
      type: Boolean,
      required: true,
    },
  },
  emits: [
    "submit-answer",
    "handle-input",
    "delete-last-digit",
    "update:userAnswer",
    "quit",
  ],
  setup(props, { emit }) {
    const submitAnswer = () => {
      emit("submit-answer");
    };

    const emitUpdateAnswer = (answer: string) => {
      emit("update:userAnswer", answer);
    };

    const handleNumPadInput = (key: string) => {
      emit("handle-input", key);
    };

    const deleteLastDigit = () => {
      emit("delete-last-digit");
    };

    const quit = () => {
      emit("quit");
    };

    const settingsStore = useSettingsStore();

    return {
      emitUpdateAnswer,
      submitAnswer,
      handleNumPadInput,
      deleteLastDigit,
      settingsStore,
      quit,
    };
  },
});
</script>

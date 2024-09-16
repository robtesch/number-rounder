<template>
  <div class="max-w-xl mx-auto mt-12 text-center relative">
    <h1 class="text-3xl font-bold mb-8">Number Rounding Rockstars</h1>

    <!-- Settings Icon -->
    <div class="absolute right-2 top-2">
      <PButton
        @click="showSettings = true"
        aria-label="Settings"
        class="p-button-text"
      >
        <FontAwesome :icon="['fas', 'cog']" />
      </PButton>
    </div>

    <!-- Settings Modal -->
    <SettingsModal
      v-model:visible="showSettings"
      :availableRoundingOptions="availableRoundingOptions"
      @save-settings="saveSettings"
    />

    <!-- Start Screen -->
    <div v-if="!quizStarted" class="mt-8">
      <PButton label="Start" @click="startQuiz" class="p-button-success mb-6" />

      <!-- Game History -->
      <GameHistory v-if="gameHistoryStore.history.length > 0" />
    </div>

    <!-- Quiz Screen -->
    <QuizScreen
      v-if="quizStarted && timeLeft > 0"
      :formattedTime="formattedTime"
      :correctCount="correctCount"
      :questionCount="questionCount"
      :currentQuestion="currentQuestion"
      v-model:userAnswer="userAnswer"
      :isAnswerCorrect="isAnswerCorrect"
      :correctAnswer="correctAnswer"
      :showFeedback="showFeedback"
      @submit-answer="submitAnswer"
      @handle-input="handleNumPadInput"
      @delete-last-digit="deleteLastDigit"
      @quit="endQuiz(false)"
    />

    <!-- Result Screen -->
    <ResultScreen
      v-if="quizStarted && timeLeft <= 0"
      :correctCount="correctCount"
      :questionCount="questionCount"
      @restart-quiz="restartQuiz"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeUnmount, reactive, ref } from "vue";

import SettingsModal from "@/components/SettingsModal.vue";
import GameHistory from "@/components/GameHistory.vue";
import QuizScreen from "@/components/QuizScreen.vue";
import ResultScreen from "@/components/ResultScreen.vue";

import type { CurrentQuestion, GameResult, RoundingOption } from "@/types";

import { useSettingsStore } from "@/stores/settings";
import { useGameHistoryStore } from "@/stores/gameHistory";

export default defineComponent({
  components: {
    SettingsModal,
    GameHistory,
    QuizScreen,
    ResultScreen,
  },
  setup() {
    const quizStarted = ref<boolean>(false);
    const timeLeft = ref<number>(180); // Default 3 minutes
    const timer = ref<number | null>(null);
    const gameStartTime = ref<Date | null>(null);
    const gameEndTime = ref<Date | null>(null);

    // Initialize the stores
    const settingsStore = useSettingsStore();
    const gameHistoryStore = useGameHistoryStore();

    const availableRoundingOptions: RoundingOption[] = [
      { label: "10", value: 10 },
      { label: "100", value: 100 },
      { label: "1000", value: 1000 },
    ];

    const showSettings = ref<boolean>(false);

    const numberOptions = ref<number[]>([
      ...settingsStore.settings.roundingOptions,
    ]);
    const questionCount = ref<number>(0);
    const correctCount = ref<number>(0);

    const currentQuestion = reactive<CurrentQuestion>({
      number: 0,
      roundTo: 0,
      roundToLabel: "",
    });

    const userAnswer = ref<number | null>(null);

    const showFeedback = ref<boolean>(false);
    const isAnswerCorrect = ref<boolean>(false);
    const correctAnswer = ref<number | null>(null);

    const formattedTime = computed((): string => {
      const minutes = Math.floor(timeLeft.value / 60);
      const seconds = timeLeft.value % 60;
      return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    });

    const startQuiz = (): void => {
      if (settingsStore.settings.roundingOptions.length === 0) {
        alert("Please select at least one rounding option in settings.");
        return;
      }
      stopTimer(); // Stop any existing timer
      quizStarted.value = true;
      correctCount.value = 0;
      questionCount.value = 0;
      timeLeft.value = settingsStore.settings.timeLimit * 60;
      numberOptions.value = [...settingsStore.settings.roundingOptions];
      gameStartTime.value = new Date(); // Record the start time
      nextQuestion();
      startTimer();
    };

    const endQuiz = (saveResult: boolean = true): void => {
      if (!quizStarted.value) return; // Avoid multiple calls
      gameEndTime.value = new Date(); // Record the end time
      // Stop the timer
      stopTimer();
      if (saveResult) {
        // Save the game result
        saveGameResult();
      }

      // Set quizStarted to false
      quizStarted.value = false;

      // Reset start and end times
      gameStartTime.value = null;
      gameEndTime.value = null;
    };

    const restartQuiz = (): void => {
      // End the current quiz if it's ongoing
      if (quizStarted.value) {
        endQuiz();
      }
      // Start a new quiz
      startQuiz();
    };

    const startTimer = (): void => {
      timer.value = window.setInterval(() => {
        timeLeft.value--;
        if (timeLeft.value <= 0) {
          // Time's up
          endQuiz();
        }
      }, 1000);
    };

    const stopTimer = (): void => {
      if (timer.value !== null) {
        clearInterval(timer.value);
        timer.value = null;
      }
    };

    const nextQuestion = (): void => {
      userAnswer.value = null;
      showFeedback.value = false;
      isAnswerCorrect.value = false;
      correctAnswer.value = null;

      currentQuestion.number = Math.floor(Math.random() * 9999) + 1;
      const options = numberOptions.value;
      currentQuestion.roundTo =
        options[Math.floor(Math.random() * options.length)];
      currentQuestion.roundToLabel = currentQuestion.roundTo.toString();
    };

    const handleNumPadInput = (key: string): void => {
      if (showFeedback.value) return;

      const currentValue =
        userAnswer.value !== null ? userAnswer.value.toString() : "";
      if (currentValue.length >= 6) return;

      const newValue = currentValue + key;
      userAnswer.value = parseInt(newValue, 10);
    };

    const deleteLastDigit = (): void => {
      if (userAnswer.value === null) return;
      const currentValue = userAnswer.value.toString();
      const newValue = currentValue.slice(0, -1);
      userAnswer.value = newValue ? parseInt(newValue, 10) : null;
    };

    const submitAnswer = (): void => {
      if (userAnswer.value === null) return;

      questionCount.value++;

      const expectedAnswer =
        Math.round(currentQuestion.number / currentQuestion.roundTo) *
        currentQuestion.roundTo;

      if (userAnswer.value === expectedAnswer) {
        isAnswerCorrect.value = true;
        correctCount.value++;
      } else {
        isAnswerCorrect.value = false;
        correctAnswer.value = expectedAnswer;
      }

      showFeedback.value = true;

      setTimeout(() => {
        if (timeLeft.value > 0) {
          nextQuestion();
        }
      }, 2000);
    };

    const saveSettings = (): void => {
      if (settingsStore.settings.timeLimit < 1) {
        alert("Time limit must be at least 1 minute.");
        return;
      }
      if (settingsStore.settings.roundingOptions.length === 0) {
        alert("Please select at least one rounding option.");
        return;
      }
      showSettings.value = false;

      if (quizStarted.value) {
        endQuiz(false); // End the current quiz without saving the result
      }
    };

    const saveGameResult = (): void => {
      // Calculate the duration in seconds
      let durationInSeconds = settingsStore.settings.timeLimit * 60; // Default to the full time limit
      if (gameStartTime.value && gameEndTime.value) {
        durationInSeconds = Math.round(
          (gameEndTime.value.getTime() - gameStartTime.value.getTime()) / 1000,
        );
      }

      const newResult: GameResult = {
        date: new Date().toISOString(),
        correctCount: correctCount.value,
        questionCount: questionCount.value,
        settings: { ...settingsStore.settings },
        duration: durationInSeconds,
      };

      gameHistoryStore.addGameResult(newResult);
    };

    onBeforeUnmount(() => {
      // Ensure the timer is stopped
      stopTimer();
      // End the quiz if it's ongoing
      if (quizStarted.value) {
        endQuiz();
      }
    });

    return {
      quizStarted,
      timeLeft,
      formattedTime,
      currentQuestion,
      userAnswer,
      submitAnswer,
      deleteLastDigit,
      handleNumPadInput,
      showFeedback,
      isAnswerCorrect,
      correctAnswer,
      correctCount,
      questionCount,
      startQuiz,
      restartQuiz,
      settingsStore,
      showSettings,
      saveSettings,
      availableRoundingOptions,
      gameHistoryStore,
      endQuiz,
    };
  },
});
</script>

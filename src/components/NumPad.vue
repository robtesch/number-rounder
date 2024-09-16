<template>
  <div class="flex flex-col items-center space-y-3">
    <div class="flex space-x-3" v-for="row in numpadLayout" :key="row.join('')">
      <PButton
        v-for="key in row"
        :key="key"
        :label="key"
        @click="handleInput(key)"
        class="w-16 h-16 text-xl"
      />
    </div>
    <div class="flex space-x-3">
      <PButton @click="$emit('delete')" class="p-button-secondary w-28 h-12">
        <FontAwesome :icon="['fas', 'backspace']" /><span>Delete</span>
      </PButton>
      <PButton @click="$emit('submit')" class="p-button-primary w-28 h-12">
        <span>Submit</span><FontAwesome :icon="['fas', 'check']" />
      </PButton>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  emits: ["input", "delete", "submit"],
  setup(_, { emit }) {
    const numpadLayout: string[][] = [
      ["7", "8", "9"],
      ["4", "5", "6"],
      ["1", "2", "3"],
      ["0"],
    ];

    const handleInput = (key: string) => {
      emit("input", key);
    };

    return {
      numpadLayout,
      handleInput,
    };
  },
});
</script>

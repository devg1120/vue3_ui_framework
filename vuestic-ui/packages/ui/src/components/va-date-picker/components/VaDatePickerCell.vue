<template>
  <div
    v-if="hidden"
    class="va-date-picker-cell va-date-picker-cell_clear"
  />
  <div
    v-else
    class="va-date-picker-cell"
    :class="{
      'va-date-picker-cell_other-month': otherMonth,
      'va-date-picker-cell_today': highlightToday && today,
      'va-date-picker-cell_in-range': inRange,
      'va-date-picker-cell_disabled': disabled,
      'va-date-picker-cell_highlighted-weekend': highlightWeekend && weekend,
      'va-date-picker-cell_selected': selected,
      'va-date-picker-cell_focused': focused,
      'va-date-picker-cell_readonly': readonly,
    }"
    @click="onClick"
    @keypress.space.enter.prevent.stop="onClick"
  >
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { useElementTextColor, useColors } from '../../../composables'
import { computed, toRef } from 'vue'

defineOptions({
  name: 'VaDatePickerCell',
})

const props = defineProps({
  otherMonth: { type: Boolean, default: false },
  today: { type: Boolean, default: false },
  inRange: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  selected: { type: Boolean, default: false },
  weekend: { type: Boolean, default: false },
  hidden: { type: Boolean, default: false },
  focused: { type: Boolean, default: false },
  highlightWeekend: { type: Boolean, default: false },
  highlightToday: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  color: { type: String, default: 'primary' },
})

const emit = defineEmits(['click'])

const onClick = () => {
  if (!props.disabled) { emit('click') }
}

const { getColor } = useColors()

const bg = computed(() => getColor(props.color))

const textColorComputed = useElementTextColor(bg)
</script>

<style lang="scss">
@import '../../../styles/resources';

.va-date-picker-cell {
  position: relative;
  color: var(--va-date-picker-text-color);
  line-height: var(--va-date-picker-cell-size);
  min-height: var(--va-date-picker-cell-size);
  min-width: var(--va-date-picker-cell-size);
  cursor: pointer;
  user-select: none;
  border-radius: var(--va-date-picker-cell-radius);
  box-sizing: border-box;
  text-align: center;
  z-index: 1;

  &::after,
  &::before {
    content: '';
    position: absolute;
    height: 100%;
    width: 100%;
    left: 0;
    z-index: -1;
    user-select: none;
    box-sizing: border-box;
    border-radius: var(--va-date-picker-cell-radius);
  }

  &_clear {
    cursor: default;
    opacity: 0;
  }

  &_highlighted-weekend {
    color: var(--va-date-picker-weekends-color);
  }

  // &_in-range:not(.va-date-picker-cell_disabled) {
  // &_in-range { // should be like a the line above if the `range` value
  // will exclude not allows dates
  &_in-range {
    &::after {
      background-color: v-bind(bg);
      opacity: var(--va-date-picker-cell-background-opacity-in-range);
    }
  }

  &_today {
    font-weight: bold;

    &::before {
      border: 2px solid var(--va-date-picker-color);
    }
  }

  &_selected {
    background-color: v-bind(bg);
    color: v-bind(textColorComputed);
  }

  &_other-month {
    opacity: var(--va-date-picker-cell-opacity);
  }

  &:hover,
  &_focused,
  &_focused:hover {
    &:not(
    .va-date-picker-cell_selected):not(
      .va-date-picker-cell_readonly):not(
        .va-date-picker-cell_disabled):not(
          .va-date-picker-cell_other-month) {
      &::after {
        background-color: var(--va-date-picker-selected-background);
        opacity: var(--va-date-picker-cell-background-opacity-hover);
      }
    }
  }

  &_disabled {
    &:not(.va-date-picker-cell_today) {
      opacity: 0.5;
    }

    cursor: not-allowed;
    opacity: var(--va-date-picker-cell-opacity);

    &::after { // Crossline
      opacity: var(--va-date-picker-cell-opacity);
      border: none;
      height: 2px;
      width: 50%;
      background: currentColor;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }

  &_readonly {
    cursor: default;
  }
}
</style>

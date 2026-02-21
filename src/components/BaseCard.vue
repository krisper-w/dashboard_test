<template>
  <div :class="['base-card', `--variant-${variant}`]">
    <div v-if="$slots.header" class="base-card__header">
      <slot name="header"></slot>
    </div>

    <div class="base-card__body">
      <slot></slot>
    </div>

    <div v-if="footerText" class="base-card__footer">
      {{ footerText }}
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'default' | 'error' | 'loader'
  footerText?: string
}

withDefaults(defineProps<Props>(), {
  variant: 'default',
})
</script>

<style lang="scss" scoped>
.base-card {
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.05);
  overflow: hidden;

  &.--variant-error {
    border: 1px solid rgba(239, 68, 68, 0.2);
  }

  &__header {
    padding: 1.5rem 1.5rem 0;
  }

  &__body {
    padding: 1.5rem;
  }

  &__footer {
    padding: 1rem 1.5rem;
    background: #f8fafc;
    font-size: 0.8rem;
    color: #94a3b8;
    border-top: 1px solid #f1f5f9;
  }
}
</style>

<script setup lang="ts">
import type { DbAlbum } from "~/infrastructure/database/schemas/DbAlbum";
import { albumFontNameToClass } from "~/infrastructure/utils";

defineProps<{ style: DbAlbum["style"] }>();
</script>

<template>
  <div
    :style="{
      '--album-view-background-color': style.backgroundColor,
      '--album-view-text-color': style.textColor,
      '--album-view-base-border-radius': style.baseBorderRadius,
      background: 'var(--album-view-background-color)',
      color: 'var(--album-view-text-color)',
    }"
    :class="['w-full h-screen', albumFontNameToClass(style.font)]"
  >
    <slot />
  </div>
</template>

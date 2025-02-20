<script setup lang="ts">
import type { AlbumViewSuccessData } from "~/types";

const { t } = useI18n();

defineProps<{ data: AlbumViewSuccessData }>();
defineEmits<{ open: [] }>();
</script>

<template>
  <div class="w-full h-screen flex items-stretch">
    <div
      :class="[
        'w-full max-w-[max(30rem,60%)] flex flex-col items-start justify-center',
        'px-12 pt-8 pb-10 md:pl-28 md:pr-32 md:pt-16 md:pb-20',
      ]"
    >
      <h1
        :class="[
          'text-4xl sm:text-5xl md:text-4xl lg:text-5xl xl:text-6xl',
          'mb-8 md:mb-16',
        ]"
      >
        {{ data.album.title }}
      </h1>

      <p
        v-if="data.album.description"
        :class="[
          'whitespace-pre-line',
          'text-lg sm:text-xl md:text-lg lg:text-xl xl:text-2xl',
          'mb-8 md:mb-16',
        ]"
      >
        {{ data.album.description }}
      </p>

      <button
        type="button"
        :class="[
          'cursor-pointer',
          'px-4 py-1 sm:px-6 sm:py-1.5 md:px-4 md:py-1 lg:px-6 lg:py-1.5',
          'text-lg sm:text-xl md:text-lg lg:text-xl xl:text-2xl',
          'bg-[var(--album-view-text-color)] text-[var(--album-view-background-color)]',
          'rounded-[calc(0.75*var(--album-view-base-border-radius))] sm:rounded-[calc(1.25*var(--album-view-base-border-radius))]',
          'md:rounded-[calc(1*var(--album-view-base-border-radius))] lg:rounded-[calc(1.5*var(--album-view-base-border-radius))]',
        ]"
        @click="$emit('open')"
      >
        {{ t("public.album.view.cover.openAlbum") }}
      </button>
    </div>

    <div
      v-if="data.pictures[0]"
      :class="[
        'max-md:hidden flex-1 w-0 overflow-hidden relative',
        'bg-[var(--album-view-text-color)]',
      ]"
    >
      <div
        class="absolute top-0 left-0 w-full h-full bg-black/40 backdrop-blur-xs"
      />

      <img
        alt=""
        class="w-full h-full object-cover"
        :src="data.pictures[0].presignedS3UrlOptimizedImage"
        :width="data.pictures[0].optimizedImage.width"
        :height="data.pictures[0].optimizedImage.height"
      />
    </div>
  </div>
</template>

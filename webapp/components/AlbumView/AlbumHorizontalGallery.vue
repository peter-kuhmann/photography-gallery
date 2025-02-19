<script setup lang="ts">
import type { AlbumViewSuccessData } from "~/types";
import { onKeyStroke, useSwipe } from "@vueuse/core";

const props = defineProps<{
  data: AlbumViewSuccessData;
}>();

const currentIndex = ref(0);
const direction = ref<"next" | "previous">("next");

const canPrevious = computed(() => currentIndex.value > 0);
const canNext = computed(
  () => currentIndex.value < props.data.pictures.length - 1,
);

function previous(e: Event) {
  e.preventDefault();
  if (canPrevious.value) {
    direction.value = "previous";
    currentIndex.value--;
  }
}

function next(e: Event) {
  e.preventDefault();
  if (canNext.value) {
    direction.value = "next";
    currentIndex.value++;
  }
}

onKeyStroke("ArrowLeft", previous);
onKeyStroke("ArrowRight", next);

const imageAreaRef = useTemplateRef("image-area");
useSwipe(imageAreaRef, {
  onSwipeEnd: (e, direction) => {
    if (direction === "right") {
      previous(e);
    } else if (direction === "left") {
      next(e);
    }
  },
});

const currentImage = computed(
  () => props.data.pictures[currentIndex.value] ?? null,
);
const nextImage = computed(
  () => props.data.pictures[currentIndex.value + 1] ?? null,
);

watchEffect(() => {
  if (
    props.data.pictures.length > 0 &&
    currentIndex.value >= props.data.pictures.length
  ) {
    currentIndex.value = props.data.pictures.length - 1;
  }
});
</script>

<template>
  <div class="w-full h-screen flex flex-col">
    <div ref="image-area" class="flex-1 h-0 p-8 overflow-hidden">
      <div class="relative w-full h-full">
        <transition :name="`gallery-${direction}`">
          <img
            v-if="currentImage"
            :key="currentImage.id"
            alt=""
            :src="currentImage.presignedS3UrlOptimizedImage"
            :width="currentImage.optimizedImage.width"
            :height="currentImage.optimizedImage.height"
            loading="eager"
            class="w-full h-full object-contain"
          />
        </transition>

        <img
          v-if="nextImage"
          alt=""
          :src="nextImage.presignedS3UrlOptimizedImage"
          :width="nextImage.optimizedImage.width"
          :height="nextImage.optimizedImage.height"
          loading="eager"
          class="w-1 h-1 opacity-0 absolute -left-full -top-full"
        />
      </div>
    </div>

    <div
      class="bg-white flex items-center justify-center gap-x-8 px-4 py-4 text-black"
    >
      <Button
        :disabled="!canPrevious"
        type="button"
        severity="secondary"
        size="small"
        @click="previous"
      >
        <i class="pi pi-arrow-left" />
      </Button>

      <span> {{ currentIndex + 1 }} / {{ data.pictures.length }} </span>

      <Button
        :disabled="!canNext"
        type="button"
        severity="secondary"
        size="small"
        @click="next"
      >
        <i class="pi pi-arrow-right" />
      </Button>
    </div>
  </div>
</template>

<style>
@import "~/styles/gallery/horizontal.scss";
</style>

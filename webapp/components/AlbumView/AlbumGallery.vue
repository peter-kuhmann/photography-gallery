<script setup lang="ts">
import type { AlbumViewSuccessData } from "~/types";
import AlbumHorizontalGallery from "~/components/AlbumView/AlbumHorizontalGallery.vue";
import AlbumCover from "~/components/AlbumView/cover/AlbumCover.vue";
import AlbumStyleConfig from "~/components/AlbumView/AlbumStyleConfig.vue";

const showCover = ref(true);

defineProps<{
  data: AlbumViewSuccessData;
}>();
</script>

<template>
  <AlbumStyleConfig :style="data.album.style">
    <transition name="cross-fade">
      <AlbumCover v-if="showCover" :data @open="showCover = false" />
      <AlbumHorizontalGallery v-else :data />
    </transition>
  </AlbumStyleConfig>
</template>

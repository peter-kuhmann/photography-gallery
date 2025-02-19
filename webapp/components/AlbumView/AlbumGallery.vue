<script setup lang="ts">
import type { AlbumViewSuccessData } from "~/types";
import AlbumHorizontalGallery from "~/components/AlbumView/AlbumHorizontalGallery.vue";

defineProps<{
  data: AlbumViewSuccessData;
}>();
</script>

<template>
  <AlbumHorizontalGallery :data />
</template>

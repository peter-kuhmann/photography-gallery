<script setup lang="ts">
import type { AlbumViewSuccessData } from "~/types";
import ModernCover from "~/components/AlbumView/cover/ModernCover.vue";

const { t } = useI18n();

defineProps<{ data: AlbumViewSuccessData }>();
defineEmits<{ open: [] }>();
</script>

<template>
  <ModernCover
    v-if="data.album.style.cover.type === 'MODERN'"
    :data="data"
    @open="$emit('open')"
  />

  <div v-else>ERROR: Unsupported cover</div>
</template>

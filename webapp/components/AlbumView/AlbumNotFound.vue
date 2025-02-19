<script setup lang="ts">
import AlbumNotFoundIllustration from "~/assets/AlbumNotFoundIllustration.svg";
const { t } = useI18n();
</script>

<template>
  <div class="w-full h-screen grid place-content-center p-4">
    <AlbumNotFoundIllustration class="max-w-full w-64" aria-disabled="true" />
    <p class="sr-only">{{ t("public.album.view.notFound.title") }}</p>
  </div>
</template>

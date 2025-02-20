<script setup lang="ts">
import AlbumGallery from "~/components/AlbumView/AlbumGallery.vue";
import AlbumNotFound from "~/components/AlbumView/AlbumNotFound.vue";
import AlbumPasswordProtectionScreen from "~/components/AlbumView/AlbumPasswordProtectionScreen.vue";

const slug = useRoute().params.slug;
const headers = useRequestHeaders();
const albumPassword = ref<string | undefined>(undefined);

const { data } = await useAsyncData(
  () => {
    return $fetch(`/api/album/${slug}`, {
      headers,
      params: {
        password: albumPassword.value,
      },
    });
  },
  {
    watch: [albumPassword],
  },
);
</script>

<template>
  <div class="w-full h-screen">
    <transition name="cross-fade">
      <p v-if="!data">loading</p>

      <AlbumNotFound v-else-if="!data.success && data.reason === 'NOT_FOUND'" />

      <AlbumPasswordProtectionScreen
        v-else-if="!data.success && data.reason === 'NOT_AUTHORIZED'"
        :password-incorrect="data.invalidPassword"
        @password-entered="(password) => (albumPassword = password)"
      />

      <AlbumGallery v-else :data />
    </transition>
  </div>
</template>

<script setup lang="ts">
import {onKeyStroke, useSwipe} from "@vueuse/core";

const route = useRoute()
const { data } = await useFetch(`/api/album/${route.params.slug}`)

const sortedPictures = computed(() => {
  if ( !data.value || !data.value.album || !data.value.pictures ) return []

  const pictureOrder = data.value.album.pictures
  return data.value.pictures.sort((a, b) => pictureOrder.indexOf(a.id) - pictureOrder.indexOf(b.id))
})

const currentIndex = ref(0)
const direction = ref<"next" | "previous">("next")

const canPrevious = computed(() => currentIndex.value > 0)
const canNext = computed(() => currentIndex.value < sortedPictures.value.length - 1)

function previous(e: Event) {
  e.preventDefault()
  if ( canPrevious.value ) {
    direction.value = "previous"
    currentIndex.value--;
  }
}

function next(e: Event) {
  e.preventDefault()
  if ( canNext.value ) {
    direction.value = "next"
    currentIndex.value++;
  }
}

onKeyStroke('ArrowLeft', previous)
onKeyStroke('ArrowRight', next)

const imageAreaRef = useTemplateRef('image-area')
useSwipe(imageAreaRef, {
  onSwipeEnd: (e, direction) => {
    if ( direction === "right" ) {
      previous(e)
    } else if ( direction === "left" ) {
      next(e)
    }
  }
})

const currentImage = computed(() => sortedPictures.value?.[currentIndex.value] ?? null)
const nextImage = computed(() => sortedPictures.value?.[currentIndex.value + 1] ?? null)

watchEffect(() => {
  if ( sortedPictures.value.length > 0 && currentIndex.value >= sortedPictures.value.length ) {
    currentIndex.value = sortedPictures.value.length - 1
  }
})
</script>

<style>
@import "~/styles/gallery.scss";
</style>

<template>
  <div class="w-full h-screen">
    <div v-if="!data?.album">
      Album not found.
    </div>

    <div v-else class="w-full h-screen flex flex-col">
      <div class="flex-1 h-0 p-8 bg-white overflow-hidden" ref="image-area">
        <div class="relative w-full h-full">
          <transition :name="`gallery-${direction}`">
            <img v-if="currentImage"
                    alt=""
                   :key="currentImage.id"
                   :src="currentImage.presignedS3UrlOptimizedImage"
                   :width="currentImage.optimizedImage.width"
                   :height="currentImage.optimizedImage.height"
                   loading="eager"
                   class="w-full h-full object-contain"/>
          </transition>

          <img v-if="nextImage"
               alt=""
               :src="nextImage.presignedS3UrlOptimizedImage"
               :width="nextImage.optimizedImage.width"
               :height="nextImage.optimizedImage.height"
               loading="eager"
               class="w-1 h-1 opacity-0 absolute -left-full -top-full"/>
        </div>
      </div>

      <div class="bg-white flex items-center justify-center gap-x-8 px-4 py-4 text-black">
        <Button :disabled="!canPrevious" @click="previous" type="button" severity="secondary" size="small">
          <i class="pi pi-arrow-left" />
        </Button>

        <span>
          {{currentIndex + 1}} / {{sortedPictures.length}}
        </span>

        <Button :disabled="!canNext" @click="next" type="button" severity="secondary" size="small">
          <i class="pi pi-arrow-right" />
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from "@primevue/forms/form";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { z } from "zod";

const { t } = useI18n();

defineProps<{ passwordIncorrect?: boolean }>();
const emit = defineEmits<{ passwordEntered: [password: string] }>();

const formZodSchema = z.object({
  password: z.string().nonempty(),
});

const resolver = ref(zodResolver(formZodSchema));

function onFormSubmit(event: FormSubmitEvent) {
  if (event.valid) {
    const values = event.values as z.infer<typeof formZodSchema>;
    emit("passwordEntered", values.password);
  }
}
</script>

<template>
  <div class="w-full h-screen grid place-content-center p-8">
    <Form
      :resolver
      class="flex flex-col gap-4 text-center"
      @submit="onFormSubmit"
    >
      <InputText
        type="password"
        name="password"
        placeholder="password"
        class="text-center"
        autofocus
      />
      <Button type="submit" severity="secondary" label="log in" />

      <p v-if="passwordIncorrect" class="text-red-600">
        {{ t("public.album.view.passwordProtection.invalidPassword") }}
      </p>
    </Form>
  </div>
</template>

<style scoped></style>

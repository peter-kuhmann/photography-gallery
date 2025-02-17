<script setup lang="ts">
import {Form} from "@primevue/forms"
import { zodResolver } from '@primevue/forms/resolvers/zod';
import {z} from "zod";
import type {FormSubmitEvent} from "@primevue/forms/form";

definePageMeta({
  layout: "centered"
})

const zodSchema = z.object({
  email: z.string().email(),
  password: z.string().nonempty()
})

const resolver = ref(zodResolver(zodSchema))

function onFormSubmit(event: FormSubmitEvent) {
  if ( event.valid ) {
    const values = event.values as z.infer<typeof zodSchema>
    alert("TODO: implement login")
  }
}
</script>

<template>
  <Form :resolver class="flex flex-col gap-4 w-full sm:w-56" @submit="onFormSubmit">
    <InputText type="text" name="email" placeholder="e-mail address" />
    <InputText type="password" name="password" placeholder="password" />
    <Button type="submit" severity="secondary" label="log in" />
  </Form>
</template>

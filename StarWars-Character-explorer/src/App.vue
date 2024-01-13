<script setup lang="ts">

</script>

<template>
  <div>
    <Suspense>
      <RouterView v-slot="{ Component }">
        <Transition
          name="fade-slow"
          mode="out-in"
        >
          <component :is="Component" />
        </Transition>
      </RouterView>
    </Suspense>
  </div>
</template>

<style scoped>

</style>

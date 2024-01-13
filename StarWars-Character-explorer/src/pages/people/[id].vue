<script setup lang="ts">
import useStarWarsStore from '/@src/stores/useStarWarsStore'

const router = useRouter()

const route = useRoute()
const id = route.params.id

const starWarsStore = useStarWarsStore();

onMounted(async () => {
  await starWarsStore.fetchCharacter(id)
})
const character = computed(() => starWarsStore.getCharacterById(id))
</script>

<template>
  <AppLayout>
    <h1 class="title is-white">
      Starwars Characters
    </h1>
    <nav
      class="breadcrumb has-background-light"
      aria-label="breadcrumbs"
    >
      <ul>
        <li>
          <a
            href="#"
            @click="router.push('/')"
          >Home</a>
        </li>
        <li
          v-if="character"
          class="is-active"
        >
          <a
            href="#"
            aria-current="page"
          >{{ character.name }}</a>
        </li>
      </ul>
    </nav>

    <section
      v-if="character"
      class="container has-background-light is-fullwidth is-large"
    >
      <div class="content">
        <p><strong>Name:</strong> {{ character.name }}</p>
        <p><strong>Gender:</strong> {{ character.gender }}</p>
        <p><strong>Height:</strong> {{ character.height }}</p>
        <p><strong>Mass:</strong> {{ character.mass }}</p>
        <p><strong>Hair Color:</strong> {{ character.hair_color }}</p>
        <p><strong>Skin Color:</strong> {{ character.skin_color }}</p>
        <p><strong>Eye Color:</strong> {{ character.eye_color }}</p>
        <p><strong>Birth Year:</strong> {{ character.birth_year }}</p>
        <p><strong>Homeworld:</strong> {{ character.homeworld.name }}</p>

        <p>
          <strong>Films:</strong>&nbsp;
          <span
            v-for="(film, i) in character.films"
            :key="i"
          >{{ film.title }}<template v-if="i !== character.films.length - 1 && character.films[0]?.title">, </template></span>
        </p>

        <p>
          <strong>Vehicles:</strong>&nbsp;
          <span
            v-for="(vehicle, i) in character.vehicles"
            :key="i"
          >{{ vehicle.name }}<template v-if="i !== character.vehicles.length - 1 && character.vehicles[0]?.name">, </template></span>
        </p>
      </div>
    </section>
  </AppLayout>
</template>

<style lang="scss" scoped>

</style>

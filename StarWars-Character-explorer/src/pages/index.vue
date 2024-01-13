<script setup lang="ts">
  import useStarWarsStore from '/@src/stores/useStarWarsStore'

  const starWarsStore = useStarWarsStore()
  let isRequestedAndLoaded = ref(false)
  const router = useRouter()

  onMounted(async () => {
    await changePage()
  })

  const characterList = computed(() => starWarsStore.getCharactersByPage(starWarsStore.currentPage))

  async function changePage(page = 1) {
    isRequestedAndLoaded.value = false
    if (isOutOfPageRange(page)) {
      console.error('Unable to change the page as it is outside of the page range.')
      return
    }
    await fetchCharactersByPage(page)
    starWarsStore.currentPage = page
    isRequestedAndLoaded.value = true
  }

  async function fetchCharactersByPage(page = 1) {
    if (isOutOfPageRange(page)) {
      console.error('Unable to fetch the characters as the page is outside of the page range.')
      return
    }
    await starWarsStore.fetchCharactersByPage(page)
  }

  const isOutOfPageRange = (page: number) => {
    if (starWarsStore.isLastPageDefined) { starWarsStore.fetchLastPage() }
    return page < 0 || (starWarsStore.lastPage !== -1 && page > starWarsStore.lastPage);
  }

  const isFirstPage = computed(() => starWarsStore.currentPage === 1)
  const isLastPage = computed(() => starWarsStore.currentPage === starWarsStore.lastPage)

  const previousPage = computed(() => starWarsStore.currentPage - 1)
  const nextPage = computed(() => starWarsStore.currentPage + 1)

  const showFirstPage = computed(() => starWarsStore.currentPage > 1)
  const showPrevPage = computed(() => starWarsStore.currentPage > 2)
  const showNextPage = computed(() => starWarsStore.currentPage < starWarsStore.lastPage - 1)
  const showLastPage = computed(() => starWarsStore.currentPage < starWarsStore.lastPage)

  const goToPeoplePage = (id: number) => {
    router.push(`/people/${id}`)
  }
</script>

<template>
  <AppLayout>
    <h1 class="title has-text-white">
      Starwars Characters
    </h1>
    <nav
      class="breadcrumb"
      aria-label="breadcrumbs"
    >
      <ul>
        <li class="is-active is">
          <span class="icon"><i class="fas fa-home" /></span><a
            href="#"
            class="is-primary"
            aria-current="page"
          >Home</a>
        </li>
      </ul>
    </nav>

    <div
      class="loader-wrapper"
      :class="{'is-active': !isRequestedAndLoaded}"
    >
      <div class="loader is-loading" />
    </div>

    <section>
      <table class="table is-fullwidth is-narrow is-hoverable">
        <thead>
          <tr>
            <th>Name</th>
            <th>Height</th>
            <th>Gender</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="character in characterList"
            :key="character.id"
          >
            <td>
              <a
                href="#"
                @click="goToPeoplePage(character.id)"
                @mouseenter="starWarsStore.fetchCharacter(character.id.toString())"
              >{{ character.name }}</a>
            </td>
            <td>
              <a
                href="#"
                @click="goToPeoplePage(character.id)"
                @mouseenter="starWarsStore.fetchCharacter(character.id.toString())"
              >{{ character.height }}</a>
            </td>
            <td>
              <a
                href="#"
                @click="goToPeoplePage(character.id)"
                @mouseenter="starWarsStore.fetchCharacter(character.id.toString())"
              >{{ character.gender }}</a>
            </td>
            <td>
              <button
                class="button"
                @click="goToPeoplePage(character.id)"
                @mouseenter="starWarsStore.fetchCharacter(character.id.toString())"
              >
                View
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <nav
        class="pagination is-centered"
        role="navigation"
        aria-label="pagination"
      >
        <a
          class="pagination-previous has-background-light"
          :class="{'is-disabled': isFirstPage}"
          @click="changePage(previousPage)"
          @mouseenter="fetchCharactersByPage(previousPage)"
        >Previous</a>
        <a
          class="pagination-next has-background-light"
          :class="{'is-disabled': isLastPage}"
          @click="changePage(nextPage)"
          @mouseenter="fetchCharactersByPage(nextPage)"
        >Next page</a>
        <ul class="pagination-list">
          <li v-if="showFirstPage">
            <a
              class="pagination-link has-background-light"
              aria-label="Goto page 1"
              @click="changePage(1)"
              @mouseenter="fetchCharactersByPage(1)"
            >1</a>
            <span
              v-if="starWarsStore.currentPage > 3"
              class="pagination-ellipsis"
            >&hellip;</span>
          </li>
          <li v-if="showPrevPage">
            <a
              class="pagination-link has-background-light"
              :aria-label="`Goto page ${previousPage}`"
              @click="changePage(previousPage)"
              @mouseenter="fetchCharactersByPage(previousPage)"
            >{{ previousPage }}</a>
          </li>
          <li>
            <a
              class="pagination-link is-current"
              aria-current="page"
              :aria-label="`Page ${starWarsStore.currentPage}`"
            >{{ starWarsStore.currentPage }}</a>
          </li>
          <li v-if="showNextPage">
            <a
              class="pagination-link has-background-light"
              :aria-label="`Goto page ${nextPage}`"
              @click="changePage(nextPage)"
              @mouseenter="fetchCharactersByPage(nextPage)"
            >{{ nextPage }}</a>
            <span
              v-if="starWarsStore.currentPage < starWarsStore.lastPage - 2"
              class="pagination-ellipsis"
            >&hellip;</span>
          </li>
          <li v-if="showLastPage">
            <a
              class="pagination-link has-background-light"
              :aria-label="`Goto page ${starWarsStore.lastPage}`"
              @click="changePage(starWarsStore.lastPage)"
              @mouseenter="fetchCharactersByPage(starWarsStore.lastPage)"
            >{{ starWarsStore.lastPage }}</a>
          </li>
        </ul>
      </nav>
    </section>
  </AppLayout>
</template>

 <style lang="scss" scoped>
 .loader-wrapper {
   position: absolute;
   top: 0;
   left: 0;
   height: 100%;
   width: 100%;
   background: #fff;
   opacity: 0;
   z-index: -1;
   transition: opacity .3s;
   display: flex;
   justify-content: center;
   align-items: center;
   border-radius: 6px;

   .loader {
     height: 80px;
     width: 80px;
   }

   &.is-active {
     opacity: 1;
     z-index: 1;
   }
 }

 .is-loading {
   position: relative;
 }

 </style>

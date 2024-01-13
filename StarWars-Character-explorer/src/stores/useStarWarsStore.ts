import { defineStore } from 'pinia';
import axios from 'axios';

type Homeworld = {
  name: string | null;
  url: string;
}

type Film = {
  title: string | null;
  url: string;
}

type Vehicle = {
  name: string | null;
  url: string;
}

type Character = {
  id: number,
  name: string;
  gender: string;
  height: string;
  mass: string;
  hair_color: string;
  skin_color: string;
  eye_color: string;
  birth_year: string;
  homeworld: Homeworld;
  films: Film[];
  vehicles: Vehicle[];
  url: string;
}

const useStarWarsStore = defineStore('starwars', {
  state: () => ({
    characters: {} as {[key: string]: Character},
    charactersByPage: {} as {[key: number]: Character[]},
    currentPage: 1,
    lastPage: -1,
    homeworld: {} as {[url: string]: Homeworld},
    films: {} as {[url: string]: Film},
    vehicles: {} as {[url: string]: Vehicle},
    isLoading: false,
  }),
  getters: {
    getCharacterById: (state) => (id: string) => state.characters[`https://swapi.dev/api/people/${id}/`],
    getCharactersByPage: (state) => (page: number = 1) => state.charactersByPage[page],
    isLastPageDefined: (state) => state.lastPage > -1
  },
  actions: {
    async fetchCharactersByPage(page: number = 1) {
      while (this.isLoading) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      if (this.charactersByPage[page]) {
        return;
      }
      this.isLoading = true;
      try {
        const response = await axios.get(`https://swapi.dev/api/people?page=${page}`);
        const rawCharacterData = response.data.results;
        const characterList = await Promise.all(rawCharacterData.map(rawData => this.convertRawDataToCharacter(rawData)));
        this.charactersByPage[page] = characterList

        if (this.lastPage === -1) {
          this.lastPage = Math.ceil(response.data.count / characterList.length);
        }
      }catch (error) {
        console.error('Unable to load characters', error)
      } finally {
        this.isLoading = false
      }
    },
    async fetchLastPage() {
      await this.fetchCharactersByPage();
    },
    async convertRawDataToCharacter(rawCharacterData: any): Promise<Character> {
      return this.characters[rawCharacterData.url] = {
        id: parseInt(rawCharacterData.url.split('/').slice(-2)[0]),
        name: rawCharacterData?.name,
        gender: rawCharacterData?.gender,
        height: rawCharacterData?.height,
        mass: rawCharacterData?.mass,
        hair_color: rawCharacterData?.hair_color,
        skin_color: rawCharacterData?.skin_color,
        eye_color: rawCharacterData?.eye_color,
        birth_year: rawCharacterData?.birth_year,
        homeworld: { name: null, url: rawCharacterData.homeworld },
        films: rawCharacterData?.films.map(filmUrl => {
          return { title: null, url: filmUrl }
        }),
        vehicles: rawCharacterData?.vehicles.map(vehicleUrl => {
          return { name: null, url: vehicleUrl }
        }),
        url: rawCharacterData?.url
      }
    },
    async fetchCharacter(id: string) {
      let character = this.getCharacterById(id)
      if (!character) {
        try {
          const response = await axios.get(`https://swapi.dev/api/people/${id}`);
          const rawCharacterData = response.data;
          character = await this.convertRawDataToCharacter(rawCharacterData);
        }catch (error) {
          console.error(`Unable to load character ${id}`, error)
        }
      }

      if(character.homeworld.name === null) {
        character.homeworld.name = (await this.getHomeworldByUrl(character.homeworld.url)).name
      }

      character.films = await Promise.all(character.films.map(filmData => (filmData.title === null)?this.getFilmsByUrl(filmData.url):filmData))
      character.vehicles = await Promise.all(character.vehicles.map(vehicleData => (vehicleData.name === null)?this.getVehiclesByUrl(vehicleData.url):vehicleData))

      this.characters[character.url] = {...character}
    },
    async getHomeworldByUrl(url: string): Promise<Homeworld> {
      if (this.homeworld[url])
        return this.homeworld[url]

      const response = await axios.get(url);
      const rawHomeworldData = response.data;

      this.homeworld[url] = {
        name: rawHomeworldData?.name,
        url
      }

      return this.homeworld[url];
    },

    async getFilmsByUrl(url: string): Promise<Film> {
      if (this.films[url])
        return this.films[url]

      const response = await axios.get(url);
      const rawFilmsData = response.data;

      this.films[url] = {
        title: rawFilmsData?.title,
        url
      }

      return this.films[url];
    },

    async getVehiclesByUrl(url: string): Promise<Vehicle> {
      if (this.vehicles[url])
        return this.vehicles[url]

      const response = await axios.get(url);
      const rawVehiclesData = response.data;

      this.vehicles[url] = {
        name: rawVehiclesData?.name,
        url
      }

      return this.vehicles[url]
    },
  },
});

export default useStarWarsStore;

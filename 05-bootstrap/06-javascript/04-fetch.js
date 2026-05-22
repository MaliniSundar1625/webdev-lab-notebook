const pokemonColors = {
  normal: "#A8A77A",
  fire: "#EE8130",
  water: "#6390F0",
  electric: "#F7D02C",
  grass: "#7AC74C",
  ice: "#96D9D6",
  fighting: "#C22E28",
  poison: "#ea7ce8",
  ground: "#E2BF65",
  flying: "#A98FF3",
  psychic: "#F95587",
  bug: "#A6B91A",
  rock: "#B6A136",
  ghost: "#735797",
  dragon: "#6F35FC",
  dark: "#705746",
  steel: "#B7B7CE",
  fairy: "#D685AD",
};

const pokemonContainer = document.getElementById("pokemonContainer");
const loader = document.getElementById("loader");
const searchInput = document.getElementById("searchInput");
const message = document.getElementById("message");

let allPokemons = [];

const showLoader = () => loader.classList.remove("hidden");
const hideLoader = () => loader.classList.add("hidden");

const showMessage = (text) => {
  message.textContent = text;
  message.classList.remove("hidden");
};

const hideMessage = () => {
  message.textContent = "";
  message.classList.add("hidden");
};

const createTypeBadge = (typeName) => {
  const badge = document.createElement("span");
  badge.className = "type-badge";
  badge.textContent = typeName;
  badge.style.backgroundColor = pokemonColors[typeName] || "#ddd";
  return badge;
};

const createPokemonCard = (pokemon) => {
  const card = document.createElement("article");
  card.className = "pokemon-card";

  const name = document.createElement("h2");
  name.className = "pokemon-name";
  name.textContent = pokemon.name;

  const image = document.createElement("img");
  image.className = "pokemon-image";
  image.src =
    pokemon.sprites.other["official-artwork"].front_default ||
    pokemon.sprites.front_default;

  // WAVE fix: thorough, accurate alt text describing the image content
  const typeNames = pokemon.types
    .map((typeObj) => typeObj.type.name)
    .join(" and ");
  image.alt = `Official artwork of ${pokemon.name}, a ${typeNames} type Pokémon`;

  const typesWrapper = document.createElement("div");
  typesWrapper.className = "pokemon-types";

  pokemon.types.forEach((typeObj) => {
    const badge = createTypeBadge(typeObj.type.name);
    typesWrapper.appendChild(badge);
  });

  card.append(name, image, typesWrapper);
  return card;
};

const renderPokemons = (pokemons) => {
  pokemonContainer.innerHTML = "";

  if (!pokemons.length) {
    showMessage("No Pokémon matched your search.");
    return;
  }

  hideMessage();
  pokemons.forEach((pokemon) => {
    const card = createPokemonCard(pokemon);
    pokemonContainer.appendChild(card);
  });
};

const fetchPokemons = async () => {
  showLoader();
  hideMessage();

  try {
    const response = await fetch(
      "https://pokeapi.co/api/v2/pokemon?limit=25",
    );
    const data = await response.json();

    const pokemonDetails = await Promise.all(
      data.results.map(async (pokemon) => {
        const detailResponse = await fetch(pokemon.url);
        return detailResponse.json();
      }),
    );

    allPokemons = pokemonDetails;
    renderPokemons(allPokemons);
  } catch (error) {
    showMessage("Something went wrong while fetching Pokémon data.");
    console.error(error);
  } finally {
    hideLoader();
  }
};

searchInput.addEventListener("input", (event) => {
  const query = event.target.value.trim().toLowerCase();

  const filteredPokemons = allPokemons.filter((pokemon) => {
    const nameMatch = pokemon.name.toLowerCase().includes(query);
    const typeMatch = pokemon.types.some((typeObj) =>
      typeObj.type.name.toLowerCase().includes(query),
    );
    return nameMatch || typeMatch;
  });

  renderPokemons(filteredPokemons);
});

fetchPokemons();

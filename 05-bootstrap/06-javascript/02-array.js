const pokemons = [
  { id: 1, name: "Bulbasaur", types: ["Grass", "Poison"] },
  { id: 2, name: "Ivysaur", types: ["Grass", "Poison"] },
  { id: 3, name: "Venusaur", types: ["Grass", "Poison"] },
  { id: 4, name: "Charmander", types: ["Fire"] },
  { id: 5, name: "Charmeleon", types: ["Fire"] },
  { id: 6, name: "Charizard", types: ["Fire", "Flying"] },
  { id: 7, name: "Squirtle", types: ["Water"] },
  { id: 8, name: "Wartortle", types: ["Water"] },
  { id: 9, name: "Blastoise", types: ["Water"] },
  { id: 10, name: "Caterpie", types: ["Bug"] },
  { id: 11, name: "Metapod", types: ["Bug"] },
  { id: 12, name: "Butterfree", types: ["Bug", "Flying"] },
  { id: 13, name: "Weedle", types: ["Bug", "Poison"] },
  { id: 14, name: "Kakuna", types: ["Bug", "Poison"] },
  { id: 15, name: "Beedrill", types: ["Bug", "Poison"] },
  { id: 16, name: "Pidgey", types: ["Normal", "Flying"] },
  { id: 17, name: "Pidgeotto", types: ["Normal", "Flying"] },
  { id: 18, name: "Pidgeot", types: ["Normal", "Flying"] },
  { id: 19, name: "Rattata", types: ["Normal"] },
  { id: 20, name: "Raticate", types: ["Normal"] },
];

// forEachPokemon
const forEachPokemon = function () {
  const lines = [];
  pokemons.forEach((pokemon) => {
    lines.push(
      `#${pokemon.id} ${pokemon.name} - ${pokemon.types.join(" / ")}`,
    );
  });
  return lines.join("\n");
};

console.group("=========== forEachPokemon =========== ");
console.log(forEachPokemon());
console.groupEnd();

// filterPokemons
const filterPokemons = function (type) {
  return pokemons
    .filter((pokemon) => pokemon.types.includes(type))
    .map((pokemon) => pokemon.name)
    .sort((a, b) => a.localeCompare(b));
};

console.group("=========== filterPokemons =========== ");
console.log(filterPokemons("Fire"));
// [ 'Charizard', 'Charmander', 'Charmeleon' ]
console.log(filterPokemons("Normal"));
// [ 'Pidgeot', 'Pidgeotto', 'Pidgey', 'Raticate', 'Rattata' ]
console.log(filterPokemons("Poison"));
// [ 'Beedrill', 'Bulbasaur', 'Ivysaur', 'Kakuna', 'Venusaur', 'Weedle' ]
console.groupEnd();

// searchPokemons
const searchPokemons = function (query) {
  const normalizedQuery = query.toLowerCase();
  return pokemons.filter((pokemon) => {
    const nameMatch = pokemon.name.toLowerCase().includes(normalizedQuery);
    const typeMatch = pokemon.types.some((type) =>
      type.toLowerCase().includes(normalizedQuery),
    );
    return nameMatch || typeMatch;
  });
};

console.group("=========== searchPokemons =========== ");
console.log(searchPokemons("Wartortle"));
console.log(searchPokemons("pidgey"));
console.log(searchPokemons("bug"));
console.groupEnd();

// reducePokemons
const reducePokemons = pokemons.reduce((acc, pokemon) => {
  pokemon.types.forEach((type) => {
    acc[type] = (acc[type] || 0) + 1;
  });
  return acc;
}, {});

console.group("=========== reducePokemons =========== ");
console.log(reducePokemons);
console.groupEnd();

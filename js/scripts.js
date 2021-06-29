let pokemonRepository = (function() {
  // Creates pokemonList variable and adds pokemon information to the list:
  // name, height, types
  let pokemonList = [
    {
      name: 'Charmander',
      height: 0.7,
      types: ['fire']
    },
    {
      name: 'Gengar',
      height: 1.5,
      types: ['ghost', 'poison']
    },
    {
      name: 'Gyarados',
      height: 6.5,
      types: ['water', 'flying']
    },
    {
      name: 'Zapdos',
      height: 1.6,
      types: ['electric', 'flying']
    },
    {
      name: 'Suicune',
      height: 2,
      types: ['water']
    },
    {
      name: 'Ho-oh',
      height: 3.8,
      types: ['fire', 'flying']
    }
  ];

  // function to return full pokemon list
  function getAll() {
    return pokemonList;
  }

  // function to add pokemon to pokemonList
  function add(pokemon) {
    // Check if pokemon variable is an object
    if (typeof pokemon === 'object') {
      let keys = Object.keys(pokemon);
      // Check if pokemon variable has 'name', 'height', and 'types' keys
      if (keys.indexOf('name') >= 0 && keys.indexOf('height') >= 0 && keys.indexOf('types') >= 0) {
        pokemonList.push(pokemon);
      }
    }
  }

  // functio to search for and return pokemon based on name
  function search(name) {
    return pokemonList.filter(function(pokemon) {
      return pokemon.name.toLowerCase() === name.toLowerCase();
    });
  }

  return {
    getAll: getAll,
    add: add,
    search: search
  };
})();

// Iterate through pokemon list, writing each one to the document
pokemonRepository.getAll().forEach(function(pokemon) {
  // Check if pokemon is taller then 5, if so add excalamation text "Wow, that's big!"
  document.write(`<p>${pokemon.name} (height: ${pokemon.height})${pokemon.height > 5 ? ' Wow, that\'s big!' : ''}</p>`);
});

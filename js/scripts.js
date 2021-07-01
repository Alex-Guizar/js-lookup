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

  // function to create a list item and button for each pokemon and add it to the empty ul.pokemon-list
  function addListItem(pokemon) {
    let pokemonListElement = document.querySelector('.pokemon-list'); // variable assigned to empty ul to hold pokemon
    let listItem = document.createElement('li'); // create list item to hold pokemon button
    let button = document.createElement('button'); // create button to be used to interact with for pokemon info

    button.innerText = pokemon.name;
    button.classList.add('pokemon-list__btn');

    listItem.appendChild(button);
    pokemonListElement.appendChild(listItem);
  }

  // function to search for and return pokemon based on name
  function search(name) {
    return pokemonList.filter(function(pokemon) {
      return pokemon.name.toLowerCase() === name.toLowerCase();
    });
  }

  return {
    getAll: getAll,
    add: add,
    addListItem: addListItem,
    search: search
  };
})();

// Iterate through pokemon list, running the addListItem function for each pokemon
pokemonRepository.getAll().forEach(function(pokemon) {
  pokemonRepository.addListItem(pokemon);
});

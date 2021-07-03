let pokemonRepository = (function() {
  // Creates pokemonList variable and adds pokemon information to the list:
  // name, height, types
  let pokemonList = [];

  // Load pokemon list from API
  function loadList() {
    return fetch('https://pokeapi.co/api/v2/pokemon/').then(function(response) {
      // format response into json
      return response.json();
    }).then(function(data) {
      data.results.forEach(function(item) {
        const pokemon = {
          name: item.name,
          detailsUrl: item.url
        }

        // Add formatted pokemon to main pokemonList
        add(pokemon);
      });
    }).catch(function(error) {
      console.log(error);
    });
  }

  // Load pokemon details from detailsUrl provided
  function loadDetails(pokemon) {
    fetch(pokemon.detailsUrl).then(function(response) {
      return response.json();
    }).then(function(details) {
      console.log(details);
    }).catch(function(error) {
      console.log(error);
    });
  }

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
      if (keys.indexOf('name') >= 0 && keys.indexOf('detailsUrl') >= 0) {
        pokemonList.push(pokemon);
      }
    }
  }

  // function to add click event to button and pass pokemon info
  function addClickEvent(button, pokemon) {
    button.addEventListener('click', function(e) {
      showDetails(pokemon);
    });
  }

  // function to create a list item and button for each pokemon and add it to the empty ul.pokemon-list
  function addListItem(pokemon) {
    let pokemonListElement = document.querySelector('.pokemon-list'); // variable assigned to empty ul to hold pokemon
    let listItem = document.createElement('li'); // create list item to hold pokemon button
    let button = document.createElement('button'); // create button to be used to interact with for pokemon info

    button.innerText = pokemon.name;
    button.classList.add('pokemon-list__btn');
    // Add click event to show details of the pokemon when the button is clicked
    addClickEvent(button, pokemon);

    listItem.appendChild(button);
    pokemonListElement.appendChild(listItem);
  }

  // function to show details of pokemon that is passed
  function showDetails(pokemon) {
    console.log(pokemon);
  }

  // function to search for and return pokemon based on name
  function search(name) {
    return pokemonList.filter(function(pokemon) {
      return pokemon.name.toLowerCase() === name.toLowerCase();
    });
  }

  return {
    loadList: loadList,
    loadDetails: loadDetails,
    getAll: getAll,
    add: add,
    addListItem: addListItem,
    search: search
  };
})();

pokemonRepository.loadList().then(function() {
  // Iterate through pokemon list, running the addListItem function for each pokemon
  pokemonRepository.getAll().forEach(function(pokemon) {
    pokemonRepository.addListItem(pokemon);
  });
});

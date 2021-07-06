let pokemonRepository = (function() {
  let modalContainer = document.querySelector('#modal-container');
  // create modal content and show Modal
  function showModal(title, text) {
    // clear all existing modal content
    modalContainer.innerHTML = '';

    let modal = document.createElement('div');
    modal.classList.add('modal');

    // Add the new modal content
    let closeButtonElement = document.createElement('button');
    closeButtonElement.classList.add('modal-close');
    closeButtonElement.innerText = 'Close';
    closeButtonElement.addEventListener('click', hideModal);

    let titleElement = document.createElement('h1');
    titleElement.innerText = title;

    let contentElement = document.createElement('p');
    contentElement.innerText = text;

    modal.appendChild(closeButtonElement);
    modal.appendChild(titleElement);
    modal.appendChild(contentElement);
    modalContainer.appendChild(modal);

    modalContainer.classList.add('is-visible');
  }

  // hide modal
  function hideModal() {
    let modalContainer = document.querySelector('#modal-container');
  }

  // Creates pokemonList variable and adds pokemon information to the list:
  // name, height, types
  let pokemonList = [];

  // Load pokemon list from API
  function loadList() {
    showLoadingMessage();
    return fetch('https://pokeapi.co/api/v2/pokemon/').then(function(response) {
      // format response into json
      return response.json();
    }).then(function(data) {
      hideLoadingMessage();
      data.results.forEach(function(item) {
        const pokemon = {
          name: item.name,
          detailsUrl: item.url
        }

        // Add formatted pokemon to main pokemonList
        add(pokemon);
      });
    }).catch(function(error) {
      hideLoadingMessage();
      console.log(error);
    });
  }

  // Load pokemon details from detailsUrl provided
  function loadDetails(pokemon) {
    showLoadingMessage();
    return fetch(pokemon.detailsUrl).then(function(response) {
      return response.json();
    }).then(function(details) {
      hideLoadingMessage();
      pokemon.imgUrl = details.sprites.front_default;
      pokemon.height = details.height;
      console.log(details);
    }).catch(function(error) {
      hideLoadingMessage();
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

  // create and return image element with src and alt info added
  function createImageElement(pokemon) {
    let imageElement = document.createElement('img');

    imageElement.src = pokemon.imgUrl;
    imageElement.alt = `Image of ${pokemon.name}`;

    return imageElement;
  }

  // function to show details of pokemon that is passed
  function showDetails(pokemon) {
    loadDetails(pokemon).then(function() {
      // create modal

    });
  }

  // function to search for and return pokemon based on name
  function search(name) {
    return pokemonList.filter(function(pokemon) {
      return pokemon.name.toLowerCase() === name.toLowerCase();
    });
  }

  // create and add loading message to header
  function showLoadingMessage() {
    let header = document.querySelector('.header');
    let loadingElement = document.createElement('div');

    loadingElement.innerText = 'Loading';
    loadingElement.classList.add('loading');

    header.appendChild(loadingElement);
  }

  // remove loading message from header if it exists
  function hideLoadingMessage() {
    let header = document.querySelector('.header');
    let loadingElement = header.querySelector('.loading');

    if (loadingElement !== null) {
      header.removeChild(loadingElement);
    }
  }

  // watch for escape key to close modal
  window.addEventListener('keydown', function(e) {
    let modalContainer = document.querySelector('#modal-container');
    if (e.key === 'Escape' && modalContainer.classList.contains('is-visible')) {
      hideModal();
    }
  });

  // watch outer modal container for click
  modalContainer.addEventListener('click', function(e) {
    // Since this is also triggered when clicking INSIDE the modal
    // We only want to close if the user clicks directly on the overlay
    let taret = e.target;
    if (target === modalContainer) {
      hideModal();
    }
  });

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

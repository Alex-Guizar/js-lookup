/* global bootstrap */
let pokemonRepository = (function() {
  let modalInstance = new bootstrap.Modal(document.querySelector('#modal-container'));
  // variable to hold element used to open modal
  let currentActivationElement = null;

  modalInstance._element.addEventListener('hidden.bs.modal', hideModal);

  // create modal content and show Modal
  function showModal(title, content) {
    // clear all existing modal content
    let modalContent = modalInstance._element.querySelector('.modal-content');
    let modalTitle = modalContent.querySelector('.modal-title');
    let modalBody = modalContent.querySelector('.modal-body');

    modalBody.innerHTML = '';

    modalTitle.innerText = title;

    modalBody.appendChild(content);
  }

  // hide modal
  function hideModal() {
    if (currentActivationElement !== null) {
      currentActivationElement.focus();
    }
  }

  // Creates pokemonList variable and adds pokemon information to the list:
  // name, height, types
  let pokemonList = [];

  function captialize(name) {
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  // Load pokemon list from API
  function loadList() {
    let header = document.querySelector('.header');
    showLoadingMessage(header);
    return fetch('https://pokeapi.co/api/v2/pokemon/?limit=151').then(function(response) {
      // format response into json
      return response.json();
    }).then(function(data) {
      hideLoadingMessage(header);
      data.results.forEach(function(item) {
        const pokemon = {
          name: captialize(item.name),
          detailsUrl: item.url
        }

        // Add formatted pokemon to main pokemonList
        add(pokemon);
      });
    }).catch(function(error) {
      hideLoadingMessage(header);
      // eslint-disable-next-line no-console
      console.error(error);
    });
  }

  // Load pokemon details from detailsUrl provided
  function loadDetails(pokemon) {
    let pokeModal = document.querySelector('.modal-content');
    showLoadingMessage(pokeModal);
    return fetch(pokemon.detailsUrl).then(function(response) {
      return response.json();
    }).then(function(details) {
      hideLoadingMessage(pokeModal);
      pokemon.imgUrl = details.sprites.front_default;
      pokemon.height = details.height;
      pokemon.types = [];
      details.types.forEach(function(type) {
        pokemon.types.push(type.type.name);
      });
    }).catch(function(error) {
      hideLoadingMessage(pokeModal);
      // eslint-disable-next-line no-console
      console.error(error);
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
    button.addEventListener('click', function() {
      showDetails(pokemon);
      // set button to variable to be returned to when modal is closed
      currentActivationElement = this;
    });
  }

  // function to create a list item and button for each pokemon and add it to the empty ul.pokemon-list
  function addListItem(pokemon) {
    let pokemonListElement = document.querySelector('.pokemon-list'); // variable assigned to empty ul to hold pokemon
    let listItem = document.createElement('li'); // create list item to hold pokemon button
    let button = document.createElement('button'); // create button to be used to interact with for pokemon info

    listItem.classList.add('list-group-item', 'd-grid', 'border-0');

    button.innerText = pokemon.name;
    button.type = 'button';
    button.classList.add('btn', 'btn-primary', 'pokemon-list__btn');
    button.dataset.bsTarget = '#modal-container';
    button.dataset.bsToggle = 'modal';
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

  // create pokemon content for modal
  function createModalContent(pokemon) {
    let pokemonContent = document.createElement('div');
    pokemonContent.classList.add('pokemon-modal');

    let pokemonImg = createImageElement(pokemon);
    pokemonImg.classList.add('pokemon-modal__img');

    // create and add pokemon types
    let pokemonTypes = document.createElement('div');
    pokemonTypes.classList.add('pokemon-modal__types');

    pokemon.types.forEach(function(type) {
      let pokemonType = document.createElement('span');
      pokemonType.classList.add('pokemon-modal__types__type', `is-${type}`);
      pokemonType.innerText = type;
      pokemonTypes.appendChild(pokemonType);
    });

    // create and add info to list
    let pokemonInfo = document.createElement('ul');
    pokemonInfo.classList.add('pokemon-modal__info');
    // since we currently have a single piece of info directly declaring it
    let pokemonHeight = document.createElement('li');
    pokemonHeight.innerText = `Height: ${pokemon.height}`;
    pokemonInfo.appendChild(pokemonHeight);

    pokemonContent.appendChild(pokemonImg);
    pokemonContent.appendChild(pokemonTypes);
    pokemonContent.appendChild(pokemonInfo);

    return pokemonContent;
  }

  // function to show details of pokemon that is passed
  function showDetails(pokemon) {
    loadDetails(pokemon).then(function() {
      // create modal content
      let pokemonContent = createModalContent(pokemon);
      // create modal
      showModal(pokemon.name, pokemonContent);
    });
  }

  // function to search for and return pokemon based on name
  function search(name) {
    return pokemonList.filter(function(pokemon) {
      return pokemon.name.toLowerCase() === name.toLowerCase();
    });
  }

  // create and add loading message to header
  function showLoadingMessage(parentEle) {
    let loadingElement = document.createElement('div');

    loadingElement.classList.add('loading');

    parentEle.appendChild(loadingElement);
  }

  // remove loading message from header if it exists
  function hideLoadingMessage(parentEle) {
    let loadingElement = parentEle.querySelector('.loading');

    if (loadingElement !== null) {
      parentEle.removeChild(loadingElement);
    }
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

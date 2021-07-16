let pokemonRepository = (function() {
  let modalInstance = new bootstrap.Modal($('#modal-container')[0]);
  // variable to hold element used to open modal
  let currentActivationElement = null;

  $(modalInstance._element).on('hidden.bs.modal', hideModal);

  // create modal content and show Modal
  function showModal(title, content) {
    // clear all existing modal content
    let modalContent = $(modalInstance._element).find('.modal-content');
    let modalTitle = modalContent.find('.modal-title');
    let modalBody = modalContent.find('.modal-body');

    modalTitle.text(title);
    modalBody.html(content);
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
    showLoadingMessage();
    return $.ajax('https://pokeapi.co/api/v2/pokemon/', {dataType: 'json'}).then(function(data) {
      hideLoadingMessage();
      data.results.forEach(function(item) {
        const pokemon = {
          name: captialize(item.name),
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
    return $.ajax(pokemon.detailsUrl, {dataType: 'json'}).then(function(details) {
      hideLoadingMessage();
      pokemon.imgUrl = details.sprites.front_default;
      pokemon.height = details.height;
      pokemon.types = [];
      details.types.forEach(function(type) {
        pokemon.types.push(type.type.name);
      });
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
    button.on('click', function(e) {
      showDetails(pokemon);
      // set button to variable to be returned to when modal is closed
      currentActivationElement = this;
    });
  }

  // function to create a list item and button for each pokemon and add it to the empty ul.pokemon-list
  function addListItem(pokemon) {
    let pokemonListElement = $('.pokemon-list'); // variable assigned to empty ul to hold pokemon
    let listItem = $('<li></li>'); // create list item to hold pokemon button
    let button = $('<button type="button"></button>'); // create button to be used to interact with for pokemon info

    listItem.addClass('list-group-item d-grid border-0');

    button.text(pokemon.name);
    button.addClass('btn btn-primary pokemon-list__btn');
    button.attr('data-bs-target', '#modal-container').attr('data-bs-toggle', 'modal');
    // Add click event to show details of the pokemon when the button is clicked
    addClickEvent(button, pokemon);

    listItem.append(button);
    pokemonListElement.append(listItem);
  }

  // create and return image element with src and alt info added
  function createImageElement(pokemon) {
    let imageElement = $('<img class="pokemon-modal__img">');

    imageElement.attr('src', pokemon.imgUrl).attr('alt', `Image of ${pokemon.name}`);

    return imageElement;
  }

  // create pokemon content for modal
  function createModalContent(pokemon) {
    //console.log({'createModalContent': pokemon});
    let pokemonContent = $('<div class="pokemon-modal"></div>');
    let pokemonImg = createImageElement(pokemon);
    // create and add pokemon types
    let pokemonTypes = $('<div class="pokemon-modal__types"></div>');

    pokemon.types.forEach(function(type) {
      let pokemonType = $('<span></span>');
      pokemonType.addClass(`pokemon-modal__types__type is-${type}`);
      pokemonType.text(type);
      pokemonTypes.append(pokemonType);
    });

    // create and add info to list
    let pokemonInfo = $('<ul class="pokemon-modal__info"></ul>');
    // since we currently have a single piece of info directly declaring it
    let pokemonHeight = $('<li></li>');
    pokemonHeight.text(`Height: ${pokemon.height}`);
    pokemonInfo.append(pokemonHeight);

    pokemonContent.append(pokemonImg).append(pokemonTypes).append(pokemonInfo);

    return pokemonContent;
  }

  // function to show details of pokemon that is passed
  function showDetails(pokemon) {
    //console.log({'showDetails': pokemon});
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
  function showLoadingMessage() {
    let header = $('.header');
    let loadingElement = $('<div class="loading">Loading</div>');

    header.append(loadingElement);
  }

  // remove loading message from header if it exists
  function hideLoadingMessage() {
    let header = $('.header');
    let loadingElement = header.find('.loading');

    if (loadingElement.length) {
      loadingElement.remove();
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

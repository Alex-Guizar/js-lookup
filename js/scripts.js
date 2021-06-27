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

// Iterate through pokemon list, writing each one to the document
for (let i = 0; i < pokemonList.length; i++) {
  // Check if pokemon is taller then 5, if so add excalamation text "Wow, that's big!"
  document.write(`<p>${pokemonList[i].name} (height: ${pokemonList[i].height})${pokemonList[i].height > 5 ? ' Wow, that\'s big!' : ''}</p>`);
}

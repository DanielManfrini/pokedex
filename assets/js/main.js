const pokemonList = document.getElementById('pokemonList')
const cutter = document.getElementById('cutter')
const detailed = document.getElementById('detailed')
const typeFilter = document.getElementById('type-filter')

const maxRecords = 151;
const limit = 20;
let offset = 0;
var typeNumber = -1;

function convertPokemonToLi(pokemon) {
  return `
        <li class="pokemon ${pokemon.type}" onClick="detailPokemon(${pokemon.number})">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
    `
}

function loadPokemonItens(offset, limit) {
  pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
    var newHtml = []

    let oldTypes = pokeReduxGetTypes();

    pokeReduxSetPokemons(pokemons)

    let types = pokemons.map((pokemon) => (pokemon.type))

    pokeReduxSetTypes(types)

    if(typeNumber == -1){
      newHtml = pokemons.map(convertPokemonToLi).join('');
      console.log('all')
    }else{
      filteredPokemons = pokemons.filter((pokemon) => pokemon.types.includes(oldTypes[typeNumber]));
      newHtml = filteredPokemons.map(convertPokemonToLi).join('');
      console.log(types[typeNumber])
    }


    pokemonList.innerHTML += newHtml;

  })
}

loadPokemonItens(offset, limit)

/**
 * Evento que identifica o fim da tela de rolagem para carregar novos dados.
 */
cutter.addEventListener('scroll', () => {
  const { scrollTop, scrollHeight, clientHeight } = cutter;

  if (scrollTop + clientHeight >= scrollHeight) {

    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
      const newLimit = maxRecords - offset
      loadPokemonItens(offset, newLimit)
    } else {
      loadPokemonItens(offset, limit)
    }

  }
});

function detailPokemon(number) {

  let allPokemons = pokeReduxGetPokemons();

  let detailedPokemon = allPokemons.find((pokemon) => pokemon.number == parseInt(number))

  console.log(detailedPokemon);

  let html = `
    <div class="detailed-pokemon ${detailedPokemon.type}">

      <div class="detailed-header">
        <button class='close-btn' onClick='closeDetailed()'>X</button>
        <span class="number">#${detailedPokemon.number}</span>
      </div>
      
      <span class="name">${detailedPokemon.name}</span>
      <div class="detail">
        <div class='left'>
            <ol class="types">
                ${detailedPokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
            </ol>
            <span class="name">Moves:</span>
            <ol class="moves">
              ${detailedPokemon.moves.map((move) => `<li class="move">${move.name}</li>`).join('')}
            </ol>
        </div>
        <div class='rigth'>
          <img src="${detailedPokemon.photo}"alt="${detailedPokemon.name}">
          <ol class="stats">
            ${detailedPokemon.stats.map((stat) =>
    `<li class="stat">
                  <span class="name">${stat.stat.name}</span>
                  <span class="name">${stat.base_stat}</span>
              </li>`
  ).join('')}
          </ol>
        </div>
      </div>

    </li>
  `;

  detailed.innerHTML = html;
  cutter.style.display = 'none';
  detailed.style.display = 'block';
}

function closeDetailed() {
  detailed.innerHTML = "";
  cutter.style.display = 'block';
  detailed.style.display = 'none';
}

function filterType(isUp) {

  var filteredPokemons = []

  let types = pokeReduxGetTypes();

  let allTypes = types.length -1

  let pokemons = pokeReduxGetPokemons();

  if (isUp) {
    if(typeNumber == allTypes){
      typeNumber = -1
    }else{
      typeNumber += 1
    }
  } else if (typeNumber > -1){
    typeNumber -= 1
  } else {
    typeNumber = allTypes
  }

  typeFilter.innerHTML = '';

  if(typeNumber == -1){
    typeFilter.innerHTML = 'All';
    filteredPokemons = pokemons
  }else{
    typeFilter.innerHTML = capitalizeFirstLetter(types[typeNumber]);
    filteredPokemons = pokemons.filter((pokemon) => pokemon.types.includes(types[typeNumber]));
  }

  pokemonList.innerHTML = '';

  const newHtml = filteredPokemons.map(convertPokemonToLi).join('');

  pokemonList.innerHTML += newHtml;

}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
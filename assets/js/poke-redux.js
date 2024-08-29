var pokemons = []
var types = []

function pokeReduxGetPokemons(){
  return pokemons
}

function pokeReduxSetPokemons(payload){
  pokemons = [...pokemons, ...payload]
}

function pokeReduxGetTypes(){
  return types
}

function pokeReduxSetTypes(payload){
  let newTypes = [...types, ...payload]
  types = [...new Set(newTypes)];
}
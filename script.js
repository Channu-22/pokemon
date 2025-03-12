
let offset = 0;
let limit = 20;
const typesUrl = "https://pokeapi.co/api/v2/type/?limit=21";
const pokemonUrl = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;

let types;
let pokemon;
let finalData;

const pokemonsDiv = document.querySelector("#pokemons");
const button = document.querySelector("button");
const search = document.querySelector("#search");
const select = document.querySelector("select");
const loading = document.querySelector(".loading");

getTypes();
getPokemons(pokemonUrl);

// Type Filtering
select.addEventListener("change", (e) => {
    if (e.target.value === "all") {
        displayPokemons(finalData);
    } else {
        const filteredPokemons = finalData.filter((pokemon) =>
            pokemon.types.some((type) => type.type.name === e.target.value)
        );
        displayPokemons(filteredPokemons);
    }
});

// Search Filtering
search.addEventListener("keyup", (e) => {
    if (e.target.value.length <= 3) {
        displayPokemons(finalData);
    } else {
        const searchedPokemons = finalData.filter((obj) =>
            obj.name.toLowerCase().includes(e.target.value.toLowerCase())
        );
        if (searchedPokemons.length === 0) {
            pokemonsDiv.innerHTML = "<h1>No Pokémon Found</h1>";
        } else {
            displayPokemons(searchedPokemons);
        }
    }
});

// Load More Button
button.addEventListener("click", () => {
    offset += limit;
    getPokemons(`https://pokeapi.co/api/v2/pokemon?limit=20&offset=${offset}`);
});

// Fetch Pokémon Types
async function getTypes() {
    types = await getDataFromUrl(typesUrl);
    createOptions(types.results);
}

// Create Dropdown Options
function createOptions(types) {
    const fragment = document.createDocumentFragment();
    types.forEach((obj) => {
        const option = document.createElement("option");
        option.value = obj.name;
        option.innerText = obj.name;
        fragment.append(option);
    });
    select.append(fragment);
}

// Fetch Pokémon List
async function getPokemons(url) {
    loading.style.display = "block"; // Show loader

    pokemon = await getDataFromUrl(url);
    const promisesArray = pokemon.results.map((obj) => getDataFromUrl(obj.url));
    finalData = await Promise.all(promisesArray);

    displayPokemons(finalData);
    loading.style.display = "none"; // Hide loader after fetching
}

// Display Pokémon Cards
function displayPokemons(data) {
    pokemonsDiv.innerHTML = ""; // Clear previous Pokémon before displaying new ones
    const fragment = document.createDocumentFragment();

    data.forEach((obj) => {
        const parent = document.createElement("div");
        const image = document.createElement("img");
        const name = document.createElement("h2");
        const type = document.createElement("p");

        image.src = obj.sprites.other.dream_world.front_default || obj.sprites.front_default;
        name.innerText = "Name: " + obj.name;

        const types = obj.types.map((object) => object.type.name);
        type.innerHTML = `<strong>Types:</strong> ${types.join(", ")}`;

        parent.append(image, name, type);
        parent.classList.add("parent");
        fragment.append(parent);
    });

    pokemonsDiv.append(fragment);
}

// Fetch Data from API
async function getDataFromUrl(url) {
    const response = await fetch(url);
    return response.json();
}

const searchForm = document.querySelector('#searchForm');
const searchInput = document.querySelector('#search');
const resultsList = document.querySelector('#results');
const spinner = document.querySelector('#spinner');
const dietFilter = document.querySelector('#diet');

const APP_ID = '48b1cd74';
const APP_KEY = 'a8ec805f012e1abab117626531f94a12';
const BASE_URL = `https://api.edamam.com/api/recipes/v2`;

searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    searchRecipes();
});

async function searchRecipes() {
    const searchValue = searchInput.value.trim();
    const dietValue = dietFilter.value;
    if (searchValue === '') return;

    showSpinner();
    try {
        // Construct URL with optional diet parameter
        let url = `${BASE_URL}?type=public&q=${encodeURIComponent(searchValue)}&app_id=${APP_ID}&app_key=${APP_KEY}&from=0&to=10`;
        if (dietValue) {
            url += `&diet=${encodeURIComponent(dietValue)}`;
        }
        
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        displayRecipes(data.hits);
    } catch (error) {
        console.error('Error fetching recipes:', error);
        resultsList.innerHTML = '<p>Error fetching recipes. Please try again later.</p>';
    } finally {
        hideSpinner();
    }
}

function displayRecipes(recipes) {
    if (recipes.length === 0) {
        resultsList.innerHTML = '<p>No recipes found. Please try different ingredients.</p>';
        return;
    }
    let html = '';
    recipes.forEach((recipe) => {
        html += `
        <div>
            <img src="${recipe.recipe.image}" alt="${recipe.recipe.label}">
            <h3>${recipe.recipe.label}</h3>
            <ul>
                ${recipe.recipe.ingredientLines.map(ingredient => `<li>${ingredient}</li>`).join('')}
            </ul>
            <p>Calories: ${Math.round(recipe.recipe.calories / recipe.recipe.yield)}</p>
            <p>Total Weight: ${Math.round(recipe.recipe.totalWeight)} grams</p>
            <a href="${recipe.recipe.url}" target="_blank">View Recipe</a>
        </div>
        `;
    });
    resultsList.innerHTML = html;
}

function showSpinner() {
    spinner.style.display = 'block';
    resultsList.innerHTML = '';
}

function hideSpinner() {
    spinner.style.display = 'none';
}

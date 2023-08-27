import axios from "axios";
import { fetchBreeds, fetchCatByBreed } from "./cat-api";
import SlimSelect from 'slim-select';
import 'slim-select/dist/slimselect.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

// Встановлюємо x-api-key заголовок для Axios
axios.defaults.headers.common["x-api-key"] = "live_C8fch3W7tmmF8fmpsXU2mdIfjeqC3R8Q3wAY9gs2QZiQFnTO5tNKg722MPHavC8b";

// Знаходимо DOM елементи
const selectCat = document.querySelector(".breed-select");
const catInfo = document.querySelector(".cat-info");
const loader = document.querySelector('.loader');
const error = document.querySelector('.error');

// Додаємо подію на зміну вибраної породи
selectCat.addEventListener("change", onSelectChange);

// Функція для створення списку порід котів
function createCatList() {
    // Показуємо лоадер перед початком запиту
    loader.classList.remove('is-hidden');
    selectCat.classList.add('is-hidden');
    error.classList.add('is-hidden');

    // Обробляємо результат запиту на бекенд (всі породи котів)
    fetchBreeds()
        .then(data => {
            const optionsList = data.map(({ id, name }) => `<option value="${id}">${name}</option>`).join(' ');
            selectCat.innerHTML = optionsList;

            // Стилізуємо селект за допомогою бібліотеки SlimSelect
            new SlimSelect({
                select: selectCat
            });

            // Отримали дані успішно, ховаємо лоадер та показуємо селект
            loader.classList.add('is-hidden');
            selectCat.classList.remove('is-hidden');
        })
        .catch(error => {
            Notify.failure('Oops! Something went wrong! Try reloading the page!');
        });
}

// Викликаємо функцію для створення списку порід котів
createCatList();

// Функція, яка виконується при зміні вибраної породи
function onSelectChange(evt) {
    loader.classList.remove('is-hidden');
    catInfo.classList.add('is-hidden');

    const selectedBreedId = evt.currentTarget.value;

    fetchCatByBreed(selectedBreedId)
        .then(data => {
            renderMarkupInfo(data);
            loader.classList.add('is-hidden');
            catInfo.classList.remove('is-hidden');
        })
        .catch(error => {
            loader.classList.add('is-hidden');
            Notify.failure('Oops! Something went wrong! Try reloading the page!');
        });
}

// Функція для відображення інформації про породу кота
function renderMarkupInfo(data) {
    const { breeds, url } = data[0];
    const { name, temperament, description } = breeds[0];
    const catCardMarkup = `
        <img class="photo-cat" width="300px" src="${url}" alt="${name}">
        <div class="text-part">
            <h2 class="name-cat">${name}</h2>
            <p class="desc-cat">${description}</p>
            <p class="temperament-cat"><span class="temperament-label">Temperament:</span> ${temperament}</p>
        </div>
    `;

    catInfo.innerHTML = catCardMarkup;
}

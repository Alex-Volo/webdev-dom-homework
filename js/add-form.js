import { renderAuthForm } from "./auth.js";
import { safeInput, validate } from "./service-functions.js";
import { postComment } from "./API.js";

// Объект формы добавления комментариев со свойствами и методами
let token = null;
let currentUser = null;


function renderAddForm(form = 'addForm') {
    const addFormElement = document.querySelector('div.add-form');

    switch (form) {

        case 'loading':
            addFormElement.innerHTML = ` 
    <div style="display: flex;">Комментарий загружается...</div>
    <svg class="spinner" viewBox="0 0 50 50">
        <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
    </svg>
    </div>
    `
            break;

        case 'addForm': addFormElement.innerHTML = `    
    <div class="user-container">
    <input type="text" class="add-form-name" placeholder="Введите ваше имя" id="input-name" style="display: inline-block" />
    <a href=# class="logout-button">Выйти</a>
    </div>
    <textarea type="textarea" class="add-form-text" placeholder="Введите ваш коментарий" rows="4"
    id="input-comment"></textarea>
    <div class="add-form-row">
        <button class="add-form-button" id="button-add-comment">Написать</button>
    </div>`;
            if (localStorage.getItem('currentUser')) {
                const nameInput = document.getElementById('input-name');
                nameInput.disabled = true;
                nameInput.value = localStorage.getItem('currentUser');

            } else {
                renderAddForm('auth');
                return;
            }

            // Добавляю событие на клик по кнопке добавить
            // И на нажатие Enter
            initAddFormListeners();
            break;

        case 'auth':
            addFormElement.classList.remove('add-form');
            addFormElement.innerHTML = `
        <p class="auth">Чтобы добавить комментарий <a href="#">авторизуйтесь</a></p>
        `
            document.querySelector('.auth>a').addEventListener('click', () => {
                renderAuthForm({ setToken: (newToken) => { token = localStorage.getItem('currentToken') }, setUser: (newUser) => { currentUser = localStorage.getItem('currentUser') } });
            })
            break;

    }
};

function initAddFormListeners() {
    const buttonAddComment = document.getElementById('button-add-comment');
    const logout = document.querySelector('.logout-button');
    const addForm = document.querySelector('.add-form');
    addForm.addEventListener('click', (event) => {
        if (event.target === buttonAddComment) {
            addComment();
            return;
        }
        if (event.target === logout) {
            localStorage.removeItem('currentUser');
            localStorage.removeItem('currentToken');
            renderAddForm('auth');
        }
    });

    document.addEventListener('keyup', (e) => {
        if (e.code == 'Enter') addComment();
    });
};


function addComment() {
    const inputName = document.querySelector('input.add-form-name');
    const inputComment = document.querySelector('.add-form-text');
    const currentDate = new Date;
    const name = inputName.value;
    const comment = inputComment.value;

    // Валидация
    if (validate(inputName, 'ваше имя') && validate(inputComment, 'ваш комментарий')) {
        // Заглушка на время отправки коммента на сервер
        renderAddForm('loading');

        postComment(safeInput(name), safeInput(comment), currentDate, token)
            .then(() => {
                inputComment.value = '';
            })

            .then(() => {
                renderAddForm('addForm');
            })
            .catch(error => {
                console.warn(error);
                switch (error.message) {
                    case 'Bad authorization':
                        renderAuthForm({ setToken: (newToken) => { token = newToken }, setUser: (newUser) => { currentUser = newUser } });
                        break;

                    case 'Short value':
                        alert('Что-то пошло не так:\n' +
                            'Имя или текст не должны быть короче 3 символов\n');
                        renderAddForm('addForm');
                        document.querySelector('input.add-form-name').value = name;
                        document.querySelector('.add-form-text').value = comment;
                        break;

                    case 'Server is broken':
                        postComment(safeInput(name), safeInput(comment), currentDate);
                        break;

                    case 'Failed to fetch':
                        alert('Кажется, у вас сломался интернет, попробуйте позже');
                        renderAddForm('addForm');
                        document.querySelector('input.add-form-name').value = name;
                        document.querySelector('.add-form-text').value = comment;
                        break;
                }
            });
    }
};

export { renderAddForm }
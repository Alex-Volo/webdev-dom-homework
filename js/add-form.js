import { comments } from "./comments.js";
import { safeInput, responseHandler } from "./service-functions.js";
// Объект формы добавления комментариев со свойствами и методами
export const addForm = {
    formElement: document.querySelector('.add-form'),
    stub: document.querySelector('.stub'),
    inputName: document.querySelector('input.add-form-name'),
    inputComment: document.querySelector('.add-form-text'),
    render:
        function (loadingStatus = 'addForm') {
            const addFormElement = document.querySelector('div.add-form');

            switch (loadingStatus) {

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
            <input type="text" class="add-form-name" placeholder="Введите ваше имя" id="input-name" />
            <textarea type="textarea" class="add-form-text" placeholder="Введите ваш коментарий" rows="4"
            id="input-comment"></textarea>
            <div class="add-form-row">
                <button class="add-form-button" id="button-add-comment">Написать</button>
            </div>`;
                    // Добавляю событие на клик по кнопке добавить
                    // И на нажатие Enter
                    this.addListeners();
                    break;

                case 'auth': 
                addFormElement.classList.remove('add-form');
                addFormElement.innerHTML = `
                <p class="auth">Чтобы добавить комментарий <a href="#">авторизуйтесь</a></p>
                `
                document.querySelector('.auth>a').addEventListener('click', () => {
                    renderAuthForm();
                })
                break;

            }
        },
    // Функция переключает отображение заглушки и формы
    toggleStub: function (displayStub) {
        if (displayStub) {
            this.stub.style.display = "flex";
            this.formElement.style.display = "none";

        } else {
            this.stub.style.display = "none";
            this.formElement.style.display = "flex";
        }
    },

    addListeners:
        function () {
            const buttonAddComment = document.getElementById('button-add-comment');
            buttonAddComment.addEventListener('click', this.addComment);

            document.addEventListener('keyup', (e) => {
                if (e.code == 'Enter') this.addComment();
            });
        },

    addComment:
        function () {
            const inputName = document.querySelector('input.add-form-name');
            const inputComment = document.querySelector('.add-form-text');
            const currentDate = new Date;
            const name = inputName.value;
            const comment = inputComment.value;

            // Таймаут красного фона на полях
            function clearInputs() {
                inputName.classList.remove('error__name')
                inputName.placeholder = 'Введите ваше имя';
                inputComment.classList.remove('error__name')
                inputComment.placeholder = 'Введите ваш комментарий';
            }

            if (inputName.value === '') {
                inputName.classList.add('error__name');
                inputName.placeholder = 'Поле не может быть пустым!';
                inputComment.value = '';
                setTimeout(clearInputs, 1500);

            } else if (inputComment.value === '' || inputComment.value === '\n') {
                inputComment.classList.add('error__name');
                inputComment.placeholder = 'Поле не может быть пустым!';
                inputComment.value = '';
                setTimeout(clearInputs, 1500);

            } else {
                // Заглушка на время отправки коммента на сервер
                addForm.render('loading');

                function postComment() {
                    fetch('https://webdev-hw-api.vercel.app/api/v1/alex-volo/comments', {
                        method: "POST",

                        body: JSON.stringify({
                            date: currentDate,
                            likes: 0,
                            isLiked: false,
                            text: safeInput(inputComment.value),
                            name: safeInput(inputName.value),
                            // Чтобы сервер падал в 50% случаев
                            forceError: true,
                        })

                    }).then(response => responseHandler(response))

                        .then(() => {
                            inputName.value = '';
                            inputComment.value = '';

                        })
                        .then(() => addForm.render('addForm'))
                        .catch(error => {
                            console.warn(error);
                            switch (error.message) {

                                case 'Short value':
                                    alert('Что-то пошло не так:\n' +
                                        'Имя или текст не должны быть короче 3 символов\n');
                                    addForm.render('addForm');
                                    document.querySelector('input.add-form-name').value = name;
                                    document.querySelector('.add-form-text').value = comment;
                                    break;

                                case 'Server is broken':
                                    postComment();
                                    break;

                                case 'Failed to fetch':
                                    alert('Кажется, у вас сломался интернет, попробуйте позже');
                                    addForm.render('addForm');
                                    document.querySelector('input.add-form-name').value = name;
                                    document.querySelector('.add-form-text').value = comment;
                                    break;
                            }
                        });
                }
                postComment();
            }
        },
}

function renderAuthForm() {
    const container = document.querySelector('body>div.container');
    let isLoginForm = true;
    const renderForm = () => {
        container.innerHTML = `
        <ul class="comments" id="comments">
          <!-- Отрисовывается из массива JS -->
        </ul>
        <div class="auth-form add-form" id="auth-form">
            ${isLoginForm ? '' : `
            <input type="text" class="auth-form-name" placeholder="Введите ваше имя" id="login-name">
            `}

            <input type="text" class="auth-form-name" placeholder="Введите ваш логин" id="login-login">
            <input type="password" class="auth-form-name" placeholder="Введите ваш пароль" id="login-password">
            
            <button class="add-form-button" id="button-login">${isLoginForm ? 'Войти' : 'Зарегистрироваться'}</button>

            <a class="anchor-buton" href=#>${isLoginForm ? 'Зарегистрироваться' : 'Войти'}</a>
            
        </div>
            `
        document.querySelector('.anchor-buton').addEventListener('click', (e) => {
            e.stopPropagation();
            isLoginForm = !isLoginForm;
            renderForm();
  
        });

        if (isLoginForm) {
            document.getElementById('button-login').addEventListener('click', () => {
                const loginInput = document.getElementById('login-login');
                const passwordInput = document.getElementById('login-password');
                if(!loginInput.value || !passwordInput.value) {
                    alert('Поля не должны быть пустыми');
                } else {
                    const login = loginInput.value;
                    const password = passwordInput.value;
                    loginUser({login, password })
                    .then((user) => {
                        console.log(user);
                        console.log(user.user.token);
                        const token = `Bearer ${user.user.token}`;
                        comments.get(token);
                        addForm.render('addForm');
                    })
                }
            })
        } else {
            document.getElementById('button-login').addEventListener('click', () => {
                const nameInput = document.getElementById('login-name');
                const loginInput = document.getElementById('login-login');
                const passwordInput = document.getElementById('login-password');
                if(!loginInput.value || !passwordInput.value || !nameInput.value) {
                    alert('Поля не должны быть пустыми');
                } else {
                    const name = nameInput.value;
                    const login = loginInput.value;
                    const password = passwordInput.value;
                    registerUser({ login, password, name });
                }
            });
        }
    }
    renderForm();
}
function loginUser({ login, password }) {
    return fetch("https://webdev-hw-api.vercel.app/api/user/login", {
        method: "POST",

        body: JSON.stringify({
            login,
            password,
        }),
    })
        .then((response) => {
            if (response.status == 400) {
                throw new Error('Неверный логин или пароль');
            }
            return response.json();
        })
        .catch(error => alert(error.message))
}

function registerUser({ login, password, name }) {
    return fetch("https://webdev-hw-api.vercel.app/api/user", {
        method: "POST",

        body: JSON.stringify({
            login,
            password,
            name,
        }),
    })
        .then((response) => {
            if (response.status == 400) {
                throw new Error('Такой пользователь уже существует');
            }
            return response.json();
        })
        .catch(error => alert(error.message))
}
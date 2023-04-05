import { renderAddForm } from "./add-form.js";
import { getAndRenderComments } from "./comments.js";
export function renderAuthForm({ setToken, setUser }) {
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
                if (!loginInput.value || !passwordInput.value) {
                    alert('Поля не должны быть пустыми');
                } else {
                    const login = loginInput.value;
                    const password = passwordInput.value;
                    loginUser({ login, password })
                        .then((user) => {
                            console.log(user);
                            console.log(user.user.token);
                            const newToken = `Bearer ${user.user.token}`;
                            setToken(newToken);
                            const newUser = user.user.name;
                            setUser(newUser);
                            getAndRenderComments(newToken);
                            renderAddForm('addForm');
                        })
                }
            })
        } else {
            document.getElementById('button-login').addEventListener('click', () => {
                const nameInput = document.getElementById('login-name');
                const loginInput = document.getElementById('login-login');
                const passwordInput = document.getElementById('login-password');
                if (!loginInput.value || !passwordInput.value || !nameInput.value) {
                    alert('Поля не должны быть пустыми');
                } else {
                    const name = nameInput.value;
                    const login = loginInput.value;
                    const password = passwordInput.value;
                    registerUser({ login, password, name })
                        .then((user) => {
                            console.log(user);
                            console.log(user.user.token);
                            const newToken = `Bearer ${user.user.token}`;
                            setToken(newToken);
                            const newUser = user.user.name;
                            setUser(newUser);
                            getAndRenderComments(newToken);
                            renderAddForm('addForm');
                        })
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
                throw new Error('Пользователь с таким логином уже существует');
            }
            return response.json();
        })
        .catch(error => alert(error.message))
}
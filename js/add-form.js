import { safeInput, responseHandler } from "./service-functions.js";
// Объект формы добавления комментариев со свойствами и методами
export const addForm = {
    formElement: document.querySelector('.add-form'),
    stub: document.querySelector('.stub'),
    inputName: document.querySelector('input.add-form-name'),
    inputComment: document.querySelector('.add-form-text'),
    render:
        function (loadingStatus = 0) {
            const addFormElement = document.querySelector('div.add-form');

            switch (loadingStatus) {

                case 1:
                    addFormElement.innerHTML = ` 
            <div style="display: flex;">Комментарий загружается...</div>
            <svg class="spinner" viewBox="0 0 50 50">
                <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
            </svg>
            </div>
            `
                    break;

                default: addFormElement.innerHTML = `    
            <input type="text" class="add-form-name" placeholder="Введите ваше имя" id="input-name" />
            <textarea type="textarea" class="add-form-text" placeholder="Введите ваш коментарий" rows="4"
            id="input-comment"></textarea>
            <div class="add-form-row">
                <button class="add-form-button" id="button-add-comment">Написать</button>
            </div>`;
                    // Добавляю событие на клик по кнопке добавить
                    // И на нажатие Enter
                    this.addListeners();
                // const buttonAddComment = document.querySelector('button.add-form-button');
                // document.addEventListener('keyup', (e) => {
                //     if (e.code == 'Enter') this.addComment();
                // });
                // buttonAddComment.addEventListener('click', this.addComment);
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
                addForm.render(1);

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
                            // console.log(responseData);
                            // addForm.render();
                            inputName.value = '';
                            inputComment.value = '';

                        })
                        .then(() => addForm.render())
                        .catch(error => {
                            console.warn(error);
                            switch (error.message) {

                                case 'Short value':
                                    alert('Что-то пошло не так:\n' +
                                        'Имя или текст не должны быть короче 3 символов\n');
                                    addForm.render();
                                    break;

                                case 'Server is broken':
                                    postComment();
                                    // addForm.render();
                                    break;

                                case 'Failed to fetch':
                                    alert('Кажется, у вас сломался интернет, попробуйте позже');
                                    addForm.render();
                                    break;
                            }
                        });
                }
                postComment();
            }
        },
}

// function responseHandler(response) {
//     switch (response.status) {
//         case 200:
//             return response.json();

//         case 201:
//             response.json().then(message => console.log(message));
//             return comments.get();

//         case 400:
//             throw new Error('Short value');

//         case 500:
//             throw new Error('Server is broken');
//     }
// }
import { safeInput, responseHandler } from "./service-functions.js";
// Объект формы добавления комментариев со свойствами и методами
export const addForm = {
    formElement: document.querySelector('.add-form'),
    stub: document.querySelector('.stub'),
    inputName: document.querySelector('input.add-form-name'),
    inputComment: document.querySelector('.add-form-text'),
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
            const buttonAddComment = document.querySelector('.add-form-button');
            buttonAddComment.addEventListener('click', this.addComment);

            document.addEventListener('keyup', (e) => {
                if (e.code == 'Enter') this.addComment();
            });
        },

    addComment:
        function () {
            const currentDate = new Date;
            // Таймаут красного фона на полях
            function clearInputs() {
                addForm.inputName.classList.remove('error__name')
                addForm.inputName.placeholder = 'Введите ваше имя';
                addForm.inputComment.classList.remove('error__name')
                addForm.inputComment.placeholder = 'Введите ваш комментарий';
            }

            if (addForm.inputName.value === '') {
                addForm.inputName.classList.add('error__name');
                addForm.inputName.placeholder = 'Поле не может быть пустым!';
                addForm.inputComment.value = '';
                setTimeout(clearInputs, 1500);

            } else if (addForm.inputComment.value === '' || addForm.inputComment.value === '\n') {
                addForm.inputComment.classList.add('error__name');
                addForm.inputComment.placeholder = 'Поле не может быть пустым!';
                addForm.inputComment.value = '';
                setTimeout(clearInputs, 1500);

            } else {
                // Заглушка на время отправки коммента на сервер
                addForm.toggleStub(1);

                function postComment() {
                    fetch('https://webdev-hw-api.vercel.app/api/v1/alex-volo/comments', {
                        method: "POST",

                        body: JSON.stringify({
                            date: currentDate,
                            likes: 0,
                            isLiked: false,
                            text: safeInput(addForm.inputComment.value),
                            name: safeInput(addForm.inputName.value),
                            // Чтобы сервер падал в 50% случаев
                            forceError: true,
                        })

                    }).then(response => responseHandler(response))

                        .then(() => {
                            // console.log(responseData);
                            addForm.toggleStub(0);
                            addForm.inputName.value = '';
                            addForm.inputComment.value = '';

                        }).catch(error => {
                            console.warn(error);
                            switch (error.message) {

                                case 'Short value':
                                    alert('Что-то пошло не так:\n' +
                                        'Имя или текст не должны быть короче 3 символов\n');
                                    addForm.toggleStub(0);
                                    break;

                                case 'Server is broken':
                                    postComment();
                                    addForm.toggleStub(0);
                                    break;

                                case 'Failed to fetch':
                                    alert('Кажется, у вас сломался интернет, попробуйте позже');
                                    addForm.toggleStub(0);
                                    break;
                            }
                        });
                }
                postComment();
            }
        },
}
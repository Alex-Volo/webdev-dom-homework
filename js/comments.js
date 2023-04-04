import { delay, safeInput, getDate, responseHandler } from "./service-functions.js";

// Объект комментариев со свойствами и методами
export const comments = {
    comments: [],

    get: function (token) {
        return fetch('https://webdev-hw-api.vercel.app/api/v2/alex-volo/comments', {
            method: 'GET',
            headers: {
                athorization: token,
            }
        })
            .then(response => responseHandler(response))

            .then(responseData => {
                this.comments = responseData.comments;
                this.render();

            }).catch(error => {
                console.warn(error);
                switch (error.message) {
                    case 'Server is broken':
                        alert('Сервер сломался, попробуй позже');
                        break;

                    case 'Failed to fetch':
                        alert('Кажется, у вас сломался интернет, попробуйте позже');
                }
            });
    },

    render: //Отрисовать, при true аргументе рисует заглушку
        function (isFirstOpen = 0, token) {
            const commentsList = document.querySelector('ul.comments');
            if (isFirstOpen) {
                commentsList.innerHTML = `
            <li class="comment" style="display: flex;">
            Комментарии загружаются... 
    
            <svg class="spinner" viewBox="0 0 50 50">
            <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
            </svg>
            </li>`;

            } else {
                commentsList.innerHTML = this.comments.reduce((result, comment, index) => {
                    return result + `
        <li class="comment" data-id="${comment.id}" data-index="${index}">
            <div class="comment-header">
            <div>${comment.author.name}
            </div>
            <div>${getDate(comment.date)}
            </div >
            </div >
            <div class="comment-body">
            <div class="comment-text">   
                ${this.makeQuote(comment.text)}            
            </div>
            </div>
            <div class="comment-footer">
            <button class="delete-button">Удалить</button>
      
            <div class="likes">
                <span class="likes-counter">${comment.likes}</span>
                <button class="${comment.isLiked ? 'like-button -active-like' : 'like-button'}"></button>
            </div>
            </div>
        </li >`
                }, '');

                this.addListener();
            }
        },

    addListener: // Делегирование на один листенер различных таргетов
        function () {
            const currentComments = document.querySelectorAll('li.comment');

            for (const comment of currentComments) {
                comment.addEventListener('click', (e) => {
                    const index = comment.dataset.index;
                    const likeButton = e.currentTarget.querySelector('button.like-button');
                    const deleteButton = e.currentTarget.querySelector('.delete-button');

                    if (e.target === likeButton) { this.like(index); return; }
                    if (e.target === deleteButton) { this.delete(index); return }

                    this.replyComment(index);
                })
            }
        },

    replyComment:       //Ответ на комментарий в виде цитаты
        function (index) {
            const inputComment = document.querySelector('.add-form-text');
            inputComment.value = '⟪' + this.comments[index].text +
                '\n' + this.comments[index].author.name + '⟫';
            this.render();
        },

    makeQuote: function (str) {
        return str.replaceAll('⟪', '<blockquote class="blockquote">')
            .replaceAll('⟫', '</blockquote>');
    },

    delete:
        function (index) {
            this.comments.splice(index, 1);
            this.render();
        },

    like:
        function (index) {
            const currentLikeButton = document.querySelectorAll('.like-button')[index];
            currentLikeButton.classList.add('loading-like')
            delay(2000)
                .then(() => {
                    if (this.comments[index].isLiked) {
                        this.comments[index].isLiked = false;
                        this.comments[index].likes -= 1;
                    } else {
                        this.comments[index].isLiked = true;
                        this.comments[index].likes += 1;
                    }
                    this.render();
                })
        },

    edit: // Пока не работает, ждем возможностей от API
        function (index) {

            if (this.comments[index].isEdit === false) {
                this.comments[index].isEdit = true;

            } else {
                let currentTextarea = document.querySelectorAll('.comment')[index].querySelector('textarea');

                if (currentTextarea.value !== '') {
                    this.comments[index].isEdit = false;
                    this.comments[index].text = safeInput(currentTextarea.value);
                }
            }
            this.render();
        }
}
import { delay, getDate, } from "./service-functions.js";
import { getComments } from "./API.js"
let comments = [];

function getAndRenderComments(token) {
    getComments(token)
        .then(responseData => {
            comments = responseData.comments;
            console.log(comments);
            renderComments(0, token);
        })
        .catch(error => {
            console.warn(error);
            switch (error.message) {
                case 'Server is broken':
                    alert('Сервер сломался, попробуй позже');
                    break;

                case 'Failed to fetch':
                    alert('Кажется, у вас сломался интернет, попробуйте позже');
            }
        });
}


//Отрисовать, при true аргументе рисует заглушку
function renderComments(isFirstOpen = 0, token) {
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
        commentsList.innerHTML = comments.reduce((result, comment, index) => {
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
        ${makeQuote(comment.text)}            
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

        addCommentListener(token);
    }
};


function addCommentListener(token) {
    const currentComments = document.querySelectorAll('li.comment');

    for (const comment of currentComments) {
        comment.addEventListener('click', (e) => {
            const index = comment.dataset.index;
            const currentToken = token;
            const likeButton = e.currentTarget.querySelector('button.like-button');
            const deleteButton = e.currentTarget.querySelector('.delete-button');

            if (e.target === likeButton) { like(index); return; }
            if (e.target === deleteButton) { deleteComment(index, currentToken); return }

            replyComment(index);
        })
    }
};

//Ответ на комментарий в виде цитаты
function replyComment(index) {
    const inputComment = document.querySelector('.add-form-text');
    inputComment.value = '⟪' + comments[index].text +
        '\n' + comments[index].author.name + '⟫';
    renderComments();
};

function makeQuote(str) {
    return str.replaceAll('⟪', '<blockquote class="blockquote">')
        .replaceAll('⟫', '</blockquote>');
};


function deleteComment(index, currentToken) {
    fetch('https://webdev-hw-api.vercel.app/api/v2/alex-volo/comments/' + comments[index].id, {
        method: "DELETE",
        headers: {
            authorization: currentToken,
        },
    })
        .then((response) => {        
            if(response.status === 200){
                comments.splice(index, 1);
                renderComments(0, currentToken);
                return response.json();
            }
        })
        .catch(error => {
            console.warn(error);
            if (error.message = 'Failed to fetch'){
                alert('Нет соединения с интернетом')
            }
        })
    
};

function like(index) {
    const currentLikeButton = document.querySelectorAll('.like-button')[index];
    currentLikeButton.classList.add('loading-like')
    delay(2000)
        .then(() => {
            if (comments[index].isLiked) {
                comments[index].isLiked = false;
                comments[index].likes -= 1;
            } else {
                comments[index].isLiked = true;
                comments[index].likes += 1;
            }
            renderComments();
        })
};

// Пока не работает, ждем возможностей от API
// function edit(index) {

//     if (comments[index].isEdit === false) {
//         comments[index].isEdit = true;

//     } else {
//         let currentTextarea = document.querySelectorAll('.comment')[index].querySelector('textarea');

//         if (currentTextarea.value !== '') {
//             comments[index].isEdit = false;
//             comments[index].text = safeInput(currentTextarea.value);
//         }
//     }
//     renderComments();
// };

export { comments, getAndRenderComments, renderComments }
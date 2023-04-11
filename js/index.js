// Сначала отображает возможность авторизоваться
// Потом логин
// После обновления страницы эддформ с заполненным юзером и токеном



import {  renderComments, getAndRenderComments } from "./comments.js";
import { renderAddForm } from "./add-form.js";


let token = localStorage.getItem('currentToken');
console.log(token);
renderComments(1);//Заглушка на комментариях
if(!token){
     renderAddForm('auth');
} else {
     renderAddForm('addForm')
}

getAndRenderComments(token);// Получаем с сервера и отрисовываем
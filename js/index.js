// Если вы поняли, что, на самом-то деле, все не так уж и плохо, 
// а жизнь, черт побери, налаживается - 
// больше не пейте в этот вечер!



import {  renderComments, getAndRenderComments } from "./comments.js";
import { renderAddForm } from "./add-form.js";
let token = null;
// let token = localStorage.getItem('currentToken');
renderComments(1);//Заглушка на комментариях
if(!token){
     renderAddForm('auth');
} else {
     renderAddForm('addForm')
}

getAndRenderComments();// Получаем с сервера и отрисовываем
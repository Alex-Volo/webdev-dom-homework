/* 1. При открытии страницы отображаются комментарии,
   под ними надпись: Чтобы добавить комментарий авторизуйтесь
   2. После нажатия авторизуйтесь появляется форма входа,
   в ней два поля логин и пароль, две кнопки
   войти и зарегистрироваться.
        -Валидация полей
   3. После нажатия зарегистрироваться появляется форма 
   регистрации. Там три поля ввода и две кнопки.
        -Валидация полей.
   4. После логина появляется форма добавления комментария.
   Имя в ней уже задано и его невозможно изменить.
   5. Токен получается из апи авторизации
   6. Обработка ошибок от апи авторизации:
        -Такой пользователь уже существует
        -Неверный пользователь или пароль.
   7. Модуль АПИ и модуль компонента авторизации */

import { comments } from "./comments.js";
import { addForm } from "./add-form.js";

comments.render(1);//Заглушка на комментариях
addForm.render()
// addForm.addListeners(); //Добавляю обработчики событий на форму
comments.get();// Получаем с сервера и отрисовываем
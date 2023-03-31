// - У меня депрессия и ничего не хочется.
// - Тебе надо срочно показаться бармену!

import { comments } from "./comments.js";
import { addForm } from "./add-form.js";

comments.render(1);//Заглушка на комментариях
addForm.addListeners(); //Добавляю обработчики событий на форму
comments.get();// Получаем с сервера и отрисовываем
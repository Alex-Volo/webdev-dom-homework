// Функции либо общие, либо не относящиеся ни к какому объекту.
import { format } from "date-fns";
function safeInput(str) {
    return str.replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;");
}

function delay(interval = 300) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, interval);
    });
}

function getDate(date) {
    const options = {
        year: '2-digit',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }
    const newDate = new Date(date);
    // return newDate.toLocaleString('ru-RU', options).replace(',', '');
    return format(newDate, 'yyyy-MM-dd hh.mm.ss');
}

function validate(input, text) {
    if (input.value === '' || input.value === '\n') {
        input.classList.add('error__name');
        input.placeholder = 'Поле не может быть пустым!';
        input.value = '';
        setTimeout(() => {
            input.classList.remove('error__name')
            input.placeholder = `Введите ${text}`;
        }, 1500);
    } else {
        return true;
    }
}

export { validate, getDate, delay, safeInput };
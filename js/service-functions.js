import { comments } from "./comments.js";
// Функции либо общие, либо не относящиеся ни к какому объекту.
export function safeInput(str) {
    return str.replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;");
}

export function delay(interval = 300) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, interval);
    });
}

export function getDate(date) {
    const options = {
        year: '2-digit',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }
    const newDate = new Date(date);
    return newDate.toLocaleString('ru-RU', options).replace(',', '');
}

export function responseHandler(response) {
    switch (response.status) {
        case 200:
            return response.json();

        case 201:
            response.json().then(message => console.log(message));
        return comments.get();

        case 400:
            throw new Error('Short value');

        case 500:
            throw new Error('Server is broken');
    }
}
import { getAndRenderComments } from "./comments.js";

function getComments(token) {
    return fetch('https://webdev-hw-api.vercel.app/api/v2/alex-volo/comments', {
        method: 'GET',
        headers: {
            athorization: token,
        }
    })
        .then(response => {
            switch (response.status) {
                case 200:
                    return response.json();
                case 500:
                    throw new Error('Server is broken');
            }
        })
}
// На будущее, когда будет больше свободного времени
// function catchErrors(error) {
//     console.warn(error);
//     switch (error.message) {
//         case 'Server is broken':
//             alert('Сервер сломался, попробуй позже');
//             break;

//         case 'Failed to fetch':
//             alert('Кажется, у вас сломался интернет, попробуйте позже');
//     }
// }

function postComment(name, comment, date, token) {
    return fetch('https://webdev-hw-api.vercel.app/api/v2/alex-volo/comments', {
        method: "POST",
        headers: {
            authorization: token,
        },
        body: JSON.stringify({
            date: date,
            likes: 0,
            isLiked: false,
            text: comment,
            name: name,
            // Чтобы сервер падал в 50% случаев
            forceError: true,
        })

    })
    .then(response => {
        switch (response.status) {
            case 201:
            response.json().then(message => console.log(message));
            return getAndRenderComments(token);

            case 400:
                throw new Error('Short value');

            case 401:
                throw new Error('Bad authorization');

            case 500:
                throw new Error('Server is broken');
        }
    })
}

function responseHandler(response) {
    switch (response.status) {
        case 200:
            return response.json();

        case 201:
            response.json().then(message => console.log(message));
            return getAndRenderComments();

        case 400:
            throw new Error('Short value');

        case 500:
            throw new Error('Server is broken');
    }
}

export { getComments, responseHandler, postComment }
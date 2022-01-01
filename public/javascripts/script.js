const socket = io();

const allMessagesEl = document.querySelector('.allMessages');
const messUsEl = document.querySelector('.messUs');
const addingMessEl = document.querySelector('.addingMess');
const usersListEl = document.querySelector('.usersList');
const addingUsernameEl = document.querySelector('.addingUsername');
const loginChatEl = document.querySelector('.loginChat');

let profile = {
    name: null,
};

let timerTyping = null;
const showTyping = () => {
    addingMessEl.classList.remove('hidden');
    clearTimeout(timerTyping);
    timerTyping = setTimeout( () => {
        addingMessEl.classList.add('hidden');
    }, 500);
}

const boxMessage = (name, time, message) => {
    const html = `
    <div class="userMess">
          <div class="titleMess">
            <div class="titleMessName">${name}</div>
            <div class="titleMessTime">${time}</div>
          </div>
          <div class="messageText"> ${message} </div>
        </div>`;

    allMessagesEl.insertAdjacentHTML('beforeend', html);
    messUsEl.innerHTML = "";
}

const loginChatForm = document.forms.loginChat;
loginChatForm.addEventListener('submit', (ev) => {
    ev.preventDefault();

    const formData = new FormData(ev.target);
    const name = formData.get('username');

    socket.emit('login', { name }, (data) => {
        profile.name = data.name;
    });

    addingUsernameEl.innerHTML = name;

    loginChatEl.classList.remove('show');
    addingUsernameEl.classList.add('show');

    socket.on('joinChat', (data) => {

        const html = `<div>${data.name} joined the chat</div>`
        allMessagesEl.insertAdjacentHTML('beforeend', html);

        const listEl = `<li>${data.name}<li>`;
        usersListEl.insertAdjacentHTML('beforeend', listEl);
    })
})

const messageChatForm = document.forms.messageChat;
messageChatForm.addEventListener('submit', (ev) => {
    ev.preventDefault();

    const formData = new FormData(ev.target);
    const message = formData.get('message');

    messUsEl.addEventListener('keypress', (ev) => {
        socket.emit('typing', {name: profile.name });
    })

    socket.emit('send mess', { message, name: profile.name }, (data) => {
        boxMessage(data.name, data.time, data.message)
    });

    messUsEl.value = "";
})

socket.on('send mess', (data) => {
    boxMessage(data.name, data.time, data.message)
});

socket.on('typing', (data) => {
    const html = `<span>${data.name} is typing...</span>`
    addingMessEl.innerHTML = html;
    showTyping();
});


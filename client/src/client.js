const sock = io();


const writeEvent = (text) => {
    const parent = document.querySelector('#events');
    const li = document.createElement('li');

    li.innerHTML = text;

    parent.appendChild(li);
};

writeEvent("Welcoe to the game!");

sock.on('message', writeEvent);
const sock = io();
let name = '';



const writeEvent = (text) => {
    const para = document.querySelector('#events');

    para.innerHTML = `<pre>${String(new(Date)).substring(0, 24)}\n${text}</pre>`;
};

const registerUser = (text) => {
    if(name == '') {
        name = text;
    }
    sock.emit('register', name);
}

const onClick = (move) => {
    switch(move) {
        case 'r':
            writeEvent('ROCK');
            break;
        case 'p':
            writeEvent('PAPER');
            break;
        case 's':
            writeEvent('SCISSORS');
            break;
        default:
            writeEvent('NOTHING')
    };
    sock.emit('move', {'player': name, 'move': move});  // Problem sending itself object by the object
};

document.getElementById("button").addEventListener('click', (event) => {
    event.preventDefault();
    name = document.getElementById("input").value;
    document.getElementById("name").textContent = name;
    document.getElementById("wrap").innerHTML = '';
    sock.emit('register', name);
});

document.getElementById("r").addEventListener('click', () => {
    onClick('r');
});
document.getElementById("p").addEventListener('click', () => {
    onClick('p');
});
document.getElementById("s").addEventListener('click', () => {
    onClick('s');
});

writeEvent("Welcome to the game!");

sock.on('message', writeEvent);

sock.on('register', registerUser);

sock.on('refresh', () => {
    location.reload();
});



const sock = io();
let name = ''; // name will be used to register a palyer
let atcion_message = document.getElementById('action-message');
let socket_message = document.getElementById('socket-message');



const writeEvent = (text) => { // write date and message
    socket_message.innerHTML = `<pre>${String(new(Date)).substring(0, 24)}\n${text}</pre>`;
};

const onClick = (move) => {
    switch(move) {
        case 'r':
            atcion_message.textContent = 'Your move: ROCK';
            break;
        case 'p':
            atcion_message.textContent = 'Your move: PAPER';
            break;
        case 's':
            atcion_message.textContent = 'Your move: SCISSORS';
            break;
        default: // absolutely redundant
            atcion_message.textContent = 'Your move: NOTHING';
    };
    sock.emit('move', {'player': name, 'move': move});  // Problem sending itself object by the object, so need to use name here
};

document.getElementById("button").addEventListener('click', (event) => {
    event.preventDefault();
    let value = document.getElementById("input").value;
    if(value != "") { // do nothing if there is no name entered
        name = value // set name
        sock.emit('register', name); // send name to register with player
        document.getElementById("name").textContent = name; // display name
        document.getElementById("wrap").innerHTML = ''; // destroy form
    };
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

writeEvent("Welcome to the game!"); // just welcome message

sock.on('message', writeEvent); // here comes the namo of the winner

sock.on('register', (text) => { // set name and sent it to server
    if(name == '') {
        name = text;
    }
    sock.emit('register', name);
});

sock.on('refresh', () => { // redundant
    location.reload();
});



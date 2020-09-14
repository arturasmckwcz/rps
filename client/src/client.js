const sock = io();
let name = ''; // name will be used to register a palyer



const writeEvent = (text) => { // write date and message
    document.querySelector('#events').innerHTML = `<pre>${String(new(Date)).substring(0, 24)}\n${text}</pre>`;
};

const registerUser = (text) => { // set name and sent it to server
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
        default: // absolutely redundant
            writeEvent('NOTHING')
    };
    sock.emit('move', {'player': name, 'move': move});  // Problem sending itself object by the object, so need to use name here
};

document.getElementById("button").addEventListener('click', (event) => {
    event.preventDefault();
    registerUser(document.getElementById("input").value);
    document.getElementById("name").textContent = name; // display name
    document.getElementById("wrap").innerHTML = ''; // destroy form
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

sock.on('register', registerUser);

sock.on('refresh', () => { // redundant
    location.reload();
});



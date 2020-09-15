const http = require('http');
const express = require('express');

const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const clientPath = `${__dirname}/../client`;

app.use(express.static(clientPath));
console.log(`Serving from ${clientPath}`);

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));


// let player1 = null;
// let player2 = null;

class RPSGame {
    constructor() {
        this.player1 = null; // this.player1 is a socket which makes connection to a browser
        this.name1 = ''; // this.name is a name of player
        this.player2 = null;
        this.name2 = '';
        this.move = {player1: '', player2: ''}; // this.move contains moves made by players
    }

    setPlayer1(player){
        this.player1 = player; // player is a socket
    }
    setPlayer2(player){
        this.player2 = player;
    }
    setName1(name){
        this.name1 = name;
    }
    setName2(name){
        this.name2 = name;
    }
    getPlayer1(){
        return this.player1;
    }
    getPlayer2(){
        return this.player2;
    }
    getName1(){
        return this.name1;
    }
    getName2(){
        return this.name2;
    }
    setMove(move){
        if(move.player==this.name1) { //move is identified by a name, not by a socket, otherwise a socket calls itself trying to do .emit
            this.move.player1 = move.move;
        };
        if(move.player==this.name2) {
            this.move.player2 = move.move;
        }
    }
    getMove() {
        return this.move;
    }
    isMoveComplete() {
        return (this.move.player1 != '') && (this.move.player2 != '');
    }
    getScore() {
        let move = this.move.player1 + this.move.player2;
        console.log(new(Date), move);
        switch(move) { // simple logic switching by concatination of moves
            case 'rr':
            case 'pp':
            case 'ss':
                return 'DRAW'; //return the name of the winner
                break;
            case 'rp':
            case 'ps':
            case 'sr':
                return this.name2;
                break;
            case 'rs':
            case 'pr':
            case 'sp':
                return this.name1;
                break;
            default:
                return 'Error!'
        }; 
    }
    reset() {
        this.move = {player1: '', player2: ''};
    }
};

game = new RPSGame();

io.on('connection', (sock) => {
    if (game.getPlayer1() == null) {
        console.log(new(Date), "Setting PLAYER1.");
        game.setPlayer1(sock); // set the current sock as player1
        game.setName1('PLAYER1'); // give  temp name
        sock.on('register', (name) => { // in case user entered name 
            if (name != '') {
                game.setName1(name);
            };
            console.log(new(Date), `Registering: ${game.getName1()} as PLAYER1`)
        });
        sock.on('disconnect', () => { // in case user disconnected
            game.setPlayer1(null);
        });
        sock.emit('register', 'PLAYER1'); // seem like redundant
    } else if (game.getPlayer2() == null) { // all the same as with player1
        console.log(new(Date), "Setting PLAYER2.");
        game.setPlayer2(sock);
        game.setName2('PLAYER2');
        sock.on('register', (name) => {
            if (name != '') {
                game.setName2(name);
            };
            console.log(new(Date), `Registering: ${game.getName2()} as PLAYER2`)
        });
        sock.on('disconnect', () => {
            game.setPlayer2(null);
        });
        sock.emit('register', 'PLAYER2');
    };

    sock.on('move', (move) => {
        console.log(new(Date), game.getPlayer1()==sock, game.getPlayer2()==sock);
        if (sock == game.getPlayer1() || sock == game.getPlayer2()) { // checking if one of players sent the move
            game.setMove(move);
            console.log(new(Date), game.getMove());
            console.log(`PLAYER1: ${game.getName1()}\nPLAYER2: ${game.getName2()}`);
            if (game.isMoveComplete()) { // check if both players has made a move
                console.log(new(Date), "Just about to conclude the game.");
                io.emit('message', `The winner is: ${game.getScore()}`); // get the winner!
                game.reset(); // actualy reset move
            };
        };
    });
});

// io.on('register', (name) => {});

server.on('error', (err) => {
    console.error("Server error: ", err);
});

server.listen(3004, () => {
    console.log("RPS server is up and running!");
});


// Juliaus stuff follows:
console.log("as esu robotas.");
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
        this.player1 = null;
        this.name1 = '';
        this.player2 = null;
        this.name2 = '';
        this.move = {player1: '', player2: ''};
    }

    setPlayer1(player){
        this.player1 = player;
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
        if(move.player==this.name1) {
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
        switch(move) {
            case 'rr':
            case 'pp':
            case 'ss':
                return 'DRAW';
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
        game.setPlayer1(sock);
        sock.on('register', (name) => {
            game.setName1(name);
        });
        sock.emit('register', '');
    } else if (game.getPlayer2() == null) {
        console.log(new(Date), "Setting PLAYER2.");
        game.setPlayer2(sock);
        sock.on('register', (name) => {
            game.setName2(name);
        });
        sock.emit('register', '');
    };

    sock.on('move', (move) => {
        console.log(new(Date), move);
        game.setMove(move);
        console.log(new(Date), game.getMove());
        let flag = game.isMoveComplete();
        console.log(`PLAYER1: ${game.getName1()}\nPLAYER2: ${game.getName2()}`);
        if (flag) {
            console.log(new(Date), "Just about to conclude the game.");
            io.emit('message', `The game is concluded by ${game.getScore()}`);
            game.reset();
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
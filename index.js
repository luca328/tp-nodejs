import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import moment from 'moment';
import { fileURLToPath } from 'url';
import mysql from 'mysql';
import pug from 'pug';
import api from './api.js';
import sleep from '@crunchya/nodesleep';
dotenv.config(".env");

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(`${__dirname}/script`));
app.use(express.static(`${__dirname}/style`));

if(!fs.existsSync("./chat.log")) {
    fs.writeFile("./chat.log", '', err => {
        if (err) throw err;

        console.log("Chat log created"); // log chat log

    }); // write to data.json
}

function log(user, message) {
    fs.appendFileSync("./chat.log", `${moment().format("d/M/Y")} - ${user} has sent this message: ${message}\n`); // write to data.json
}

io.on("connection", async (socket)=> {
    socket.on("chat_message", async (msg)=> {
        let bot_msg = "bot: Bonjour un expert va vous contacter dès que possible."
        io.emit("chat_message", {msg:msg, bot_msg:bot_msg})
        log("User", msg.replace(/\w+\:\s/, '')); // log message to chat log
        await sleep(1000)
        log("bot",bot_msg.replace(/\w+\:\s/,'')); // log message to chat log
    })
})

//fonction de récupération des valeurs

async function getBeers(){
    let resultat = await api.get('/beers');
    return resultat.data
}

async function getRandom(){
    let resultat = await api.get('/beers/random');
    return resultat.data[0];
}


async function getSingleBeer(id){
    let resultat = await api.get(`/beers/${id}`);
    return resultat.data[0];
}

//rooting des pages

app.get('/', (req, res) => {
    res.send(pug.renderFile("./page/index.pug"));
});

app.get('/list', async (req, res) => {
    let beers = await getBeers();
    res.send(pug.renderFile("./page/list.pug", { 
        beers:beers,
    }));
});

app.get('/boisson_mois', async (req, res) => {
    let result = await getRandom();
    res.send(pug.renderFile("./page/boisson_mois.pug", {
        beer:result
    }));
});

app.get('/description', async (req, res) => {
    let result = await getSingleBeer(parseInt(req.query.id));
    res.send(pug.renderFile("./page/description.pug", {
        beer:result
    }));
});

app.get('/contact', (req, res) => {
    res.send(pug.renderFile("./page/contact.pug"));
});

//serveur

server.listen(process.env.PORT, process.env.HOST, () => {
  console.log('listening on *:8000');
});
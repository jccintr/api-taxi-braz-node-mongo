import express from 'express';
//import { WebSocketServer,WebSocket } from 'ws';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import router from './routes.js';
import websocket from './websocket.js';
import cors from 'cors';





dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true}))
app.use(cors({
  origin: '*'
}));

app.get('/', function(req, res) {
    res.send('Bem Vindo a Braz Driver API');
  });
  app.get('/awake', function(req, res) {
    res.send('Hello !');
  });
  app.use(router);

 

  async function connectDatabase() {

    await mongoose.connect(process.env.DB_CONNECTION_PROD).then(()=>{
        console.log('Conectado ao banco de dados com sucesso !');
    }).catch((error)=>{
        console.log("Falha ao conectar ao banco de dados.");
    })
  }



connectDatabase()

const server = app.listen(process.env.PORT,()=>{console.log('Servidor ouvindo a porta '+ process.env.PORT)});

const wss = websocket(server);

app.set("wss", wss);



// mantem o ws acordado
const keepAwake = () => {
  setInterval(async () => {
    try {
      const response = await fetch('https://taxibraz.onrender.com/awake');
      
    } catch (error) {
      console.error('Erro ao fazer ping:', error);
    }
  }, 50000); //'50s'
};

keepAwake();







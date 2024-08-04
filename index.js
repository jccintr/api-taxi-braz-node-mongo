import express from 'express';
import { WebSocketServer,WebSocket } from 'ws';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import router from './routes.js';
import websocket from './websocket.js';





dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true}))



app.get('/', function(req, res) {
    res.send('Taxi Braz API');
  });
  app.use(router);

 

  async function connectDatabase() {

    await mongoose.connect(process.env.DB_CONNECTION).then(()=>{
        console.log('Conectado ao banco de dados com sucesso !');
    }).catch((error)=>{
        console.log("Falha ao conectar ao banco de dados.");
    })
  }



connectDatabase()

const server = app.listen(process.env.PORT,()=>{console.log('Servidor ouvindo a porta '+ process.env.PORT)});

websocket(server);



// const wss = new WebSocketServer({server});

// wss.on('connection', (ws, req) => {
//  // ws.on('error', onSocketPostError);
   
//   ws.on('message', (msg, isBinary) => {
//       wss.clients.forEach((client) => {
//           if (client.readyState === WebSocket.OPEN) {
//               client.send(msg, { binary: isBinary });
//           }
//       });
//   });

//   ws.on('close', () => {
//       console.log('Connection closed');
//   });
// });







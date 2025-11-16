import express from 'express';
//import { WebSocketServer,WebSocket } from 'ws';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
//import router from './routes.js';
import AdminRouter from './routes/adminRoutes.js';
import PagamentoRouter from './routes/pagamentoRoutes.js';
import PassengerRouter from './routes/passengerRoutes.js';
import DriverRouter from './routes/driverRoutes.js';
import RideRouter from './routes/rideRoutes.js';
import websocket from './websocket.js';
import cors from 'cors';
import { coordinates } from './data/coordinates.js';
import { driversIds } from './data/coordinates.js';
import Driver from './models/driver.js';



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
  app.use(AdminRouter);
  app.use(PagamentoRouter);
  app.use(PassengerRouter);
  app.use(DriverRouter);
  app.use(RideRouter);
  //app.use(router);

 

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


const updateDriversPosition = () => {
  setInterval(async () => {
    for (const driverId of driversIds) {

      const randomIndex = Math.floor(Math.random() * coordinates.length);
      const position = coordinates[randomIndex];

      try {
        const updatedLocation = await Driver.findByIdAndUpdate(driverId, { position });
        if (updatedLocation) {
          console.log('atualizado drivers positions');
        } else {
          console.log('falha ao atualizar')
        }
      } catch (error) {
        console.error(error);
      }
    }
  }, 120000);
};

updateDriversPosition();







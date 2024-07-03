import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import router from './routes.js';




dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true}))



app.get('/', function(req, res) {
    res.send('Bem vindo a Api Taxi Braz');
  });
  app.use(router);

  //app.post("/register",cadastro);
 

  async function connectDatabase() {

    await mongoose.connect(process.env.DB_CONNECTION).then(()=>{
        console.log('Conectado ao banco de dados com sucesso !');
    }).catch((error)=>{
        console.log("Falha ao conectar ao banco de dados.");
    })
  }



connectDatabase()
app.listen(process.env.PORT,()=>{console.log('Servidor ouvindo a porta '+ process.env.PORT)});


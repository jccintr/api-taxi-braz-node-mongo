import Ride from '../models/ride.js';



export const store = async (req,res) => {

    
    const {passengerId,origem,destino,duracao,distancia,valor} = req.body;
    
    const event = {Data: Date.now,Description: "Corrida solicitada"};
    const newRide = new Ride({passenger:passengerId,origem,destino,duracao,distancia,valor});
    newRide.events.push({data: new Date(),descricao: "Corrida solicitada"});
    await newRide.save();
   
    return res.status(201).json(newRide);

}
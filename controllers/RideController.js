import Ride from '../models/ride.js';



export const store = async (req,res) => {

    
    const {passengerId,origem,destino,duracao,distancia,valor,pagamento} = req.body;
    
    const event = {Data: Date.now,Description: "Corrida solicitada"};
    const newRide = new Ride({passenger:passengerId,origem,destino,duracao,distancia,valor,pagamento});
    newRide.events.push({data: new Date(),descricao: "Corrida solicitada"});
    await newRide.save();
   
    return res.status(201).json(newRide);

}

export const price = async (req,res) => {

    // parametros a serem considerados: preco do combustivel, distancia, horario
    // apos x horas, acrescimo de z %

    const {distancia} = req.body;

    const priceByKm = 5.0;

    let ridePrice = 0;


   if(distancia<1){
       ridePrice = priceByKm;
   } else {
       ridePrice = priceByKm * distancia;
   }
   
   const price = {valor:ridePrice};

    return res.status(200).json(price);



}
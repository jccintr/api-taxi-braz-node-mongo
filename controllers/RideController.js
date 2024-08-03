import Ride from '../models/ride.js';
import Driver from '../models/driver.js';
import Passenger from '../models/passenger.js';



export const store = async (req,res) => {

    
    const {passengerId,origem,destino,duracao,distancia,valor,pagamento} = req.body;
    
    const event = {Data: Date.now,Description: "Corrida solicitada"};
    const newRide = new Ride({passenger:passengerId,origem,destino,duracao,distancia,valor,pagamento});
    newRide.events.push({data: new Date(),descricao: "Corrida solicitada"});
    await newRide.save();

    const passenger = await Passenger.findById(passengerId).select('name'); 
    const drivers = await Driver.find({online:true}).select('pushToken');
    
    const toDrivers = [];
    drivers.forEach((driver)=>toDrivers.push(driver.pushToken));

   
    const sound = 'default';
    const title = 'Nova Corrida';
    const body = `${passenger.name} solicita uma corrida de ${origem.address}, para ${destino.address}, no valor de R$ ${valor.toFixed(2)}.`;
    const response = await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({to:toDrivers,sound,title,body})
    });

   
    return res.status(201).json(newRide);

}

export const accept = async (req,res) => {

    const rideId = req.params.id;
    const {driverId} = req.body;
    
    const ride = await Ride.findById(rideId);
    ride.status = 1;
    ride.driver = driverId;
    ride.events.push({data: new Date(),descricao: "Corrida aceita"});
    await ride.save();

    return res.status(200).json(ride);

  

}

export const start = async (req,res) => {

    const rideId = req.params.id;
   
    
    const ride = await Ride.findById(rideId);
    ride.status = 2;
    ride.events.push({data: new Date(),descricao: "Corrida iniciada"});
    await ride.save();

    return res.status(200).json(ride);

}

export const finish = async (req,res) => {

    const rideId = req.params.id;
   
    
    const ride = await Ride.findById(rideId);
    ride.status = 3;
    ride.events.push({data: new Date(),descricao: "Corrida concluida"});
    await ride.save();

    return res.status(200).json(ride);

}

export const status = async (req,res) => {
    const rideId = req.params.id;

    const ride = await Ride.findById(rideId,'status');

    if (!ride){
        return res.status(404).json({error:'Corrida não encontrada'});
    }

    return res.status(200).json({status:ride.status});
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

export const index =  async (req,res) => {

    const rides = await Ride.find({status:0}).populate('passenger','name avatar rating').select('data distancia duracao valor origem destino pagamento');


    return res.status(200).json(rides);


}
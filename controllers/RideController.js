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

    const rides = await Ride.find({status:0}).populate('passenger','name avatar').select('data distancia duracao valor origem.address destino.address');


    return res.status(200).json(rides);


}
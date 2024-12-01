import Ride from '../models/ride.js';
import Driver from '../models/driver.js';
import Passenger from '../models/passenger.js';
import { WebSocket } from 'ws';
import { addLog } from '../util/logs.js';



export const store = async (req,res) => {

    
    const {passengerId,origem,destino,duracao,distancia,valor,pagamentoId} = req.body;
    
    //const event = {Data: Date.now,Description: "Corrida solicitada"};
    const newRide = new Ride({passenger:passengerId,origem,destino,duracao,distancia,valor,pagamento:pagamentoId});
    newRide.events.push({data: new Date(),descricao: "Aguardando Motorista"});
    await newRide.save();

    const passenger = await Passenger.findById(passengerId).select('name'); 
    const drivers = await Driver.find({online:true}).select('pushToken');
    
    const toDrivers = [];
    drivers.forEach((driver)=>{
        if(driver.pushToken){
            toDrivers.push(driver.pushToken);
        }
    });
    
    // envia a notificação para o motorista
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

    const retRide = await Ride.findById(newRide._id).populate('pagamento','nome').select('status data distancia duracao valor origem destino events');
    return res.status(201).json(retRide);

}

export const accept = async (req,res) => {

    const rideId = req.params.id;
    const {driverId} = req.body;
    
    const ride = await Ride.findById(rideId);
    


    if(ride.status!==0) {
       return res.status(400).json({error: 'Corrida não disponível no momento.'});
    }
    const driver = await Driver.findById(driverId);
    ride.status = 1;
    ride.driver = driverId;
    ride.veiculo = driver.veiculo;
    ride.events.push({data: new Date(),descricao: "Corrida aceita"});
    await ride.save();

     const acceptedRide = await Ride.findById(rideId).populate('passenger','name avatar rating telefone').populate('driver','name avatar rating telefone').populate('pagamento','nome').select('status data distancia duracao valor origem destino events veiculo');

     const wss = req.app.get("wss");
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            if(client.id==ride.passenger._id){
                client.send(JSON.stringify(acceptedRide));
            }
        }
      });

    return res.status(200).json(acceptedRide);

  

}

export const onWay = async (req,res) => {

    const rideId = req.params.id;

    const ride = await Ride.findById(rideId);
    ride.status = 2;
    ride.events.push({data: new Date(),descricao: "Motorista a Caminho"});
    await ride.save();

    const onWayRide = await Ride.findById(rideId).populate('passenger','name avatar rating telefone').populate('driver','name avatar rating telefone').populate('pagamento','nome').select('status data distancia duracao valor origem destino events veiculo');

    const wss = req.app.get("wss");
     wss.clients.forEach((client) => {
       if (client.readyState === WebSocket.OPEN) {
           if(client.id==ride.passenger._id){
               client.send(JSON.stringify(onWayRide));
           }
       }
     });

   return res.status(200).json(onWayRide);

}

export const arrived = async (req,res) => {

    const rideId = req.params.id;

    const ride = await Ride.findById(rideId);
    ride.status = 3;
    ride.events.push({data: new Date(),descricao: "Motorista chegou"});
    await ride.save();

    const newRide = await Ride.findById(rideId).populate('passenger','name avatar rating telefone').populate('driver','name avatar rating telefone').populate('pagamento','nome').select('status data distancia duracao valor origem destino events veiculo');

    const wss = req.app.get("wss");
     wss.clients.forEach((client) => {
       if (client.readyState === WebSocket.OPEN) {
           if(client.id==ride.passenger._id){
               client.send(JSON.stringify(newRide));
           }
       }
     });

   return res.status(200).json(newRide);

}

export const start = async (req,res) => {

    const rideId = req.params.id;
    const {latitude,longitude} = req.body;
   
    
    const ride = await Ride.findById(rideId);
    ride.status = 4;
    ride.embarque = {data: new Date(),latitude:latitude,longitude:longitude};
    ride.events.push({data: new Date(),descricao: "Corrida iniciada"});
    await ride.save();

    const newRide = await Ride.findById(rideId).populate('passenger','name avatar rating telefone').populate('driver','name avatar rating telefone').populate('pagamento','nome').select('status data distancia duracao valor origem destino events veiculo');

    const wss = req.app.get("wss");
     wss.clients.forEach((client) => {
       if (client.readyState === WebSocket.OPEN) {
           if(client.id==ride.passenger._id){
               client.send(JSON.stringify(newRide));
           }
       }
     });

   return res.status(200).json(newRide);

}

export const restoreDriverRide = async (req,res) => {
    const rideId = req.params.id;

    const ride = await Ride.findById(rideId).populate('passenger','name avatar rating telefone').populate('driver','name avatar rating telefone').populate('pagamento','nome').select('status data distancia duracao valor origem destino events veiculo');

    if(!ride){
        return res.status(404).json({error:'Corrida não encontrada.'});
    }
    if(ride.status<0){
        return res.status(404).json({error:'Corrida não encontrada.'});
    }
    return res.status(200).json(ride);

}

export const restorePassengerRide = async (req,res) => {

    const rideId = req.params.id;
   // console.log('restore passenger rideId =>',rideId);
    const ride = await Ride.findById(rideId).populate('passenger','name avatar rating telefone').populate('driver','name avatar rating telefone').populate('pagamento','nome').select('status data distancia duracao valor origem destino events veiculo');
    

    if(!ride){
        return res.status(404).json({error:'Corrida não encontrada.'});
    }
    if(ride.status<0){
        return res.status(404).json({error:'Corrida não encontrada.'});
    }
    return res.status(200).json(ride);

}

export const finish = async (req,res) => {

    const rideId = req.params.id;
    const {latitude,longitude} = req.body;
   
    
    const ride = await Ride.findById(rideId);
    ride.status = 5;
    ride.desembarque = {data: new Date(),latitude:latitude,longitude:longitude};
    ride.events.push({data: new Date(),descricao: "Corrida concluida"});
    ride.valorPlataforma = ride.valor * process.env.PERCENTUAL_PLATAFORMA / 100;
    ride.valorDriver = ride.valor - ride.valorPlataforma;
    await ride.save();

    const newRide = await Ride.findById(rideId).populate('passenger','name avatar rating telefone').populate('driver','name avatar rating telefone pix').populate('pagamento','nome').select('status data distancia duracao valor origem destino events veiculo');

    const wss = req.app.get("wss");
     wss.clients.forEach((client) => {
       if (client.readyState === WebSocket.OPEN) {
           if(client.id==ride.passenger._id){
               client.send(JSON.stringify(newRide));
           }
       }
     });

   return res.status(200).json(newRide);

}

export const passengerCancel = async (req,res) => {

    const {passengerId} = req.body;
    const rideId = req.params.id;

    const ride = await Ride.findById(rideId);
    
    if(ride.status!==0){
        return res.status(400).json({error:'Esta corrida não pode ser cancelada.'});
    }

    if(ride.passenger != passengerId){
        return res.status(403).json({error:'Você não tem permissão para cancelar esta corrida.'});
    }


    ride.status = -1;
    ride.events.push({data: new Date(),descricao: "Corrida cancelada pelo passageiro"});
    await ride.save();

    return res.status(200).json(ride);
}

export const driverCancel = async (req,res) => {

    const {driverId,motivo} = req.body;
    const rideId = req.params.id;

    const ride = await Ride.findById(rideId);
    
   
    if(ride.driver._id != driverId){
        return res.status(403).json({error:'Você não tem permissão para cancelar esta corrida.'});
    }


    ride.status = -2;
    ride.events.push({data: new Date(),descricao: "Corrida cancelada pelo motorista"});
    ride.motivoCancelamento = motivo;
    await ride.save();

    const newRide = await Ride.findById(rideId).populate('passenger','name avatar rating telefone').populate('driver','name avatar rating telefone pix').select('status data distancia duracao valor origem destino pagamento events veiculo');

    const wss = req.app.get("wss");
     wss.clients.forEach((client) => {
       if (client.readyState === WebSocket.OPEN) {
           if(client.id==ride.passenger._id){
               client.send(JSON.stringify(newRide));
           }
       }
     });

   return res.status(200).json(newRide);
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

    const {distancia,passengerId} = req.body;  // distancia em km por exemplo: 1.54km ou 0.95km
    
    const cf = parseFloat(process.env.PRECO_COMBUSTIVEL) / parseFloat(process.env.AUTONOMIA_POR_LITRO);


    let ridePrice = 0;


    ridePrice =  ( distancia * parseFloat(process.env.CUSTO_POR_KM) ) + parseFloat(process.env.TAXA_FIXA) + ( distancia * cf );

   console.log(ridePrice);
    
    if(ridePrice < parseFloat(process.env.VALOR_MINIMO_CORRIDA)) {

         ridePrice = process.env.VALOR_MINIMO_CORRIDA;

    }

    const data = new Date();

   console.log(data.getHours());
   

   const price = {valor:parseFloat(ridePrice)};

  
    //addLog(passengerId,'Consultou preço de uma corrida','');
    return res.status(200).json(price);



}

export const index =  async (req,res) => {

    const rides = await Ride.find({status:0}).populate('passenger','name avatar rating').populate('pagamento','nome').select('data distancia duracao valor origem destino');

    return res.status(200).json(rides);

}

export const ratePassenger = async (req,res) => {

    const rideId = req.params.id;
    const {rating} = req.body;
    const ride = await Ride.findById(rideId);
    ride.passengerRating = rating;
    await ride.save();
    const passenger = await Passenger.findById(ride.passenger);
    passenger.votes = passenger.votes + 1;
    passenger.totalRating = passenger.totalRating + rating;
    let newRating = (passenger.totalRating + rating) / (passenger.votes + 1);
    passenger.rating = parseFloat(newRating.toFixed(1));
    await passenger.save();
    return res.status(200).json(ride);

}

export const rateDriver = async (req,res) => {

    const rideId = req.params.id;
    const {rating} = req.body;
    const ride = await Ride.findById(rideId);
    ride.driverRating = rating;
    await ride.save();
    const driver = await Driver.findById(ride.driver);
    driver.votes = driver.votes + 1;
    driver.totalRating = driver.totalRating + rating;
    let newRating = (driver.totalRating + rating) / (driver.votes + 1);
    driver.rating = parseFloat(newRating.toFixed(1));
    await driver.save();
    return res.status(200).json(ride);

}

export const detailPassenger =  async (req,res) => {

    const rideId = req.params.id;
    const {passengerId} = req.body;

    try {
        const ride = await Ride.findById(rideId).populate('driver','name avatar rating').populate('pagamento','nome').select('data passenger status origem destino distancia duracao valor veiculo driverRating events');
        if(ride.passenger != passengerId)  throw 'Não autorizado';
        if(!ride) throw 'Corrida não encontrada';
        addLog(passengerId,'Acessou dados de uma corrida',rideId);
        return res.status(200).json(ride);
    } catch (error) {
        console.log(error);
        return res.status(404).json({erro:'Corrida não encontrada'});
    }

    
}

export const detailDriver =  async (req,res) => {

    const rideId = req.params.id;
    const {driverId} = req.body;

    try {
        const ride = await Ride.findById(rideId).populate('passenger','name avatar rating').populate('pagamento','nome').select('data driver status origem destino distancia duracao valor veiculo passengerRating events');
        if(ride.driver != driverId)  throw 'Não autorizado';
        if(!ride) throw 'Corrida não encontrada';
        return res.status(200).json(ride);
    } catch (error) {
        console.log(error);
        return res.status(404).json({erro:'Corrida não encontrada'});
    }

    
}


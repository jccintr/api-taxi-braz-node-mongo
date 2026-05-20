import Passenger from '../models/passenger.js';
import { calcularPrecoAcima20Km,calcularPrecoAte3Km,calcularPrecoAcima3KmAbaixo20km } from '../util/ridePrice.js';
import { addLog } from '../util/logs.js';
import Ride from '../models/ride.js';



export const price = async (req,res) => {
    const {distancia,passengerId} = req.body; 

    let adicionalNoturno = false;
    let valorAdicionalNoturno = 0;
    let valorDescontoPrimeiraCorrida = 0;
    let ridePrice = 0

    if (distancia <= 3) {
        ridePrice = calcularPrecoAte3Km(distancia);
    }

    if (distancia > 3 && distancia < 20) {
        ridePrice = calcularPrecoAcima3KmAbaixo20km(distancia);
    }
    
     if (distancia >= 20) {
        ridePrice = calcularPrecoAcima20Km(distancia);
    }

    

     // se for entre 22h e 5h59min, acrescimo de 20%
    const time = new Date().toLocaleTimeString("pt-BR",{timeZone: "America/Sao_Paulo"});
    const hora = parseInt(time.split(':')[0]);

    if(hora > 21 || hora < 6) {
        ridePrice = ridePrice * 1.2;
        adicionalNoturno = true;
        valorAdicionalNoturno = ridePrice * 0.2;
    }

     ridePrice = Math.round(ridePrice,2);

    // verifica se é a primeira corrida do passageiro, se for, aplica 20% de desconto
    const totalRidesFinished = await Ride.countDocuments({
        passenger: passengerId,
        status: 5
    });
    
    if(totalRidesFinished == 0) {
        ridePrice = ridePrice * 0.8;
        valorDescontoPrimeiraCorrida = ridePrice * 0.2;
    }

    const valorTotalCorrida = ridePrice + valorAdicionalNoturno - valorDescontoPrimeiraCorrida;
    const valorIntegralCorrida = ridePrice + valorAdicionalNoturno;
    ridePrice = Math.round(valorTotalCorrida,2);
        
     const price = {
            valor:parseFloat(ridePrice),
            valorIntegral: parseFloat(valorIntegralCorrida),
            distancia:distancia,
            adicionalNoturno: adicionalNoturno,
            valorAdicionalNoturno: valorAdicionalNoturno,
            descontoPrimeiraCorrida: totalRidesFinished == 0 ? true : false,
            valorDescontoPrimeiraCorrida: valorDescontoPrimeiraCorrida
    };

    addLog(passengerId,'Consultou preço de uma corrida',distancia.toFixed(2) + 'km $'+parseFloat(ridePrice).toFixed(2));
    return res.status(200).json(price);
}
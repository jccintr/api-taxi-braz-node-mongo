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
        console.log('Calculando preço para distância até 3km');
        ridePrice = calcularPrecoAte3Km(distancia);
        console.log('Preço calculado para distância até 3km:', ridePrice);
    } else if (distancia > 3 && distancia < 20) {
         console.log('Calculando preço para distância entre 3km e 20km');
        ridePrice = calcularPrecoAcima3KmAbaixo20km(distancia);
        console.log('Preço calculado para distância entre 3km e 20km:', ridePrice);
    } else if (distancia >= 20) {
        console.log('Calculando preço para distância acima de 20km');
        ridePrice = calcularPrecoAcima20Km(distancia);
        console.log('Preço calculado para distância acima de 20km:', ridePrice);
    }

    if (distancia > 3 && distancia < 20) {
      
    }
    
     if (distancia >= 20) {
        
    }

    

     // se for entre 22h e 5h59min, acrescimo de 20%
    const time = new Date().toLocaleTimeString("pt-BR",{timeZone: "America/Sao_Paulo"});
    const hora = parseInt(time.split(':')[0]);

    if(hora > 21 || hora < 6) {
        console.log('Aplicando acréscimo noturno');
        ridePrice = ridePrice * 1.2;
        adicionalNoturno = true;
        valorAdicionalNoturno = ridePrice * 0.2;
    }

     ridePrice = Math.round(ridePrice,2);
     const totalRidesFinished = 10;
     /*
    // verifica se é a primeira corrida do passageiro, se for, aplica 20% de desconto
    const totalRidesFinished = await Ride.countDocuments({
        passenger: passengerId,
        status: 5
    });
    
    if(totalRidesFinished == 0) {
        console.log('Aplicando desconto para primeira corrida');
        ridePrice = ridePrice * 0.8;
        valorDescontoPrimeiraCorrida = ridePrice * 0.2;
    }
*/
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

    console.log('Preço da corrida calculado:', price);
    addLog(passengerId,'Consultou preço de uma corrida',distancia.toFixed(2) + 'km $'+parseFloat(ridePrice).toFixed(2));
    return res.status(200).json(price);
}
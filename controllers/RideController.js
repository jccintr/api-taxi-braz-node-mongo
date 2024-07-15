import Ride from '../models/ride.js';
import User from '../models/user.js';


export const store = async (req,res) => {


    const {userId,origem,destino,duracao,distancia,valor} = req.body;

    //const user = await User.findById(userId).select('name telefone');
    const newRide = new Ride({passageiro:userId,origem,destino,duracao,distancia,valor});
   // newRide.user = user;
    await newRide.save();
   
    return res.status(201).json(newRide);

}
import bcryptjs from 'bcryptjs';
import jsonwebtoken from 'jsonwebtoken';
import Passenger from '../models/passenger.js';
import Ride from '../models/ride.js';


    export const login =  async (req,res) => {

        const {email,password} = req.body;

        if(!email || !password || email == '' || password == ''){
            return res.status(400).json({error: 'Campos obrigatórios não informados.'});
        }

        const passenger = await Passenger.findOne({ email }).select('name email telefone password avatar doc emailVerifiedAt');

    if(!passenger){
        return res.status(400).json({error:'Nome de usuário e ou senha inválidos.'});
    }

    if(!bcryptjs.compareSync(password,passenger.password)){
        return res.status(400).json({error:'Nome de usuário e ou senha inválidos.'});
        }

        const token = jsonwebtoken.sign({passengerId: passenger._id},process.env.JWT_SECRET);
       

        const { password:p, ...rest } = passenger._doc;
        const ret = {...rest,token};
        return res.status(200).json(ret);
    }


    export const store = async (req,res) => {
   
      const {name,email,password,telefone,doc} = req.body;

       

        if(!name || !email || !password || !telefone || !doc || name=='' || email == '' || password == '' || telefone =='' || doc ==''){
            return res.status(400).json({error: 'Campos obrigatórios não informados.'});
        }

        const validateEmailRegex = /^\S+@\S+\.\S+$/;
        if(!validateEmailRegex.test(email)){
            return res.status(400).json({error: 'Email inválido.'});
        }

       
        const passenger = await Passenger.findOne({email});
        
        if (passenger){
            return res.status(400).json({error: 'Email já cadastrado.'});
        }

        const salt = bcryptjs.genSaltSync(10);
        const password_hash = bcryptjs.hashSync(password,salt);
        //cria o codigo de verificacao do email
        const  strRandomNumber = Math.random().toString();
        const emailVerificationCode = strRandomNumber.substring(strRandomNumber.length-6);
       
        const newPassenger = new Passenger({name,email,password:password_hash,telefone,doc,emailVerificationCode});
        await newPassenger.save();
       // const { password:p, ...rest } = newPassenger._doc;
        return res.status(201).json({mensagem:'Conta criada com sucesso.'});
       

    }

    export const validateToken  = async (req,res) => {

        const {passengerId} = req.body;
       
    
       const passenger = await Passenger.findById(passengerId).select('name email telefone avatar doc emailVerifiedAt');
    
       if (!passenger) {
         return res.status(404).json({error: 'Usuário não encontrado.'});
       }

       return res.status(200).json(passenger);
    }


    export const update  = async (req,res) => {

        const {passengerId,name,telefone,avatar} = req.body;

        if(!name || !telefone ||  name=='' || telefone ==''){
            return res.status(400).json({error: 'Campos obrigatórios não informados.'});
        }

      const updatedPassenger = await Passenger.findByIdAndUpdate(passengerId,{name,telefone,avatar},{new:true}).select('name email telefone avatar doc');
       if (!updatedPassenger) {
         return res.status(404).json({error: 'Usuário não encontrado.'});
       }

       return res.status(200).json(updatedPassenger);
    }

    export const passengerRides = async (req,res) => {

        const {passengerId} = req.body;
    
        const rides = await Ride.find({passenger:passengerId}).select('data status origem destino');
    
    
        return res.status(200).json(rides);
    
    }

    export const verifyEmail = async (req,res) => {

        const {passengerId,code} = req.body;
       
        const passenger = await Passenger.findById(passengerId).select('name email telefone avatar doc emailVerificationCode emailVerifiedAt');
        
        if(passenger.emailVerificationCode==code){

            passenger.emailVerifiedAt = new Date();
            await passenger.save();
            return res.status(200).json(passenger);

        } else {
            return res.status(401).json({error:'Código de verificação inválido.'});
        }
    
      
    
    }
    
    
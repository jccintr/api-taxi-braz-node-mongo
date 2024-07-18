import bcryptjs from 'bcryptjs';
import jsonwebtoken from 'jsonwebtoken';
import Passenger from '../models/passenger.js';


    export const login =  async (req,res) => {

        const {email,password} = req.body;

        if(!email || !password || email == '' || password == ''){
            return res.status(400).json({error: 'Campos obrigatórios não informados.'});
        }

        const passenger = await Passenger.findOne({ email }).select('name email telefone password avatar doc');

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
        const newPassenger = new Passenger({name,email,password:password_hash,telefone,doc});
        await newPassenger.save();
        const { password:p, ...rest } = newPassenger._doc;
        return res.status(201).json(rest);
       

    }

    export const validateToken  = async (req,res) => {

        const {passengerId} = req.body;
       
    
       const passenger = await Passenger.findById(passengerId).select('name email telefone avatar doc');
    
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
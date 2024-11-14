import bcryptjs from 'bcryptjs';
import jsonwebtoken from 'jsonwebtoken';
import Passenger from '../models/passenger.js';
import Ride from '../models/ride.js';
import { sendVerificationEmail,sendResetPasswordEmail } from '../util/sendEmail.js';
import { addLog } from '../util/logs.js';


    export const login =  async (req,res) => {

        const {email,password} = req.body;

        if(!email || !password || email == '' || password == ''){
            return res.status(400).json({error: 'Campos obrigatórios não informados.'});
        }

        const passenger = await Passenger.findOne({ email }).select('name email telefone password avatar doc ativo emailVerifiedAt');

    if(!passenger){
        return res.status(400).json({error:'Nome de usuário e ou senha inválidos.'});
    }

    if(!passenger.ativo){
        return res.status(400).json({error:'Nome de usuário e ou senha inválidos.'});
    }

    if(!bcryptjs.compareSync(password,passenger.password)){
        return res.status(400).json({error:'Nome de usuário e ou senha inválidos.'});
        }

        const token = jsonwebtoken.sign({passengerId: passenger._id},process.env.JWT_SECRET);
        const { password:p, ...rest } = passenger._doc;
        const ret = {...rest,token};
        addLog(passenger._id,'Login pela tela Login','');
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
        // para bloquear novos cadastros
        return res.status(400).json({error: 'Campos obrigatórios não informados.'});

        const salt = bcryptjs.genSaltSync(10);
        const password_hash = bcryptjs.hashSync(password,salt);
       
        const emailVerificationCode = generateVerificationCode();

        const newPassenger = new Passenger({name,email,password:password_hash,telefone,doc,emailVerificationCode});
        await newPassenger.save();
        sendVerificationEmail(newPassenger.email,emailVerificationCode);
       
        // const { password:p, ...rest } = newPassenger._doc;
        return res.status(201).json({mensagem:'Conta criada com sucesso.'});
       

    }

    export const validateToken  = async (req,res) => {

        const {passengerId} = req.body;
       
    
       const passenger = await Passenger.findById(passengerId).select('name email telefone avatar doc ativo emailVerifiedAt');
    
       if (!passenger) {
         return res.status(404).json({error: 'Usuário não encontrado.'});
       }

       if (!passenger.ativo) {
        return res.status(404).json({error: 'Usuário não encontrado.'});
      }
       addLog(passenger._id,'Login pela tela Preload','');
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
    
        const rides = await Ride.find({passenger:passengerId}).select('data status origem destino').sort({data: 'desc'});
           
        return res.status(200).json(rides);
    
    }

    export const sendVerifyEmail = async (req,res) => {
        const {passengerId} = req.body;

        // pesquisar pelo pax
        const passenger = await Passenger.findById(passengerId).select('email emailVerificationCode');
        // gerar novo codigo (criar funcao para isto)
        const emailVerificationCode = generateVerificationCode();
        //salvar no bd
        passenger.emailVerificationCode = emailVerificationCode;
        await passenger.save();
        //enviar o email com o codigo (criar funcao para isto)
        sendVerificationEmail(passenger.email,emailVerificationCode);
       
        return res.status(200).json({mensagem:'Código de verificação enviado com sucesso.'});
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

    export const requestEmailPassword = async (req,res) => {

        const {email} = req.body;

        const passenger = await Passenger.findOne({ email }).select('name resetPasswordCode');

        if(!passenger){
            return res.status(404).json({error:'Registro não encontrado.'});
        }
        
        const resetPasswordCode = generateVerificationCode();
        passenger.resetPasswordCode = resetPasswordCode;
        await passenger.save();
        sendResetPasswordEmail(email,resetPasswordCode);
        
        return res.status(200).json({mensagem:'Solicitação de alteração de senha recebida.'});
    }

    export const resetPassword = async (req,res) => {

        const {email,code,password} = req.body;

        const passenger = await Passenger.findOne({ email }).select('resetPasswordCode password');

        if(!passenger){
            return res.status(404).json({mensagem:'Passageiro não encontrado.'});
        }
        if(passenger.resetPasswordCode!==code){
            return res.status(400).json({mensagem:'Código de verificação inválido.'});
        }

        const salt = bcryptjs.genSaltSync(10);
        const password_hash = bcryptjs.hashSync(password,salt);
        passenger.password = password_hash;
        passenger.resetPasswordCode = null;
        await passenger.save();

        return res.status(200).json({mensagem:'Senha alterada com sucesso.'});


    }

    const generateVerificationCode = () => {

        const  strRandomNumber = Math.random().toString();
        return strRandomNumber.substring(strRandomNumber.length-6);

    }
    
    
    
import Driver from '../models/driver.js';
import Ride from '../models/ride.js';
import bcryptjs from 'bcryptjs';
import jsonwebtoken from 'jsonwebtoken';
import { sendResetPasswordEmail } from '../util/sendEmail.js';


export const store = async (req,res) => {
   
    const {name,email,password,telefone,doc,veiculo,pix} = req.body;


      if(!name || !email || !password || !telefone  || !doc || name=='' || email == '' || password == '' || telefone =='' || doc ==''){
          return res.status(400).json({error: 'Campos obrigatórios não informados.'});
      }

      const validateEmailRegex = /^\S+@\S+\.\S+$/;
      if(!validateEmailRegex.test(email)){
          return res.status(400).json({error: 'Email inválido.'});
      }

     
      const driver = await Driver.findOne({email});
      
      if (driver){
          return res.status(400).json({error: 'Email já cadastrado.'});
      }

      const salt = bcryptjs.genSaltSync(10);
      const password_hash = bcryptjs.hashSync(password,salt);
      const newDriver = new Driver({name,email,password:password_hash,telefone,doc,veiculo,pix});
      await newDriver.save();
      const { password:p, ...rest } = newDriver._doc;
      return res.status(201).json(rest);
     

  }


  export const login =  async (req,res) => {

    const {email,password} = req.body;

    

    if(!email || !password || email == '' || password == ''){
        return res.status(400).json({error: 'Campos obrigatórios não informados.'});
    }

    const driver = await Driver.findOne({ email }).select('name email telefone avatar veiculo online password doc pix');

if(!driver){
    return res.status(400).json({error:'Nome de usuário e ou senha inválidos.'});
}

if(!bcryptjs.compareSync(password,driver.password)){
    return res.status(400).json({error:'Nome de usuário e ou senha inválidos.'});
    }

    const token = jsonwebtoken.sign({driverId: driver._id},process.env.JWT_SECRET);
   
    const { password:p, ...rest } = driver._doc;
    const ret = {...rest,token};
    return res.status(200).json(ret);
}

export const setStatus =  async (req,res) => {

    const {driverId,online} = req.body;

    const updatedDriver = await Driver.findByIdAndUpdate(driverId,{online},{new:true});
       
    if(!updatedDriver){
        return res.status(404).json({message: "Driver não encontrado"});
    } else {
        return res.status(200).json({message:"Driver status updated"});
    }

}

export const updateLocation =  async (req,res) => {

   
    const {driverId,position} = req.body;
 

  const updatedLocation = await Driver.findByIdAndUpdate(driverId,{position,online:true});
       
  if(!updatedLocation){
      return res.status(404).json({message: "Driver não encontrado"});
  } else {

    const rides = await Ride.find({status:0}).populate('passenger','name avatar rating').populate('pagamento','nome').select('data distancia duracao valor origem destino');
    return res.status(200).json(rides);
    //  return res.status(200).json({message:"Location updated"});
  }

}

export const getLocation =  async (req,res) => {

    const drivers = await Driver.find({online:true}).select('name telefone veiculo position');


    return res.status(200).json(drivers);


}

export const validateToken  = async (req,res) => {

    const {driverId} = req.body;
   

   const driver = await Driver.findById(driverId).select('name email telefone avatar veiculo online doc pix');

   if (!driver) {
    return res.status(404).json({error: 'Usuário não encontrado.'});
  }

   return res.status(200).json(driver);
}

export const storePushToken =  async (req,res) => {

    const {driverId,pushToken} = req.body;


    const updatedDriver = await Driver.findByIdAndUpdate(driverId,{pushToken},{new:true});
    
    if(!updatedDriver){
        return res.status(404).json({mensagem: 'Falha ao atualizar push token.'});
    }
    return res.status(200).json({mensagem: 'Push Token Atualizado'});
 
}

export const update  = async (req,res) => {

    const {driverId,name,telefone,avatar} = req.body;

    if(!name || !telefone ||  name=='' || telefone ==''){
        return res.status(400).json({error: 'Campos obrigatórios não informados.'});
    }

  const updatedDriver = await Driver.findByIdAndUpdate(driverId,{name,telefone,avatar},{new:true}).select('name email telefone avatar veiculo online doc pix');
   if (!updatedDriver) {
     return res.status(404).json({error: 'Motorista não encontrado.'});
   }

   return res.status(200).json(updatedDriver);
}

export const updatePix  = async (req,res) => {

    const {driverId,favorecido,chave} = req.body;

    if(!favorecido || !chave ||  favorecido=='' || chave ==''){
        return res.status(400).json({error: 'Campos obrigatórios não informados.'});
    }
    const pix = {favorecido,chave};
    const updatedDriver = await Driver.findByIdAndUpdate(driverId,{pix},{new:true}).select('name email telefone avatar veiculo online doc pix');
    if (!updatedDriver) {
        return res.status(404).json({error: 'Motorista não encontrado.'});
      }
   
      return res.status(200).json(updatedDriver);


}

export const updateVeiculo  = async (req,res) => {

    const {driverId,modelo,cor,placa} = req.body;

    if(!modelo || !cor || !placa || modelo=='' || cor =='' || placa ==''){
        return res.status(400).json({error: 'Campos obrigatórios não informados.'});
    }

    const veiculo = {modelo,cor,placa};

    const updatedDriver = await Driver.findByIdAndUpdate(driverId,{veiculo},{new:true}).select('name email telefone avatar veiculo online doc pix');
    if (!updatedDriver) {
        return res.status(404).json({error: 'Motorista não encontrado.'});
      }
   
      return res.status(200).json(updatedDriver);


}

export const driverRides = async (req,res) => {

    const {driverId} = req.body;

    const rides = await Ride.find({driver:driverId}).select('data status origem destino');


    return res.status(200).json(rides);

}

export const requestEmailPassword = async (req,res) => {

    const {email} = req.body;

    const driver = await Driver.findOne({ email }).select('name resetPasswordCode');

    if(!driver){
        return res.status(404).json({error:'Registro não encontrado.'});
    }
    
    const resetPasswordCode = generateVerificationCode();
    driver.resetPasswordCode = resetPasswordCode;
    await driver.save();
    sendResetPasswordEmail(email,resetPasswordCode);
    
    return res.status(200).json({mensagem:'Solicitação de alteração de senha recebida.'});
}

export const resetPassword = async (req,res) => {

    const {email,code,password} = req.body;

    const driver = await Driver.findOne({ email }).select('resetPasswordCode password');

    if(!driver){
        return res.status(404).json({mensagem:'Motorista não encontrado.'});
    }
    if(driver.resetPasswordCode!==code){
        return res.status(400).json({mensagem:'Código de verificação inválido.'});
    }

    const salt = bcryptjs.genSaltSync(10);
    const password_hash = bcryptjs.hashSync(password,salt);
    driver.password = password_hash;
    driver.resetPasswordCode = null;
    await driver.save();

    return res.status(200).json({mensagem:'Senha alterada com sucesso.'});


}

const generateVerificationCode = () => {

    const  strRandomNumber = Math.random().toString();
    return strRandomNumber.substring(strRandomNumber.length-6);

}


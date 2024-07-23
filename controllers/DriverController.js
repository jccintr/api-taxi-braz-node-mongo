import Driver from '../models/driver.js';
import bcryptjs from 'bcryptjs';
import jsonwebtoken from 'jsonwebtoken';


export const store = async (req,res) => {
   
    const {name,email,password,telefone,doc,veiculo,pix} = req.body;

      console.log(req.body);

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

    const driver = await Driver.findOne({ email }).select('name veiculo password online');

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
      return res.status(200).json({message:"Location updated"});
  }

}

export const getLocation =  async (req,res) => {

    const drivers = await Driver.find({online:true}).select('name telefone veiculo position');


    return res.status(200).json(drivers);


}

export const validateToken  = async (req,res) => {

    const {driverId} = req.body;
   

   const driver = await Driver.findById(driverId).select('name veiculo online');

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


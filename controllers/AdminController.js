import bcryptjs from 'bcryptjs';
import jsonwebtoken from 'jsonwebtoken';
import Admin from '../models/admin.js';
import Passenger from '../models/passenger.js';
import Driver from '../models/driver.js';
import PassengerLog from '../models/passengerLog.js';


export const login =  async (req,res) => {

    const {email,password} = req.body;

    if(!email || !password || email == '' || password == ''){
        return res.status(400).json({error: 'Campos obrigatórios não informados.'});
    }

    const admin = await Admin.findOne({ email }).select('name email password');

if(!admin){
    return res.status(400).json({error:'Nome de usuário e ou senha inválidos.'});
}


if(!bcryptjs.compareSync(password,admin.password)){
    return res.status(400).json({error:'Nome de usuário e ou senha inválidos.'});
    }

    const token = jsonwebtoken.sign({adminId: admin._id},process.env.JWT_SECRET);
   

    const { password:p, ...rest } = admin._doc;
    const ret = {...rest,token};
    return res.status(200).json(ret);
}



export const store = async (req,res) => {
   
    const {name,email,password} = req.body;

    

      if(!name || !email || !password  || name=='' || email == '' || password == '' ){
          return res.status(400).json({error: 'Campos obrigatórios não informados.'});
      }

      const validateEmailRegex = /^\S+@\S+\.\S+$/;
      if(!validateEmailRegex.test(email)){
          return res.status(400).json({error: 'Email inválido.'});
      }

     
      const admin = await Admin.findOne({email});
      
      if (admin){
          return res.status(400).json({error: 'Email já cadastrado.'});
      }
     
      const salt = bcryptjs.genSaltSync(10);
      const password_hash = bcryptjs.hashSync(password,salt);
     
      const newAdmin = new Admin({name,email,password:password_hash});
      await newAdmin.save();
     
     
      // const { password:p, ...rest } = newPassenger._doc;
      return res.status(201).json({mensagem:'Conta de Administrador criada com sucesso.'});
     

  }

  export const storeDriver = async (req,res) => {
   
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


  export const passengers = async (req,res) => {

    const passengers = await Passenger.find().select('name avatar rating').sort({name: 'asc'});
           
    return res.status(200).json(passengers);

  }

  export const drivers = async (req,res) => {

    const drivers = await Driver.find().select('name avatar rating').sort({name: 'asc'});
           
    return res.status(200).json(drivers);

  }

  export const showDriver = async (req,res) => {

    const driverId = req.params.id;
    const driver = await Driver.findById(driverId).select('name email telefone doc veiculo pix ativo rating avatar');
           
    return res.status(200).json(driver);

  }

  export const updateDriver  = async (req,res) => {
    const driverId = req.params.id;
    const {name,telefone,doc,veiculo,pix,ativo} = req.body;

    if(!name || !telefone ||  name=='' || telefone ==''){
        return res.status(400).json({error: 'Campos obrigatórios não informados.'});
    }

  const driver = await Driver.findByIdAndUpdate(driverId,{name,telefone,doc,veiculo,pix,ativo},{new:true}).select('name');
   if (!driver) {
     return res.status(404).json({error: 'Motorista não encontrado.'});
   }

   return res.status(200).json({mensagem:'Motorista alterado com sucesso.'});
}

export const showPassenger = async (req,res) => {

    const passengerId = req.params.id;
    const passenger = await Passenger.findById(passengerId).select('name email telefone doc ativo rating avatar');
           
    return res.status(200).json(passenger);

  }

  export const updatePassenger  = async (req,res) => {
    const passengerId = req.params.id;
    const {name,telefone,doc,ativo} = req.body;

    if(!name || !telefone ||  name=='' || telefone ==''){
        return res.status(400).json({error: 'Campos obrigatórios não informados.'});
    }

  const passenger = await Passenger.findByIdAndUpdate(passengerId,{name,telefone,doc,ativo},{new:true}).select('name');
   if (!passenger) {
     return res.status(404).json({error: 'Passageiro não encontrado.'});
   }

   return res.status(200).json({mensagem:'Passageiro alterado com sucesso.'});
}

export const passengerLogs  = async (req,res) => {

  const logs = await PassengerLog.find().populate('passenger','name avatar').select('data passenger action info').sort({data: 'desc'});

  return res.status(200).json(logs);
}

  
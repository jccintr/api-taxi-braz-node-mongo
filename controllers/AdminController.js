import bcryptjs from 'bcryptjs';
import jsonwebtoken from 'jsonwebtoken';
import Admin from '../models/admin.js';
import Passenger from '../models/passenger.js';
import Driver from '../models/driver.js';
import Ride from '../models/ride.js';
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

    const token = jsonwebtoken.sign({adminId: admin._id},process.env.JWT_SECRET_ADMIN);
   

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

    const passengers = await Passenger.find().select('name avatar rating email telefone').sort({name: 'asc'});
           
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

export const getAllRides  = async (req,res) => {
   const page = req.query.page * 1 || 1;
   const pageSize = 10;
   const skip = ( page - 1 ) * pageSize;
   const totalDocuments = await Ride.countDocuments({status: 5});
   const pages = Math.ceil(totalDocuments / pageSize);


  const rides = await Ride.find({status: 5}).populate('passenger','name avatar').populate('driver','name avatar').select('data passenger driver status valor').sort({data: 'desc'}).skip(skip).limit(pageSize);
    
  return res.status(200).json({
    pages: pages,
    data: rides
  });

}

export const getCancelledRides  = async (req,res) => {
   const page = req.query.page * 1 || 1;
   const pageSize = 10;
   const skip = ( page - 1 ) * pageSize;
   const totalDocuments = await Ride.countDocuments({status: -2});
   const pages = Math.ceil(totalDocuments / pageSize);

  const cancelledRides = await Ride.find({status: -2}).populate('passenger','name avatar').populate('driver','name avatar').select('data passenger driver valor').sort({data: 'desc'}).skip(skip).limit(pageSize);
  
  return res.status(200).json({
    pages: pages,
    data: cancelledRides
  });

}

export const getSolicitedRides  = async (req,res) => {
  const page = req.query.page * 1 || 1;
  const pageSize = 10;
  const skip = ( page - 1 ) * pageSize;
  const totalDocuments = await Ride.countDocuments({status: -1});
  const pages = Math.ceil(totalDocuments / pageSize);

  const solicitedRides = await Ride.find({status: -1}).populate('passenger','name avatar').populate('driver','name avatar').select('data passenger driver valor').sort({data: 'desc'}).skip(skip).limit(pageSize);
  
  return res.status(200).json({
    pages: pages,
    data: solicitedRides
  });

}

export const getRideDetail  = async (req,res) => {
  
  const rideId = req.params.id;

  const ride = await Ride.findById(rideId).populate('passenger','name avatar rating').populate('driver','name avatar rating').populate('pagamento','nome').select('data driver status origem destino distancia duracao valor valorPlataforma veiculo passengerRating driverRating events motivoCancelamento');
      

  return res.status(200).json(ride);

}

export const getDashboardData  = async (req,res) => {

  const registeredPassengers = await Passenger.countDocuments();
  const registeredDrivers = await Driver.countDocuments();
  const driversOnline = await Driver.countDocuments({online:true});
  const solicitedRides = await Ride.countDocuments({status: -1});
  const cancelledRides = await Ride.countDocuments({status: -2});
  const completedRides = await Ride.countDocuments({status: 5});

  
  const completedRidesPerDayTotalValue = await valorTotalCorridasPorDia();
  const completedRidesPerWeekTotalValue = await valorTotalCorridasPorSemana();
   const completedRidesPerMonthTotalValue = await valorTotalCorridasPorMes();



  const dashboard = {
    registeredPassengers,
    registeredDrivers,
    driversOnline,
    solicitedRides,
    cancelledRides,
    completedRides,
    completedRidesPerDayTotalValue,
    completedRidesPerWeekTotalValue,
    completedRidesPerMonthTotalValue
  };

  return res.status(200).json(dashboard);

}



async function valorTotalCorridasPorDia() {
  // Define o início do dia atual (00:00:00) no fuso local (-03)
  const inicioDoDia = new Date();
  inicioDoDia.setHours(0, 0, 0, 0);

  // Define o fim do dia atual (23:59:59.999)
  const fimDoDia = new Date();
  fimDoDia.setHours(23, 59, 59, 999);

  const resultado = await Ride.aggregate([
    {
      $match: {
        data: { $gte: inicioDoDia, $lt: fimDoDia },
        status: 5  // corridas concluidas
      }
    },
    {
      $group: {
        _id: null,
        totalValor: { $sum: "$valor" }
      }
    }
  ]);

  const total = resultado.length > 0 ? resultado[0].totalValor : 0;

  return total;
}

async function valorTotalCorridasPorSemana() {
  const hoje = new Date();

  // Garante que estamos no fuso horário local (Brasil -03)
  const diaDaSemana = hoje.getDay(); // 0 = domingo, 1 = segunda, ..., 6 = sábado
  const diffParaSegunda = diaDaSemana === 0 ? -6 : 1 - diaDaSemana; // Se for domingo, volta 6 dias

  // Início da semana: segunda-feira 00:00:00
  const inicioSemana = new Date(hoje);
  inicioSemana.setDate(hoje.getDate() + diffParaSegunda);
  inicioSemana.setHours(0, 0, 0, 0);

  // Fim da semana: domingo 23:59:59.999
  const fimSemana = new Date(inicioSemana);
  fimSemana.setDate(inicioSemana.getDate() + 6);
  fimSemana.setHours(23, 59, 59, 999);

  const resultado = await Ride.aggregate([
    {
      $match: {
        data: { $gte: inicioSemana, $lte: fimSemana }, // inclui o domingo
        status: 5
      }
    },
    {
      $group: {
        _id: null,
        totalValor: { $sum: "$valor" }
      }
    }
  ]);

  const total = resultado.length > 0 ? resultado[0].totalValor : 0;
  
  return total;
}

async function valorTotalCorridasPorMes() {
  const hoje = new Date();

  // Início do mês atual: dia 1 às 00:00:00
  const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
  inicioMes.setHours(0, 0, 0, 0);

  // Fim do mês atual: último dia do mês às 23:59:59.999
  const fimMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0); // dia 0 = último do mês anterior
  fimMes.setHours(23, 59, 59, 999);

  const resultado = await Ride.aggregate([
    {
      $match: {
        data: { $gte: inicioMes, $lte: fimMes },
        status: 5
      }
    },
    {
      $group: {
        _id: null,
        totalValor: { $sum: "$valor" }
      }
    }
  ]);

  const total = resultado.length > 0 ? resultado[0].totalValor : 0;
 
  return total;
}



  
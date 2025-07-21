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

    const token = jsonwebtoken.sign({driverId: driver._id},process.env.JWT_SECRET_DRIVER);
   
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

    const rides = await Ride.find({driver:driverId}).select('data status origem destino').sort({data: 'desc'});


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

export const getGanhos =  async (req,res) => {
    
    const {driverId,data} = req.body;
    const dtHoje = new Date(data);
    const startSufix = 'T00:00:00.000Z';
    const endSufix = 'T23:59:59.000Z';

    let dia = dtHoje.getDate();
    if (dia<10){
        dia = '0'+dia;
    }
    const strData = dtHoje.getFullYear()+'-'+(dtHoje.getMonth()+1)+'-'+dia;//dtHoje.getDate();

    
    const todayRides = await Ride.find({driver:driverId,status:5,data: { $gte: strData+startSufix, $lte: strData+endSufix }}).select('data valorDriver');
    const todayTotal = todayRides.reduce( (n,{valorDriver}) => n + valorDriver,0)

    const lastMonday = getMonday(data);
    const strMonday = lastMonday.getFullYear()+'-'+(lastMonday.getMonth()+1)+'-'+lastMonday.getDate();
    const weekRides = await Ride.find({driver:driverId,status:5,data: { $gte: strMonday+startSufix, $lte: strData+endSufix }}).select('data valorDriver');
    const totalweek = weekRides.reduce( (n,{valorDriver}) => n + valorDriver,0)

    const firstDayMonth = dtHoje.getFullYear()+'-'+(dtHoje.getMonth()+1)+'-01';
    const monthRides = await Ride.find({driver:driverId,status:5,data: { $gte: firstDayMonth+startSufix, $lte: strData+endSufix }}).select('data valorDriver');
    const totalMonth = monthRides.reduce( (n,{valorDriver}) => n + valorDriver,0)
   

    const hoje = {valor:todayTotal,corridas:todayRides.length};
    const semana = {valor:totalweek,corridas:weekRides.length};
    const mes = {valor:totalMonth,corridas:monthRides.length};

    
    return res.status(200).json({hoje,semana,mes});
}

export const getGanhos2 = async (req, res) => {
  try {
    const { driverId } = req.body;
    const dtHoje = new Date();

    // Formatar a data com dois dígitos para mês e dia
    const day = String(dtHoje.getDate()).padStart(2, '0');
    const month = String(dtHoje.getMonth() + 1).padStart(2, '0'); // +1 porque meses começam em 0
    const year = dtHoje.getFullYear();

    // Criar objetos Date diretamente
    const strStart = `${year}-${month}-${day}T00:00:00.000Z`;
    const strEnd =  `${year}-${month}-${day}T23:59:59.999Z`;
    const startOfDay = new Date(strStart);
    const endOfDay = new Date(strEnd);

    // Consultar corridas do dia
    const todayRides = await Ride.find({
      driver: driverId,
      status: 5,
      data: { $gte: startOfDay, $lte: endOfDay },
    }).select('data valorDriver');
    const todayTotal = todayRides.reduce((n, { valorDriver }) => n + valorDriver, 0);

    // Obter a última segunda-feira
    const lastMonday = getMonday(dtHoje);
    const startOfWeek = new Date(lastMonday.getFullYear(), lastMonday.getMonth(), lastMonday.getDate(), 0, 0, 0);

    // Consultar corridas da semana
    const weekRides = await Ride.find({
      driver: driverId,
      status: 5,
      data: { $gte: startOfWeek, $lte: endOfDay },
    }).select('data valorDriver');
    const totalWeek = weekRides.reduce((n, { valorDriver }) => n + valorDriver, 0);

    // Primeiro dia do mês
    const startOfMonth = new Date(year, dtHoje.getMonth(), 1, 0, 0, 0);

    // Consultar corridas do mês
    const monthRides = await Ride.find({
      driver: driverId,
      status: 5,
      data: { $gte: startOfMonth, $lte: endOfDay },
    }).select('data valorDriver');
    const totalMonth = monthRides.reduce((n, { valorDriver }) => n + valorDriver, 0);

    // Retornar resultados
    const hoje = { valor: todayTotal, corridas: todayRides.length };
    const semana = { valor: totalWeek, corridas: weekRides.length };
    const mes2 = { valor: totalMonth, corridas: monthRides.length };

    return res.status(200).json({ hoje, semana, mes2 });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao buscar ganhos', error });
  }
};


function getMonday(d) {

     d = new Date(d); 
     var day = d.getDay(), diff = d.getDate() - day + (day == 0 ? -6 : 1); 
     // adjust when day is sunday
      return new Date(d.setDate(diff));
     } 
     



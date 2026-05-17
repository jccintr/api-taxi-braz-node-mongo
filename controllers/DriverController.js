import Driver from '../models/driver.js';
import Ride from '../models/ride.js';
import bcryptjs from 'bcryptjs';
import jsonwebtoken from 'jsonwebtoken';
import { sendResetPasswordEmail } from '../util/sendEmail.js';
import { addDriverLog } from '../util/logs.js';


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
    addDriverLog(driver._id,'Login pela tela Login','');
    return res.status(200).json(ret);
}

/*
export const setStatus =  async (req,res) => {

    const {driverId,online} = req.body;

    const updatedDriver = await Driver.findByIdAndUpdate(driverId,{online},{new:true});
       
    if(!updatedDriver){
        return res.status(404).json({message: "Driver não encontrado"});
    } else {
        return res.status(200).json({online:updatedDriver.online,message:"Driver status updated"});
    }

}

*/
export const setStatus =  async (req,res) => {

    const {driverId,online} = req.body;

    const driver = await Driver.findById(driverId);

    if(!driver){
        return res.status(404).json({message: "Driver não encontrado"});
    }

    driver.online = !driver.online;
    const updatedDriver = await driver.save();

    return res.status(200).json({online:updatedDriver.online,message:"Driver status updated"});
  
}




/*
export const updateLocation =  async (req,res) => {
  
  const {driverId,position} = req.body;
  console.log('Driver Position request=>',position);
  const updatedLocation = await Driver.findByIdAndUpdate(driverId,{position,online:true});
       
  if(!updatedLocation){
      return res.status(404).json({message: "Driver não encontrado"});
  } 

    const rides = await Ride.find({status:0}).populate('passenger','name avatar rating').populate('pagamento','nome').select('data distancia duracao valor origem destino');
    return res.status(200).json(rides);
 
  

}
*/
export const getLocation =  async (req,res) => {

    const drivers = await Driver.find({online:true}).select('name avatar telefone veiculo position').sort({ name: 1 });;


    return res.status(200).json(drivers);


}

export const validateToken  = async (req,res) => {

    const {driverId} = req.body;
   

   const driver = await Driver.findById(driverId).select('name email telefone avatar veiculo online doc pix');

   if (!driver) {
    return res.status(404).json({error: 'Usuário não encontrado.'});
  }
   addDriverLog(driver._id,'Login pela tela Preload','');
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
    const mes = { valor: totalMonth, corridas: monthRides.length };

    return res.status(200).json({ hoje, semana, mes });
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

// Distância entre dois pontos (Haversine)
function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Raio da Terra em km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}


// Define quantos motoristas mais próximos podem ver a corrida
function getMaxVisiblePosition(elapsedSeconds) {
  const initialBatch = 3;
  const batchSize = 2;
  const stepSeconds = 15;

  if (elapsedSeconds < 0) return 0;

  const steps = Math.floor(elapsedSeconds / stepSeconds);
  let visible = initialBatch + (steps * batchSize);

  // Após 75-90 segundos, libera para todos (máximo ~20 motoristas)
  return Math.min(visible, 20);
}

export const updateLocation_old = async (req, res) => {
  const { driverId, position } = req.body;

  if (!position?.latitude || !position?.longitude) {
    return res.status(400).json({ message: "Posição inválida" });
  }

  // 1. Atualiza a posição do motorista
  const updatedDriver = await Driver.findByIdAndUpdate(
    driverId,
    { 
      position, 
      online: true,
    },
    { new: true }
  );

  if (!updatedDriver) {
    return res.status(404).json({ message: "Motorista não encontrado" });
  }
  console.log('Atualização de Localização recebida. Motorista:', updatedDriver.name);
  // 2. Busca TODOS os motoristas online (precisamos deles para ordenar)
  const onlineDrivers = await Driver.find({ 
    online: true,
    "position.latitude": { $exists: true },
    "position.longitude": { $exists: true }
  }).select('_id position');
  console.log('Motoristas online:', onlineDrivers.length);
  

  // 3. Busca as corridas abertas
  const rides = await Ride.find({ status: 0 })
    .populate('passenger', 'name avatar rating')
    .populate('pagamento', 'nome')
    .select('data distancia duracao valor origem destino');
  console.log('Corridas abertas', rides);
  const now = new Date();

  // 4. Processa cada corrida
  const visibleRides = rides.map(ride => {
    const origem = ride.origem;

    // Calcula a distância de TODOS os motoristas online até a origem da corrida
    const driversWithDistance = onlineDrivers.map(driver => {
      const dLat = driver.position.latitude;
      const dLon = driver.position.longitude;

      const distanceKm = haversineDistance(dLat,dLon,origem.latitude, origem.longitude);

      return {driverId: driver._id,distanceKm: distanceKm};
    });

    // Ordena os motoristas do mais próximo para o mais distante
    driversWithDistance.sort((a, b) => a.distanceKm - b.distanceKm);

    // Calcula há quanto tempo a corrida está aberta
    const elapsedSeconds = (now - new Date(ride.data)) / 1000;

    // Define quantos motoristas mais próximos podem ver esta corrida
    const maxVisiblePosition = getMaxVisiblePosition(elapsedSeconds);

    // Verifica se o motorista atual está entre os "N" mais próximos permitidos
    const driverPositionInList = driversWithDistance.findIndex(
      d => d.driverId.toString() === driverId.toString()
    ) + 1; // +1 porque findIndex começa em 0

    const isVisible = driverPositionInList <= maxVisiblePosition;

    return {
      ...ride.toObject(),
      distanceToDriverKm: Number(
        driversWithDistance.find(d => d.driverId.toString() === driverId.toString())?.distanceKm.toFixed(3) || 999
      ),
      elapsedSeconds: Math.floor(elapsedSeconds),
      isVisible
    };
  })
  // Filtra apenas as corridas que este motorista pode ver
  .filter(ride => ride.isVisible);

  // Ordena as corridas visíveis por distância (mais perto primeiro)
  visibleRides.sort((a, b) => a.distanceToDriverKm - b.distanceToDriverKm);
  console.log('Corridas visíveis para o motorista', visibleRides);
  return res.status(200).json(visibleRides);
};

export const updateLocation = async (req, res) => {
  const { driverId, position } = req.body;

  if (!position?.latitude || !position?.longitude) {
    return res.status(400).json({ message: "Posição inválida" });
  }

  // 1. Atualiza a posição do motorista
  const updatedDriver = await Driver.findByIdAndUpdate(
    driverId,
    { 
      position, 
     // online: true,
    },
    { new: true }
  );

  if (!updatedDriver) {
    return res.status(404).json({ message: "Motorista não encontrado" });
  }

  console.log('Atualização de Localização recebida. Motorista:', updatedDriver.name);

  const now = new Date();

  // 2. Busca todas as corridas abertas (status 0)
  const allOpenRides = await Ride.find({ status: 0 })
    .populate('passenger', 'name avatar rating')
    .populate('pagamento', 'nome')
    .select('data distancia duracao valor origem destino driver');

  // 3. Separa as corridas em dois grupos
  const assignedRides = [];   // Corridas onde o passageiro já escolheu este motorista
  const openRides = [];       // Corridas abertas (sem motorista selecionado)

  allOpenRides.forEach(ride => {
    if (ride.driver && ride.driver.toString() === driverId) {
      assignedRides.push(ride);
    } else if (!ride.driver) {
      openRides.push(ride);
    }
  });

  console.log(`Corridas atribuídas: ${assignedRides.length} | Corridas abertas: ${openRides.length}`);

  // 4. Processa as corridas abertas (lógica antiga de proximidade + tempo)
  const visibleOpenRides = [];

  if (openRides.length > 0) {
    // Busca todos os motoristas online para calcular ranking de proximidade
    const onlineDrivers = await Driver.find({ 
      online: true,
      "position.latitude": { $exists: true },
      "position.longitude": { $exists: true }
    }).select('_id position');

    visibleOpenRides.push(...openRides.map(ride => {
      const origem = ride.origem;

      const driversWithDistance = onlineDrivers.map(driver => {
        const distanceKm = haversineDistance(
          driver.position.latitude,
          driver.position.longitude,
          origem.latitude,
          origem.longitude
        );
        return { driverId: driver._id, distanceKm };
      });

      driversWithDistance.sort((a, b) => a.distanceKm - b.distanceKm);

      const elapsedSeconds = (now - new Date(ride.data)) / 1000;
      const maxVisiblePosition = getMaxVisiblePosition(elapsedSeconds);

      const driverPositionInList = driversWithDistance.findIndex(
        d => d.driverId.toString() === driverId.toString()
      ) + 1;

      const isVisible = driverPositionInList <= maxVisiblePosition;

      return {
        ...ride.toObject(),
        distanceToDriverKm: Number(
          driversWithDistance.find(d => d.driverId.toString() === driverId.toString())?.distanceKm.toFixed(3) || 999
        ),
        elapsedSeconds: Math.floor(elapsedSeconds),
        isVisible
      };
    }).filter(ride => ride.isVisible));
  }

  // 5. Combina as corridas atribuídas + as abertas visíveis
  const visibleRides = [
    ...assignedRides.map(ride => ({
      ...ride.toObject(),
      distanceToDriverKm: 0,           // Prioridade máxima
      elapsedSeconds: 0,
      isVisible: true,
      isAssigned: true                 // Flag útil no frontend
    })),
    ...visibleOpenRides
  ];

  // 6. Ordena: primeiro as atribuídas, depois por distância
  visibleRides.sort((a, b) => {
    if (a.isAssigned && !b.isAssigned) return -1;
    if (!a.isAssigned && b.isAssigned) return 1;
    return (a.distanceToDriverKm || 999) - (b.distanceToDriverKm || 999);
  });

  console.log(`Total de corridas visíveis para o motorista: ${visibleRides.length}`);

  return res.status(200).json(visibleRides);
};

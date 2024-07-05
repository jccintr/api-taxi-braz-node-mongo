import Driver from '../models/driver.js';
import bcryptjs from 'bcryptjs';
import jsonwebtoken from 'jsonwebtoken';


export const store = async (req,res) => {
   
    const {name,email,password,telefone,carro,placa} = req.body;

      console.log(req.body);

      if(!name || !email || !password || !telefone || !carro || !placa || name=='' || email == '' || password == '' || telefone =='' || placa =='' || carro ==''){
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
      const newDriver = new Driver({name,email,password:password_hash,telefone,carro,placa});
      await newDriver.save();
      const { password:p, ...rest } = newDriver._doc;
      return res.status(201).json(rest);
     

  }


  export const login =  async (req,res) => {

    const {email,password} = req.body;

    console.log(req.body);

    if(!email || !password || email == '' || password == ''){
        return res.status(400).json({error: 'Campos obrigatórios não informados.'});
    }

    const driver = await Driver.findOne({ email });

if(!driver){
    return res.status(400).json({error:'Nome de usuário e ou senha inválidos.'});
}

if(!bcryptjs.compareSync(password,driver.password)){
    return res.status(400).json({error:'Nome de usuário e ou senha inválidos.'});
    }

    const token = jsonwebtoken.sign({driverId: driver._id},process.env.JWT_SECRET);
    return res.status(200).json({token: token});
}


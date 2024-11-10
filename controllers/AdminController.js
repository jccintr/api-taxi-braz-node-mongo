import bcryptjs from 'bcryptjs';
import jsonwebtoken from 'jsonwebtoken';
import Admin from '../models/admin.js';



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

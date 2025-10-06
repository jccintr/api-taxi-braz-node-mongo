import bcryptjs from 'bcryptjs';
import jsonwebtoken from 'jsonwebtoken';
import User from '../models/user.js';
import { addLog } from '../util/logs.js';



    export const login =  async (req,res) => {

        const {email,password} = req.body;

        if(!email || !password || email == '' || password == ''){
            return res.status(400).json({error: 'Campos obrigatórios não informados.'});
        }

        const user = await User.findOne({ email }).select('name password isAvailable');

    if(!user){
        return res.status(400).json({error:'Nome de usuário e ou senha inválidos.'});
    }

    if(!bcryptjs.compareSync(password,user.password)){
        return res.status(400).json({error:'Nome de usuário e ou senha inválidos.'});
        }

        const token = jsonwebtoken.sign({userId: user._id},process.env.JWT_SECRET);
       

        const { password:p, ...rest } = user._doc;
        const ret = {...rest,token};
        return res.status(200).json(ret);
    }


    export const store = async (req,res) => {
   
      const {name,email,password,telefone,doc} = req.body;

        //console.log(req.body);

        if(!name || !email || !password || !telefone || !doc || name=='' || email == '' || password == '' || telefone =='' || doc ==''){
            return res.status(400).json({error: 'Campos obrigatórios não informados.'});
        }

  
        const validateEmailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

        if(!validateEmailRegex.test(email)){
            return res.status(400).json({error: 'Email inválido.'});
        }

       
        const user = await User.findOne({email});
        
        if (user){
            return res.status(400).json({error: 'Email já cadastrado.'});
        }

        const salt = bcryptjs.genSaltSync(10);
        const password_hash = bcryptjs.hashSync(password,salt);
        const newUser = new User({name,email,password:password_hash,telefone,doc});
        await newUser.save();
        const { password:p, ...rest } = newUser._doc;
        addLog(newUser._id,"Novo Cadastro",newUser.name);
        return res.status(201).json(rest);
       

    }

    export const validateToken  = async (req,res) => {

        const {userId} = req.body;
       
    
       const user = await User.findById(userId).select('name');
    
       return res.status(200).json(user);
    }



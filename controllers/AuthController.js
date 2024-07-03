import bcryptjs from 'bcryptjs';
import jsonwebtoken from 'jsonwebtoken';
import User from '../models/user.js';


    export const login =  async (req,res) => {

        const {email,password} = req.body;

        if(!email || !password || email == '' || password == ''){
            return res.status(400).json({error: 'Campos obrigatórios não informados.'});
        }

        const user = await User.findOne({ email });

    if(!user){
        return res.status(400).json({error:'Nome de usuário e ou senha inválidos.'});
    }

    if(!bcryptjs.compareSync(password,user.password)){
        return res.status(400).json({error:'Nome de usuário e ou senha inválidos.'});
        }

        const token = jsonwebtoken.sign({userId: user._id},process.env.JWT_SECRET);
        return res.status(200).json({token: token});
    }


    export const register = async (req,res) => {
   
      const {name,email,password,telefone} = req.body;

        console.log(req.body);

        if(!name || !email || !password || !telefone|| name=='' || email == '' || password == '' || telefone ==''){
            return res.status(400).json({error: 'Campos obrigatórios não informados.'});
        }

        const validateEmailRegex = /^\S+@\S+\.\S+$/;
        if(!validateEmailRegex.test(email)){
            return res.status(400).json({error: 'Email inválido.'});
        }

       
        const user = await User.findOne({email});
        
        if (user){
            return res.status(400).json({error: 'Email já cadastrado.'});
        }

        const salt = bcryptjs.genSaltSync(10);
        const password_hash = bcryptjs.hashSync(password,salt);
        const newUser = new User({name,email,password:password_hash,telefone});
        await newUser.save();
        const { password:p, ...rest } = newUser._doc;
        return res.status(201).json(rest);
       

    }



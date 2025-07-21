import jsonwebtoken from 'jsonwebtoken';


 const AuthAdmin = (req, res, next) => {
  
      const bearer = req.headers['authorization'];
      
    
      if (!bearer) {
        return res.status(401).json({error: 'Não autorizado'});
      }

      const token = bearer.split(' ')[1];

      try {
        var decoded = jsonwebtoken.verify(token,process.env.JWT_SECRET_ADMIN);
      } catch (error) {
      return res.status(401).json({error:"Não autorizado"});
      }
    req.body.adminId = decoded.adminId;

    next();

 
 
};

export default AuthAdmin;
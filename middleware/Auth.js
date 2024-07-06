import jsonwebtoken from 'jsonwebtoken';


 const AuthDriver = (req, res, next) => {
  
      const bearer = req.headers['authorization'];
      
    
      if (!bearer) {
        return res.status(401).json({error: 'Não autorizado'});
      }

      const token = bearer.split(' ')[1];

      try {
        var decoded = jsonwebtoken.verify(token,process.env.JWT_SECRET);
      } catch (error) {
      return res.status(403).json({error:"Não autorizado"});
      }
    req.body.userId = decoded.userId;

    next();

 
 
};

export default AuthDriver;
import jsonwebtoken from 'jsonwebtoken';


 const AuthPassenger = (req, res, next) => {
  
      const bearer = req.headers['authorization'];
      
    
      if (!bearer) {
        return res.status(401).json({error: 'Não autorizado'});
      }

      const token = bearer.split(' ')[1];

      try {
        var decoded = jsonwebtoken.verify(token,process.env.JWT_SECRET_PASSENGER);
      } catch (error) {
      return res.status(401).json({error:"Não autorizado"});
      }
    req.body.passengerId = decoded.passengerId;

    next();

 
 
};

export default AuthPassenger;
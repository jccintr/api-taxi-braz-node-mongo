import PassengerLog from "../models/passengerLog.js";



export const index  = async (req,res) => {
  
   const page = req.query.page * 1 || 1;
   const pageSize = 10;
   const skip = ( page - 1 ) * pageSize;
   const totalDocuments = await PassengerLog.countDocuments();
   const pages = Math.ceil(totalDocuments / pageSize);

    const logs = await PassengerLog.find().populate('passenger','name avatar').select('data passenger action info').sort({data: 'desc'}).skip(skip).limit(pageSize);
  
    return res.status(200).json({
      status:"success",
      pages: pages,
      data: logs
    });

  }

  export const destroy  = async (req,res) => {

    const id = req.params.id;
   
    try {
       const deleted = await PassengerLog.findByIdAndDelete(id);
    } catch (error) {
       return res.status(404).json({error: 'Mensagem não encontrada.'});
    }

    
    return res.status(200).json({message:'Excluído com sucesso'});
    

 }
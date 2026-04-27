import DriverLog from "../models/driverLog.js";



export const index  = async (req,res) => {
  
   const page = req.query.page * 1 || 1;
   const pageSize = 10;
   const skip = ( page - 1 ) * pageSize;
   const totalDocuments = await DriverLog.countDocuments();
   const pages = Math.ceil(totalDocuments / pageSize);

    const logs = await DriverLog.find().populate('driver','name avatar').select('data driver action info').sort({data: 'desc'}).skip(skip).limit(pageSize);
  
    return res.status(200).json({
      status:"success",
      page,
      pages: pages,
      total: totalDocuments,
      data: logs
    });

  }

  export const destroy  = async (req,res) => {

    const id = req.params.id;
   
    try {
       const deleted = await DriverLog.findByIdAndDelete(id);
    } catch (error) {
       return res.status(404).json({error: 'Mensagem não encontrada.'});
    }

    
    return res.status(200).json({message:'Excluído com sucesso'});
    

 }
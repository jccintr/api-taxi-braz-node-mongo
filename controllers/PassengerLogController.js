import PassengerLog from "../models/passengerLog.js";



export const index  = async (req,res) => {

    const logs = await PassengerLog.find().populate('passenger','name avatar').select('data passenger action info').sort({data: 'desc'});
  
    return res.status(200).json(logs);
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
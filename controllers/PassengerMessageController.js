import PassengerMessage from '../models/passengerMessage.js';

export const store = async (req,res) => {
    const {passengerId,message,tipo} = req.body;

    if(!tipo || !message || tipo=='' || message == ''){
        return res.status(400).json({error: 'Campos obrigatórios não informados.'});
    }
    
    const newMessage = new PassengerMessage({passenger:passengerId,tipo,message});
    await newMessage.save();

    return res.status(201).json(newMessage);

}

export const index  = async (req,res) => {

    const messages = await PassengerMessage.find().populate('passenger','name avatar').select('data passenger tipo message lida').sort({data: 'desc'});
  
    return res.status(200).json(messages);
  }
  

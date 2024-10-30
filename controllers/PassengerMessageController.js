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

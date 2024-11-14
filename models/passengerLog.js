import mongoose from 'mongoose';


const passengerLogSchema = new mongoose.Schema({
    data:{
        type:Date,
        default:Date.now
    },
    passenger:{
        type: mongoose.Types.ObjectId,
        ref: "Passenger",
        required:true
        
    },
   
    action:{
        type:String,
        required:true
    },
   
    
    
   
},{timestamps: true});

const PassengerLog = mongoose.model("PassengerLog",passengerLogSchema);



export default PassengerLog
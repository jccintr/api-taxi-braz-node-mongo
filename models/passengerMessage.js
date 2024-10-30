import mongoose from 'mongoose';


const passengerMessageSchema = new mongoose.Schema({
    data:{
        type:Date,
        default:Date.now
    },
    passenger:{
        type: mongoose.Types.ObjectId,
        ref: "Passenger",
        required:true
    },
    tipo:{
        type:String,
        required:true
    },
    message:{
        type:String,
        required:true
    },
    lida:{
        type:Boolean,
        required: false,
        default: false
     },
    
    
   
},{timestamps: true});

const PassengerMessage = mongoose.model("PassengerMessage",passengerMessageSchema);



export default PassengerMessage
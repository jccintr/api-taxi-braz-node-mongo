import mongoose from 'mongoose';


const logSchema = new mongoose.Schema({
    data:{
        type:Date,
        default:Date.now
    },
    passenger:{
        type: mongoose.Types.ObjectId,
        ref: "Passenger",
        required:false,
        default:null
    },
    driver:{
        type: mongoose.Types.ObjectId,
        ref: "Driver",
        required:false,
        default:null
    },
    action:{
        type:String,
        required:true
    },
    info:{
        type:String,
        required:false,
        default:null
    },
   
    
    
   
},{timestamps: true});

const Log = mongoose.model("Log",logSchema);



export default Log
import mongoose from 'mongoose';


const driverLogSchema = new mongoose.Schema({
    data:{
        type:Date,
        default:Date.now
    },
    driver:{
        type: mongoose.Types.ObjectId,
        ref: "Driver",
        required:true
        
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

const DriverLog = mongoose.model("DriverLog",driverLogSchema);



export default DriverLog
import mongoose from 'mongoose';



const rideSchema = new mongoose.Schema({
    data:{
        type:Date,
        default:Date.now
    },
    passageiro:{
        type: mongoose.Types.ObjectId,
        ref: "User",
        required:true
    },
    driverId:{
        type: mongoose.Types.ObjectId,
        default:null
    },
    origem:{latitude:Number,longitude:Number,address:String},
    destino:{latitude:Number,longitude:Number,address:String},
    distancia:{  // km
        type:Number,
        required:true
    },
    duracao:{ //min
        type:Number,
        required:true
    },
    valor:{
        type:Number,
        required:true
    },
   
   
    
    
    
   
},{timestamps: true});

const Ride = mongoose.model("Ride",rideSchema);



export default Ride
import mongoose from 'mongoose';



const rideSchema = new mongoose.Schema({
    data:{
        type:Date,
        default:Date.now
    },
    passenger:{
        type: mongoose.Types.ObjectId,
        ref: "Passenger",
        required:true
    },
    driver:{
        type: mongoose.Types.ObjectId,
        ref: "Driver",
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
    pagamento:{
        type:String,
        required:true
    },
    status:{
        type:Number,
        default:0
    },
    events:[
        {
        data:{
           type:Date,          
        },
        descricao:{
            type:String,          
        }       
    }
]
   
   
},{timestamps: true});

const Ride = mongoose.model("Ride",rideSchema);



export default Ride
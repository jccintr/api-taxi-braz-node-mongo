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
    veiculo:{modelo:String,cor:String,placa:String},
    origem:{latitude:Number,longitude:Number,address:String},
    destino:{latitude:Number,longitude:Number,address:String},
    embarque:{data:Date,latitude:Number,longitude:Number},
    desembarque:{data:Date,latitude:Number,longitude:Number},
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
    valorDriver:{
        type:Number,
        required:false,
        default:0
    },
    valorPlataforma:{
        type:Number,
        required:false,
        default:0
    },
    pagamento:{
        type: mongoose.Types.ObjectId,
        ref: "Pagamento",
        default:null
    },
    status:{
        type:Number,
        default:0
    },
    motivoCancelamento:{
        type:String,
        required:false,
        default:null
    },
    driverRating:{
        type:Number,
        required:false,
        default: null
        },
    passengerRating:{
        type:Number,
        required:false,
        default: null
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
import mongoose from 'mongoose';


const passengerSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    telefone:{
       type:String,
       required:true
    },
    doc:{
        type:String,
        required:false,
        default: null
     },
     avatar:{
        type:String,
        required:false,
        default: null
     },
     pushToken:{
        type:String,
        required:false,
        default: null
     },
     ativo:{
        type:Boolean,
        required: false,
        default: true
     }
    
    
   
},{timestamps: true});

const Passenger = mongoose.model("Passenger",passengerSchema);



export default Passenger
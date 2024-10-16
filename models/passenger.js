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
     rating:{
      type:Number,
      required:false,
      default: 5
      },
     votes:{
      type:Number,
      required:false,
      default: 0
      },
      totalRating:{
         type:Number,
         required:false,
         default: 0
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
     },
     emailVerifiedAt:{
      type:Date,
      required:false,
      default:null
     },
     emailVerificationCode:{
      type:String,
      required:false,
      default: null
   },
   resetPasswordCode:{
      type:String,
      required:false,
      default: null
   },
    
    
   
},{timestamps: true});

const Passenger = mongoose.model("Passenger",passengerSchema);



export default Passenger
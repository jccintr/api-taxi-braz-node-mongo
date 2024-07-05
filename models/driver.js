import mongoose from 'mongoose';


const driverSchema = new mongoose.Schema({
   
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
  isAdmin: {
    type: Boolean,
    default: false,
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
    isAvailable: {
      type: Boolean,
      default: false,
    },
    latitude:{
        type:Number,
        required:false,
        default:0
     },
     longitude:{
        type:Number,
        required:false,
        default:0
     },
     carro:{
        type:String,
        required: true,
     },
     placa:{
      type:String,
      required: true,
   },
   pushToken:{
      type:String,
      required:false,
      default: null
   },
     
   
},{timestamps: true});

const Driver = mongoose.model("Driver",driverSchema);



export default Driver
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
   online:{
      type:Boolean,
      required:false,
      default:false
   },
   position:{latitude:Number,longitude:Number},
   veiculo:{tipo:String,modelo:String,cor:String,placa:String},
   pix:{favorecido:String,chave:String},
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

const Driver = mongoose.model("Driver",driverSchema);



export default Driver
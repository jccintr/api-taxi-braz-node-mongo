import mongoose from 'mongoose';


const userSchema = new mongoose.Schema({
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
   //   emailVerifiedAt:{
   //    type:Date,
   //    required:false,
   //    default:null
   //   },
   //   emailVerificationCode:{
   //    type:String,
   //    required:false,
   //    default: null
   // },
    
    
   
},{timestamps: true});

const User = mongoose.model("User",userSchema);



export default User
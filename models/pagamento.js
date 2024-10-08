import mongoose from 'mongoose';


const pagamentoSchema = new mongoose.Schema({

    nome:{
        type:String,
        required:true
    },
     ativo:{
        type:Boolean,
        required: false,
        default: true
     },
    
   
},{timestamps: true});

const Pagamento = mongoose.model("Pagamento",pagamentoSchema);



export default Pagamento
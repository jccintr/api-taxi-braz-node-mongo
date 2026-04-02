import mongoose from 'mongoose';

const localidadeSchema = new mongoose.Schema({

   nome:{
      type:String,
      required:true
   },
   latitude: {
      type: Number,
      required:true
   },
   longitude: {
      type: Number,
      required: true
   },
   valor: {
      type: Number,
      required:true
   }

    },{timestamps: true});

const Localidade = mongoose.model("Localidade",localidadeSchema);

export default Localidade;

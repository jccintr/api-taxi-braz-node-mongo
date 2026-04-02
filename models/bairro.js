import mongoose from 'mongoose';

const LocalidadeSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  valor: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

const bairroSchema = new mongoose.Schema({

    nome: { 
      type: String, 
      required: true, 
      unique: true 
    },

    localidades: [LocalidadeSchema]

},{timestamps: true});

const Bairro = mongoose.model("Bairro",bairroSchema);

export default Bairro
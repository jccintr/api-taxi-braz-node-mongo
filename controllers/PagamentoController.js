import Pagamento from '../models/pagamento.js';


export const store = async (req,res) => {

    const {nome} = req.body;


      if(!nome ){
          return res.status(400).json({error: 'Campos obrigatórios não informados.'});
      }

      const newPagamento = new Pagamento({nome});
      await newPagamento.save();
      return res.status(201).json(newPagamento);

}

export const index = async (req,res) => {

    const pagamentos = await Pagamento.find({ativo:true}).select('nome').sort({nome: 'asc'});

    return res.status(200).json(pagamentos);

}


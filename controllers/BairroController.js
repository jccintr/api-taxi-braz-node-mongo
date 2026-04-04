import Bairro from '../models/bairro.js';

class BairroController {

    async create(req, res) {
        try {
            const { nome, localidades } = req.body;

            // Validação simples
            if (!nome || !Array.isArray(localidades) || localidades.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Nome do bairro e pelo menos uma localidade são obrigatórios'
                });
            }

            const bairro = await Bairro.create({ nome, localidades });

            res.status(201).json({
                success: true,
                message: 'Bairro criado com sucesso!',
                data: bairro
            });

        } catch (error) {
            if (error.code === 11000) {
                return res.status(400).json({
                    success: false,
                    message: 'Já existe um bairro com este nome'
                });
            }

            console.error(error);
            res.status(500).json({
                success: false,
                message: 'Erro interno ao criar bairro'
            });
        }
    }

    async getBairroById(req, res) {
        
        const bairro = await Bairro.findById(req.params.id);

        if (!bairro) {
            return res.status(404).json({
                success: false,
                error: 'Bairro não encontrado'
            });
        }

        res.status(200).json({
        success: true,
        data: bairro
        });
    
    }

     async updateBairro(req, res) {
        const bairro = await Bairro.findById(req.params.id);
         if (!bairro) {
            return res.status(404).json({
                success: false,
                error: 'Bairro não encontrado'
            });
         }
        const { nome } = req.body;
        if (!nome || nome.trim() === '') {
            return res.status(422).json({ success: false, error: 'Nome do bairro deve ser informado' });
        }
       const bairroUpdated = await Bairro.findByIdAndUpdate(
            req.params.id,
            { nome: nome.trim() },           // trim para evitar nomes com espaços
            { 
                new: true,                   // retorna o documento atualizado
                runValidators: true          // força as validações do schema (required, unique, etc.)
            }
        );
        res.status(200).json({
            success: true,
            data: bairroUpdated
        });
     }

    async findAll(req, res) {
        try {
            const bairros = await Bairro.find().sort({ nome: 1 });

            res.status(200).json({
                success: true,
                count: bairros.length,
                data: bairros
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                message: 'Erro ao buscar bairros'
            });
        }
    }

    async delete(req, res) {
        try {
            const bairro = await Bairro.findById(req.params.id);
            if (!bairro) {
                return res.status(404).json({
                    success: false,
                    error: 'Bairro não encontrado'
                });
            }
            await Bairro.findByIdAndDelete(req.params.id);
            res.status(204).end();
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async addLocalidade(req, res) {
            try {
                const bairro = await Bairro.findById(req.params.id);
                if (!bairro) {
                return res.status(404).json({ success: false, error: 'Bairro não encontrado' });
        }

            const { nome, latitude, longitude, valor } = req.body;

            if (!nome || !latitude || !longitude || !valor){
                return res.status(422).json({ success: false, error: 'Dados da localidade incompletos' });
            }

            if(valor < 0){
                return res.status(422).json({ success: false, error: 'Valor da localidade deve ser positivo' });
            }

            bairro.localidades.push({ nome, latitude, longitude, valor });
            await bairro.save();

            res.status(201).json({
            success: true,
            data: bairro
            });
        } catch (error) {
            res.status(500).json({ success: false, error: error });
        }
    };

        async getLocalidadeById(req, res) {
        try {
            const { bairroId, localidadeId } = req.params;

            const bairro = await Bairro.findById(bairroId);
            
            if (!bairro) {
                return res.status(404).json({
                    success: false,
                    message: 'Bairro não encontrado'
                });
            }

            // Busca a localidade dentro do array de subdocumentos
            const localidade = bairro.localidades.id(localidadeId);

            if (!localidade) {
                return res.status(404).json({
                    success: false,
                    message: 'Localidade não encontrada'
                });
            }

            res.status(200).json({
                success: true,
                data: localidade
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                message: 'Erro ao buscar localidade'
            });
        }
    }

    
   async updateLocalidade(req, res)  {
        const { bairroId, localidadeId } = req.params;

        try {
            // 1. Busca o bairro pelo ID
            const bairro = await Bairro.findById(bairroId);
            
            if (!bairro) {
            return res.status(404).json({ message: 'Bairro não encontrado' });
            }

            // 2. Localiza o subdocumento (localidade) dentro do array
            const localidade = bairro.localidades.id(localidadeId);

            if (!localidade) {
            return res.status(404).json({ message: 'Localidade não encontrada' });
            }

             const { nome, latitude, longitude, valor } = req.body;

            if (!nome || !latitude || !longitude || !valor){
                return res.status(422).json({ success: false, error: 'Dados da localidade incompletos' });
            }

            if(valor < 0){
                return res.status(422).json({ success: false, error: 'Valor da localidade deve ser positivo' });
            }
            
            localidade.set(req.body);

            // 4. Salva o documento pai (o Bairro)
            await bairro.save();

            res.status(200).json(bairro);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
  };


    async deleteLocalidade(req, res) { 
        try {
            const bairro = await Bairro.findById(req.params.bairroId);
            if (!bairro) return res.status(404).json({ message: 'Bairro não encontrado' });
            const localidade = bairro.localidades.id(req.params.localidadeId);
            if (!localidade) {
               return res.status(404).json({ message: 'Localidade não encontrada' });
            }
            // O Mongoose permite remover de arrays de subdocumentos usando .pull()
            bairro.localidades.pull({ _id: req.params.localidadeId });
            await bairro.save();
            res.status(204).end();
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
     }

   
}

export default new BairroController();
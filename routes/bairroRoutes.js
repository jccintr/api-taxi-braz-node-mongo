import { Router } from "express";
import BairroController from "../controllers/BairroController.js";
import AuthAdmin from '../middleware/AuthAdmin.js';


const BairrosRouter = Router();

BairrosRouter.post("/bairros",AuthAdmin,BairroController.create);
BairrosRouter.get("/bairros", BairroController.findAll);
BairrosRouter.get("/bairros/:id", BairroController.getBairroById);
BairrosRouter.put("/bairros/:id",AuthAdmin ,BairroController.updateBairro);
BairrosRouter.delete("/bairros/:id",AuthAdmin, BairroController.delete);
BairrosRouter.post('/bairros/:id/localidades',AuthAdmin ,BairroController.addLocalidade);
BairrosRouter.put('/bairros/:bairroId/localidades/:localidadeId',AuthAdmin, BairroController.updateLocalidade);
BairrosRouter.delete('/bairros/:bairroId/localidades/:localidadeId', BairroController.deleteLocalidade);

export default BairrosRouter;
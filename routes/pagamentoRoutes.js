import { Router } from 'express';
import * as PagamentoController from "../controllers/PagamentoController.js";



const PagamentoRouter = Router();

PagamentoRouter.get("/pagamentos",PagamentoController.index);
PagamentoRouter.post("/pagamentos",PagamentoController.store);



export default PagamentoRouter;
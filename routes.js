import { Router } from 'express';
import * as AuthController from "./controllers/AuthController.js";
import * as DriverController from "./controllers/DriverController.js";


const router = Router();

router.post("/register",AuthController.register);
router.post("/login",AuthController.login);

router.post("/driver/register",DriverController.store);
router.post("/driver/login",DriverController.login);


export default router;
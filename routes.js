import { Router } from 'express';
import * as AuthController from "./controllers/AuthController.js";
import * as DriverController from "./controllers/DriverController.js";
import AuthDriver from './middleware/AuthDriver.js';


const router = Router();

router.post("/register",AuthController.register);
router.post("/login",AuthController.login);

router.post("/driver/register",DriverController.store);
router.post("/driver/login",DriverController.login);
router.post("/driver/token",AuthDriver,DriverController.validateToken);
router.post("/driver/location",AuthDriver,DriverController.updateLocation);
router.get("/driver/location",DriverController.getLocation);


export default router;
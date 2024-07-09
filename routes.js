import { Router } from 'express';
import * as AuthController from "./controllers/AuthController.js";
import * as DriverController from "./controllers/DriverController.js";
import AuthDriver from './middleware/AuthDriver.js';
import Auth from './middleware/Auth.js';


const router = Router();

// User Routes
router.post("/auth/register",AuthController.store);
router.post("/auth/login",AuthController.login);
router.post("/auth/token",Auth,AuthController.validateToken);
// Driver routes
router.post("/driver/register",DriverController.store);
router.post("/driver/login",DriverController.login);
router.post("/driver/token",AuthDriver,DriverController.validateToken);
router.post("/driver/location",AuthDriver,DriverController.updateLocation);
router.get("/driver/location",DriverController.getLocation);
router.post("/driver/status",AuthDriver,DriverController.setStatus);


export default router;
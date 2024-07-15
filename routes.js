import { Router } from 'express';
//import * as AuthController from "./controllers/AuthController.js";
import * as PassengerController from "./controllers/PassengerController.js";
import * as DriverController from "./controllers/DriverController.js";
import * as RideController from "./controllers/RideController.js";
import AuthPassenger from './middleware/AuthPassenger.js';
import AuthDriver from './middleware/AuthDriver.js';
//import Auth from './middleware/Auth.js';


const router = Router();

// Passenger Routes
router.post("/passengers/auth/register",PassengerController.store);
router.post("/passengers/auth/login",PassengerController.login);
router.post("/passengers/auth/token",AuthPassenger,PassengerController.validateToken);
// Driver routes
router.post("/drivers/auth/register",DriverController.store);
router.post("/drivers/auth/login",DriverController.login);
router.post("/drivers/auth/token",AuthDriver,DriverController.validateToken);
router.post("/drivers/location",AuthDriver,DriverController.updateLocation);
router.get("/drivers/location",DriverController.getLocation);
router.post("/driver/status",AuthDriver,DriverController.setStatus);
// Ride routes
router.post("/ride",AuthPassenger,RideController.store);

export default router;
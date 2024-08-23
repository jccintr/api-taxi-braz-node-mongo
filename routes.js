import { Router } from 'express';
//import * as AuthController from "./controllers/AuthController.js";
import * as PassengerController from "./controllers/PassengerController.js";
import * as DriverController from "./controllers/DriverController.js";
import * as RideController from "./controllers/RideController.js";
import AuthPassenger from './middleware/AuthPassenger.js';
import AuthDriver from './middleware/AuthDriver.js';



const router = Router();

// Passenger Routes
router.post("/passengers/auth/register",PassengerController.store);
router.post("/passengers/auth/login",PassengerController.login);
router.post("/passengers/auth/token",AuthPassenger,PassengerController.validateToken);
router.post("/passengers/update",AuthPassenger,PassengerController.update);
// Driver routes
router.post("/drivers/auth/register",DriverController.store);
router.post("/drivers/auth/login",DriverController.login);
router.post("/drivers/auth/token",AuthDriver,DriverController.validateToken);
router.post("/drivers/location",AuthDriver,DriverController.updateLocation);
router.get("/drivers/location",DriverController.getLocation);
router.post("/drivers/status",AuthDriver,DriverController.setStatus);
router.post("/drivers/pushtoken",AuthDriver,DriverController.storePushToken);
router.post("/drivers/update",AuthDriver,DriverController.update);
router.post("/drivers/update/pix",AuthDriver,DriverController.updatePix);
router.post("/drivers/update/veiculo",AuthDriver,DriverController.updateVeiculo);
// Ride routes
router.get("/rides",AuthDriver,RideController.index);
router.get("/rides/:id/status",AuthPassenger,RideController.status);
router.post("/rides",AuthPassenger,RideController.store);
router.post("/rides/price",AuthPassenger,RideController.price);
router.post("/rides/:id/accept",AuthDriver,RideController.accept);
router.post("/rides/:id/onway",AuthDriver,RideController.onWay);
router.post("/rides/:id/arrived",AuthDriver,RideController.arrived);
router.post("/rides/:id/started",AuthDriver,RideController.start);
router.post("/rides/:id/finished",AuthDriver,RideController.finish);
router.post("/rides/:id/rate/passenger",AuthDriver,RideController.ratePassenger);
router.post("/rides/:id/rate/driver",AuthPassenger,RideController.rateDriver);

//router.get("/ws",RideController.teste);

export default router;
import { Router } from "express";
import * as DriverController from "../controllers/DriverController.js";
import AuthDriver from '../middleware/AuthDriver.js';

const DriverRouter = Router();

DriverRouter.post("/drivers/auth/register",DriverController.store);
DriverRouter.post("/drivers/auth/login",DriverController.login);
DriverRouter.post("/drivers/auth/token",AuthDriver,DriverController.validateToken);
DriverRouter.post("/drivers/auth/password/request",DriverController.requestEmailPassword);
DriverRouter.post("/drivers/auth/password/reset",DriverController.resetPassword);
DriverRouter.post("/drivers/location",AuthDriver,DriverController.updateLocation);
DriverRouter.get("/drivers/location",DriverController.getLocation);
DriverRouter.post("/drivers/status",AuthDriver,DriverController.setStatus);
DriverRouter.post("/drivers/pushtoken",AuthDriver,DriverController.storePushToken);
DriverRouter.post("/drivers/update",AuthDriver,DriverController.update);
DriverRouter.post("/drivers/update/pix",AuthDriver,DriverController.updatePix);
DriverRouter.post("/drivers/update/veiculo",AuthDriver,DriverController.updateVeiculo);
DriverRouter.get("/drivers/rides",AuthDriver,DriverController.driverRides);
//DriverRouter.post("/drivers/ganhos",AuthDriver,DriverController.getGanhos);
DriverRouter.get("/drivers/ganhos",AuthDriver,DriverController.getGanhos2);



export default DriverRouter;
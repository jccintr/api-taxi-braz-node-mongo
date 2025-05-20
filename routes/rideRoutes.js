import { Router } from "express";
import * as RideController from "../controllers/RideController.js";
import AuthPassenger from '../middleware/AuthPassenger.js';
import AuthDriver from '../middleware/AuthDriver.js';


const RideRouter = Router();

RideRouter.get("/rides",AuthDriver,RideController.index);
RideRouter.get("/rides/:id/status",AuthPassenger,RideController.status);
RideRouter.post("/rides",AuthPassenger,RideController.store);
RideRouter.post("/rides/price",AuthPassenger,RideController.price);
RideRouter.post("/rides/:id/accept",AuthDriver,RideController.accept);
RideRouter.post("/rides/:id/onway",AuthDriver,RideController.onWay);
RideRouter.post("/rides/:id/arrived",AuthDriver,RideController.arrived);
RideRouter.post("/rides/:id/started",AuthDriver,RideController.start);
RideRouter.post("/rides/:id/finished",AuthDriver,RideController.finish);
RideRouter.get("/rides/:id/restore/driver",AuthDriver,RideController.restoreDriverRide);
RideRouter.get("/rides/:id/restore/passenger",AuthPassenger,RideController.restorePassengerRide);
RideRouter.post("/rides/:id/cancel/passenger",AuthPassenger,RideController.passengerCancel);
RideRouter.post("/rides/:id/cancel/driver",AuthDriver,RideController.driverCancel);
RideRouter.post("/rides/:id/rate/passenger",AuthDriver,RideController.ratePassenger);
RideRouter.post("/rides/:id/rate/driver",AuthPassenger,RideController.rateDriver);
RideRouter.get("/rides/:id/detail/passenger",AuthPassenger,RideController.detailPassenger);
RideRouter.get("/rides/:id/detail/driver",AuthDriver,RideController.detailDriver);
RideRouter.post("/rides/:id/driver/message",AuthDriver,RideController.saveDriverMessage);
RideRouter.post("/rides/:id/passenger/message",AuthPassenger,RideController.savePassengerMessage);
RideRouter.get("/rides/:id/messages/driver",AuthDriver,RideController.getRideMessagesDriver);
RideRouter.get("/rides/:id/messages/passenger",AuthPassenger,RideController.getRideMessagesPassenger);

export default RideRouter;
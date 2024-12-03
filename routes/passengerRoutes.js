import { Router } from 'express';
import * as PassengerController from "../controllers/PassengerController.js"
import * as PassengerMessageController from "../controllers/PassengerMessageController.js";
import AuthPassenger from '../middleware/AuthPassenger.js';



const PassengerRouter = Router();


PassengerRouter.post("/passengers/auth/register",PassengerController.store);
PassengerRouter.post("/passengers/message",AuthPassenger,PassengerMessageController.store);

PassengerRouter.post("/passengers/auth/login",PassengerController.login);

PassengerRouter.post("/passengers/auth/email/verify/request",AuthPassenger,PassengerController.sendVerifyEmail);
PassengerRouter.post("/passengers/auth/verifyemail",AuthPassenger,PassengerController.verifyEmail);

PassengerRouter.post("/passengers/auth/password/request",PassengerController.requestEmailPassword);
PassengerRouter.post("/passengers/auth/password/reset",PassengerController.resetPassword);

PassengerRouter.post("/passengers/auth/token",AuthPassenger,PassengerController.validateToken);
PassengerRouter.post("/passengers/update",AuthPassenger,PassengerController.update);
PassengerRouter.get("/passengers/rides",AuthPassenger,PassengerController.passengerRides);


export default PassengerRouter;



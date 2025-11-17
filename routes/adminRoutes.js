import { Router } from 'express';
import * as AdminController from '../controllers/AdminController.js'
import * as PassengerMessageController from "../controllers/PassengerMessageController.js";
import * as PassengerLogController from "../controllers/PassengerLogController.js"
import AuthAdmin from '../middleware/AuthAdmin.js';



const AdminRouter = Router();

// Admin Routes
//router.post("/admin/auth/register",AdminController.store);
AdminRouter.post("/admin/auth/login",AdminController.login);
AdminRouter.get("/admin/passengers",AuthAdmin,AdminController.passengers);
AdminRouter.get("/admin/passengers/messages",AuthAdmin,PassengerMessageController.index);
AdminRouter.put("/admin/passengers/messages/:id",AuthAdmin,PassengerMessageController.setStatus);
AdminRouter.delete("/admin/passengers/messages/:id",AuthAdmin,PassengerMessageController.destroy);
AdminRouter.get("/admin/logs/passengers?",AuthAdmin,PassengerLogController.index);
AdminRouter.delete("/admin/logs/passengers/:id",AuthAdmin,PassengerLogController.destroy);
AdminRouter.get("/admin/drivers",AuthAdmin,AdminController.drivers);
AdminRouter.get("/admin/drivers/:id",AuthAdmin,AdminController.showDriver);
AdminRouter.get("/admin/passengers/:id",AuthAdmin,AdminController.showPassenger);
AdminRouter.put("/admin/drivers/:id",AuthAdmin,AdminController.updateDriver);
AdminRouter.put("/admin/passengers/:id",AuthAdmin,AdminController.updatePassenger);
AdminRouter.post("/admin/drivers/register",AuthAdmin,AdminController.storeDriver);
AdminRouter.get("/admin/rides?",AuthAdmin,AdminController.getAllRides);
AdminRouter.get("/admin/rides/cancelled?",AuthAdmin,AdminController.getCancelledRides);
AdminRouter.get("/admin/rides/solicited?",AuthAdmin,AdminController.getSolicitedRides);
AdminRouter.get("/admin/rides/:id",AuthAdmin,AdminController.getRideDetail);
AdminRouter.get("/admin/dashboard",AuthAdmin,AdminController.getDashboardData);

export default AdminRouter;
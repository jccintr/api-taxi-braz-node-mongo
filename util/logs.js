
import PassengerLog from "../models/passengerLog.js";
import DriverLog from "../models/driverLog.js";

export const addLog = async (passenger,action,info) => {

    const log = new PassengerLog({ passenger,action,info });
    await log.save();

}

export const addDriverLog = async (driver,action,info) => {

    const log = new DriverLog({ driver,action,info });
    await log.save();

}
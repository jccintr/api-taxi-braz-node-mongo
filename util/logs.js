
import PassengerLog from "../models/passengerLog.js";

export const addLog = async(passenger,action,info) => {

    const log = new PassengerLog({ passenger,action,info });
    await PassengerLog.save();

}
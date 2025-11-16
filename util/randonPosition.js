//import Driver from "../models/driver"
import { driversIds } from "../data/coordinates"
import { coordinates } from "../data/coordinates"

export default updateDriverLocationWithRandonPosition = () => {


    driversIds.forEach((driverId) => {
       
        const randomIndex = Math.floor(Math.random() * coordinates.length);
        console.log(driverId,...coordinates[randomIndex])
    });
}
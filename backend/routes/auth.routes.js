import express from "express"
import {signup,login,logout} from "../controllers/auth.controller.js"
import { checkIn, checkOut } from "../controllers/attendence.controller.js";

import { getWorkingHours } from "../controllers/workingHours.controller.js";
const router = express.Router();

router.post("/login",login);

router.post("/logout",logout);

router.post("/signup",signup);

router.post("/checkin",checkIn);

router.post("/checkout",checkOut);

router.get("/getdata", getWorkingHours);


export default router;
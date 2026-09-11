import { Router } from "express";
import { registerValidator } from "../validator/auth.validator.js";

const router = Router();

router.post('/regsiter', registerValidator);



export default router;
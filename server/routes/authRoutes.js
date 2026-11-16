import express from 'express'
import { login, logout, register} from '../controllers/authController.js';
const accountRoutes = express.Router();

accountRoutes.post("/register",register)
accountRoutes.post("/login",login)
accountRoutes.post("/logout",logout)
export default accountRoutes

import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
  registerCompany,
  getCompany,
  getCompanyById,
  updateCompany,
} from "../controllers/company.controller.js";

const router = express.Router();
router.use(isAuthenticated);

router.route("/register").post(registerCompany);
router.route("/all").get(getCompany);
router.route("/:id").get(getCompanyById);
router.route("/:id").put(updateCompany);

export default router;

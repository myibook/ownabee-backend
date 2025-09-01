import express from "express";

import voicesRoutes from "./voices";

const router = express.Router();

router.use("/voices", voicesRoutes);

export default router;

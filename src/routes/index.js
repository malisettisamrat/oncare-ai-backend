const express = require("express");
const kpiRouter = require("./kpi/kpiRoutes");

const router = express.Router();

router.use("/kpi", kpiRouter);

module.exports = router;

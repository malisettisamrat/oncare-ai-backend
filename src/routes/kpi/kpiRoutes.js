const express = require("express");
const {
  getCompleteVolumes,
  getAddOns,
  getWaitTimes,
  getAvgAppointmentsPerNurse,
  getAvgNursingOvertime,
  getAvgAppointmentsPerChair,
  getLinkedAppointments,
  getSameDayCancellations,
  getNoShows,
  getStaffLunchBreaks,
} = require("../../controllers/kpiController");

const kpiRouter = express.Router();

kpiRouter.get("/completed-volumes", getCompleteVolumes);
kpiRouter.get("/add-ons", getAddOns);
kpiRouter.get("/wait-time", getWaitTimes);
kpiRouter.get("/appointments-per-nurse", getAvgAppointmentsPerNurse);
kpiRouter.get("/nursing-overtime", getAvgNursingOvertime);
kpiRouter.get("/appointments-per-chair", getAvgAppointmentsPerChair);
kpiRouter.get("/linked-appointments", getLinkedAppointments);
kpiRouter.get("/same-day-cancellations", getSameDayCancellations);
kpiRouter.get("/no-shows", getNoShows);
kpiRouter.get("/staff-lunch-breaks", getStaffLunchBreaks);

module.exports = kpiRouter;

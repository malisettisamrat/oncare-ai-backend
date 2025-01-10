const mongoose = require("mongoose");

const NurseSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  nurseId: { type: String, required: true },
  nurseName: { type: String, required: true },
  nurseEmail: { type: String, required: true },

  startTime: { type: Number, default: null },
  endTime: { type: Number, default: null },
  scheduledStartTime: { type: Number, default: null },
  scheduledEndTime: { type: Number, default: null },
  actualStartTime: { type: Number, default: null },
  actualEndTime: { type: Number, default: null },

  lunchBreakStart: { type: Number, required: true },
  lunchBreakEnd: { type: Number, required: true },
  assignedPatients: [{ type: Number, required: true }],
});

const PatientSchema = new mongoose.Schema({
  patientId: { type: Number, required: true },
  patientName: { type: String, required: true },
  patientMRN: { type: String, required: true },
  readyTime: { type: Number, required: true },
  length: { type: Number, required: true },
  dueTime: { type: Number, required: true },
  acuity: { type: Number, required: true },
  infusionType: { type: String, required: true },
  visitStatus: { type: String, required: true },
  department: { type: String, default: null },
  clinicProvider: { type: String, default: null },
  clinicAppointmentTime: { type: String, default: null },
  assignedChair: { type: Number, required: true },
  assignedNurse: { type: String, required: true },
  linked: { type: Boolean, required: true },
  bookedDate: { type: String, required: true },
  originalInfo: {
    patientId: { type: Number },
    patientName: { type: String },
    patientMRN: { type: String },
    readyTime: { type: Number },
    length: { type: Number },
    dueTime: { type: Number },
    acuity: { type: Number },
    infusionType: { type: String },
    visitStatus: { type: String },
    department: { type: String, default: null },
    clinicProvider: { type: String, default: null },
    clinicAppointmentTime: { type: String, default: null },
    assignedChair: { type: Number },
    assignedNurse: { type: String },
    linked: { type: Boolean },
    bookedDate: { type: String },
    scheduledStartTime: { type: Number },
    scheduledEndTime: { type: Number },
    actualStartTime: { type: Number, default: null },
    actualEndTime: { type: Number, default: null },
    actualDuration: { type: Number, default: null },
  },
  scheduledStartTime: { type: Number, required: true },
  scheduledEndTime: { type: Number, required: true },
  actualStartTime: { type: Number, default: null },
  actualEndTime: { type: Number, default: null },
  actualDuration: { type: Number, default: null },
});

const ScheduleSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
  },
  patients: [PatientSchema],
  nurses: [NurseSchema],
});

module.exports = mongoose.model("Schedule", ScheduleSchema);

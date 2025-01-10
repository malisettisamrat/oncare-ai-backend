const Schedule = require("../models/Schedule");

// API to get Complete Volumes..
const getCompleteVolumes = async (req, res) => {
  try {
    const date = req.query.date || new Date().toISOString().split("T")[0];

    // Get schedule on a particular date...
    const schedule = await Schedule.findOne({ date });

    // If schedule doesn't exist
    if (!schedule) {
      return res.status(404).json({
        message: `No schedule found for the date: ${date}`,
        completedVolumes: 0,
      });
    }

    // Filter out the completed volumes...
    const completedVolumes = schedule.patients.filter(
      (patient) => patient.visitStatus === "Completed"
    ).length;

    res.status(200).json({
      date,
      completedVolumes,
    });
  } catch (error) {
    console.error(`Error fetching completed volumes: ${error.message}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// API to get Add-ons...
const getAddOns = async (req, res) => {
  try {
    const date = req.query.date || new Date().toISOString().split("T")[0];

    // Get schedules on that date...
    const schedule = await Schedule.findOne({ date });

    // If schedule doesn't exist
    if (!schedule) {
      return res.status(404).json({
        message: `No schedule found for the date: ${date}`,
        addOns: 0,
      });
    }

    // Get patients count who booked and treated on the same day...
    const addOns = schedule.patients.filter((patient) => {
      const bookingDate = new Date(patient.bookedDate)
        .toISOString()
        .split("T")[0];
      const scheduledDate = new Date(schedule.date).toISOString().split("T")[0];
      return bookingDate === scheduledDate;
    }).length;

    res.status(200).json({
      date,
      addOns,
    });
  } catch (error) {}
};

// Calculate the avg. wait time of the patients..
const getWaitTimes = async (req, res) => {
  try {
    const date = req.query.date || new Date().toISOString().split("T")[0];

    const schedule = await Schedule.findOne({ date });

    // If schedule doesn't exist
    if (!schedule) {
      return res.status(404).json({
        message: `No schedule found for the date: ${date}`,
        addOns: 0,
      });
    }

    // Calculate the wait time for all patients on given date...
    const waitTimes = schedule.patients
      .filter((patient) => patient.readyTime && patient.scheduledStartTime) // Ensure both fields are present
      .map(
        (patient) => Math.max(patient.readyTime - patient.scheduledStartTime, 0) // Ensure that wait time is postive
      );

    // Calculate the average wait time
    const avgWaitTime = waitTimes.length
      ? Math.round(
          waitTimes.reduce((sum, time) => sum + time, 0) / waitTimes.length
        )
      : 0;

    res.status(200).json({
      date,
      avgWaitTime,
    });
  } catch (error) {
    console.log(`${error.message}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get the average number of patients assigned to each nurse on a given day..
const getAvgAppointmentsPerNurse = async (req, res) => {
  try {
    const date = req.query.date || new Date().toISOString().split("T")[0];

    // Get schedules on that date...
    const schedule = await Schedule.findOne({ date });

    // If schedule doesn't exist
    if (!schedule) {
      return res.status(404).json({
        message: `No schedule found for the date: ${date}`,
        addOns: 0,
      });
    }

    const totalNurses = schedule.nurses.length;
    const totalPatients = schedule.nurses.reduce(
      (sum, nurse) => sum + nurse.assignedPatients.length,
      0
    );

    const avgAppointmentsPerNurse =
      totalNurses > 0 ? totalPatients / totalNurses : 0;

    res.status(200).json({
      date,
      avgAppointmentsPerNurse: parseFloat(avgAppointmentsPerNurse.toFixed(2)),
    });
  } catch (error) {
    console.log(`${error.message}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get Nurse average overtime per each day
const getAvgNursingOvertime = async (req, res) => {
  try {
    const date = req.query.date || new Date().toISOString().split("T")[0];

    // Get schedules on that date...
    const schedule = await Schedule.findOne({ date });

    // If schedule doesn't exist
    if (!schedule) {
      return res.status(404).json({
        message: `No schedule found for the date: ${date}`,
        addOns: 0,
      });
    }

    const totalOvertime = schedule.nurses.reduce((totalOvertime, nurse) => {
      let overtime = 0;
      if (nurse.actualEndTime && nurse.scheduledEndTime) {
        overtime = Math.max(0, nurse.actualEndTime - nurse.scheduledEndTime);
      }

      return totalOvertime + overtime;
    }, 0);

    // Get the total nurses and calculate the average overtime of the nurses...
    const totalNurses = schedule.nurses.length;
    const avgOvertime = totalNurses > 0 ? totalOvertime / totalNurses : 0;

    res.status(200).json({
      date,
      avgNursingOvertime: parseFloat(avgOvertime.toFixed(2)),
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get the average appointments per chair
const getAvgAppointmentsPerChair = async (req, res) => {
  try {
    const date = req.query.date || new Date().toISOString().split("T")[0];

    // Get schedules on that date...
    const schedule = await Schedule.findOne({ date });

    // If schedule doesn't exist
    if (!schedule) {
      return res.status(404).json({
        message: `No schedule found for the date: ${date}`,
        addOns: 0,
      });
    }

    const chairAssignments = {};

    // Calculate the number of patients assigned to each chair...
    schedule.patients.forEach((patient) => {
      if (patient.assignedChair) {
        chairAssignments[patient.assignedChair] =
          (chairAssignments[patient.assignedChair] || 0) + 1;
      }
    });

    const totalChairsUsed = Object.keys(chairAssignments).length;
    const totalPatients = schedule.patients.length;

    // Calculate the average appointments per chair..
    const avgAppointmentsPerChair =
      totalChairsUsed > 0 ? totalPatients / totalChairsUsed : 0;

    res.status(200).json({
      date,
      avgAppointmentsPerChair: parseFloat(avgAppointmentsPerChair).toFixed(2),
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get linked appointments...
const getLinkedAppointments = async (req, res) => {
  try {
    const date = req.query.date || new Date().toISOString().split("T")[0];

    // Get schedules on that date...
    const schedule = await Schedule.findOne({ date });

    // If schedule doesn't exist
    if (!schedule) {
      return res.status(404).json({
        message: `No schedule found for the date: ${date}`,
        addOns: 0,
      });
    }

    // Count the number of linked appointments...
    const linkedAppointmentsCount = schedule.patients.filter(
      (patient) => patient.linked === true
    ).length;

    res.status(200).json({
      date,
      linkedAppointments: linkedAppointmentsCount,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get the count of patients who cancelled the appointments on the same day...
const getSameDayCancellations = async (req, res) => {
  try {
    const date = req.query.date || new Date().toISOString().split("T")[0];

    // Get schedules on that date...
    const schedule = await Schedule.findOne({ date });

    // If schedule doesn't exist
    if (!schedule) {
      return res.status(404).json({
        message: `No schedule found for the date: ${date}`,
        addOns: 0,
      });
    }

    // count the patients who has cancelled on the same booking date...
    const countForSameDayCancellation = schedule.patients.filter(
      (patient) =>
        patient.bookedDate === date && patient.visitStatus === "Cancelled"
    ).length;

    res
      .status(200)
      .json({ date, sameDayCancellation: countForSameDayCancellation });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get the No shows of the patient..
const getNoShows = async (req, res) => {
  try {
    const date = req.query.date || new Date().toISOString().split("T")[0];

    // Get schedules on that date...
    const schedule = await Schedule.findOne({ date });

    // If schedule doesn't exist
    if (!schedule) {
      return res.status(404).json({
        message: `No schedule found for the date: ${date}`,
        addOns: 0,
      });
    }

    // Calculate the no show count of the patients on that day...
    const noShowCount = schedule.patients.filter(
      (patient) => patient.visitStatus === "No Show"
    ).length;

    res.status(200).json({
      date,
      noShows: noShowCount,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get the count of the nurses followed the lunch break policy..
const getStaffLunchBreaks = async (req, res) => {
  try {
    const date = req.query.date || new Date().toISOString().split("T")[0];

    // Get schedules on that date...
    const schedule = await Schedule.findOne({ date });

    // If schedule doesn't exist
    if (!schedule) {
      return res.status(404).json({
        message: `No schedule found for the date: ${date}`,
        addOns: 0,
      });
    }

    const minLunchBreakDuration = 30;

    // calculate the nurse count...
    const nurseCount = schedule.nurses.filter((nurse) => {
      const lunchBreakDuration = nurse.lunchBreakEnd - nurse.lunchBreakStart;

      return (
        lunchBreakDuration >= minLunchBreakDuration &&
        nurse.lunchBreakStart >= nurse.startTime &&
        nurse.lunchBreakEnd <= nurse.endTime
      );
    }).length;

    res.status(200).json({
      date,
      nursesCount: nurseCount,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
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
};

const depotService = require("../services/depotService");
const vehicleService = require("../services/vehicleService");
const schedulerService = require("../services/schedulerService");
const { Log } = require("../middleware/logger");

const getSchedule = async (req, res) => {
  try {
    await Log(
      "backend",
      "info",
      "controller",
      "Vehicle scheduler started"
    );

    await Log(
      "backend",
      "info",
      "service",
      "Fetching depots"
    );

    const depots = await depotService.getDepots();

    await Log(
      "backend",
      "info",
      "service",
      "Fetching vehicles"
    );

    const vehicles = await vehicleService.getVehicles();

    const result = depots.map((depot) => {
      const schedule =
        schedulerService.scheduleVehicles(
          vehicles,
          depot.MechanicHours
        );

      const hoursUsed =
        schedule.selectedVehicles.reduce(
          (sum, vehicle) =>
            sum + vehicle.Duration,
          0
        );

      return {
        depotId: depot.ID,
        mechanicHours:
          depot.MechanicHours,
        hoursUsed,
        remainingHours:
          depot.MechanicHours -
          hoursUsed,
        totalImpact:
          schedule.totalImpact,
        totalTasks:
          schedule.selectedVehicles.length,
        selectedVehicles:
          schedule.selectedVehicles
      };
    });

    await Log(
      "backend",
      "info",
      "service",
      `Generated schedules for ${depots.length} depots`
    );

    await Log(
      "backend",
      "info",
      "controller",
      "Vehicle scheduler completed"
    );

    res.status(200).json({
      success: true,
      totalDepots: result.length,
      data: result
    });
  } catch (error) {
    console.error(error);

    await Log(
      "backend",
      "error",
      "controller",
      error.message
    );

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getSchedule
};
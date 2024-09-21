import { calculateBatteryPriority } from "../engine/battery-calculation";
import { InterrogationRequestType, Rule } from "../types";
import { MDC_IDC_ENUM_BATTERY_STATUS } from "../types/enums";

describe("calculateBatteryPriority", () => {
  let mockData: InterrogationRequestType;
  let mockRule: Rule;

  beforeEach(() => {
    mockData = {
      transmission: {
        measurements: {
          batteryMeasurements: [
            {
              status: "NORMAL" as MDC_IDC_ENUM_BATTERY_STATUS,
              impedance: 100,
              voltage: 3.6,
              remainingPercentage: 80,
              remainingLongevity: 5,
              date: "2023-01-01",
            },
          ],
        },
      },
    } as InterrogationRequestType;

    mockRule = {
      id: "test-rule",
      priority: 1,
      type: "battery",
      rules: {
        position: {
          status: ["NORMAL"],
        },
        valueRange: {
          impedance_min: 20,
          voltage_min: 3,
          remainingPercentage_min: 50,
          remainingLongevity_min: 2,
          impedance_max: 200,
          voltage_max: 5,
          remainingPercentage_max: 100,
          remainingLongevity_max: 10,
        },
      },
    } as Rule;
  });

  it("should handle missing rules correctly", () => {
    const mockRuleCopy = JSON.parse(JSON.stringify(mockRule));
    mockRuleCopy.rules.position = {};
    mockRuleCopy.rules.valueRange = {};

    const result = calculateBatteryPriority(mockData, mockRuleCopy);
    expect(result.priority).toBe(0);
    expect(result.issues).toHaveLength(0);
  });

  it("should return priority 0 when all values are within range", () => {
    const result = calculateBatteryPriority(mockData, mockRule);
    expect(result.priority).toBe(0);
    expect(result.issues).toHaveLength(0);
  });

  it("should return correct priority when a value is out of range", () => {
    if (mockData.transmission.measurements?.batteryMeasurements) {
      mockData.transmission.measurements.batteryMeasurements[0].impedance = 250;
    }
    const result = calculateBatteryPriority(mockData, mockRule);
    expect(result.priority).toBe(1);
    expect(result.issues).toHaveLength(1);
    expect(result.issues?.[0].field_path).toEqual(["impedance"]);
  });

  it("should handle RRT status correctly", () => {
    if (mockData.transmission.measurements?.batteryMeasurements) {
      mockData.transmission.measurements.batteryMeasurements[0].status =
        "RRT" as MDC_IDC_ENUM_BATTERY_STATUS;
    }
    if (mockRule.rules?.position) {
      mockRule.rules.position.status = ["RRT"];
    }
    const result = calculateBatteryPriority(mockData, mockRule);
    expect(result.priority).toBe(1);
    expect(result.issues).toHaveLength(1);
    expect(result.issues?.[0].field_path).toEqual(["status"]);
  });

  it("should handle missing measurements correctly", () => {
    mockData.transmission.measurements = {
      batteryMeasurements: [],
      capacitorMeasurements: [],
      leadHVChannelMeasurements: [],
      heartFailureMeasurements: [],
      leadChannelMeasurements: [],
    };
    const result = calculateBatteryPriority(mockData, mockRule);
    expect(result.priority).toBe(0);
    expect(result.issues).toHaveLength(0);
  });

  it("should handle undefined or null values correctly", () => {
    if (mockData.transmission.measurements?.batteryMeasurements) {
      mockData.transmission.measurements.batteryMeasurements[0].impedance =
        undefined;
    }
    const result = calculateBatteryPriority(mockData, mockRule);
    console.log(result);

    expect(result.priority).toBe(0);
    expect(result.issues).toHaveLength(0);
  });

  it("should handle missing range keys correctly", () => {
    const mockRuleCopy = JSON.parse(JSON.stringify(mockRule));

    mockRuleCopy.rules.valueRange = {};

    const result = calculateBatteryPriority(mockData, mockRule);
    expect(result.priority).toBe(0);
    expect(result.issues).toHaveLength(0);
  });

  it("should handle unknown battery status correctly", () => {
    if (mockData.transmission.measurements?.batteryMeasurements) {
      mockData.transmission.measurements.batteryMeasurements[0].status =
        "Unknown" as MDC_IDC_ENUM_BATTERY_STATUS;
    }
    if (mockRule.rules?.position) {
      mockRule.rules.position.status = ["NORMAL"];
    }
    const result = calculateBatteryPriority(mockData, mockRule);
    expect(result.priority).toBe(0);
    expect(result.issues).toHaveLength(0);
  });

  it("should handle higher voltage value", () => {
    if (mockData.transmission.measurements?.batteryMeasurements) {
      mockData.transmission.measurements.batteryMeasurements[0].voltage = 1000;
      mockRule.priority = 2;
    }
    const result = calculateBatteryPriority(mockData, mockRule);
    expect(result.priority).toBe(2);
    expect(result.issues).toHaveLength(1);
  });

  it("should handle lower voltage value", () => {
    if (mockData.transmission.measurements?.batteryMeasurements) {
      mockData.transmission.measurements.batteryMeasurements[0].voltage = 1;
      mockRule.priority = 2;
    }
    const result = calculateBatteryPriority(mockData, mockRule);
    expect(result.priority).toBe(2);
    expect(result.issues).toHaveLength(1);
  });
});

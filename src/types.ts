import { Static, Type } from "@sinclair/typebox";

export const InterrogationRequest = Type.Object({
  transmission: Type.Object({
    reports: Type.Optional(Type.Array(Type.Any())),
    notes: Type.Optional(Type.Array(Type.Any())),
    device: Type.Object({
      type: Type.String(),
      model: Type.String(),
      serial: Type.String(),
      manufacturer: Type.String(),
      implantDate: Type.Optional(Type.String()),
      implanter: Type.Optional(Type.String()),
      implanterContactInfo: Type.Optional(Type.String()),
      implantingFacility: Type.Optional(Type.String()),
    }),
    session: Type.Object({
      date: Type.String(),
      type: Type.String(),
      previousDate: Type.Optional(Type.String()),
      reprogrammed: Type.Optional(Type.String()),
      clinicName: Type.Optional(Type.String()),
      clinicianName: Type.Optional(Type.String()),
      clinicianContactInformation: Type.Optional(Type.String()),
      previousType: Type.Optional(Type.String()),
    }),
    leads: Type.Array(
      Type.Object({
        model: Type.String(),
        serial: Type.String(),
        manufacturer: Type.String(),
        implantDate: Type.String(),
        polarityType: Type.Optional(Type.String()),
        location: Type.Optional(Type.String()),
        locationDetail: Type.String(),
        connectionStatus: Type.Optional(Type.String()),
      })
    ),
    episodes: Type.Array(
      Type.Object({
        episodeId: Type.String(),
        date: Type.String(),
        type: Type.String(),
        typeInduced: Type.Optional(Type.String()),
        vendorType: Type.Optional(Type.String()),
        therapyResult: Type.Optional(Type.String()),
        extendedData: Type.Record(Type.String(), Type.Optional(Type.String())),
        duration: Type.Optional(Type.Number()),
        averageAtrialRate: Type.Optional(Type.Number()),
        averageVentricleRate: Type.Optional(Type.Number()),
        maximumAtrialRate: Type.Optional(Type.Number()),
        maximumVentricleRate: Type.Optional(Type.Number()),
        inProgress: Type.Optional(Type.Boolean()),
        numberOfAtpSequencesDelivered: Type.Optional(Type.Number()),
        detectionTherapyDetails: Type.Optional(Type.String()),
        atrialIntervalAtDetection: Type.Optional(Type.Number()),
      })
    ),
    measurements: Type.Object({
      batteryMeasurements: Type.Array(
        Type.Object({
          date: Type.String(),
          status: Type.String(),
          voltage: Type.Optional(Type.Number()),
          remainingPercentage: Type.Optional(Type.Number()),
          rrtTrigger: Type.Optional(Type.String()),
          remainingLongevity: Type.Optional(Type.Number()),
          impedance: Type.Optional(Type.Number()),
        })
      ),
      capacitorMeasurements: Type.Array(
        Type.Object({
          chargeDate: Type.String(),
          chargeDuration: Type.Number(),
          chargeEnergy: Type.Optional(Type.Number()),
          chargeType: Type.String(),
        })
      ),
      leadHVChannelMeasurements: Type.Array(
        Type.Object({
          startDate: Type.String(),
          endDate: Type.Optional(Type.String()),
          impedance: Type.Number(),
          type: Type.String(),
          status: Type.Optional(Type.String()),
          location: Type.Optional(Type.String()),
        })
      ),
      heartFailureMeasurements: Type.Array(Type.Any()),
      leadChannelMeasurements: Type.Array(
        Type.Object({
          chamber: Type.String(),
          startDate: Type.Optional(Type.String()),
          endDate: Type.Optional(Type.String()),
          status: Type.Optional(Type.String()),
          sensing: Type.Optional(
            Type.Object({
              intrinsicAmplitudeMin: Type.Optional(Type.Number()),
              intrinsicAmplitudeMean: Type.Optional(Type.Number()),
              polarity: Type.String(),
              date: Type.String(),
              intrinsicAmplitude: Type.Optional(Type.Number()),
            })
          ),
          pacingThreshold: Type.Optional(
            Type.Object({
              amplitude: Type.Optional(Type.Number()),
              pulseWidth: Type.Optional(Type.Number()),
              measurementMethod: Type.Optional(Type.String()),
              polarity: Type.String(),
              date: Type.String(),
            })
          ),
          impedance: Type.Optional(
            Type.Object({
              value: Type.Number(),
              polarity: Type.String(),
              date: Type.String(),
            })
          ),
          electrodes: Type.Optional(Type.Array(Type.String())),
        })
      ),
    }),
    settings: Type.Optional(
      Type.Object({
        brady: Type.Object({
          mode: Type.String(),
          vendorMode: Type.Optional(Type.String()),
          lowRate: Type.Number(),
          sensorType: Type.Optional(Type.String()),
          maxTrackingRate: Type.Number(),
          maxSensorRate: Type.Number(),
          savDelayHigh: Type.Optional(Type.Number()),
          savDelayLow: Type.Optional(Type.Number()),
          atModeSwitchMode: Type.Optional(Type.String()),
          atModeSwitchRate: Type.Optional(Type.Number()),
          pavDelayLow: Type.Optional(Type.Number()),
          pavDelayHigh: Type.Optional(Type.Number()),
        }),
        crt: Type.Optional(
          Type.Object({
            lvrvDelay: Type.Number(),
            pacedChambers: Type.String(),
          })
        ),
        magnet: Type.Optional(
          Type.Object({
            response: Type.String(),
          })
        ),
        tachyTherapy: Type.Optional(
          Type.Object({
            vstat: Type.String(),
            astat: Type.Optional(Type.String()),
          })
        ),
        zones: Type.Array(
          Type.Object({
            type: Type.String(),
            shockSettings: Type.Array(
              Type.Object({
                energy: Type.Number(),
                maxShocks: Type.Number(),
              })
            ),
            atpSettings: Type.Array(
              Type.Object({
                type: Type.String(),
                sequences: Type.Number(),
              })
            ),
            detectionInterval: Type.Optional(Type.Number()),
            vendorType: Type.Optional(Type.String()),
            status: Type.Optional(Type.String()),
            detectionBeatsNumerator: Type.Optional(Type.Number()),
            detectionBeatsDenominator: Type.Optional(Type.Number()),
            detectionDetails: Type.Optional(Type.String()),
          })
        ),
        leadChannels: Type.Array(
          Type.Object({
            chamber: Type.String(),
            sensing: Type.Object({
              sensitivity: Type.Number(),
              polarity: Type.Optional(Type.String()),
              electrodes: Type.Array(
                Type.Object({
                  type: Type.String(),
                  name: Type.String(),
                  location: Type.String(),
                })
              ),
              adaptationMode: Type.Optional(Type.String()),
            }),
            pacing: Type.Object({
              amplitude: Type.Optional(Type.Number()),
              polarity: Type.Optional(Type.String()),
              captureMode: Type.Optional(Type.String()),
              electrodes: Type.Array(
                Type.Object({
                  type: Type.String(),
                  name: Type.String(),
                  location: Type.String(),
                })
              ),
            }),
          })
        ),
      })
    ),
    statistics: Type.Optional(
      Type.Object({
        atrialTachy: Type.Array(
          Type.Object({
            startDate: Type.String(),
            endDate: Type.String(),
            burdenPercent: Type.Number(),
            modeSWCountPerDay: Type.Optional(Type.Number()),
            modeSWPercentTimePerDay: Type.Optional(Type.Number()),
          })
        ),
        brady: Type.Array(
          Type.Object({
            startDate: Type.String(),
            endDate: Type.String(),
            raPercentPaced: Type.Optional(Type.Number()),
            rvPercentPaced: Type.Number(),
            apvpPercent: Type.Optional(Type.Number()),
            asvpPercent: Type.Optional(Type.Number()),
            apvsPercent: Type.Optional(Type.Number()),
            asvsPercent: Type.Optional(Type.Number()),
          })
        ),
        crt: Type.Optional(
          Type.Object({
            startDate: Type.String(),
            endDate: Type.String(),
            lvPercentPaced: Type.Number(),
            percentPaced: Type.Optional(Type.Number()),
          })
        ),
        heartRate: Type.Array(
          Type.Object({
            startDate: Type.String(),
            endDate: Type.String(),
            atrialRateMean: Type.Number(),
            ventricularRateMean: Type.Number(),
          })
        ),
        tachyTherapy: Type.Optional(
          Type.Object({
            recentShocksDelivered: Type.Number(),
            totalShocksDelivered: Type.Number(),
            recentShocksAborted: Type.Number(),
            totalShocksAborted: Type.Number(),
            recentAtpDelivered: Type.Number(),
            totalAtpDelivered: Type.Number(),
            recentStartDate: Type.String(),
            recentEndDate: Type.String(),
            totalStartDate: Type.String(),
            totalEndDate: Type.String(),
          })
        ),
        episode: Type.Array(
          Type.Object({
            type: Type.String(),
            recentCount: Type.Optional(Type.Number()),
            recentCountStartDate: Type.Optional(Type.String()),
            recentCountEndDate: Type.Optional(Type.String()),
            totalCount: Type.Optional(Type.Number()),
            totalCountStartDate: Type.Optional(Type.String()),
            totalCountEndDate: Type.Optional(Type.String()),
            typeInduced: Type.Optional(Type.String()),
            vendorType: Type.Optional(Type.String()),
          })
        ),
        activity: Type.Array(Type.Any()),
      })
    ),
    biotronik: Type.Optional(Type.Any()),
    notifications: Type.Optional(
      Type.Array(
        Type.Object({
          id: Type.String(),
          date: Type.String(),
          status: Type.String(),
          description: Type.String(),
          priority: Type.String(),
        })
      )
    ),
  }),
  patient: Type.Object({
    age: Type.Number(),
    currentlyTakingOAC: Type.Optional(Type.Boolean()),
    manufacturer: Type.String(),
    device_type: Type.String(),
  }),
  user_id: Type.String(),
  triggered_rule_ids: Type.Array(Type.String()),
});

export type ComparisonOperator =
  | "eq" // equals
  | "neq" // not equals
  | "gt" // greater than
  | "gte" // greater than or equal to
  | "lt" // less than
  | "lte" // less than or equal to
  | "between" // between two values
  | "in" // in a list of values
  | "nin" // not in a list of values
  | "contains" // contains a substring
  | "ncontains" // does not contain a substring
  | "startswith" // starts with
  | "endswith" // ends with
  | "isnull" // is null
  | "notnull"; // is not null

export interface FilterRow {
  fieldName: string[];
  operator: ComparisonOperator;
  value: any[];
}

export type LogicalOperator = "and" | "or";

export interface FilterRule {
  operator: LogicalOperator;
  conditions: (FilterRow | FilterRule)[];
}

// Patient rules interface
export interface PatientRules {
  includedPatients: string[];
  excludedPatients: string[];
  conditions: FilterRule;
}

// Main Rule interface
export interface Rule {
  id: string;
  userId: string | null;
  patientId: string | null;
  type: string;
  name: string;
  description: string | null;
  patientRules: PatientRules;
  interrogationRules: FilterRule;
  rules: any;
  createdAt: Date;
  updatedAt: Date;
  active: boolean;
  priority: number | null;
}

const exampleRule: Rule = {
  id: "cuidjnasnsajknasf",
  userId: "user123",
  patientId: null,
  type: "episode",
  name: "High-risk Episode Rule",
  description: "Detects potentially dangerous episodes",
  patientRules: {
    includedPatients: ["patient1", "patient2"],
    excludedPatients: ["patient3"],
    conditions: {
      operator: "and",
      conditions: [
        {
          fieldName: ["age"],
          operator: "gt",
          value: [65],
        },
        {
          operator: "or",
          conditions: [
            {
              fieldName: ["currentlyTakingOAC"],
              operator: "eq",
              value: [true],
            },
            {
              fieldName: ["device_type"],
              operator: "in",
              value: ["CRT_P", "CRT_D"],
            },
          ],
        },
      ],
    },
  },
  interrogationRules: {
    operator: "and",
    conditions: [
      {
        fieldName: ["interrogations", "device", "type"],
        operator: "in",
        value: ["IPG", "CRT_P", "CRT_D"],
      },
      {
        operator: "or",
        conditions: [
          {
            fieldName: ["episodes", "duration"],
            operator: "gt",
            value: [300],
          },
          {
            fieldName: ["episodes", "treated"],
            operator: "eq",
            value: [true],
          },
        ],
      },
    ],
  },
  rules: {},
  createdAt: new Date(),
  updatedAt: new Date(),
  active: true,
  priority: 1,
};

export type InterrogationRequestType = Static<typeof InterrogationRequest>;

import { Static, Type } from "@sinclair/typebox";

export const InterrogationRequest = Type.Object(
  {
    reports: Type.Optional(
      Type.Array(
        Type.Object({
          type: Type.Optional(Type.String()),
          name: Type.Optional(Type.String()),
          identifier: Type.Optional(Type.String()),
          content: Type.Optional(Type.String()),
          storageId: Type.Optional(Type.Any()),
        })
      )
    ),
    notes: Type.Optional(Type.Array(Type.Optional(Type.Any()))),
    device: Type.Optional(
      Type.Object({
        type: Type.Optional(Type.String()),
        model: Type.Optional(Type.String()),
        serial: Type.Optional(Type.String()),
        manufacturer: Type.Optional(Type.String()),
        implantDate: Type.Optional(Type.String()),
      })
    ),
    session: Type.Optional(
      Type.Object({
        date: Type.Optional(Type.String()),
        type: Type.Optional(Type.String()),
        clinicName: Type.Optional(Type.String()),
      })
    ),
    leads: Type.Optional(
      Type.Array(
        Type.Object({
          model: Type.Optional(Type.String()),
          serial: Type.Optional(Type.String()),
          manufacturer: Type.Optional(Type.String()),
          implantDate: Type.Optional(Type.String()),
          polarityType: Type.Optional(Type.String()),
          location: Type.Optional(Type.String()),
          locationDetail: Type.Optional(Type.String()),
        })
      )
    ),
    episodes: Type.Optional(
      Type.Array(
        Type.Object({
          episodeId: Type.Optional(Type.String()),
          date: Type.Optional(Type.String()),
          type: Type.Optional(Type.String()),
          vendorType: Type.Optional(Type.String()),
          detectionTherapyDetails: Type.Optional(Type.String()),
          extendedData: Type.Optional(
            Type.Object({}, { additionalProperties: true })
          ),
          typeInduced: Type.Optional(Type.String()),
          ventricularIntervalAtDetection: Type.Optional(Type.Number()),
          duration: Type.Optional(Type.Number()),
          atrialIntervalAtDetection: Type.Optional(Type.Number()),
        })
      )
    ),
    measurements: Type.Optional(
      Type.Object({
        batteryMeasurements: Type.Optional(
          Type.Array(
            Type.Object({
              date: Type.Optional(Type.String()),
              status: Type.Optional(Type.String()),
              remainingLongevity: Type.Optional(Type.Number()),
              remainingPercentage: Type.Optional(Type.Number()),
            })
          )
        ),
        capacitorMeasurements: Type.Optional(
          Type.Array(Type.Optional(Type.Any()))
        ),
        leadHVChannelMeasurements: Type.Optional(
          Type.Array(Type.Optional(Type.Any()))
        ),
        heartFailureMeasurements: Type.Optional(
          Type.Array(Type.Optional(Type.Any()))
        ),
        leadChannelMeasurements: Type.Optional(
          Type.Array(
            Type.Object({
              chamber: Type.Optional(Type.String()),
              startDate: Type.Optional(Type.String()),
              status: Type.Optional(Type.String()),
              sensing: Type.Optional(
                Type.Object({
                  intrinsicAmplitudeMean: Type.Optional(Type.Number()),
                  polarity: Type.Optional(Type.String()),
                  date: Type.Optional(Type.String()),
                })
              ),
              pacingThreshold: Type.Optional(
                Type.Object({
                  measurementMethod: Type.Optional(Type.String()),
                  polarity: Type.Optional(Type.String()),
                  amplitude: Type.Optional(Type.Number()),
                  pulseWidth: Type.Optional(Type.Number()),
                  date: Type.Optional(Type.String()),
                })
              ),
              impedance: Type.Optional(
                Type.Object({
                  value: Type.Optional(Type.Number()),
                  polarity: Type.Optional(Type.String()),
                  date: Type.Optional(Type.String()),
                })
              ),
              endDate: Type.Optional(Type.String()),
            })
          )
        ),
      })
    ),
    settings: Type.Optional(
      Type.Object({
        brady: Type.Optional(
          Type.Object({
            mode: Type.Optional(Type.String()),
            lowRate: Type.Optional(Type.Number()),
            sensorType: Type.Optional(Type.String()),
            maxTrackingRate: Type.Optional(Type.Number()),
            maxSensorRate: Type.Optional(Type.Number()),
            savDelayHigh: Type.Optional(Type.Number()),
            savDelayLow: Type.Optional(Type.Number()),
            pavDelayHigh: Type.Optional(Type.Number()),
            pavDelayLow: Type.Optional(Type.Number()),
            atModeSwitchMode: Type.Optional(Type.String()),
            atModeSwitchRate: Type.Optional(Type.Number()),
          })
        ),
        zones: Type.Optional(
          Type.Array(
            Type.Object({
              type: Type.Optional(Type.String()),
              status: Type.Optional(Type.String()),
              detectionInterval: Type.Optional(Type.Number()),
              shockSettings: Type.Optional(
                Type.Array(Type.Optional(Type.Any()))
              ),
              atpSettings: Type.Optional(Type.Array(Type.Optional(Type.Any()))),
            })
          )
        ),
        leadChannels: Type.Optional(
          Type.Array(
            Type.Object({
              chamber: Type.Optional(Type.String()),
              sensing: Type.Optional(
                Type.Object({
                  sensitivity: Type.Optional(Type.Number()),
                  polarity: Type.Optional(Type.String()),
                  adaptationMode: Type.Optional(Type.String()),
                  electrodes: Type.Optional(
                    Type.Array(Type.Optional(Type.Any()))
                  ),
                })
              ),
              pacing: Type.Optional(
                Type.Object({
                  amplitude: Type.Optional(Type.Number()),
                  polarity: Type.Optional(Type.String()),
                  captureMode: Type.Optional(Type.String()),
                  electrodes: Type.Optional(
                    Type.Array(Type.Optional(Type.Any()))
                  ),
                })
              ),
            })
          )
        ),
      })
    ),
    statistics: Type.Optional(
      Type.Object({
        atrialTachy: Type.Optional(
          Type.Array(
            Type.Object({
              startDate: Type.Optional(Type.String()),
              endDate: Type.Optional(Type.String()),
              burdenPercent: Type.Optional(Type.Number()),
            })
          )
        ),
        brady: Type.Optional(
          Type.Array(
            Type.Object({
              startDate: Type.Optional(Type.String()),
              endDate: Type.Optional(Type.String()),
              raPercentPaced: Type.Optional(Type.Number()),
              rvPercentPaced: Type.Optional(Type.Number()),
            })
          )
        ),
        heartRate: Type.Optional(Type.Array(Type.Optional(Type.Any()))),
        episode: Type.Optional(
          Type.Array(
            Type.Object({
              type: Type.Optional(Type.String()),
              recentCount: Type.Optional(Type.Number()),
              recentCountStartDate: Type.Optional(Type.String()),
              recentCountEndDate: Type.Optional(Type.String()),
              vendorType: Type.Optional(Type.String()),
            })
          )
        ),
        activity: Type.Optional(Type.Array(Type.Optional(Type.Any()))),
      })
    ),
    observations: Type.Optional(
      Type.Array(
        Type.Object({
          type: Type.Optional(Type.String()),
          name: Type.Optional(Type.String()),
          altName: Type.Optional(Type.Any()),
          units: Type.Optional(Type.String()),
          subId: Type.Optional(Type.String()),
          value: Type.Optional(Type.String()),
          date: Type.Optional(Type.String()),
        })
      )
    ),
    patient: Type.Optional(
      Type.Object({
        notes: Type.Optional(Type.Array(Type.Optional(Type.Any()))),
        id: Type.Optional(Type.Any()),
        title: Type.Optional(Type.Any()),
        firstName: Type.Optional(Type.String()),
        lastName: Type.Optional(Type.String()),
        dateOfBirth: Type.Optional(Type.String()),
        sex: Type.Optional(Type.String()),
        mrn: Type.Optional(Type.Any()),
      })
    ),
  },
  { additionalProperties: true }
);

export enum Gender {
  M,
  F,
}

export type RangeParams = {
  page: number;
  perPage: number;
};

export const MAX_VALUE = Number.MAX_SAFE_INTEGER;
export const MIN_VALUE = Number.MIN_SAFE_INTEGER;

export function notEmpty<TValue>(
  value: TValue | null | undefined | void
): value is TValue {
  return value !== null && value !== undefined;
}

export type Context = {
  userID: string;
  db: {
    query: {
      interrogations: (
        where: any,
        options?: any
      ) => Promise<InterrogationRequestType[]>;
    };
  };
};

export type DEVICE_TYPE = "ILR" | "PPM" | "ICD";

export type InterrogationRequestType = Static<typeof InterrogationRequest>;

export const pathMapping = {
    // Lead Mapping (LV, RV, RA)
    lvSensingAmplitude: 'leadChannelMeasurements.LV.sensing.intrinsicAmplitudeMean',
    rvSensingAmplitude: 'leadChannelMeasurements.RV.sensing.intrinsicAmplitudeMean',
    raSensingAmplitude: 'leadChannelMeasurements.RA.sensing.intrinsicAmplitudeMean',
  
    lvSensingPolarity: 'leadChannelMeasurements.LV.sensing.polarity',
    rvSensingPolarity: 'leadChannelMeasurements.RV.sensing.polarity',
    raSensingPolarity: 'leadChannelMeasurements.RA.sensing.polarity',
  
    lvImpedance: 'leadChannelMeasurements.LV.impedance.value',
    rvImpedance: 'leadChannelMeasurements.RV.impedance.value',
    raImpedance: 'leadChannelMeasurements.RA.impedance.value',
  
    lvThresholdAmplitude: 'leadChannelMeasurements.LV.pacingThreshold.amplitude',
    rvThresholdAmplitude: 'leadChannelMeasurements.RV.pacingThreshold.amplitude',
    raThresholdAmplitude: 'leadChannelMeasurements.RA.pacingThreshold.amplitude',
  
    lvThresholdPolarity: 'leadChannelMeasurements.LV.pacingThreshold.polarity',
    rvThresholdPolarity: 'leadChannelMeasurements.RV.pacingThreshold.polarity',
    raThresholdPolarity: 'leadChannelMeasurements.RA.pacingThreshold.polarity',
  
    lvPulseWidth: 'leadChannelMeasurements.LV.pacingThreshold.pulseWidth',
    rvPulseWidth: 'leadChannelMeasurements.RV.pacingThreshold.pulseWidth',
    raPulseWidth: 'leadChannelMeasurements.RA.pacingThreshold.pulseWidth',
  
    // Battery Mapping
    batteryVoltage: 'batteryMeasurements.voltage',
    batteryStatus: 'batteryMeasurements.status',
    batteryImpedance: 'batteryMeasurements.impedance',
    batteryRemainingLongevity: 'batteryMeasurements.remainingLongevity',
    batteryRemainingPercentage: 'batteryMeasurements.remainingPercentage',
  
    // Pacing Mapping
    lvPercentPaced: 'brady.lvPercentPaced',
    rvPercentPaced: 'brady.rvPercentPaced',
    raPercentPaced: 'brady.raPercentPaced',
  
    // Episode Mapping
    episodeId: 'episodes[0].episodeId',
    episodeDuration: 'episodes[0].duration',
    episodeType: 'episodes[0].type',
    episodeVendorType: 'episodes[0].vendorType',
  
    // General
    patientAge: 'patient.age'
  };
  
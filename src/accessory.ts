import {
    AccessoryConfig,
    AccessoryPlugin,
    API,
    CharacteristicEventTypes,
    CharacteristicGetCallback,
    Formats,
    HAP,
    Logging,
    Perms,
    Service,
    Units} from "homebridge";
import OwlUSB from 'node-owlusb';
import { EnergyConsumptionRecord } from 'node-owlusb';

let hap: HAP;
export = (api: API): void => {
    hap = api.hap;
    api.registerAccessory("Owl +USB Energy Meter Homebridge Plugin", OwlUSBPlugin);
};

class OwlUSBPlugin implements AccessoryPlugin {

  private readonly log: Logging;  
  private readonly name: string;
  private readonly owlUSB: OwlUSB;
  private energyConsumption: EnergyConsumptionRecord;

  private readonly energyMeterService: Service;
  private readonly informationService: Service;

  constructor(log: Logging, config: AccessoryConfig) {
    this.log = log;
    this.name = config.name;
    this.owlUSB = new OwlUSB()
    this.energyConsumption = { addr: 0, year: 0, month: 0, day: 0, hour: 0, min: 0,
      amps: 0, watts: 0, cost: 0, ah: 0, wh: 0, isLiveData: false }
    this.owlUSB.on('live', (record: EnergyConsumptionRecord) => 
      this.energyConsumption = record)

    this.energyMeterService = new hap.Service(this.name, hap.Service.Outlet.UUID)
    
    this.energyMeterService.addCharacteristic(hap.Characteristic.On)
      .on(CharacteristicEventTypes.GET, (callback: CharacteristicGetCallback) => {
        callback(undefined, 1)
      })
    
    this.energyMeterService.addCharacteristic(hap.Characteristic.OutletInUse)
      .on(CharacteristicEventTypes.GET, (callback: CharacteristicGetCallback) => {
        callback(undefined, 1)
      })
    
    this.energyMeterService.addCharacteristic(
      new hap.Characteristic("Voltage", "E863F10A-079E-48FF-8F27-9C2605A29F52", {
        format: Formats.UINT16,
        unit: <Units>'Volts',
        perms: [Perms.PAIRED_READ, Perms.NOTIFY]
      })
    )
    .on(CharacteristicEventTypes.GET, (callback: CharacteristicGetCallback) => {
      callback(undefined, 2400)
    })
    
    this.energyMeterService.addCharacteristic(
      new hap.Characteristic("Current", "E863F126-079E-48FF-8F27-9C2605A29F52",
      { format: Formats.UINT16,
        unit: <Units>'Amps',
        perms: [Perms.PAIRED_READ, Perms.NOTIFY]
      })
    )
    .on(CharacteristicEventTypes.GET, (callback: CharacteristicGetCallback) => {
      callback(undefined, this.energyConsumption.amps * 100);
    })
    

    this.energyMeterService.addCharacteristic(
      new hap.Characteristic("Power", "E863F10D-079E-48FF-8F27-9C2605A29F52",
      { format: Formats.FLOAT,
        unit: <Units>'Watts',
        perms: [Perms.PAIRED_READ, Perms.NOTIFY]
      })
    )
    .on(CharacteristicEventTypes.GET, (callback: CharacteristicGetCallback) => {
      callback(undefined, this.energyConsumption.watts * 10);
    })

    this.energyMeterService.addCharacteristic(
      new hap.Characteristic("Energy", "E863F10C-079E-48FF-8F27-9C2605A29F52",
      { format: Formats.FLOAT,
        unit: <Units>'KWh',
        perms: [Perms.PAIRED_READ, Perms.NOTIFY]
      })
    )
    .on(CharacteristicEventTypes.GET, (callback: CharacteristicGetCallback) => {
      callback(undefined, this.energyConsumption.wh);
    })
    
    this.informationService = new hap.Service.AccessoryInformation()
      .setCharacteristic(hap.Characteristic.Manufacturer, "Owl")
      .setCharacteristic(hap.Characteristic.Model, "+USB (CM160)");

    log.info("Owl +USB HomeKit Plugin finished initializing!");
  }

  getServices(): Service[] {
    return [
      this.informationService,
      this.energyMeterService,
    ];
  }
}
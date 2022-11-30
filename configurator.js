module.exports = RED => {
  function DS2482SensorNetworkConfiguratorNode(config) {
    RED.nodes.createNode(this, config);

    this.i2cBus = parseInt(config.i2cBus);
    this.i2cAddress = parseInt(config.i2cAddress);
    this.name = config.name;
  }

  RED.nodes.registerType(
    'ds2482-sensor-network-configurator',
    DS2482SensorNetworkConfiguratorNode
  );

  function DS2482SensorConfiguratorNode(config) {
    RED.nodes.createNode(this, config);

    this.name = config.name;
    this.rom = config.rom;
  }

  RED.nodes.registerType(
    'ds2482-sensor-configurator',
    DS2482SensorConfiguratorNode
  );
};

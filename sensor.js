const { Sensor } = require('ds2482-temperature');

module.exports = (config, onData, onError) => {
  let device = '/dev/i2c-' + parseInt(config.i2cBus).toString();
  let address = parseInt(config.i2cAddress);

  const sensor = new Sensor(config.rom, {
    address,
    device
  });

  return sensor;
};

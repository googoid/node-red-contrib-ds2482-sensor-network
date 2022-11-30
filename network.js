const DsNetwork = require('ds2482-temperature');

module.exports = config => {
  let device = '/dev/i2c-' + parseInt(config.i2cBus).toString();
  let address = parseInt(config.i2cAddress);

  const network = new DsNetwork({
    address,
    device
  });

  return network;
};

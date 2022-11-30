const DsNetwork = require('ds2482-temperature');

module.exports = (config, onData, onError) => {
  let device = '/dev/i2c-' + parseInt(config.i2cBus).toString();
  let address = parseInt(config.i2cAddress);

  const network = new DsNetwork({
    address,
    device,
    pollRate: parseInt(config.pollInterval)
  });

  network
    .init()
    .then(() => {
      network.on('data', onData);
      network.on('error', onError);
    })
    .catch(err => {
      onError(err);
      network.init().then();
    });

  return network;
};

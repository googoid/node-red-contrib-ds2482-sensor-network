const networkFactory = require('./network');
const sensorFactory = require('./sensor');

const instances = {};
const listenerCount = {};

module.exports = RED => {
  function NetworkSensors(n) {
    RED.nodes.createNode(this, n);

    let node = this;
    let networkConfig = RED.nodes.getNode(n.network);

    if (!networkConfig) {
      return;
    }

    function onData(data) {
      let _msg = {
        payload: data
      };

      node.send(_msg);
    }

    function onError(error) {
      node.error(error.toString(), error);
    }

    if (!instances[n.network]) {
      instances[n.network] = networkFactory(
        { ...networkConfig, pollInterval: n.pollInterval },
        onData,
        onError
      );

      listenerCount[n.network] = 1;
    }

    const network = instances[n.network];

    node.on('input', () => {
      network
        .init()
        .then(() => network.search())
        .then(() => network.readTemperatures())
        .then(onData)
        .catch(onError);
    });

    node.on('close', () => {
      listenerCount[n.network]--;

      if (listenerCount[n.network] === 0) {
        network.destroy();

        delete instances[n.network];
        delete instances[n.network];
      }
    });
  }

  RED.nodes.registerType('ds2482-network', NetworkSensors);
};

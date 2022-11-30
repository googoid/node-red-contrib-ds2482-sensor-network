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

    node.on('close', () => {
      network.removeListener('data', onData);
      network.removeListener('error', onError);

      listenerCount[n.network]--;

      if (listenerCount[n.network] === 0) {
        network.destroy();

        delete instances[n.network];
        delete instances[n.network];
      }
    });
  }

  RED.nodes.registerType('ds2482-network', NetworkSensors);

  function Sensor(n) {
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

    const sensor = sensorFactory(
      { ...networkConfig, rom: n.rom },
      onData,
      onError
    );

    function onInput(msg) {
      sensor.readTemperature().then(data => {
        node.send({
          topic: n.rom,
          payload: data
        });
      });
    }

    node.on('input', onInput);

    node.on('close', () => {
      // network.removeListener('data', onData);
      // network.removeListener('error', onError);
      // listenerCount[n.network]--;
      // if (listenerCount[n.network] === 0) {
      //   network.destroy();
      //   delete instances[n.network];
      //   delete instances[n.network];
      // }
    });
  }

  RED.nodes.registerType('ds2482-sensor', Sensor);
};

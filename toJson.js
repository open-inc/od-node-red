module.exports = function(RED) {
  function toJsonNode(config) {
    RED.nodes.createNode(this, config);
    console.log("OD-NODE:", config);
    this.config = config;
    let node = this;
    node.on("input", function(msg) {
      let config = node.config;
      let ts = msg.date || new Date().getTime();
      let value2send = msg.payload;
      if (!Array.isArray(value2send)) {
        value2send = [value2send];
      }

      if (value2send.length !== config.valueTypes.length) {
        node.error(
          "Es wurde eine falsche Anzahl von Werten übergeben. Erhalten: " +
            value2send.length +
            " Erwartet: " +
            config.valueTypes.length,
          msg
        );
        return;
      }

      let json =
        "{" +
        '"id" : "defaultID  ",' +
        '"parent" : [],' +
        '"meta" : {},' +
        '"name" : "default",' +
        '"valueTypes" : [],' +
        '"user" : "defaultUser",' +
        '"values" : []' +
        "}";
      let toSend = JSON.parse(json);
      toSend.valueTypes = config.valueTypes;
      toSend.id = node.config.sensorid;
      toSend.user = node.config.owner;
      toSend.name = node.config.sensorname;
      let value = {
        date: ts,
        value: value2send
      };

      toSend.values = [value];

      newmsg = { payload: toSend };
      node.send(newmsg);
      nodeStatus = { fill: "green", shape: "dot" };
    });
    node.on("close", function() {
      //clearInterval(refreshStatusIntervalId);
      nodeStatus = {};
      node.status({});
    });
  }

  RED.nodes.registerType("od-converter-nodered", toJsonNode);
};

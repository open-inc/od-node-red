module.exports = function(RED) {
  function toJsonNode(config) {
    RED.nodes.createNode(this, config);
    console.log("OD-NODE:", config);
    this.config = config;
    let node = this;

    node.on("input", function(msg) {
      console.log(node);
      let valueType = {
        unit: node.config.unit,
        name: "Wert",
        type: node.config.datatype
      };

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
      toSend.valueTypes = [valueType];
      toSend.id = node.config.sensorid;
      toSend.user = node.config.owner;
      toSend.name = node.config.name;
      let value = {
        date: new Date().getTime(),
        value: [msg.payload]
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

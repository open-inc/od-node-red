/**
 * Copyright JS Foundation and other contributors, http://js.foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

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

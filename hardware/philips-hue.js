const HueApi = require("node-hue-api").HueApi;
const config = require('../config/devices.json');

class PhilipsHue {
    constructor () {
        const api = new HueApi(config.philipsHue.host, config.philipsHue.username);
        this.lights = [];

        // Retrieve a list of all lights from the Hue Bridge
        api.lights().then(result => {
            result.lights.forEach(light => {
                this.lights.push({
                    id: light.id,
                    name: light.name,
                    state: {
                        on: light.state.on,
                        brightness: light.state.bri,
                        hue: light.state.hue,
                        saturation: light.state.sat,
                        effect: light.state.effect,
                        colorTemperature: light.state.ct,
                        reachable: light.state.reachable
                    },
                    model: light.modelid              
                });
            });
        });
    }

    getLights () {
        return this.lights;
    }
}

module.exports = PhilipsHue;
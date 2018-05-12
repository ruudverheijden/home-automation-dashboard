const hue = require("node-hue-api");
const HueApi = hue.HueApi;
const debug = require('debug')('home-automation-dashboard:hardware');
const config = require('../config/devices.json');

const api = new HueApi(config.philipsHue.host, config.philipsHue.username);

class PhilipsHue {
    constructor () {
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

            debug('Lights retrieved from Philips Hue Bridge');
        }).fail(error => {
            debug('Failed to retrieved lights from Philips Hue Bridge due to: ' + error);
        });
    }

    /**
     * Return a array with objects of all lights
     */
    getLights () {
        return this.lights;
    }

    /**
     * Return the object of a specific light
     * 
     * @param {number} id : Identifier of the light
     * @returns {object || boolean} : Return the light object of false if id was not found
     */
    getLight (id) {
        let output = false;

        this.lights.forEach(light => {
            if (id == light.id) {
                output = light;
            }
        });

        return output;
    }

    /**
     * Set a state for a specific light
     * @param {number} id : Identifier of the light
     * @param {object} state : Set the light state
     * @property {number} state.brightness : Value between 0 and 255
     * @property {number} state.hue : Value between 0 and 65535
     * @property {number} state.saturation : Value between 0 and 255
     * @property {string} state.effect : Can be either 'none' or 'colorloop'
     * @property {number} state.colorTemperature : Value between 153 and 500
     */
    setLight (id, state) {
        let lightState = hue.lightState.create();

        // Chain the correct state options
        if (typeof state.on !== 'undefined') { lightState = lightState.on((state.on == 'true')); } // Convert 'on' value to boolean according to Hue library requirement
        if (typeof state.brightness !== 'undefined') { lightState = lightState.bri(state.brightness); }
        if (typeof state.hue !== 'undefined') { lightState = lightState.hue(state.hue); }
        if (typeof state.saturation !== 'undefined') { lightState = lightState.sat(state.saturation); }
        if (typeof state.effect !== 'undefined') { lightState = lightState.effect(state.effect); }
        if (typeof state.colorTemperature !== 'undefined') { lightState = lightState.ct(state.colorTemperature); }

        return api.setLightState(id, lightState);
    }
}

module.exports = PhilipsHue;
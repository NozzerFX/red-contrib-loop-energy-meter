# Loop Energy Meter Node

This is a *very* simple NodeRed node for the [Loop Energy Saver](https://www.your-loop.com),
a realtime energy monitoring device.

There is no official API, but the dashboard uses a WebSocket service to display current
usage data. Inspired by [Loop Energy Meter API HTTP Proxy](https://github.com/PhilDye/loop-energy-http-api), this simple Node effectively listens for the electric_realtime event to obtain realtime data from the loop energy saver.

## Deployment

Note the configuration that is required, `serial` and `secret` credentials.  You can get these values
by logging into your-loop.com, opening your browser's console, and typing in 
`Drupal.settings.navetas_realtime` - the returned JSON object contains these values.

These values can then be set in the nodes properties.

## Releases

### 0.1.0

Initial version

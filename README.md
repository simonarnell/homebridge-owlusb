<span align="center">

# Homebridge Owl +USB Plugin

<a href="https://www.npmjs.com/package/homebridge-owlusb"><img title="npm version" src="https://badgen.net/npm/v/homebridge-owlusb" ></a>
<a href="https://www.npmjs.com/package/homebridge-owlusb"><img title="npm downloads" src="https://badgen.net/npm/dt/homebridge-owlusb" ></a>

</span>

<img src="https://github.com/simonarnell/node-owlusb/blob/resources/owl.jpg" align="right" alt="owl">

## About

**Homebridge-owlusb** is a [homebridge](https://homebridge.io) plugin that collects energy consumption data from [Owl +USB](https://www.theowl.com/index.php/energy-monitors/standalone-monitors/owl-usb/) energy monitoring devices and publishes the collected data to the Apple [HomeKit](https://developer.apple.com/homekit/) ecosystem.

## Prerequisities 

### Linux

- Install dependencies using a package manger e.g. `sudo apt install libusb libusb-dev libudev-dev` on Debian-based distros.
- Add permissions to udev rules.
  - Create a new file such as `/etc/udev/rules.d/50-owlusb.rules`.
  - Add to this file - `SUBSYSTEM=="usb", ATTRS{idVendor}=="0fde", ATTRS{idProduct}=="ca05", GROUP="homebridge", MODE="0666"` where `<group>` is the username or group of the user executing the application.
  - Reload udev rules - `udevadm control --reload-rules`.

### macOS

Install dependencies using a package manger e.g. Homebrew `sudo brew install libusb` or macports `sudo port install libusb`.

### Windows 

On Windows you must install libusb using [Zadig](https://zadig.akeo.ie/).

## Installation

Install an instance of [homebridge](https://homebridge.io) on your network. If you prefer a graphical interface install [Homebridge Config UI X](https://github.com/oznu/homebridge-config-ui-x#readme). 

Once installed, login to the interface and scan the QR code with your iPhone, this will start the process to add the homebridge to your Apple Home instance. 

Once added, login back into the Homebridge Comfig UI X interface, click plugins from the menu, type `owlusb` as the search term, click install next to the plugin called `homebridge-owlusb`. You will be asked to provide a name for OWL USB plugin instance, this can be arbitrary. 

### Configuration

Alternatively the plugin can be configured within the homebridge `config.json`. The following is an example configuration:
```
{
  "accessories": [{
    "name": "Owl +USB Energy Meter",
    "accessory": "Owl +USB Energy Meter Homebridge Plugin"
  }]
}
```

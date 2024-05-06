const { Dmi, DmiState } = require("./dmi.js")
const { start } = require("./main.js")
const { resolve } = require("path")
const fs = require("fs")
const path = require("path")
const { decode, encode } = require("@vivaxy/png");
const { Image } = require("image-js");
const UPNG = require("upng-js");
var pngitxt = require('png-itxt')
const { decodePng, encodePng } = require("@lunapaint/png-codec");


async function test() {
    
    /*const args = process.argv.slice(2)
    const dmi_data = fs.readFileSync(resolve(__dirname, "./device.dmi"));
    
    const dmi = await Dmi.parse(dmi_data);
    
    var fdata = await dmi.createFile("newdevice.dmi")
    */
    
    await start(["decode","./d.dmi"])
    
}


function callback (err, data) {
  console.log(err, data)
}

test()

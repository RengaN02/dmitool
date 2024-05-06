const { Dmi, DmiState } = require("./dmi.js")
const { resolve } = require("path")
const fs = require("fs")
const path = require("path")
const { decode, encode } = require("@vivaxy/png");
const { Image } = require("image-js");
const UPNG = require("upng-js");
var pngitxt = require('png-itxt')
const { decodePng, encodePng } = require("@lunapaint/png-codec");


async function start() {
    const dmi_data = fs.readFileSync(resolve(__dirname, "./device.dmi"));
    
    //dmi_stream.pipe(pngitxt.getztxt(callback))
    
    const dmi = await Dmi.parse(dmi_data);
    
    var fdata = await dmi.createFile("newdevice.dmi")
    
    
    /*
    var sa = fdata.buffer
    console.log(dmi_data, sa)
    var baf = [fdata.result.buffer]
    var u = UPNG.encode(baf, fdata.width, fdata.height, 256)
        
    var bafır = Buffer.from(u)
    var dcd = UPNG.decode(bafır)
    console.log(dcd)
    
    var file = fs.createWriteStream("newdevice.dmi")
    file.write(fdata)
    file.end()*/
}


function callback (err, data) {
  console.log(err, data)
}

start()


/*
    const dmi_data = fs.readFileSync(resolve(__dirname, "./device.dmi"));
    const dmi = await Dmi.parse(dmi_data);
    console.log(dmi.states[2])



    
*/

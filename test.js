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
    
    //const args = process.argv.slice(2)
    const dmi_data = fs.readFileSync(resolve(__dirname, "./d.dmi"));
    
    const dmi = await Dmi.parse(dmi_data);
    
    
    dmi.createFile("newdevice.dmi")
    
    
   //await start(["encode","d_1715348926873"])
    
}


function callback (err, data) {
  console.log(err, data)
}

test()


let eski_array = [
    { frame: 1, dir: 2 },
    { frame: 2, dir: 1 },
    { frame: 2, dir: 3 },
    { frame: 1, dir: 1 },
    { frame: 1, dir: 4 },
    { frame: 2, dir: 4 },
    { frame: 1, dir: 3 },
    { frame: 2, dir: 2 }
];

// JSON nesnelerini belirli bir düzene göre sıralama
eski_array.sort((a, b) => {
    if (a.frame === b.frame) {
        return a.dir - b.dir;
    }
    return a.frame - b.frame;
});

// Yeni düzenlenmiş arrayi oluşturma
let yeni_array = [];
eski_array.forEach(obj => {
    let str = "frame " + obj.frame + " dir " + obj.dir;
    yeni_array.push(str);
});



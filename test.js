const { Dmi, DmiState } = require("./dmi.js")
require("./main.js").start(["decode","96x96.dmi"])
const { resolve } = require("path")
const fs = require("fs")
const path = require("path")


async function test() {
    
    //const args = process.argv.slice(2)
    
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



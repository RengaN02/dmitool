const Dmi = require("./dmi.js")
const { resolve } = require("path")
const fs = require("fs")
const path = require("path")

async function start() {
    const dmi_data = fs.readFileSync(resolve(__dirname, "./device.dmi"));
    const dmi = await Dmi.parse(dmi_data);
    console.log(dmi)
}

start()
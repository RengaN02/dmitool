const { DmiState, Dmi, DirNames } = require("./dmi.js")
const path = require("path")
const fs = require("fs")
/*           Arguments           */
//1: encode or decode *
//2: file or folder *
//
//
/*                               */
async function start(args) {
    var nowdate = await Date.now()
    if(!args[0]) return console.error("No arguments detected..!")
    if(args[0] != "encode" && args[0] != "decode") return console.error("encode or decode")
    if(args[0] == "decode") {
        if(!args[1]) return console.log("We need a dmi file path to decode")
        if(!fs.lstatSync(args[1]).isFile()) return console.log("This is not file")
        var extname = path.extname(args[1])
        if(extname != ".dmi") return console.log("The file must be dmi.")
        
        var filename = path.basename(args[1], extname)
        var filebuffer = fs.readFileSync(args[1])
        var dmi = await Dmi.parse(filebuffer);
        var json = {
            width: dmi.width,
            height: dmi.height,
            states: []
        }
        console.log(dmi)
        if(fs.existsSync(`./${filename}_${nowdate}`)) return console.log("There is a folder which named like ./" + filename + "_" + nowdate)
        fs.mkdirSync(`./${filename}_${nowdate}`)
        var folderpath = `./${filename}_${nowdate}`
        fs.writeFileSync(`${folderpath}/data.json`,JSON.stringify(dmi,null,4))
        var same = []
        dmi.states.forEach(state=>{
            if(fs.existsSync(`${folderpath}/${state.name.slice(1, state.name.length-1)}${state.movement? "@movement" : ""}`)){
                same.push(state.name)
            }
            var samenumber = same.filter(item => item === state.name).length
            var statepath = `${folderpath}/${state.name.slice(1, state.name.length-1)}${state.movement? "@movement" : ""}${samenumber?`@${samenumber}`:``}` 
            fs.mkdirSync(statepath)
        
            var statejson = {
                name: state.name,
                loop: state.loop,
                rewind: state.rewind,
                movement: state.movement,
                dirs: state.dirs,
                delays: state.delays,
                hotspots: state.hotspots,
                path: statepath
            }
            json.states.push(statejson)
            let i = 0
            var framecount = state.delays.length? state.delays.length : 1
            for (let frame = 0; frame < framecount; frame++) {
                for (let dir = 0; dir < state.dirs; dir++) {
                    state.frames[i].save(`${statepath}/${state.name.slice(1, state.name.length-1)}@${DirNames[dir]}@${frame}.png`)
                    i++
                }
            }
            })
        
        fs.writeFileSync(`${folderpath}/data.json`,JSON.stringify(json,null,4))
    } else {
        
    }
}
var write = (files,data) => fs.writeFileSync(files,JSON.stringify(data,null,4))
start(process.argv.slice(2))
module.exports.start = start
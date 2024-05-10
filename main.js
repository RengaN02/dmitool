const { DmiState, Dmi, DirNames } = require("./dmi.js")
const path = require("path")
const fs = require("fs")
const { Image } = require("image-js");

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
        if(!args[1]) return ("We need a dmi file path to decode")
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
        var folderpath = `./${filename}_${nowdate}`
        if(fs.existsSync(folderpath)) return console.log("There is a folder which named like ./" + filename + "_" + nowdate)
        fs.mkdirSync(folderpath)
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
                path: `./${state.name.slice(1, state.name.length-1)}${state.movement? "@movement" : ""}${samenumber?`@${samenumber}`:``}` 
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
        console.log("Created: " + folderpath)
    } else {
        if(!args[1]) return console.log("We need a folder to encode")
        if(!fs.existsSync(args[1])) return console.log(`There is no folder like ${args[1]}`)
        if(!fs.existsSync(`${args[1]}/data.json`)) return console.log("That folder is broke!")
        var jsondata = JSON.parse(fs.readFileSync(`${args[1]}/data.json`,'utf8'))
        var dmi = new Dmi(jsondata.width, jsondata.height)
        new Promise((res, rej) => {
            jsondata.states.forEach(thestate => {
                var dmistate = new DmiState(thestate.name, thestate.loop, thestate.rewind, thestate.movement, thestate.dirs)
                dmistate.delays = thestate.delays
                dmistate.hotspots = thestate.hotspots
                var frameobjects = []
                var filearray = fs.readdirSync(path.resolve(__dirname, `${args[1]}/${thestate.path}`))
                new Promise((resolve, reject) => {
                    filearray.forEach(async (filename) => {
                        var fname = path.basename(filename, path.extname(filename))
                        var fparts = fname.trim().split('@')
                        var dir = DirNames.indexOf(fparts[1])+1
                        var frame = Number(fparts[2])
                        var fimage = await Image.load(path.resolve(__dirname, `${args[1]}/${thestate.path}/${filename}`))
                        var fpj = {
                            name: fname,
                            dir: dir,
                            frame: frame,
                            image: fimage
                        }
                        frameobjects.push(fpj)
                           if(filearray.length == frameobjects.length) {
                           frameobjects.sort((a, b) => {
                               if (a.frame === b.frame) {
                                    return a.dir - b.dir;
                                }
                                return a.frame - b.frame;
                            })
                            resolve()
                        }
                    })
                }).then(() => {
                    frameobjects.forEach(frame => {
                        dmistate.frames.push(frame.image)
                    })
                }).then(() => {
                    dmi.states.push(dmistate)
                    if(dmi.states.length == jsondata.states.length) {
                        res()
                    }
                })
            })
        }).then(() => {
            dmi.createFile(`${path.basename(args[1], path.extname(args[1]))}.dmi`)
            console.log(`Created: ${path.basename(args[1], path.extname(args[1]))}.dmi`)
        })
    }
}

start(process.argv.slice(2))
module.exports.start = start
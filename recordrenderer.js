const fs = require('fs')
const dir = './readings/'
const autosaveDir = './autosavereadings/'

const { remote } = require ('electron');

const SerialPort = require('serialport')

const { ipcRenderer } = require('electron')
const Readline = require('@serialport/parser-readline')
const tableify = require('tableify')

let path = ipcRenderer.sendSync('get-com-port', '')

const port = new SerialPort(path, { baudRate: 9600 })

document.getElementById('comPorts').innerHTML = path;

counts = []

const parser = new Readline()
port.pipe(parser)

parser.on('data', line => {
    console.log(`> ${line}`)
    let current_time = new Date();
    counts.push([parseInt(line), current_time.toUTCString()]);
    document.getElementById('messages').innerHTML = tableify(counts);
})

function SaveReading(autoSave = false) {
    let num = 0;
    let localDir;
    if (autoSave) {
        localDir = autosaveDir
    }
    else {
        localDir = dir;
    }
    if (!fs.existsSync(localDir)){
        fs.mkdirSync(localDir);
    }
    let fileName =localDir+ "reading.json"
    while (fs.existsSync(fileName)) {
        num++;
        fileName = localDir+"reading" + num + ".json"
    }
    fs.writeFileSync(fileName, JSON.stringify(counts));
    console.log(fileName);

}

setInterval(SaveReading, 1000, true);

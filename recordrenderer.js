const fs = require('fs')
const dir = '/readings/'

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

function SaveReading() {
    let num = 0;
    let fileName = "reading.json"
    while (fs.existsSync(fileName)) {
        num++;
        fileName = "reading"+num+".json"
    }
    fs.writeFileSync(fileName, JSON.stringify(counts));

}
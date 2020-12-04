const fs = require('fs')
const dir = './readings/'
const autosaveDir = './autosavereadings/'

var Chart = require('chart.js');

const SerialPort = require('serialport')

const { ipcRenderer } = require('electron')
const Readline = require('@serialport/parser-readline')
const tableify = require('tableify')

let path = ipcRenderer.sendSync('get-com-port', '')

const port = new SerialPort(path, { baudRate: 9600 })

document.getElementById('comPorts').innerHTML = path;



counts = []
countXonly = []
xMax = 0;
var c = document.getElementById('myChart')
var ctx = c.getContext('2d');
var myLineChart = Chart.Line(ctx, {
    data: {
        datasets: [{
            data: [],
        },
        ]
    },
    options:{
        steppedLine: true,
    }
});

window.webContents= function(){
    console.log(c)
    c.width = 10;
    c.height = 10;
};


const parser = new Readline()
port.pipe(parser)

parser.on('data', line => {
    console.log(`> ${line}`)
    let current_time = new Date();
    counts.push([parseInt(line), current_time.toUTCString()]);
    document.getElementById('messages').innerHTML = tableify(counts);
    if (!isNaN(line)) {
        xMax++;
        myLineChart.data.datasets[0].data.push(parseInt(line))
        myLineChart.data.labels.push()
        console.log(myLineChart.data.labels.push(xMax))
        myLineChart.update()
    }
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
    if (!fs.existsSync(localDir)) {
        fs.mkdirSync(localDir);
    }
    let fileName = localDir + "reading.json"
    while (fs.existsSync(fileName)) {
        num++;
        fileName = localDir + "reading" + num + ".json"
    }
    fs.writeFileSync(fileName, JSON.stringify(counts));
    console.log(fileName);

}

setInterval(SaveReading, 10000, true);


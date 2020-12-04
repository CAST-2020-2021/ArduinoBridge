const SerialPort = require('serialport')
console.log("Here")

const { ipcRenderer } = require('electron')
const tableify = require('tableify')

SerialPort.list().then((ports) => {
    console.log('ports', ports);
    if (ports.length === 0) {
        document.getElementById('error').textContent = 'No ports discovered'
    }
    tableHTML = tableify(ports)
    document.getElementById('ports').innerHTML = tableHTML
}).catch((err) => {
    if (err) {
        document.getElementById('error').textContent = err.message
        return
    } else {
        document.getElementById('error').textContent = ''
    }
});

function setComPort() {
    ipcRenderer.send('store-com-port', document.getElementById("comPort").value)
}

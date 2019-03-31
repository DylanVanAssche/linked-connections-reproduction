const express = require('express');
const path = require('path');
const fs = require('fs');
const cron = require('cron');

let app = express();
let rt_files = fs.readdirSync(path.join(__dirname, './data/realtime'));
rt_files.sort(); // Files are named by fetch time
let rt_counter = 0;
let rt_job = new cron.CronJob({
    cronTime: '*/30 * * * * *',
    onTick: () => {
        rt_counter++;
        if(rt_counter >= rt_files.length) {
            rt_counter = 0;
        }
        console.log('RT counter set to: ' + rt_counter);
    }
});
rt_job.start();

app.get('/static', function (req, res) {
    res.sendFile(path.join(__dirname, './data/static/static.zip'));
    console.log('Static file send');
});

app.get('/realtime', function (req, res) {
    let file_name = path.join('./data/realtime', rt_files[rt_counter]);
    res.sendFile(path.join(__dirname, file_name));
    console.log('RT file: ' + file_name + ' send, counter: ' + rt_counter);
});

let server = app.listen(3001, function () {
    let host = server.address().address
    let port = server.address().port
    console.log("Linked Connections Reproduction listening at http://%s:%s", host, port)
})

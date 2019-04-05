const express = require('express');
const path = require('path');
const fs = require('fs');
const cron = require('cron');
const { Hub, sseHub } = require('@toverux/expresse');

let app = express();
let rt_files = fs.readdirSync(path.join(__dirname, '../data/realtime'));
rt_files.sort(); // Files are named by fetch time
let rt_counter = 0;
let events_files = fs.readdirSync(path.join(__dirname, '../data/events'));
events_files.sort(); // Files are named by fetch time
let events_counter = 0;
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
let events_job = new cron.CronJob({
    cronTime: '*/30 * * * * *',
    onTick: () => {
        events_counter++;
        if(events_counter >= events_files.length) {
            events_counter = 0;
        }
        console.log('Events counter set to: ' + events_counter);
        if(clients.length > 0) {
            let file_name = path.join('../data/events', events_files[events_counter]);
            file_name = path.join(__dirname, file_name);
            let file = fs.readFileSync(file_name, 'utf8');
            clients[0].sse.broadcast.event('message', JSON.stringify(JSON.parse(file)), rt_counter);
        }
    }
});
events_job.start();
let clients = [];

app.get('/static', function (req, res) {
    res.sendFile(path.join(__dirname, '../data/static/static.zip'));
    console.log('Static file send');
});

app.get('/realtime', function (req, res) {
    let file_name = path.join('../data/realtime', rt_files[rt_counter]);
    res.sendFile(path.join(__dirname, file_name));
    console.log('RT file: ' + file_name + ' send, counter: ' + rt_counter);
});

app.get('/events', function (req, res) {
    let file_name = path.join('../data/events', events_files[events_counter]);
    res.sendFile(path.join(__dirname, file_name));
    console.log('Events file:' + file_name + ' send, counter: ' + events_counter);
});

app.get('/events/sse', sseHub({ flushAfterWrite: true }), function(req, res) {
    clients.push(res);
    res.on('close', () => {
       clients.splice(clients.indexOf(res), 1);
    });
});

let server = app.listen(3001, function () {
    let host = server.address().address
    let port = server.address().port
    console.log("Linked Connections Reproduction listening at http://%s:%s", host, port)
})

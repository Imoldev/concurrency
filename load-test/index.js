'use strict'

const autocannon = require('autocannon')

const instance = autocannon({
    url: 'http://play-server:3003',
    method: 'POST',
    connections: 2, //default
    pipelining: 1,
    setupClient, // default
    duration: 10
}, () => { })

function setupClient(client) {
    client.setRequest({
        path: '/green'
    })
}

// this is used to kill the instance on CTRL-C
process.once('SIGINT', () => {
    instance.stop()
})

// just render results
autocannon.track(instance, { renderProgressBar: true })
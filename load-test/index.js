'use strict'

const autocannon = require('autocannon')

const instance = autocannon({
    url: 'http://play-server:3003/insert',
    method: 'POST',
    connections: 5,
    pipelining: 1,
    duration: 100
}, () => { })


// this is used to kill the instance on CTRL-C
process.once('SIGINT', () => {
    instance.stop()
})

// just render results
autocannon.track(instance, { renderProgressBar: true })
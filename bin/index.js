#!/usr/bin/env node

const fs = require('fs')
const http = require('http')
const handler = require('serve-handler')

const commands = require('../lib/parse-argv')(process.argv)
const sse = require('../lib/sse-handler')
const spawn = require('../lib/spawn')

const server = http.createServer((request, response) => {
  if (request.url === '/reload') {
    return sse.handler(request, response)
  }

  return handler(request, response, {
    public: 'public',
    rewrites: [{ source: '**', destination: '/index.html' }]
  })
})

const options = {
  recursive: true
}

const _handler = (e, filename) => {
  if (filename.endsWith('.scss')) {
    spawn(commands['--css'])
    return // stop execution
  }

  if (filename.endsWith('.js')) {
    spawn(commands['--js'])
  }
}

server.listen(3000, () => {
  // for (let i = 0; i < watch.length; i++) {
  //   fs.watch(watch[i], options, _handler)
  // }

  fs.watch('src', options, _handler)
  fs.watch('src/shared', options, _handler)

  console.log('\n', 'Running at http://localhost:3000', '\n')
})
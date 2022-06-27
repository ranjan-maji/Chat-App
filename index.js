const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 8000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

io.on('connection', (socket) => {
    console.log('Client is Connected!!')

    socket.emit('message', 'wellcome!')
    socket.broadcast.emit('message', 'A new user has joined!')

    socket.on('sendMessage', (message, callback) => {
        io.emit('message', message)
        callback('done')
    })

    socket.on('sendLocation', (coords) => {
        io.emit('message', `https://google.com/maps?q=${coords.latitude},${coords.longitude}`)
    })


    socket.on('disconnect', () => {
        io.emit('message', 'user has left!')
    })

    
})

server.listen(port, () => {
    console.log(`Server is Running Port no is ${port}!`)
})
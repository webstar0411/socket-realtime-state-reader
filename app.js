
const express = require('express');
const http = require('http');
const fs = require('fs')
const Tail = require('tail').Tail;

// creates server app
const app = express();
const server = http.createServer(app);
const { Server } = require("socket.io");

const { mainChannel, CHANNEL_DIR, filter } = require("./setting")

const io = new Server(server);

var openedChannels = []

// set view engine as ejs template
app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"))

// Sends html with channel number and filtered operations
app.get('/', function(req, res) {
    const channel = req.query.channel || mainChannel

    let isOpen = false
    for (var i = 0; i < openedChannels.length; i++) {
      if(openedChannels[i].channel === channel){
        isOpen = true;
        break;
      }
    }

    if(fs.existsSync(`${CHANNEL_DIR}${channel}.txt`))
      res.render('index', {channel, error: null, filter, isOpen});
    else
      res.render('index', {channel, error: "INVALID CHANNEL!", filter, isOpen});
});

// Check if the channel is open.
app.get('/isopen/:id', (req, res) => {
  const channel = req.params.id
  for (var i = 0; i < openedChannels.length; i++) {
    if(openedChannels[i].channel === channel){
      return res.send({open: true})
    }
  }
   res.send({open: false})
})

// send changes on the channel
io.on('connection', (socket) => {
  socket.on('is_open', (channel) => {
    for (var i = 0; i < openedChannels.length; i++) {
      if(openedChannels[i].channel === channel)
        return socket.emit("is_open", true)
    }
    return socket.emit("is_open", false)
  })

  // send changes using tail
  socket.on('channel', (channel) => {
    console.log("CHANNEL REQUEST: ", channel)

    openedChannels.push({ socket, channel })
    tail = new Tail(`${CHANNEL_DIR}${channel}.txt`, "\n", {}, true);
    tail.on("line", function(data) {
        socket.emit("msg", data)
    });
  })

  socket.on('disconnect', function() {
      openedChannels = openedChannels.filter(item => item.socket !== socket)
   });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});
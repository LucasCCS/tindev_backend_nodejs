const express = require('express'); //framework para as rotas
const mongoose = require('mongoose'); // mongodb
const cors = require('cors');
const routes = require('./routes');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const connectedUsers = {};

io.on('connection', socket => {
  const { user } = socket.handshake.query;
  connectedUsers[user] = socket.id;
});

mongoose.connect(
  "mongodb+srv://inovlab:inovlab@cluster0-kvyjs.mongodb.net/test?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useFindAndModify: false
  }
);

app.use((req,res,next) => {
  req.connectedUsers = connectedUsers;
  req.io = io;
  return next();
});

app.use(cors());
app.use(express.json());
app.use(routes);

server.listen(8080);
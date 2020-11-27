

const express = require('express');
const router = express.Router();
const Pusher = require('pusher');

const pusher = new Pusher({
  appId: '1102494',
  key: 'c66face03653675ea054',
  secret: '88aee995eb95e92a77a8',
  cluster: 'ap2',
});

router.get('/', (req, res) => {
  res.send('all good');
});

router.post('/pusher/auth', (req, res) => {
  const socketId = req.body.socket_id;
  const channel = req.body.channel_name;
  const auth = pusher.authenticate(socketId, channel);
  res.send(auth);
});

module.exports = router;

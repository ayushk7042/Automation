// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const bodyParser = require('body-parser');
// const connectDB = require('./config/db');

// const app = express();
// connectDB();

// app.use(cors());
// app.use(bodyParser.json());

// // Routes
// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/admin', require('./routes/admin'));

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const http = require('http');

const app = express();
connectDB();

app.use(cors());
app.use(bodyParser.json());

const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/campaigns', require('./routes/campaign'));



// add near other routes
app.use('/api/templates', require('./routes/templates'));
app.use('/api/queue', require('./routes/queue'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/branding', require('./routes/branding'));
app.use('/api/invoice', require('./routes/invoice'));
app.use('/api/bulk', require('./routes/bulk'));
app.use('/api/timeline', require('./routes/timeline'));

app.use('/api/finance', require('./routes/finance'));


const server = http.createServer(app);

// socket.io setup for live updates
const { Server } = require('socket.io');
const io = new Server(server, {
  cors: { origin: '*' } // change origin to your frontend origin in prod
});

io.on('connection', (socket) => {
  console.log('Socket connected', socket.id);
  // optional join rooms by user id when front-end connects with token
  socket.on('join', (room) => socket.join(room));
  socket.on('disconnect', () => console.log('Socket disconnected', socket.id));
});

// expose io to routes via app.locals
app.locals.io = io;
// start cron jobs AFTER DB connection
const setupCronJobs = require('./utils/cronJobs');
setupCronJobs();


// start email queue processor AFTER DB connect
const { startProcessor } = require('./utils/emailQueueProcessor');
startProcessor();

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

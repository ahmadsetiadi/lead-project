const express = require('express');
const bodyParser = require('body-parser');
const moment = require('moment-timezone');
const fs = require('fs');
const path = require('path');
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const env = process.env.NODE_ENV || 'production'; //console.log(env);
const config = require('./config/config.json')[env]; //console.log(config);

// Konfigurasi CORS
const corsOptions = {
  origin: '*', 
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, 
  optionsSuccessStatus: 204 
};

 
process.env.TZ = "Asia/Bangkok"; 

// HTTPS ====================================================================================
var http = require('http');
// var https = require('https');
// var fs = require('fs');
// var options = {
//      key: fs.readFileSync('./certificate/private.key'),
//      cert: fs.readFileSync('./certificate/certificate.crt'),
//      ca: fs.readFileSync('./certificate/ca_bundle.crt')
// }
// HTTPS ====================================================================================

app.use(cors(corsOptions));
// app.use( bodyParser.json({limit: '50mb'}) );
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
const leadRoutes = require('./routes/leads');

app.use('/leads', leadRoutes);

// app.get('/api/data', (req, res) => {
//     const data = { message: 'Hello, World Node JS!', status: 'success', data: { item1: 'Value 1', item2: 'Value 2', item3: 'Value 3' } };
//     res.json(data);
// });
// app.post('/protected', authenticateToken, (req, res) => {
//     res.json({ message: 'This is a protected route', user: req.user });
// });


var httpServer = http.createServer(app);
// initWebSocket(httpServer);
// var httpsServer = https.createServer(options, app);

httpServer.listen(config.porthttp, config.ipserver, () =>{
  const txt = 'HTTP Server '+config.database+' started at '+config.ipserver+' on port '+config.porthttp+'...';  
  console.log(txt);  // logger.info(txt);
});
// httpsServer.listen(config.portserver, config.ipserver, () =>{
//   const txt = 'HTTPS Server '+config.database+' started at '+config.ipserver+' on port '+config.portserver+'...';
//   logger.info(txt);
//   console.log(txt);
// });


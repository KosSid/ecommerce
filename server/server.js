const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');

require('dotenv').config();

//------------------------------------------------------App creation
const app = express()

//------------------------------------------------------DB connection
mongoose.connect(process.env.DATABASE, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    })
    .then(() => console.log('DB CONNECTED through mangoose'))
    .catch(err => console.log('DB CONNECTION ERROR (info from mongoose)', err))


// middlewares
app.use(morgan('dev'));
app.use(bodyParser.json({limit: '2mb'})) // 2 mb limit if needed, can be removed
app.use(cors());

//---------------------------------------------------------ROUTE
   // MOVED routes separetly in the routes folder and i,port them through require, see below
// app.get(e'/api', (rq, res) => {
//     res.json({
//         data: 'hey you hit node API'
//     });
// });
// APPLY routes middleware
    // import routes Separetly
        //1.  const authRoutes = require('./routes/auth')
        //2.  app.use('/api',authRoutes);

    // Import all files from routes folder and provides different routes
fs.readdirSync('./routes').map(r => app.use('/api', require('./routes/' + r)));

//---------------------------------------------------------Port
const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Server is running on the PORT ${port}`));


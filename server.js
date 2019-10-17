const express = require('express');
const app = express();

const connectDB = require('./config/db');
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`));
app.get('/', (req, res) => res.send('API Running'));

// body parser
// allow get data from req.body
app.use(express.json({extended: false}));

// Define Routes
// don't forget the / in the beginning of the endpoint
app.use('/api/users', require('./routers/api/users'));
app.use('/api/auth', require('./routers/api/auth'));
const express = require('express');
const app = express();

const connectDB = require('./config/db');
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`));
app.get('/', (req, res) => res.send('API Running'));

// body parser
// allow us to get data from req.body
app.use(express.json({extended: false}));

// Define Routes
// don't forget the / in the beginning
app.use('/api/users', require('./routers/api/users'));
const express = require('express')
const app = express() 
const port = 8000
const cors = require("cors");
require("dotenv").config(); 
app.use(express.json());
app.use(cors());

const connectDatabase = require("./config/db");
app.get('/', (req, res) => res.send('Hello World!'))

const userRoute = require("./routes/userRoute");
const casesRoute = require("./routes/casesRoute");
const fileRoutes = require('./routes/fileRoutes');

app.use("/user",userRoute)

app.use("/cases",casesRoute)
app.use("/file",fileRoutes)

app.listen(port, () => {
    connectDatabase();
    console.log(`app listening on port ${port}!`)
    
})   
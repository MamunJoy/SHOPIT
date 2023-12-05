const app = require ('./app')
const connectDatabase = require('./config/database')


const dotenv = require('dotenv');

//Hamdle Uncaught exceptions
process.on("uncaughtException", err => {
    console.log(`ERROR: ${err.stack}`);
    console.log('Shutting down due to uncaught exception');
    process.exit(1)
})

// setting up config file
dotenv.config({path: 'backend/config/config.env' })


//connecting to database
connectDatabase();

const server = app.listen (process.env.PORT, () => {
    console.log(`server started on port: ${process.env.PORT} in ${process.env.NODE_ENV} node.`)
})

// Handle UnHalded Promice rejection
process.on('unhandledRejection', err => {
    console.log(`ERROR: ${err.message}`);
    console.log('Shutting down the server due to unhandled promise rejection');
    server.close(() => {
        process.exit(1)
    })
})
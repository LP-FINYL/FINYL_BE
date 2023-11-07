const express = require('express')
const bodyParser = require('body-parser')
const template = require("./lib/template")
const compression = require('compression')
const helmet = require('helmet')
const app = express()
const multer = require('multer');
const session = require('express-session')
const cors = require('cors')
const indexRouter = require('./routes/index')
const adminRouter = require('./routes/admin')


const multerMid = multer({
    storage: multer.memoryStorage(),
    limits: {
        // no larger than 5mb.
        fileSize: 10 * 1024 * 1024,
    },
})

app.use(helmet())
app.use(cors())
app.use(multerMid.single('file'))
app.use(express.static('public'))
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(compression())

// var FileStore = require('session-file-store')(session);
//
// app.use(session({
//     secret: 'secrets',
//     resave: false,
//     saveUninitialized: false,
//     cookie : { secure : false, maxAge : (4 * 60 * 60 * 1000) },
//     store: new FileStore()
// }));


app.use('/api/v1', indexRouter)
app.use('/api/v1/admin', adminRouter)
// app.use('/', indexRouter)


app.get('/', function (req, res) {
    res.status(200).send('OK')
});


app.use(function (req, res, next){
    res.status(404).send('server error')
})

app.use((err, req, res, next) => {
    res.status(500).json({
        error: err,
        message: 'Internal server error!',
    })
})


const port = 3000

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
const express = require('express')
var bodyParser = require('body-parser')
var template = require("./lib/template")
const compression = require('compression')
const helmet = require('helmet')
const app = express()
const session = require('express-session')
var cors = require('cors')

app.use(helmet())
app.use(cors())
app.use(express.static('public'))
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(compression())

const indexRouter = require('./routes/index')

var FileStore = require('session-file-store')(session);

app.use(session({
    secret: 'secrets',
    resave: false,
    saveUninitialized: false,
    cookie : { secure : false, maxAge : (4 * 60 * 60 * 1000) },
    store: new FileStore()
}));


app.use('/api/v1', indexRouter)
// app.use('/', indexRouter)


//get 방식으로 오는 요청에 대해서만 파일 리스트를 가져오는거고 , POST는 처리되지않음
app.get('*',function (req,res,next){
    res.redirect('/api/v1')
})



app.use(function (req, res, next){
    res.status(404).send('sorry')
})

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})


const port = 3000

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
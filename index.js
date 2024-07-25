let fs = require('fs')
let express = require('express')
const app = express()
let path = require('path')
const hbs = require('hbs')
const bodyParser = require('body-parser');
const requests = require('requests')
let mainfilelocation = path.join(__dirname, './public')
let partialspath = path.join(__dirname,'./partials')
const { engine } = require('express-handlebars');
// THIS SEQUENCE SHOULD (FILE- FOLDERS AND NODEJS CODE)


// app.engine('hbs', engine({ extname: 'hbs' }));

// alternative way if you want to get that data from the hbs file and also use the partials :ALL IN 1

app.engine('hbs', engine({
    extname: 'hbs',
    defaultLayout: false,
    partialsDir: path.join(__dirname, './partials') // Specify partials directory
}));



app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(mainfilelocation))
// hbs.registerPartials(partialspath)

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req,res)=>{
    res.render('index')
})
app.get('/about', (req,res)=>{
    res.render('about')
})
app.get('/weather', (req,res)=>{
    res.render('weather')
})
app.get('*', (req,res)=>{
    res.render('404error')
})


// PROCESS AFTER THE SEARCH BTN CLICKED : 

app.post('/submit', (req, res) => {
    // 'name' is is the name of the input in the hbs in file (not "id")
    const name = req.body.name;
    console.log(`Name received: ${name}`);



     
    requests(`https://api.openweathermap.org/data/2.5/weather?q=${name}&appid=228cd3afcd1b4705bb56055c01050af5`)
    .on('data', (chunk) => {


        // making a file and puting the json file in it every time when search btn is clicked
        fs.writeFileSync('exam.json', chunk)

        // reading the file to covert the json data of the file into a object
        let filedata = fs.readFileSync('exam.json', 'utf-8')


        // coverting the json data into object
        let a = JSON.parse(filedata)

//  making the object a array of a object to get the data easily
        let maindata = [a]


        // gettting data and putting in the right place in the hbs file or html
        // helloe
        console.log(maindata[0].main.temp)

        res.render('weather', {
            place : maindata[0].name,
            tempreture : maindata[0].main.temp
        })
    

    })


    .on('end', (err) => {
        if (err) return console.log("connection closed due to error", err)
        console.log('end')
    })



    
});


app.listen(3000, ()=>{

})


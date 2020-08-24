'use strict';
const express=require('express');
const cors =require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 3000;

const superagent = require('superagent');
const pg =require('pg');
const client = new pg.Client(process.env.DATABASE_URL);
const methodOverride = require('method-override');
const expressLayouts = require('express-ejs-layouts');
app.use(expressLayouts);
app.use(express.urlencoded({extended:true}));
app.use(express.static('./public'));
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));
client.connect().then(() => {
    app.listen(PORT,() => console.log(`Listening on port ${PORT}`));
});
 
//Routs

// app.get()
app.post('/' , home)
app.get('add',add);
app.post('/fav', fav);
app.get('/details/:id', details);
app.delete('/update/:id',deletee)
app.get('/edit/:id',edit);
app.put('/update/:id',update);
app.use('*',errorFunction);





//helper Functions
function errorFunction (req,res){
res.send('Not avialable Jokes')
}


function home (req,res){
    let url=`https://official-joke-api.appspot.com/jokes/programming/ten`;
   
    superagent.get(url).then(data=>{
        let x=data.body.map(element=> {
        return new Jokes(element);
        })
       res.render('api',{arrray :x}) 
    } )
}


function Jokes(data){
this.id=data.id;
    this.type=data.type;
    this.setup=data.setup;
    this.punchline=data.punchline;
}

function add (req,res){
    let SQL="INSERT INTO jokes (id,type,setup,punchline) VALUES ($1,$2,$3,$4) RETUNING id;";
    let values=[id,type,setup,punchline];
    let {id,type,setup,punchline}=req.body;

client.query(SQL,values).then(res.redirct('/fav'));
}

function fav (req,res){
    let SQL="SELECT * FROM jokes;";
    client.query(SQL).then(result=>{
        res.render('fav',{arrray:result.rows})
    });

}
    function details (req,res){
        let SQL="SELECT * FROM jokes WHERE id=$1;";
        let values=[req.param.id];
        client.query(SQL,values).then(result=>{
        res.render('details',{arrray:result.rows})

        });
    
    }
   function deletee (req,res){
        let SQL=`DELETE FROM jokes WHERE id=$1`;
        let values=[req.param.id];
        client.query(SQL,values).then(res.redirct('/fav'));    
    }
     
    function edit (req,res){
        let SQL="SELECT * FROM jokes WHERE id=$1;";
        let values=[req.param.id];
        client.query(SQL,values).then(result=>{
        res.render('edit',{arrray:result.rows,"formAction" : 'update'})

        });
    
    }

    function update (req,res){
        let SQL="UPDATE jokes SET id=$1,type=$2,setup=$3,punchline=$4 RETURNING ID;";
        let values=[id,type,setup,punchline,req.param.id];
        client.query(SQL,values).then(res.redirct(`/details/${req.param.id}`));  
    
    }

// // for
// function api (req,res){

//     let url=`https://official-joke-api.appspot.com/random_joke`;
//     superagent.get(url).then(data=>{
//         let x=data.body.map(element=> {
//         return new Jokes(element);
//         })
//        res.render('api',{arrray :x}) 
//     } )
// }
// let url=;
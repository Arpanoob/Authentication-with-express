const express=require('express');
const app=express();
var session = require('express-session')
const fs=require('fs');
app.use(express.json());


app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
}))

app.use(express.urlencoded({extended:true}));
var d=[];
app.get('/signup',function(req,res)
{
  res.sendFile(__dirname+'/signup.html');
})
app.get('/styles.css',function(req,res){
   res.sendFile(__dirname+'/styles.css');
})


app.post('/todo', function (req, res) {
  if(req.session.flag===false|| req.session.flag === undefined)
  {
    res.status(201).end("unauten");return;
  }
  
  if(req.session.flag==false)
  {
    res.sendFile(__dirname+"/login.html");
  }
  fs.readFile('todo.txt', 'utf-8', function (err, data) {
    let dataArray=[];
    if (err) {
      console.error('Error ', err);
      dataArray = [];
    } else {
      if (data.length === 0) {
        dataArray = [];
      } else {
        dataArray = JSON.parse(data);
      }
    }

    try {
      dataArray.push(req.body);
      fs.writeFile('todo.txt', JSON.stringify(dataArray), function (writeErr) {
        if (writeErr) {
          console.error('Error writing to file:', writeErr);
          res.status(500).end('error');
        } else {
          console.log(' updated successfully!');
          res.status(200).json(dataArray);
        }
      });
    } catch (e) {
      console.error('Error:', e);
      res.status(500).end('error');
    }
  });
});


app.delete('/todo', function (req, res) {
  if(req.session.flag===false|| req.session.flag === undefined)
  {
    res.status(401).end("unauten");
    return;
  }

  const name = req.body.text;

  fs.readFile('todo.txt', 'utf-8', function (err, data) {
    if (err) {
      console.error('Error reading file:', err);
      res.status(500).end('error');
      return;
    }

    let dataArray = [];
    if (data.length > 0) {
      dataArray = JSON.parse(data);
    }

                     // find the index of the object with the name
    const indexToRemove = dataArray.findIndex((item) => item.text === name);

    if (indexToRemove !== -1) {
      // If the object is found, hatao from the rray
      dataArray.splice(indexToRemove, 1);

      // Write the updated array back to the file as JSON
      fs.writeFile('todo.txt', JSON.stringify(dataArray), function (writeErr) {
        if (writeErr) {
          console.error('Error writing to file:', writeErr);
          res.status(500).end('error');
        } else {
          console.log('File content updated successfully!');
          res.status(200).json(dataArray);
        }
      });
    } else {
      //  object is not found error response
      res.status(404).end('Object no found');
    }
  });
});
app.post('/signup',function(req,res){
fs.readFile('users.json',function(err,data){
  let dataArray=[];
  if (err) {
    console.error('Error ', err);
    dataArray = [];
  } else {
    if (data.length === 0) {
      dataArray = [];
    } else {
      dataArray = JSON.parse(data);
    }
  }
  try {
    dataArray.push(req.body);
    fs.writeFile('users.json', JSON.stringify(dataArray), function (writeErr) {
      if (writeErr) {
        console.error('Error writing to file:', writeErr);
        res.status(500).end('error');
      } else {
        console.log(' updated successfully!');
        res.status(200).json(dataArray);
      }
    });
  } catch (e) {
    console.error('Error:', e);
    res.status(500).end('error');
  }

});
});

app.get('/login',function(req,res){
  res.sendFile(__dirname+"/login.html");
})
app.post('/login',function(req,res){

let username=req.body.username;
let password=req.body.password;
console.log("a");
console.log(username,password);
let flag=false;
fs.readFile('users.json',function(err,data){
  let dataArray=[];
  if (err) {
    console.error('Error ', err);
    dataArray = [];
  } else {
    if (data.length === 0) {
      dataArray = [];
      res.status(501).end('signup');
    } else {
      dataArray = JSON.parse(data);
      dataArray.forEach(function(user) {
        if(user.username===username&&user.confirmPassword===password)
        {req.session.flag=true;
          console.log("ff");
           flag=true;

           res.redirect('/');          // res.status(200).end('incorrect sucess');;
        }
      });
      let S=false;
      if(!flag){
      dataArray.forEach(function(user) {

        if(user.username===username&&user.confirmPassword!==password)
        {
        S=!S;
          res.status(502).end('incorrect password');
        }

    });
    if(S==false)
    {
    res.status(501).end('signup');
       
    }
    }
  }
  }
})
})
//app.use(express.static(path.join(__dirname, 'public')));
app.listen(3000,()=>{console.log("listening to port 3000");});
app.get('/',(req,res)=>{ 
  if(req.session.flag===false|| req.session.flag === undefined)
  {
    res.redirect("/login");return;
  }res.sendFile(__dirname+"/index.html");});
app.get('/home',(req,res)=>{ 
  if(req.session.flag===false|| req.session.flag === undefined)
   { res.redirect("/login");return;
  }res.sendFile(__dirname+"/index.html");});
app.get('/contact', function(req, res) {
  if(req.session.flag===false|| req.session.flag === undefined)
  
  {
    res.redirect("/login");return;
  }
    res.sendFile(__dirname +  "/contact.html");
  });
app.get('/about',(req,res)=>{
  if(req.session.flag===false||req.session.flag === undefined)
  { 
    res.redirect("/login");return;
  }
    res.sendFile(__dirname+"/about.html");
})
app.get('/todo',(req,res)=>{
  if(req.session.flag===false|| req.session.flag === undefined)
  {
    res.redirect("/login");return;
  }
  res.sendFile(__dirname+"/todo.html");
})


app.get('/todo.txt',function(req,res){
  res.sendFile(__dirname+"/todo.txt")
})


app.get('/signup.js',function(req,res){
  res.sendFile(__dirname+"/signup.js")
})
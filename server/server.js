var express=require('express');
var bodyParser=require('body-parser');

var {mongoose}=require('./db/mongoose.js');
var {Todo}=require('./models/todo.js');
var {User}=require('./models/user.js');

var app=express();
// app.get('/',(req,res)=>{
//   res.send('hello Express');
// });

app.use(bodyParser.json());


app.post('/todos',(req,res)=>{
  console.log(req);
  var todo=new Todo({
    text:req.body.text
  });

  todo.save().then((doc)=>{
    res.send(doc);
  },(err)=>{
    res.status(400).send(err);
  });

});

app.get('/todos',(req,res)=>{
  Todo.find().then((todos)=>{
    res.send({todos})
  },(e)=>{
    res.status(400).send(e);
  })
});

app.listen(3002,()=>{
  console.log('Started on port 3000');
});
module.exports={app};

var express=require('express');
var bodyParser=require('body-parser');
var {ObjectID}=require('mongodb');

var {mongoose}=require('./db/mongoose.js');
var {Todo}=require('./models/todo.js');
var {User}=require('./models/user.js');

var app=express();
const port=process.env.PORT || 3012;
// app.get('/',(req,res)=>{
//   res.send('hello Express');
// });

app.use(bodyParser.json());


app.post('/todos',(req,res)=>{
  //console.log(req);
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
    res.send({todos});
  },(e)=>{
    res.status(400).send(e);
  })
});

app.get('/todos/:id',(req,res)=>{
  var id=req.params.id;
  //console.log(id);
  if(!ObjectID.isValid(id)){
    //console.log(1);
    return res.status(404).send();
  }
  Todo.findById(id).then((todo)=>{
    if(!todo){
      //console.log(2);
      return res.status(404).send();
    }
    res.send({todo});
  }).catch((e)=>{
    //console.log(3);
    res.status(404).send();
  })
});

app.delete('/todos/:id',(req,res)=>{
  //console.log(1);
  var id=req.params.id;
  //console.log(id);
  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }
  Todo.findByIdAndRemove(id).then((todo)=>{
    if(!todo){
      return res.status(404).send();
    }
    res.status(200).send({todo});
  }).catch((e)=>{
    console.log(e.message);
    res.status(400).send();
  });
});



app.listen(port,()=>{
  console.log('Started on port '+port);
});
module.exports={app};

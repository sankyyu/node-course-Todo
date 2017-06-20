require('./config/config');
var _=require('lodash');
var express=require('express');
var bodyParser=require('body-parser');
var {ObjectID}=require('mongodb');

var {mongoose}=require('./db/mongoose.js');
var {Todo}=require('./models/todo.js');
var {User}=require('./models/user.js');
var {authenticate}=require('./middleware/authenticate')

var app=express();
const port=process.env.PORT || 3001;
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

app.patch('/todos/:id',(req,res)=>{
  var id=req.params.id;
  var body=_.pick(req.body,['text','completed']);

  if(!ObjectID.isValid(id)){
    return res.status(400).send();
  }

  if(_.isBoolean(body.completed)&&body.completed){
    body.completeAt =new Date().getTime();
  }else{
    body.completed=false;
    body.completeAt=null;
  }

  Todo.findByIdAndUpdate(id,{$set:body},{new:true}).then((todo)=>{
    if(!todo){
      return res.status(404).send();
    }
    res.send({todo});
  }).catch((e)=>{
    res.status(400).send();
  })
});

app.post('/users',(req,res)=>{
  var body=_.pick(req.body,['email','password']);
  var user=new User(body);

  user.save().then(()=>{
    return user.generateAuthToken();
  }).then((token)=>{
    res.header('x-auth',token).send(user);
  }).catch((e)=>{
    res.status(400).send(e);
  })
});

app.get('/users/me',authenticate, (req,res)=>{
  res.send(req.user);
});

app.listen(port,()=>{
  console.log('Started on port '+port);
});
module.exports={app};

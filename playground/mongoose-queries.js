
const {mongoose} =require('./../server/db/mongoose');
const {Todo} =require('./../server/models/todo');

var id='69275493aba16ea81dd00663';

Todo.find({
  _id:id
}).then((todos)=>{
  console.log('Todos',todos);
});

Todo.findOne({
  _id:id
}).then((todo)=>{
  console.log('Todo',todo);
});

Todo.findById(id).then((todo)=>{
  if(!todo){
    return console.log(' ID not found')
  }
  console.log('Todo By id',todo);
}).catch((e)=>console.log(e));

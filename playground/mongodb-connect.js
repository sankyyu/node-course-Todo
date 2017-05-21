// const MongoClient=require('mongodb').MongoClient;
const {MongoClient,ObjectID}=require('mongodb');

var obj=new ObjectID();
console.log(obj.timestamp);

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db) => {
  if(err){
    return console.log(err);
  }
  console.log('connect to MongoDB');
  db.collection('Todos').find().count().then((count)=>{
    console.log(count);
    //console.log(JSON.stringify(docs,undefined,2));
  },(err)=>{
    console.log(err.message);
  });

  db.close();
});

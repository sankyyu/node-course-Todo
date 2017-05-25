const {MongoClient,ObjectID}=require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db) => {
  if(err){
    return console.log(err);
  }
  console.log('connect to MongoDB');

  db.collection('Todos').findOneAndUpdate({
    _id:new ObjectID('5921220f7b0a53785f857111')
  },{
    $set:{
      completed:true
    }
  },{
    returnOriginal:false
  }).then((result)=>{
    console.log(result)
  });

});

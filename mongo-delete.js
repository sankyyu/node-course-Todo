const {MongoClient,ObjectID}=require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db) => {
  if(err){
    return console.log(err);
  }
  console.log('connect to MongoDB');

    // db.collection('Todos').deleteMany({text:'Eat lunch'}).then((result)=>{
    //   console.log(result);
    // });
//   db.collection('Todos').findOneAndDelete({completed:false}).then((result)=>{
//     console.log(result);
//   }
// );

});

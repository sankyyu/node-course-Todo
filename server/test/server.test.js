const expect=require('expect');
const request =require('supertest');
const {ObjectID}=require('mongodb');
const {app}=require('./../server');
const {Todo}=require('./../models/todo');

const todos=[{
  _id:new ObjectID(),
  text:'first test todo'
},{
  _id:new ObjectID(),
  text:'second test todo'
}];

beforeEach((done)=>{
  Todo.remove({}).then(()=>{
    Todo.insertMany(todos);
  }).then(()=>done());
});

describe('POST/todos',()=>{
  it('Should create a new Todo',(done)=>{
    var text='Test todo text';

    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect((res)=>{
        expect(res.body.text).toBe(text);
      })
      .end((err,res)=>{
        if(err){
          return done(err);
        }

        Todo.find({text}).then((todos)=>{
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e)=>done(e));
      });
  });

  it('should not create todo with invaild body data',(done)=>{
    var text='';

    request(app)
      .post('/todos')
      .send({text})
      .expect(400)
      .end((err,res)=>{
        if(err){
          return done(err);
        }

        Todo.find().then((todos)=>{
          expect(todos.length).toBe(2);
          done();
        }).catch((e)=>done(e));
      });
  });
});


describe('Get /todos', ()=>{
  it('Should get all todos',(done)=>{
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res)=>{
        expect(res.body.todos.length).toBe(2);
      })
      .end(done);
  });
});

describe('GET /todos/:id',()=>{
  it('Should return todo doc',(done)=>{
    request(app)
      .get('/todos/'+todos[0]._id.toHexString())
      .expect(200)
      .expect((res)=>{
        //console.log(res);
        expect(res.body.todo.text).toBe(todos[0].text)
      })
      .end(done);
  });
  it('should return 404 if todo not found',(done)=>{
    var id=new ObjectID().toHexString();
    request(app)
      .get('/todos/'+id)
      .expect(404)
      .end(done);
  });

  it('should return 404 for non-object ids',(done)=>{
    request(app)
      .get('/todos/123abc')
      .expect(404)
      .end(done);

  });
});

describe('DELETE /todos/:id', ()=>{
  it('Should remove a todo',(done)=>{
    var id=todos[0]._id.toHexString();
    request(app)
      .delete('/todos/'+id)
      .expect(200)
      .expect((res)=>{
        //console.log(res.body.todo._id);
        expect(res.body.todo._id).toBe(id)
      })
      .end(done);
  });

  it('Should return 404 if todo not found',(done)=>{
    var id=new ObjectID().toHexString();
    request(app)
      .delete('/todos/'+id)
      .expect(404)
      .end(done);
  });

  it('Should return 404 if object id is invalid',(done)=>{
    request(app)
      .delete('/todos/123abc')
      .expect(404)
      .end(done);
  });
});

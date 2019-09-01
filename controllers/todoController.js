var bodyParse = require('body-parser');
var mongoose = require('mongoose');

//Connect to  the database
mongoose.connect(
  'mongodb+srv://todolist:todolist@todolist-zslgc.mongodb.net/test?retryWrites=true&w=majority',
  { useNewUrlParser: true }
);

//Create a schema - this is like a blueprint

var todoSchema = new mongoose.Schema({
  item: String
});

var Todo = mongoose.model('Todo', todoSchema);

/*
var itemOne = Todo({ item: 'buy flowers' }).save(function(err) {
  if (err) throw err;
  console.log('item saved');
});
*/
/*
var data = [
  { item: 'get milk' },
  { item: 'walk dog' },
  { item: 'kick some coding ass' }
];
*/

//middle ware in post request
var urlencodedParser = bodyParse.urlencoded({ extended: false });

module.exports = function(app) {
  app.get('/todo', function(req, res) {
    //get data from mongodb and pass it to view
    Todo.find({}, function(err, data) {
      if (err) throw err;
      res.render('todo', { todos: data });
    });
  });

  app.post('/todo', urlencodedParser, function(req, res) {
    //get data from the view and add it to mongodb

    var newTodo = Todo(req.body).save(function(err, data) {
      if (err) throw err;
      res.json(data);
    });
  });

  app.delete('/todo/:item', function(req, res) {
    //delete the requested item from mongodb

    Todo.find({ item: req.params.item.replace(/\-/g, ' ') }).deleteOne(function(
      err,
      data
    ) {
      if (err) throw err;
      res.json(data);
    });
  });
};

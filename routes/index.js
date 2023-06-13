var express = require('express');
var router = express.Router();
const path = require("path");
const mysql = require('mysql2');
var bodyParser = require('body-parser');



router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:true}));


const db = mysql.createConnection({
    host: 'localhost',
    user: "root",
    password: "admin",
    database: "task"
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database');
});
  


router.post('/create', function (req, res, next) {
  var task = req.body.task;


  var sql = "INSERT INTO list (task) VALUES (?)";
  db.query(sql, [task], function (error, result) {
    if (error) {
      console.error('Error inserting data into table:', error);
      res.status(500).send('Error inserting data into table');
      return;
    }
    res.redirect('/');
  });
});

//show data
router.get('/', function (req, res, next) {
  var sql = "SELECT * FROM list";
  db.query(sql, function (error, result) {
    if (error) {
      console.error('Error retrieving data from table:', error);
      res.status(500).send('Error retrieving data from table');
      return;
    }
   
    res.render("index.ejs", {result:result});
  });
});


router.get('/delete/:id', function(req, res, next) {
  // Extract the data from the request body
  console.log(req.query)
  var taskId = req.params.id;

  // Delete the task from the MySQL database
  var sql = "DELETE FROM list WHERE id = ?";
  db.query(sql, [taskId], function(error, result) {
    res.redirect('/');
  });
});



//update
router.get('/update/:id', function(req, res, next) {
  // Extract the data from the request body
  var taskId = req.params.id;
  var updatedTask = req.query.task;

  // Update the task in the MySQL database
  var sql = "UPDATE list SET task = ? WHERE id = ?";
  db.query(sql, [updatedTask, taskId], function(error, result) {
    if (error) {
      console.error('Error updating task:', error);
      res.status(500).send('Error updating task');
      return;
    }
    res.redirect('/');
  });
});




module.exports = router;

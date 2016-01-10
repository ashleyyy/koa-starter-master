var db = require('../models/index.js');

module.exports = {

  // GET    /users/2/tasks   - Retrieves list of tasks for user #2
  // GET    /users/2/tasks/8 - Retrieves task #8 for user #2
  // POST   /users/2/tasks   - Creates a new task in user #2
  // PUT    /users/2/tasks/8 - Updates task #8 for user #2
  // DELETE /users/2/tasks/8 - Deletes task #8 for user #2

  // router
  //   .get('/users/:userId/tasks',         tasksCtrl.getListOfTasksForUser)
  //   .get('/users/:userId/tasks/:taskId', tasksCtrl.getTaskforUser)
  //   .post('/users/:userId/tasks',        tasksCtrl.createTask)
  //   .put('/users/:userId/tasks/:taskId', tasksCtrl.updateTask)
  //   .del('/users/:userId/tasks/:taskId', tasksCtrl.removeTask);

  // -------------------------------------------------------------
  //
  //     get list of today's tasks for user
  //
  // -------------------------------------------------------------
  getListOfTasksForUser: function* getListOfTasksForUser(next) {

    console.log("");
    console.log("inside controllers/userTasks getListOfTasksForUser()");
    console.log("");
    console.log('GET    /users/' + this.state.userId + '/tasks');

    console.log('this.state.userId');
    console.log(this.state.userId);

    if (!this.state.userId) {
      console.log("The user with UserId = " + this.state.userId + " does not exist.");
      this.body = "The user with UserId = " + this.state.userId + " does not exist.";
    } else {

      var user = this.state.user;

      // get tasks in this sorted order
      //      - most recently updated (but not postponed or completed)
      //      - postponed
      //      - completed

      var today = new Date();
      today.setHours(-8,0,0,0);

      var tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(-8,0,0,0);

       // get tasks not completed and not postponed sorted in descending update order

       var tasks1 = yield db.sequelize.models.Task.findAll({
                                                            where: {
                                                                UserId: user.id,
                                                                completed: false,
                                                                postponed: false,
                                                                due_date: {
                                                                  $lt: tomorrow,
                                                                  $gt: today
                                                                }
                                                            },
                                                            order: [
                                                              ['updatedAt', 'DESC']
                                                            ]
                                                          });

        // console.log('tasks not completed and not postponed sorted in descending update order')

        var mappedTasks1 = [];

        tasks1.forEach(function (task) {
          mappedTasks1.push( task["dataValues"]);
        });

       // get tasks not completed and postponed sorted in descending update order

       var tasks2 = yield db.sequelize.models.Task.findAll({
                                                            where: {
                                                                UserId: user.id,
                                                                completed: false,
                                                                postponed: true,
                                                                due_date: {
                                                                  $lt: tomorrow,
                                                                  $gt: today
                                                                }
                                                            },
                                                            order: [
                                                              ['updatedAt', 'DESC']
                                                            ]
                                                          });

        // console.log('tasks not completed and postponed sorted in descending update order')

        var mappedTasks2 = [];

        tasks2.forEach(function (task) {
          mappedTasks2.push( task["dataValues"]);
        });


        // console.log(mappedTasks2);

       // get tasks completed sorted in descending update order

       var tasks3 = yield db.sequelize.models.Task.findAll({
                                                            where: {
                                                                UserId: user.id,
                                                                completed: true,
                                                                due_date: {
                                                                  $lt: tomorrow,
                                                                  $gt: today
                                                                }
                                                            },
                                                            order: [
                                                              ['updatedAt', 'DESC']
                                                            ]
                                                          });

        console.log('tasks completed sorted in descending update order')

        var mappedTasks3 = [];

        tasks3.forEach(function (task) {
          mappedTasks3.push( task["dataValues"]);
        });


        // console.log(mappedTasks3);

        var mappedTasks = mappedTasks1.concat(mappedTasks2, mappedTasks3);

      // var tasks = yield user.getTasks(); // gets you all tasks

      // var today = new Date();
      // today.setHours(0,0,0,0);

      // var tomorrow = new Date();
      // tomorrow.setDate(tomorrow.getDate() + 1);
      // tomorrow.setHours(0,0,0,0);

      // var tasks = yield db.sequelize.models.Task.findAll({
      //                               where: {
      //                                   due_date: {
      //                                     $gt: today,
      //                                     $lt: tomorrow
      //                                   }, 

      //                                   UserId: user.id
      //                               }
      //                             });  // gets you all tasks due today


      this.body = mappedTasks;

      yield next;
    }

  },

  // -------------------------------------------------------------
  //
  //     get list of yesterday's tasks for refresh function
  //
  // -------------------------------------------------------------
getListOfOldTasksForUser: function* getListOfOldTasksForUser(next) {

    if (!this.state.userId) {
      console.log("The user with UserId = " + this.state.userId + " does not exist.");
      this.body = "The user with UserId = " + this.state.userId + " does not exist.";
    } else {

      var user = this.state.user;

      var today = new Date();
      today.setHours(-8,0,0,0);

      var yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(-8,0,0,0);
      
      var tasks = yield db.sequelize.models.Task.findAll({
                                    where: {
                                        due_date: {
                                          $lt: today,
                                          $gt: yesterday
                                        }, 
                                        UserId: user.id
                                    }
                                  });  // gets you all tasks due yesterday

      var mappedTasks = [];
      tasks.forEach(function (task) {
        mappedTasks.push( task["dataValues"]);
      });

      this.body = mappedTasks;
      yield next;
    }
  },

  // -------------------------------------------------------------
  //
  //     get Task for user
  //
  // -------------------------------------------------------------
  getTaskforUser: function *getTaskforUser(next) {
    console.log("");
    console.log("inside controllers/userTasks getTaskforUser()");
    console.log("");
    console.log('GET    /users/' + this.state.userId + '/tasks/' + this.state.taskId);
    this.body = this.state.task.dataValues;
    yield next;
  },

  // -------------------------------------------------------------
  //
  //     create task for user
  //
  // -------------------------------------------------------------
  createTask: function *createTask(next) {

    console.log("");
    console.log("inside controllers/userTasks createTask()");
    console.log("");
    console.log('POST   /users/' + this.state.userId +  '/tasks');


    console.log('this.request.body');
    console.log(this.request.body);

    var task = this.request.body;

    //  should be able to replace the statement below with this ....
    var newTask = yield db.sequelize.models.Task.create(task);

    // var newTask = yield db.sequelize.models.Task.create({description: task.description,
    //                                              due_date: task.due_date,
    //                                              recurring: task.recurring,
    //                                              completed: task.completed,
    //                                              postponed: task.postponed,
    //                                              priority:  task.priority,
    //                                              UserId:   this.state.userId});

    // var newTask = yield db.sequelize.models.Task.create({description: "Test description",
    //                                            due_date: Date.now(),
    //                                            recurring: false,
    //                                            completed: false,
    //                                            postponed: false,
    //                                            priority:  1,
    //                                            UserId:   1 });

     // console.log('newTask');
     // console.log(newTask);

     this.body = newTask.dataValues;

    yield next;
  },



  // -------------------------------------------------------------
  //
  //     update task for user
  //
  // -------------------------------------------------------------
  updateTask: function *updateTask(next) {
    console.log("");
    console.log("inside controllers/userTasks updateTask()");
    console.log("");
    console.log('PUT    /users/' + this.state.userId + '/tasks/' + this.state.taskId);

    console.log('this.state.taskId');
    console.log(this.state.taskId);


    console.log('this.request.body');
    console.log(this.request.body);

    var task = this.request.body;


    if (task == {} ) {
      console.log("No Task properties were passes to the server to update the Task with");
      this.body = "No Task properties were passes to the server to update the Task with";

    } else {

        console.log("");
        // console.log("The server received these task properties to be updated ---");

    var updatedTask = yield db.sequelize.models.Task.update({description: task.description,
                                                             due_date:    task.due_date,
                                                             priority:    task.priority,
                                                             recurring:   task.recurring,
                                                             postponed:   task.postponed,
                                                             completed:   task.completed},
                                                             {where: {
                                                                 id: task.id
                                                               }
                                                             });

        // for (var prop in task) {
        //   console.log("task." + prop + '= ' + task[prop]);
        // }

        //   Inserting a star.
        //
        //   There should be a Rule on the Task model that when
        //   ... complete is set to 'true' a star is inserted
        //   For now this is being done from the  taskdetailsmodal.js  file

        var updatedTask = yield db.sequelize.models.Task.update(task,
                                                                 {where: {
                                                                     id: this.request.body.id
                                                                   }
                                                                 });
        console.log('updatedTask');
        console.log(updatedTask);
        console.log(updatedTask[0]);

        this.body = updatedTask[0];

        yield next;

      }
                                                                                                                                              },

  // -------------------------------------------------------------
  //
  //     remove task for user -  Brittany also has code for this
  //
  // -------------------------------------------------------------
  removeTask: function *removeTask(next) {

    console.log("");
    console.log("inside controllers/userTasks  removeTask()");
    console.log("");
    console.log('DELETE /users/' + this.state.userId + '/tasks/' + this.state.taskId);


    if (!this.state.taskId) {
      console.log("No Task Id was passes to the server to delete the Task with");
      this.body = "No Task Id was passes to the server to delete the Task with";
    } else {

        // must remove Stars associated with a Task before deleting the Task
        // ... or there is a Foreign Key error
        //
        //  SequelizeForeignKeyConstraintError: update or delete on table "Tasks" violates
        // ... foreign key constraint "Stars_TaskId_fkey" on table "Stars"


        var deletedStars = yield db.sequelize.models.Star.destroy({where: {
                                                                     TaskId: this.state.taskId
                                                                   }
                                                                 });

        var deletedTask = yield db.sequelize.models.Task.destroy({where: {
                                                                     id: this.state.taskId
                                                                   }
                                                                 });

        console.log('deletedTask');
        console.log(deletedTask);

        //need to return something so that the client knows that the request was successful. Just returning the task and user id for now.
        this.body = {
          userId: this.state.userId,
          taskId: this.state.taskId
        };

        yield next;
    }
  }

};

$(function() {

  var server = 'localhost:3000';

  // var userId = $('.something_to_get_userid').text();

  var userId = 2;

  $.get('users/' + userId + '/tasks', function(tasks){

    // find the <ul> and load the <li>'s


    var $taskUl = $('ul.tasks');

    var $taskLi;

    // iterate thru returned array ??
    tasks.forEach(function(task) {

       $taskLi = $('<li>');

       // <a href data-toggle="modal" data-target="#myModal">Do laundry</a>

       $taskAnchor = $('<a>').text(task.description)
                             .attr({
                                    'href': '',
                                    'data-toggle': "modal",
                                    'data-target': "#myModal"
                                  });

       // $taskLi.addClass('taskLi').attr({
       //                                  src: "/resources/hat.gif",
       //                                  title: "jQuery",
       //                                  alt: "jQuery Logo"
       //                                });;

       $taskLi.append($taskAnchor);

       $taskUl.append($taskLi);
    });

    var temp = 1;

  });

  $("#createTaskForm").on('submit', function(e) { 
    e.preventDefault();
    var task = $("#createTaskForm").serialize();
    alert("hello");
    $.post("/users/2/tasks", task, function(data) {
      // $("form").html(data);
      alert("success");
    });
  });

});  

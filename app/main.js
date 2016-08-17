(function (){
  var app = angular.module('dynamo-planner', ['ui.bootstrap']);
  eventWatch();
  reminderWatch();
  goalWatch();
  noteWatch();
  // define additional triggers on Tooltip and Popover
  app.controller('PopoverCtrl', function ($scope, $log) {
    $scope.dynamicPopover = {
      templateUrl: 'signIn.html',
      title: 'Sign In'
    };
    $scope.check = function () {
      if (firebase.auth().currentUser) {
        firebase.auth().signOut();
      }
    };
    $scope.isOpen = false;
    $scope.isOpen1 = false;
  });
  app.controller('EventController', function ($scope, $log) {
    $scope.dateTime = new Date();
    $scope.date = new Date();
    $scope.time = new Date();
    $scope.updateDate = function (date) {
      $scope.date = date;
      $scope.dateTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), $scope.time.getHours(), $scope.time.getMinutes(), $scope.time.getSeconds());
    };
    $scope.updateTime = function (time) {
      $scope.time = time;
      $scope.dateTime = new Date($scope.date.getFullYear(), $scope.date.getMonth(), $scope.date.getDate(), time.getHours(), time.getMinutes(), time.getSeconds());
    };
    $scope.addEvent = function () {
      if(firebase.auth().currentUser) {
        var description = $("#eventDescription").val();
        var userId = firebase.auth().currentUser.uid;
        var date = $scope.dateTime.toString();
        // TODO: Calculate the order # for each event
        $log.log("Description: ", description);
        $log.log("DateTime: ", $scope.dateTime);
        $log.log("User: ", userId);
        // Add the event
        if(description) {
          var events = firebase.database().ref().child("events");
          var newEvent = events.push();
          newEvent.set({
            description: description,
            dateTime: date,
            order: 1,
            user: userId
          });
          $log.log("Added Event");
          $('#eventModal').modal('hide');
        } else {
          $('#eventDesCon').addClass("has-error");
          $('#eventAlert').show();
          $('#eventDesCon').keypress(function () {
            $("#eventDesCon").removeClass("has-error");
            $('#eventAlert').hide();
          });
        }
      }
    };
  });
  app.directive('eventModal', function () {
    return {
      restrict: 'E',
      templateUrl: 'eventModal.html'
    };
  });
  app.directive('firebase', function () {
    return {
      restrict: 'E',
      templateUrl: 'firebase.html'
    };
  });
  app.directive('reminderModal', function () {
    return {
      restrict: 'E',
      templateUrl: 'reminderModal.html'
    };
  });
  app.directive('goalModal', function () {
    return {
      restrict: 'E',
      templateUrl: 'goalModal.html'
    };
  });
  app.directive('noteModal', function () {
    return {
      restrict: 'E',
      templateUrl: 'noteModal.html'
    };
  });

  // TIMEPICKER CONTROLLER
  app.controller('TimepickerDemoCtrl', function ($scope, $log) {
  $scope.mytime = new Date();
  if ($scope.mytime.getMinutes() >= 30 ) {
      $scope.mytime.setMinutes(30);
  } else {
    $scope.mytime.setMinutes( 0 );
  }
  $scope.hstep = 1;
  $scope.mstep = 15;
  $scope.ismeridian = true;

  $scope.addReminder = function() {
    if(firebase.auth().currentUser) {
      var description = $("#reminderDescription").val();
      var dateTime = $scope.mytime.toString();
      var priority = parseInt($("#reminderPriority").val());
      var userId = firebase.auth().currentUser.uid;
      $log.log("Description: ", description);
      $log.log("DateTime: ", dateTime);
      $log.log("User: ", userId);
      $log.log("Priority: ", priority);
      // Add the reminder
      if(description) {
        var reminders = firebase.database().ref().child("reminders");
        var newReminder = reminders.push();
        newReminder.set({
          description: description,
          dateTime: dateTime,
          priority: priority,
          user: userId
        });
        $log.log("Added Reminder");
        $('#reminderModal').modal('hide');
      } else {
        $('#reminderDesCon').addClass("has-error");
        $('#reminderAlert').show();
        $('#reminderDesCon').keypress(function () {
          $("#reminderDesCon").removeClass("has-error");
          $('#reminderAlert').hide();
        });
      }
    }
  };

  $scope.clear = function() {
    $scope.mytime = null;
  };
});
// DATEPICKER CONTROLLER
app.controller('DatepickerPopupDemoCtrl', function ($scope) {
  $scope.today = function() {
    $scope.dt = new Date();
  };
  $scope.today();
  $scope.format = 'shortDate';

  $scope.inlineOptions = {
    customClass: getDayClass,
    minDate: new Date(),
    showWeeks: true
  };

  $scope.dateOptions = {
    dateDisabled: disabled,
    formatYear: 'yy',
    maxDate: new Date(2030, 5, 22),
    minDate: new Date(),
    startingDay: 0
  };

  function disabled(data) { return false; }

  $scope.open1 = function() { $scope.popup1.opened = true; };
  $scope.open2 = function() { $scope.popup2.opened = true; };

  $scope.popup1 = { opened: false };
  $scope.popup2 = { opened: false };

  function getDayClass(data) {
    var date = data.date,
      mode = data.mode;
    if (mode === 'day') {
      var dayToCheck = new Date(date).setHours(0,0,0,0);

      for (var i = 0; i < $scope.events.length; i++) {
        var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

        if (dayToCheck === currentDay) {
          return $scope.events[i].status;
        }
      }
    }
    return '';
  }
});
})();

function newEvent() { $('#eventModal').modal('show'); }
function newReminder() { $('#reminderModal').modal('show'); }
function newGoal() { $('#goalModal').modal('show'); }
function newNote() { $('#noteModal').modal('show'); }

function addNote() {
  var text = $("#note-input").val();
  var dateTime = new Date().toString();
  var usr = firebase.auth().currentUser.uid;
  if (text) {
    var notes = firebase.database().ref().child("notes");
    var newNote = notes.push();
    newNote.set({
      text: text,
      dateTime: dateTime,
      user: usr
    });
    console.log("Added Note");
    $("#noteModal").modal('hide');
  } else {
    $('#noteAlert').show();
    $('#note-input').keypress(function () {
      $('#noteAlert').hide();
    });
  }
}

function addGoal() {
  var description = $("#goalDescription").val();
  var priority = parseInt($("#goalPriority").val());
  var dateTime = new Date().toString();
  var usr = firebase.auth().currentUser.uid;
  if (description) {
    var goals = firebase.database().ref().child("goals");
    var newGoal = goals.push();
    newGoal.set({
      description: description,
      dateTime: dateTime,
      priority: priority,
      user: usr
    });
    console.log("Added Goal");
    $("#goalModal").modal('hide');
  } else {
    $('#goalDesCon').addClass("has-error");
    $('#goalAlert').show();
    $('#goalDesCon').keypress(function () {
      $("#goalDesCon").removeClass("has-error");
      $('#goalAlert').hide();
    });
  }
}

function eventWatch() {
  var events = firebase.database().ref().child("events");
  events.on("child_added", function (snapshot, prevChildKey) {
    var newEvent = snapshot.val();
    console.log("ON ADDED: Description: " + newEvent.description);
    console.log("ON ADDED: DateTime: " + newEvent.dateTime);
    console.log("ON ADDED: User: " + newEvent.user);
  });
}

function reminderWatch() {
  var reminders = firebase.database().ref().child("reminders");
  reminders.on("child_added", function (snapshot, prevChildKey) {
    var newReminder = snapshot.val();
    console.log("ON ADDED: Description: " + newReminder.description);
    console.log("ON ADDED: DateTime: " + newReminder.dateTime);
    console.log("ON ADDED: Priority: " + newReminder.priority);
    console.log("ON ADDED: User: " + newReminder.user);
    var dateTime = new Date(newReminder.dateTime);
    var options = { minute: false};
    var time = dateTime.toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'});
    console.log(time);
    var reminderMarkup;
    switch (newReminder.priority) {
      case 0:
        reminderMarkup = "<li id=\"note\" class=\"list-group-item\">" + newReminder.description + "  @  " + time + "</li>";
        $("#reminder-list").append(reminderMarkup);
        break;
      case 1:
        reminderMarkup = "<li id=\"note\" class=\"list-group-item list-group-item-danger\">" + newReminder.description + "  @  " + time + "<span id=\"badge\" class=\"badge\">&#x2757;</span>" + "</li>";
        $("#reminder-list").prepend(reminderMarkup);
        break;
      case 2:
        reminderMarkup = "<li id=\"note\" class=\"list-group-item list-group-item-warning\">" + newReminder.description + "  @  " + time + "</li>";
        $("#reminder-list").append(reminderMarkup);
        break;
      case 3:
        reminderMarkup = "<li id=\"note\" class=\"list-group-item list-group-item-success\">" + newReminder.description + "  @  " + time + "</li>";
        $("#reminder-list").append(reminderMarkup);
        break;
    }
  });
}

function goalWatch() {
  // TODO: Check for date
  var goals = firebase.database().ref().child("goals");
  goals.on("child_added", function (snapshot, prevChildKey) {
    var newGoal = snapshot.val();
    // console.log("ON ADDED: Description: " + newGoal.description);
    // console.log("ON ADDED: DateTime: " + newGoal.dateTime);
    // console.log("ON ADDED: Priority: " + newGoal.priority);
    // console.log("ON ADDED: User: " + newGoal.user);
    var goalMarkup;
    switch (newGoal.priority) {
      case 0:
        goalMarkup = "<li id=\"note\" class=\"list-group-item\">" + newGoal.description + "</li>";
        $("#goals-container").append(goalMarkup);
        break;
      case 1:
        goalMarkup = "<li id=\"note\" class=\"list-group-item list-group-item-danger\">" + newGoal.description + "<span id=\"badge\" class=\"badge\">&#x2757;</span>" + "</li>";
        $("#goals-container").prepend(goalMarkup);
        break;
      case 2:
        goalMarkup = "<li id=\"note\" class=\"list-group-item list-group-item-warning\">" + newGoal.description + "</li>";
        $("#goals-container").append(goalMarkup);
        break;
      case 3:
        goalMarkup = "<li id=\"note\" class=\"list-group-item list-group-item-success\">" + newGoal.description + "</li>";
        $("#goals-container").append(goalMarkup);
        break;
    }
  });
}

function noteWatch() {
  // TODO: Check for date
  var notes = firebase.database().ref().child("notes");
  notes.on("child_added", function (snapshot, prevChildKey) {
    var newNote = snapshot.val();
    // console.log("ON ADDED: Text: " + newNote.text);
    // console.log("ON ADDED: DateTime: " + newNote.dateTime);
    // console.log("ON ADDED: User: " + newNote.user);
    var noteMarkup = "<li id=\"note\" class=\"list-group-item\">" + newNote.text + "</li>";
    $("#notes-container").append(noteMarkup);
  });
}

$("#sign-in-button").focusin(function () {
  console.log("Changed focus?");
  if (firebase.auth().currentUser) {
    $("#sign-in-button").click();
  }
});

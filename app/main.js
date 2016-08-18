/***********************************
 * Declare Global Variable
 ***********************************/
 var gEventIndex = 1;
 var atFirst = true;
 var today = new Date().toLocaleDateString();
 console.log("TODAY: ", today);
(function (){
  var app = angular.module('dynamo-planner', ['ui.bootstrap']);
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
        var date = $scope.dateTime.toLocaleDateString();
        var time = $scope.dateTime.toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'});
        // Add the event
        if(description) {
          var events = firebase.database().ref().child(userId).child("events");
          var newEvent = events.push();
          newEvent.set({
            description: description,
            date: date,
            time: time,
            order: gEventIndex
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
      // var date = $scope.mytime.toLocaleDateString();
      var priority = parseInt($("#reminderPriority").val());
      var userId = firebase.auth().currentUser.uid;
      var time = $scope.mytime.toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'});
      $log.log("Description: ", description);
      $log.log("Time: ", time);
      $log.log("User: ", userId);
      $log.log("Priority: ", priority);
      // Add the reminder
      if(description) {
        var reminders = firebase.database().ref().child(userId).child("reminders");
        var newReminder = reminders.push();
        newReminder.set({
          description: description,
          date: today,
          time: time,
          priority: priority
        });
        $log.log("Added Reminder");
        location.reload();
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
  $scope.dateOptions = {
    dateDisabled: disabled,
    formatYear: 'yy',
    maxDate: new Date(2030, 5, 22),
    minDate: new Date(),
    startingDay: 0
  };
  function disabled(data) { return false; }
  $scope.open1 = function() { $scope.popup1.opened = true; };
  $scope.popup1 = { opened: false };
});
})();

function loadWatchers(uid) {
  firebase.auth().onAuthStateChanged(function (authData) {
    if (authData) {
      setEventIndex(authData.uid);
      console.log("User is logged in");
      eventWatch(authData.uid);
      noteWatch(authData.uid);
      goalWatch(authData.uid);
      reminderWatch(authData.uid);
    } else {
      console.log("User is logged out");
      $("#notes-container").empty();
      $("#goals-container").empty();
      $("#reminder-list").empty();
      $('.eventBadge').remove();
      $(".highlight-item").remove();
      gEventIndex = 1;
    }
  });
}

function newEvent() { $('#eventModal').modal('show'); }
function newReminder() { $('#reminderModal').modal('show'); }
function newGoal() { $('#goalModal').modal('show'); }
function newNote() { $('#noteModal').modal('show'); }

function addNote() {
  var text = $("#note-input").val();
  var dateTime = new Date().toString();
  var usr = firebase.auth().currentUser.uid;
  if (text) {
    var notes = firebase.database().ref().child(usr).child("notes");
    var newNote = notes.push();
    newNote.set({
      text: text,
      date: today
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
    var goals = firebase.database().ref().child(usr).child("goals");
    var newGoal = goals.push();
    newGoal.set({
      description: description,
      date: today,
      priority: priority
    });
    console.log("Added Goal");
    location.reload();
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

function eventWatch(uid) {
  var events = firebase.database().ref().child(uid).child("events").orderByChild("date").equalTo(today);
  events.on("child_added", function (snapshot, prevChildKey) {
    var newEvent = snapshot.val();
    var colon = newEvent.time.search(':');
    var median;
    if (newEvent.time.search('AM') != -1) {
      median = "AM";
    } else {
      median = "PM";
    }
    var hour = parseInt(newEvent.time.substring(0, colon));
    var minute = parseInt(newEvent.time.substr(colon+1, 2));
    // Insert into?
    var timeSpanID = '#' + median + '-' + hour;
    // $(timeSpanID)
    if (minute >= 30) {
      timeSpanID += "-30";
    }
    // Add the event badge
    var markup = "<span id=\"badge\" class=\"badge eventBadge\">" + newEvent.order + "</span>";
    $(timeSpanID).prepend(markup);
    // Add the Event highlight
    var markup2 = "<tr class=\"highlight-item\"><td><span id=\"rBadge\" class=\"badge\">" + newEvent.order + "</span><span>" + newEvent.description + "</span></td></tr>";
    switch (hour) {
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 12:
        // Insert into noon
        console.log("NOON");
        $("#noon").append(markup2);
        break;
      default:
        if (median == "AM") {
          // Insert into Morning
          console.log("MORNING");
          $("#morning").append(markup2);
        } else {
          // Insert into Evening
          console.log("EVENING");
          $("#evening").append(markup2);
        }
        break;
    }
  });
}

function reminderWatch(uid) {
    var reminders = firebase.database().ref().child(uid).child("reminders").orderByChild("priority");
    reminders.on("child_added", function (snapshot, prevChildKey) {
      var newReminder = snapshot.val();
      if (newReminder.date == today) {
        var time = newReminder.time;
        var options = { minute: false};
        var reminderMarkup;
        switch (newReminder.priority) {
          case 4:
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

      }
    });
}

function goalWatch(uid) {
  var goals = firebase.database().ref().child(uid).child("goals").orderByChild("priority");
  goals.on("child_added", function (snapshot, prevChildKey) {
    var newGoal = snapshot.val();
    if (newGoal.date == today) {
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
    }
  });
}

function noteWatch(uid) {
  // TODO: Check for date
  var notes = firebase.database().ref().child(uid).child("notes");
  notes.on("child_added", function (snapshot, prevChildKey) {
    console.log("HOW MANY TIMES?");
    var newNote = snapshot.val();
    if (newNote.date == today) {
      var noteMarkup = "<li id=\"note\" class=\"list-group-item\">" + newNote.text + "</li>";
      $("#notes-container").append(noteMarkup);
    }
  });
}

$("#sign-in-button").focusin(function () {
  console.log("Changed focus?");
  if (firebase.auth().currentUser) {
    $("#sign-in-button").click();
  }
});

function setEventIndex(uid) {
    var events = firebase.database().ref().child(uid).child("events").orderByChild("date").equalTo(today);
    events.on("child_added", function (snapshot) {
      gEventIndex++;
      console.log("INDEX IS INCREMENTED TO", gEventIndex);
    });
}

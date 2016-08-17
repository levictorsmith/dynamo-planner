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
        var date = $scope.dateTime.toString();
        // TODO: Calculate the order # for each event
        $log.log("Description: ", description);
        $log.log("DateTime: ", $scope.dateTime);
        $log.log("User: ", userId);
        // Add the event
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

  console.log("Added Note");
}
function addGoal() {

  // console.log("Added Goal");
}
$("#sign-in-button").focusin(function () {
  console.log("Changed focus?");
  if (firebase.auth().currentUser) {
    $("#sign-in-button").click();
  }
});

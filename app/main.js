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
      $log.log($scope.dateTime);
      $log.log("Added Event");
      addEvent();
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
    $log.log($scope.mytime);
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

function newEvent() {
  $('#eventModal').modal('show');
}

function newReminder() {
  $('#reminderModal').modal('show');
  console.log("Added Reminder");
}

function newGoal() {
  $('#goalModal').modal('show');
  console.log("Added Goal");
}

function newNote() {
  $('#noteModal').modal('show');
  console.log("Added Note");
}
function addEvent() {
  // var date = new Date("8/13/1993");
  // var time = new Date();
  // var dateTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), time.getHours(), time.getMinutes(), time.getSeconds());
  // console.log(dateTime);
  //Add badge with number and with type color
  // var date = document.getElementById('eventDate').value;
  // var time = document.getElementById('eventTime').value;
  // console.log($ngModel.mytime);
  // console.log(new Date(date));
  console.log("hey");
}
function test(testing) {
  console.log("Hello!");
  console.log(testing);
}

$("#sign-in-button").focusin(function () {
  console.log("Changed focus?");
  if (firebase.auth().currentUser) {
    $("#sign-in-button").click();
  }
});

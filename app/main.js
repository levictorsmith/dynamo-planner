(function (){
  var app = angular.module('dynamo-planner', ['ui.bootstrap']);
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

  $scope.setTime = function() {

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
    startingDay: 1
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
  //Add badge with number and with type color
  
  console.log("Added Event");
}

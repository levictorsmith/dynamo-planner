(function (){
  var app = angular.module('dynamo-planner', ['ui.bootstrap']);
  angular.module('dynamo-planner').controller('TimepickerDemoCtrl', function ($scope, $log) {
  $scope.mytime = new Date();

  $scope.hstep = 1;
  $scope.mstep = 15;

  $scope.options = {
    hstep: [1, 2, 3],
    mstep: [1, 5, 10, 15, 25, 30]
  };

  $scope.ismeridian = true;
  $scope.toggleMode = function() {
    $scope.ismeridian = ! $scope.ismeridian;
  };

  $scope.update = function() {
    var d = new Date();
    d.setHours( 14 );
    d.setMinutes( 0 );
    $scope.mytime = d;
  };

  $scope.changed = function () {
    $log.log('Time changed to: ' + $scope.mytime);
  };

  $scope.clear = function() {
    $scope.mytime = null;
  };
});

})();

function newEvent() {
  $('#eventModal').modal('show');
  console.log("Added Event");
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

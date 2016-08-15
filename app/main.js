(function (){
  var app = angular.module('dynamo-planner', []);

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

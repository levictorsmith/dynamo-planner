(function (){
  var app = angular.module('dynamo-planner', []);

})();
function newEvent() {
  $('eventModal').show();
  console.log("Added Event");
}
function newReminder() {
  $('reminderModal').show();
  console.log("Added Reminder");
}
function newGoal() {
  $('goalModal').show();
  console.log("Added Goal");
}
function newNote() {
  $('noteModal').show();
  console.log("Added Note");
}

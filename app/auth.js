// Initialize Firebase
var config = {
   apiKey: "AIzaSyAB-MckOG2fIHu7FKG4IFdoYfm3HlQFm5o",
   authDomain: "dynamo-planner.firebaseapp.com",
   databaseURL: "https://dynamo-planner.firebaseio.com",
   storageBucket: "dynamo-planner.appspot.com",
};
firebase.initializeApp(config);
var gUID;
/**
 * Handles the sign in button press.
 */
function toggleSignIn() {
  if (firebase.auth().currentUser) {
    // [START signout]
    firebase.auth().signOut();
    // [END signout]
  } else {
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    if (email.length < 4) {
      alert('Please enter an email address.');
      return;
    }
    if (password.length < 4) {
      alert('Please enter a password.');
      return;
    }
    // Sign in with email and pass.
    // [START authwithemail]
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // [START_EXCLUDE]
      if (errorCode === 'auth/wrong-password') {
        alert('Wrong password.');
      } else {
        alert(errorMessage);
      }
      console.log(error);
      document.getElementById('sign-in-button').disabled = false;
      // [END_EXCLUDE]
    });
    // [END authwithemail]
  }
  //Close the info again
}
/**
 * Handles the sign up button press.
 */
function handleSignUp() {
  var email = document.getElementById('email').value;
  var password = document.getElementById('password').value;
  if (email.length < 4) {
    alert('Please enter an email address.');
    return;
  }
  if (password.length < 4) {
    alert('Please enter a password.');
    return;
  }
  // Sign in with email and pass.
  // [START createwithemail]
  firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // [START_EXCLUDE]
    if (errorCode == 'auth/weak-password') {
      alert('The password is too weak.');
    } else {
      alert(errorMessage);
    }
    console.log(error);
    // [END_EXCLUDE]
  });
  // [END createwithemail]
}
/**
 * Sends an email verification to the user.
 */
function sendEmailVerification() {
  // [START sendemailverification]
  firebase.auth().currentUser.sendEmailVerification().then(function() {
    // Email Verification sent!
    // [START_EXCLUDE]
    alert('Email Verification Sent!');
    // [END_EXCLUDE]
  });
  // [END sendemailverification]
}
function sendPasswordReset() {
  var email = document.getElementById('email').value;
  // [START sendpasswordemail]
  firebase.auth().sendPasswordResetEmail(email).then(function() {
    // Password Reset Email Sent!
    // [START_EXCLUDE]
    alert('Password Reset Email Sent!');
    // [END_EXCLUDE]
  }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // [START_EXCLUDE]
    if (errorCode == 'auth/invalid-email') {
      alert(errorMessage);
    } else if (errorCode == 'auth/user-not-found') {
      alert(errorMessage);
    }
    console.log(error);
    // [END_EXCLUDE]
  });
  // [END sendpasswordemail];
}
/**
 * Handles registering callbacks for the auth status.
 *
 * This method registers a listener with firebase.auth().onAuthStateChanged. This listener is called when
 * the user is signed in or out, and that is where we update the UI.
 *
 * When signed in, we also authenticate to the Firebase Realtime Database.
 */
function initApp() {
  // Listening for auth state changes.
  // [START authstatelistener]
  firebase.auth().onAuthStateChanged(function(user) {
    // [START_EXCLUDE silent]
    // document.getElementById('verify-email-button').disabled = true;
    // document.getElementById('signed-in-as').style.display = 'none';
    // [END_EXCLUDE]
    if (user) {
      // User is signed in.
      var displayName = user.displayName;
      var email = user.email;
      var emailVerified = user.emailVerified;
      var photoURL = user.photoURL;
      var isAnonymous = user.isAnonymous;
      var uid = user.uid;
      var refreshToken = user.refreshToken;
      var providerData = user.providerData;
      gUID = uid;
      // [START_EXCLUDE silent]
      document.getElementById('signed-in-as').textContent = 'Signed in as ' + email;
      document.getElementById('sign-in-button').textContent = 'Sign out';
      document.getElementById('sign-up-button').disabled = true;
      if (!emailVerified) {
        sendEmailVerification();
        addUserToDatabase(uid);
      }
      // [END_EXCLUDE]
    } else {
      // User is signed out.
      // [START_EXCLUDE silent]
      document.getElementById('signed-in-as').innerHTML = '';
      document.getElementById('sign-in-button').textContent = 'Sign in';
      document.getElementById('sign-up-button').disabled = false;
     //  document.getElementById('quickstart-account-details').textContent = 'null';
      // [END_EXCLUDE]
    }
    // [START_EXCLUDE silent]
    document.getElementById('sign-in-button').disabled = false;
    // [END_EXCLUDE]
  });
  // [END authstatelistener]
}
window.onload = function() {
  initApp();
  loadWatchers(gUID);
};

function addUserToDatabase(uid) {
  var dateTime = new Date().toString();
  firebase.database().ref().child(uid).set({
    // id: uid,
    events: {
        123: {
          description: "This is my first event",
          dateTime: dateTime
        }
      },
    reminders: {
      124: {
        description: "This is a reminder",
        dateTime: dateTime,
        priority: 1
      }
    },
    goals: {
      125: {
        description: "This is a goal",
        dateTime: dateTime,
        priority: 2
      }
    },
    notes: {
      126: {
        text: "This is a note",
        dateTime: dateTime
      }
    }
  });
  console.log("ADDED USER TO THE DATABASE");
}

var database
 
function run() {


 var config = {
    apiKey: "AIzaSyBQL4hAWD7x0IicQLyQAWtw8NSNBpxxcog",
    authDomain: "kavzahav-1.firebaseapp.com",
    databaseURL: "https://kavzahav-1.firebaseio.com/",
    storageBucket: "kavzahav-1.appspot.com"
  };
  let app = firebase.initializeApp(config);

  // Get a reference to the database service
  database = firebase.database(app);
 }


//
 function newMeeting(hostId, time, title, description) {

  // A post entry.
  var meeting = {
    hostId: hostId,
    time: time,
    title: title,
    description: description
  }

  // Get a key for a new Post.
  var newMeetingKey = firebase.database().ref().child('meetings').push().key;

  // Write the new post's data simultaneously in the posts list and the user's post list.
  var updates = {};
  updates['/meetings/' + newMeetingKey] = meeting;
  updates['/hosts/' + hostId + '/meetings' + newMeetingKey] = meeting;

  return firebase.database().ref().update(updates);
}




//set function 
  function setMeetingData(meetingId, time, title, host, description) {
  firebase.database().ref('kavzahav/' + meetingId).set({
    time: time,
    title: title,
    host :host,
    description: description
  });
}
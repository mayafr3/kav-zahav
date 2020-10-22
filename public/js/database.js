// <script src="https://cdn.firebase.com/libs/firebaseui/3.5.2/firebaseui.js"></script>
// <link type="text/css" rel="stylesheet" href="https://cdn.firebase.com/libs/firebaseui/3.5.2/firebaseui.css" />

// For more examples, see docs:
// https://firebase.google.com/docs/web/setup#from-the-cdn

// Examples for calling the functions:
  // newMeeting(1, "21:00", "Hanna Bishul", "description")
  // getMeetings(1)

let db;
let auth;
let realUser;
let realUserE;


function initializeDB()
{
  let config = {
    apiKey: "AIzaSyBQL4hAWD7x0IicQLyQAWtw8NSNBpxxcog",
    authDomain: "kavzahav-1.firebaseapp.com",
    projectId: "kavzahav-1"
  };
  let app = firebase.initializeApp(config);
  db = firebase.firestore(app);
  auth = firebase.auth();
  if (localStorage.getItem('realUser'))
  {
    realUser = localStorage.getItem('realUser');
  }
  if (localStorage.getItem('realUserE'))
  {
    realUserE = localStorage.getItem('realUserE');
  }

  //load users
  // db.collection("users").doc("0").set({name: "Gadi Bar", faculty: "Computer Sience", description: "love sport and history", meetingList: [1, 3]});
  // db.collection("users").doc("1").set({name: "Maya May", faculty: "Pshycology", description: "I like good conversations", meetingList: [2]});
  // db.collection("users").doc("2").set({name: "Ben Gol", faculty: "Geography", description: "love traveling and coocking", meetingList: []});

  // //load hosts
  // db.collection("hosts").doc("0").set({name: "Shoshana Galili", description: "I like swimming and be with my grandchildrens", meetingID: 3});
  // db.collection("hosts").doc("1").set({name: "Pini Ran", description: "", meetingList: 1});
  // db.collection("hosts").doc("2").set({name: "Lea Goldberg", description: "love traveling and coocking", meetingList: 2});

  //editMeetiong(1, "16:00", "Hanna Bishol", "");
  // console.log(getAllStudentMeeting("0"));
  // console.log(getMeetingsByHost(2));
}


//this function should be called in onload in order to load footer and header
function initializeComponentsStudents()
{
  // Load components
  const headerLoading = new rxjs.Observable(observer => {
    $("#header").load("components/header_students.html", () => observer.next());
  });
  // const contentLoading = new rxjs.Observable(observer => {
  //   $("#content").load("components/content.html", () => observer.next());
  // });
  const footerLoading = new rxjs.Observable(observer => {
    $("#footer").load("components/footer.html", () => observer.next());
  });

  
  // Wait until all components are loaded
  rxjs.zip(
    headerLoading,
    //contentLoading,
    footerLoading,
  ).subscribe(() => {
    // Components are loaded, display them
    $("#components").css({ display: 'block' });
  });
}

//this function should be called in onload in order to load footer and header
function initializeComponentsElders()
{
  // Load components
  const headerLoading = new rxjs.Observable(observer => {
    $("#header").load("components/header_grand.html", () => observer.next());
  });
  // const contentLoading = new rxjs.Observable(observer => {
  //   $("#content").load("components/content.html", () => observer.next());
  // });
  const footerLoading = new rxjs.Observable(observer => {
    $("#footer").load("components/footer.html", () => observer.next());
  });

  
  // Wait until all components are loaded
  rxjs.zip(
    headerLoading,
    //contentLoading,
    footerLoading,
  ).subscribe(() => {
    // Components are loaded, display them
    $("#components").css({ display: 'block' });
  });
}

function initializeElderMeetingPage()
{
  elderId = realUserE;

  // Lior added here: for enter meeting button. Find meeting Id by host id, and implement it in the url
  changeMeetingButton(elderId);
  db.collection('meetings').get().then((snapshot) => {
    snapshot.docs.forEach((doc) => {
      if (doc.data()['hostId'] == elderId)
      {

        if(doc.data()['taken'] == '0')
        {
          document.getElementById("student_jpg1").style.display = "block";
          document.getElementById("student_jpg2").style.display = "block";
          document.getElementById("student_jpg3").style.display = "block";
          document.getElementById("student_jpg4").style.display = "block";
          document.getElementById("student_jpg5").style.display = "block";
          document.getElementById("student_alert").innerHTML= " סטודנטים שמתעניינים בנושא:לחץ על התמונה לפרטים נוספים";
          document.getElementById("student_alert1").innerHTML= "הפגישה ממתינה לאישור של סטודנט . שים לב ברגע שהפגישה תאושר יופיע כפתור הכניסה למפגש.:";
          document.getElementById("entry_btn").disabled = true;

        }
        else if (doc.data()['taken'] == '1')
        {
          var infro = doc.data()['elderPageInfo'];
          document.getElementById("old_butten_change").disabled = false;
          document.getElementById("student_alert").innerHTML= infro;
          document.getElementById("student_alert").classList.add("student_alert_after");
        }
      }
    })
  })
}















function noFutureMeeting()
{
        var noMeeting = document.createElement('div');
        noMeeting.className = 'old_header';
        noMeeting.textContent = "לא נמצאה פגישה עתידית";
        var setButton = document.createElement('button');
        setButton.className = 'prettyButton_set';
        setButton.style.width = 400;
        var buttonLink = "location.href='appointElderly.html'";
        setButton.setAttribute('onclick', buttonLink);
        setButton.textContent = "קבע פגישה חדשה";
        document.getElementById('myMeeting').appendChild(noMeeting);
        document.getElementById('myMeeting').appendChild(setButton);
}

function transferAuthenticatedHost()
{
  elderId = realUserE;
  console.log(realUserE);
  if (realUserE != undefined) // User is not authenticated
  {
    console.log('user is authenticated');
    window.location.href = 'hostView.html';
  }
}

/* Loads the elderly meeting review page with 3 options: if not authenticated, authenticate; if not future meeting exists, offers creating a new one; if future meeting exist, show it  */
function initializeElderMeetingPageNew()
{
  elderId = realUserE;
  console.log(realUserE);
  if (realUserE == undefined) // User is not authenticated
  {
    console.log('No user authenticated');
    open_sing_in();
  }
  else // User is authenticated
  {
    console.log('User is authenticated');

    db.collection('hosts').doc(realUserE).get().then((doc) => {    // get meeting id of the elderly:
      meetingId = doc.get('meetingID');
      var hostName = doc.get('name');

      // No meeting exists:
      if (meetingId == undefined || meetingId =="")
      {
        noFutureMeeting();
      }

      // Meeting exists:
      else
        {

          // Check if meeting is in the future:
        db.collection('meetings').doc(meetingId).get().then((doc) => {  // get the actual meeting:
        meetingDate = doc.get('date');
        meetingHour = doc.get('hour');
        timeArray = parseDate(doc.data()['date'], doc.data()['hour']);
        var isMeetingInTheFuture = isMeetingInFuture(timeArray[0], timeArray[1], timeArray[2], timeArray[3]);
        
        if (isMeetingInTheFuture)
        {
          addMeetingToElderPrivatePage(doc.data(), doc.id, hostName);

          // db.collection('meetings').get().then((snapshot) => {
          // snapshot.docs.forEach((doc) => {
            if (doc.data()['hostId'] == elderId)
            {
              if(doc.data()['taken'] == '0')
              {
                document.getElementById('entry_btn').style.visibility = 'hidden';
                document.getElementById("student_jpg1").style.display = "block";
                document.getElementById("student_jpg2").style.display = "block";
                document.getElementById("student_jpg3").style.display = "block";
                document.getElementById("student_jpg4").style.display = "block";
                document.getElementById("student_jpg5").style.display = "block";
                document.getElementById("student_alert").innerHTML= " סטודנטים שמתעניינים בנושא:לחץ על התמונה לפרטים נוספים";
                document.getElementById("student_alert1").innerHTML= " הפגישה ממתינה לאישור של סטודנט, ברגע שהפגישה תאושר , יופיע כפתור הכניסה למפגש.";
                document.getElementById("entry_btn").disabled = true;

              }
              else if (doc.data()['taken'] == '1')
              {
                var infro = doc.data()['elderPageInfo']
                document.getElementById("old_butten_change").disabled = true;
                document.getElementById("student_alert").innerHTML= infro;
                document.getElementById("student_alert").classList.remove('student_alert');
                document.getElementById("student_alert").classList.add("student_alert2");
              }
            } 
        //   })
        // })
        } // end of meeting in the future

        else // The meeting has passed.
        {
          noFutureMeeting();
          console.log("meeting past");
        }


      });
    }
    });

  }
  
}



function addMeetingToElderPrivatePage(meeting, meetingid, hostName)
{
    //create elements
    var header = document.createElement('div');
    header.className+="old_header";
    header.textContent+=" הפגישה הבאה תתקיים "
    
    var day = document.createElement('span');
    day.id='day';
    day.className="old_header";
    day.textContent = "ביום " + meeting['date'];

    var hour = document.createElement('span');
    hour.id='hour';
    hour.className="old_header";
    hour.textContent = " בשעה " + meeting['hour'];

    var subject = document.createElement('span');
    subject.id='subject';
    subject.className="old_header";
    subject.textContent = " בנושא " + meeting['topic'];

    var waitForApprove = document.createElement('div');
    waitForApprove.id = "student_alert1";

    var cancelButton = document.createElement('input');
    cancelButton.className = 'old_butten_cancel';
    cancelButton.type = 'button';
    cancelButton.setAttribute('value', 'ביטול מפגש');
    cancelButton.setAttribute('onclick', "elder_cancel_meeting()");

    var enterMeetingButton = document.createElement('input');
    enterMeetingButton.id = "entry_btn"; 
    enterMeetingButton.className = 'old_butten_go';
    enterMeetingButton.type = 'button';
    enterMeetingButton.setAttribute('value', 'כניסה למפגש');
    var buttonLink = "location.href='meeting.html?id=" +meetingId+ '&userType=host&userName=' + hostName + "'";
    enterMeetingButton.setAttribute('onclick', buttonLink);

    var changeMeetingButton = document.createElement('input');
    changeMeetingButton.id = "old_butten_change"; 
    changeMeetingButton.className = 'old_butten_change';
    changeMeetingButton.type = 'button';
    changeMeetingButton.setAttribute('value', 'שינוי פרטי מפגש');
    var linkchange = "location.href= 'changemeeting.html'"
    changeMeetingButton.setAttribute('onclick', linkchange);

    header.appendChild(day);
    header.appendChild(hour);
    header.appendChild(subject);

    document.getElementById("myMeeting").appendChild(header);
    document.getElementById("myMeeting").appendChild(waitForApprove);
    document.getElementById("contain_button").appendChild(cancelButton);
    document.getElementById("contain_button").appendChild(enterMeetingButton);
    document.getElementById("contain_button").appendChild(changeMeetingButton);
}





















//this function adds a user to the data base
function addUser(name, faculty, description)
{
  //todo- deal with new ID
  db.collection("users").add({name: name, faculty: faculty, description: description, meetingList: []});
}

// This function creates a new meeting in the database with the given parameters
function newMeeting(day, time, description, topic) {
  var canappoint = 0;
  hostId = realUserE;
  db.collection('meetings').get().then((snapshot) => {
    snapshot.docs.forEach((doc) => { 
      if (doc.data()['hostId'] == hostId)
      {
        //check if meeting is in the future 
        timeArray = parseDate(doc.data()['date'], doc.data()['hour']);
        var isMeetingInTheFuture = isMeetingInFuture(timeArray[0], timeArray[1], timeArray[2], timeArray[3]);
        if (isMeetingInTheFuture === true)
        {
          canappoint = 1;
        }
        // var infro = doc.data()['elderPageInfo']                    
        // document.getElementById("student_alert").innerHTML= infro;
      }
    });
  }).then(()=>{

    if (canappoint == 1)
    {
      var r = confirm(" יש לך כבר פגישה עתידית לחץ אישור למעבר לעמוד הפגישה");
        if (r==true)
        {
          window.location.href='hostView.html';
        }
        else{
          window.location.href='appointElderly.html';
        }
    }
    else
    {
      localStorage.setItem('day', day);
      localStorage.setItem('topic', topic);
      localStorage.setItem('hour', time);
      console.log("newMeeting");
      var name = "פגישה עם ";
      var hostDoc;
      db.collection('hosts').get().then(function (snapshot)
      {
        var docs = snapshot.docs;
        docs.forEach((doc) =>
        {
          if(doc.id == hostId)
          {
            name+= doc.data()['name'];
            hostDoc = doc;
          }
        });
        addTheMeeting(hostId, day, time, description, topic, name);
      })

    }   
  });
  
}


  function addTheMeeting(hostId, day, time, description, topic, title)
  {
    db.collection("meetings").add({
    hostId: hostId,
    hour: time,
    date: day,
    title: title,
    description: description,
    taken:"0",
    topic: topic
   
  }).then(function (docRef) {
      console.log("newMeeting: Document written with ID: ", docRef.id);
      //add metting id to host
     db.collection('hosts').doc(hostId).update({meetingID: docRef.id});
     window.location.href = 'hostView.html';
    })
    .catch(function (error) {
    console.error("newMeeting: Error adding document: ");
    });
  }
  


//function that edit a meeting. assumption - one meeting per hostId
//understand the bug- delete meeting than edd another one?
function editMeetiong(hostId, time, title, description)
{
  var batch = db.batch();
  db.collection("meetings").where("hostId", "==", hostId).get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      batch.update(doc, {hostId: hostId, time:time, title: title, description: description});
    });
  });
}

 function elder_cancel_meeting(){
    hostId = realUserE;
    var over = document.createElement("div");
    over.classList.add("old_cancel_over"); 
    var massage = document.createElement("div");
    massage.innerHTML = "האם אתה בטוח <br>שאתה רוצה <br> לבטל את הפגישה הזו?";
    massage.classList.add("old_cancel");                        
    var btn_yes = document.createElement("button");  
    btn_yes.innerHTML = "כן";
    btn_yes.classList.add("old_butten_cancel_yes");
    var btn_no = document.createElement("button");  
    btn_no.innerHTML = "לא";
    btn_no.classList.add("old_butten_cancel_no");
    btn_yes.onclick = function()
    {
      db.collection('meetings').get().then((snapshot) =>{
        snapshot.docs.forEach((doc) =>{
          if (doc.data()['hostId'] == hostId)
          {
            //check if meeting is in the future 
            timeArray = parseDate(doc.data()['date'], doc.data()['hour']);
            var isMeetingInTheFuture = isMeetingInFuture(timeArray[0], timeArray[1], timeArray[2], timeArray[3]);

            //the meeting not passed
            if(isMeetingInTheFuture === true)
            {
              if (doc.data()['taken'] == '1')
              {
                
                    db.collection('hosts').doc(hostId).update({meetingID: ""}).then(() => 
                    {
                      db.collection('meetings').doc(doc.id).delete().then(() => 
                      {
                        var day = "יום הפגישה"
                        var hour= "שעת הפגישה"
                        var topic= "נושא הפגישה"
                        localStorage.setItem("day",day);
                        localStorage.setItem("hour",hour);
                        localStorage.setItem("subject",topic);
                        window.location.href = '/appointElderly.html';

                      }).then(() => {
                        db.collection('users').get().then((snapshot)=>{
                        snapshot.docs.forEach((doc2) =>{
                        db.collection('users').doc(doc2.id).update({meetingList: firebase.firestore.FieldValue.arrayRemove(doc.id)});
                  });
                      })
                    });
                  });
              }
              else
              {
                db.collection('hosts').doc(hostId).update({meetingID: ""}).then(() => 
                    {
                      db.collection('meetings').doc(doc.id).delete().then(() => 
                      {
                        var day = "יום הפגישה"
                        var hour= "שעת הפגישה"
                        var topic= "נושא הפגישה"
                        localStorage.setItem("day",day);
                        localStorage.setItem("hour",hour);
                        localStorage.setItem("subject",topic);
                        window.location.href = '/appointElderly.html';

                      })
                    });
                }

            }


            
          }
        });
      });
    }
    btn_no.onclick = function(){massage.remove();
    btn_yes.remove();
    over.remove();
    btn_no.remove()};
    document.body.appendChild(over); 
    document.body.appendChild(massage);
    document.body.appendChild(btn_no);
    document.body.appendChild(btn_yes);       
  }

function chang_page_old(name, faculty, description, phone, meetingId)
{ 
  var information = "הפגישה נקבעה עם" + " " + name + " " + "סטודנט/ית בחוג" + " " + faculty + "<br>" + "הסטודנט/ית מספר/ת:"+ " "+ description + " "+ "פרטים ליצירת קשר:" + " " + phone;
  localStorage.setItem("information",information);
  db.collection('meetings').doc(meetingId).update({elderPageInfo: information});
  return false;
}


//function for appoint meeting - when the student press the button appoint meeting
//clicking on appint meeting- add in a new_meeting func
  function appoint_meeting(userId, meetingId)
  {
    var r = confirm("Are you sure you want to appoint this meeting?");
    var index= -1;
    if (r == true) 
    {

      //sign the meeting as taken
      db.collection('meetings').doc(meetingId).update({taken: '1'});


      //code for insert meeting id into the student meeting list
      db.collection('users').doc(userId).update({
      meetingList: firebase.firestore.FieldValue.arrayUnion(meetingId)});

      //details student
      db.collection('users').get().then((snapshot) => {
        alldocs = snapshot.docs
        alldocs.forEach((doc) => {
          if (doc.id == userId)
          {
            //function for change page of the elderly
            chang_page_old(doc.data()['name'], doc.data()['faculty'], doc.data()['description'], doc.data()['phone'], meetingId);
          }
        })
      }).then(()=>{window.location.href = 'student_page.html';});
      
    } 
    
  }




//responsible of showing allll meetings in entry student page

function createMeetingInStudentHtml(meeting, meetingid)
{
  //create elements
  var card = document.createElement('div');
  var header = document.createElement('div');
  var body = document.createElement('div');
  var title = document.createElement('h3');

  var row = document.createElement('div');
  var col1 = document.createElement('col');
  var col2 = document.createElement('col');
  var date = document.createElement('p');
  var hour = document.createElement('p');
  var topic = document.createElement('p');
  var description = document.createElement('p');
  
  var bottomRow = document.createElement('div');
  var bottomCol1 = document.createElement('div');
  var bottomCol2 = document.createElement('div');
  var appointButton = document.createElement('button');

//define class names
  card.id = meetingid;
  card.className+="card text-right w-75 bg-light mb-3 cardstyle";
  header.className+="cardheader";
  body.className+="card-body";
  title.className+="card-title cardheader";
  row.className+="row";
  col1.className+="col-sm-2";
  col2.className+="col-sm-2";
  date.className+="card-text cardinner col-sm-3";
  hour.className+="card-text cardinner col-sm-3";
  topic.className+="card-text cardinner col-sm-3"; /////hereee
  description.className+="card-text cardinner";
  bottomRow.className+="row";
  bottomCol1.className+="col-sm-4";
  bottomCol2.className+="col-sm-5";
  appointButton.className+="prettyButton col-sm-4";
  

//define texts
  title.textContent+=meeting['title'];
  date.textContent+="ביום: " + meeting["date"];
  hour.textContent+="בשעה: " + meeting['hour'];
  topic.textContent+="בנושא: " + meeting['topic']
  description.textContent+="המארח/ת מספר: " + meeting['description'];
  appointButton.textContent+="קבע פגישה"

//bring user id instead 0
  appointButton.addEventListener('click', appoint_meeting.bind(null, realUser, meetingid));

//connect the elements
  header.appendChild(title);
  row.appendChild(col1);
  row.appendChild(date);
  row.appendChild(hour);
  row.appendChild(topic);
  row.appendChild(col2);
  bottomRow.appendChild(bottomCol1);
  bottomRow.appendChild(appointButton);
  bottomRow.appendChild(bottomCol2);

  body.appendChild(row);
  body.appendChild(description);
  body.appendChild(bottomRow);

  card.appendChild(header);
  card.appendChild(body);

  document.getElementById("allmeeting").appendChild(card);
  
}

/**
 * displays all the meeting in students page
 */
function displayAllMeetings()
{
  
  db.collection('meetings').get().then((snapshot) => {
    snapshot.docs.forEach(meetingElement => {
      
      //checks if the meeting is in the future
      let timeArray = parseDate(meetingElement.data()['date'], meetingElement.data()['hour']);
      var isMeetingInTheFuture = isMeetingInFuture(timeArray[0], timeArray[1], timeArray[2], timeArray[3]);
      
      if (meetingElement.data()['taken'] == '0' && isMeetingInTheFuture)
      {
        createMeetingInStudentHtml(meetingElement.data(), meetingElement.id);
      }

    });
  });
}




//next 3 functions responsible for finding and display the student meeting in my meeting page

// function insertToStudentCalander(meeting)
// {
//   var div = document.createElement('div');
//   div.style+="position:relative";
//   var span = document.createElement('span');
//   span.style+="font-size:22px";
//   span.textContent+=meeting['title'];

//   div.appendChild(span);
//   document.getElementById(216).className+="cal_meeting";
//   document.getElementById(216).appendChild(div);
// }


function getPhoneByMeetingId(meetingid)
{
  var hostId;
  var phone;
  db.collection('meetings').get().then((snapshot) => {
    snapshot.docs.forEach(doc => {
      if (doc.id == meetingid)
      {
        hostId = doc.data()['hostId'];
      }
    })
  }).then(()=>{
    db.collection('hosts').get().then((snapshot) => {
    snapshot.docs.forEach(doc => {
      if (doc.id == hostId)
      {
        phone = doc.data()['phone'];
      }
    });
  }).then(()=>{return phone;});

  })

  
}
  


function addMeetingToStudentPrivatePage(meeting, meetingid, studentName)
{
  var phone;
  var hostId;
  db.collection('meetings').get().then((snapshot) => {
    snapshot.docs.forEach(doc => {
      if (doc.id == meetingid)
      {
        hostId = doc.data()['hostId'];
      }
    })
  }).then(()=>{
    db.collection('hosts').get().then((snapshot) => {
    snapshot.docs.forEach(doc => {
      if (doc.id == hostId)
      {
        phone = doc.data()['phone'];
      }
    });
  }).then(()=>{  
      
    //create elements
  
    var card = document.createElement('div');

    //style should be added to scc - style="background:#3C8EB7; text-align:center;"
    var header = document.createElement('div');

    //style- "style="font-weight:bold;
    var title = document.createElement('h4');

    var body = document.createElement('div');
    var row = document.createElement('div');
    var row2 = document.createElement('div');
    var row3 = document.createElement('div');
    var col1 = document.createElement('div');
    var col2 = document.createElement('div');
    var col3 = document.createElement('div');
    var col4 = document.createElement('div');
    var date = document.createElement('p');
    var time = document.createElement('p');
    var topic = document.createElement('p');
    var description = document.createElement('p');
    var startMeeting = document.createElement('button');
    var cancleMeeting = document.createElement('button');
    var phoneNum = document.createElement('p');

    // var phone = "0507847365"
    // phone = getPhoneByMeetingId(meetingid);

    //define classes and text
    card.className+="card text-right w-75 bg-light mb-3 cardstyle";
    header.className+="cardheader";
    title.className+="card-title cardheader";
    title.textContent+= meeting['title'];

    body.className+="card-body";
    row.className+="row";
    row2.className+="row";
    row3.className+="row";
    col1.className+="col-sm-3";
    col2.className+="col-sm-3";
    col3.className+="col-sm-3";
    col4.className+="col-sm-3";
    date.className+="card-text cardinner col-sm-3";
    time.className+="card-text cardinner col-sm-3";
    topic.className+="card-text cardinner col-sm-3";
    phoneNum.className+="card-text cardinner col-sm-3";
    description.className+="card-text cardinner";
    startMeeting.className+="start_meeting col-sm-3";
    cancleMeeting.className+="cancle_meeting col-sm-3";

    time.textContent+="שעה: "+ meeting['hour'];
    date.textContent+="תאריך: " + meeting['date'];
    topic.textContent+="נושא: " + meeting['topic'];
    phoneNum.textContent+="צור קשר: " + phone;
    description.textContent+="המארח מספר: " + meeting['description'];

    startMeeting.textContent+="התחל פגישה";
    cancleMeeting.textContent+= "בטל פגישה";

    //conect cancel meeting.
    cancleMeeting.addEventListener('click', student_cancel_meeting.bind(null, realUser, meetingid));

    
    //condition if the meeting is close

    var meetingLink = 'meeting.html?id=' + meetingid + '&userType=student&userName=' + studentName;
    startMeeting.addEventListener('click', function(){window.location.replace(meetingLink)});

    header.appendChild(title);
    row.appendChild(date);
    row.appendChild(time);
    row.appendChild(topic);
    row.appendChild(phoneNum);
    row2.appendChild(col1);
    row2.appendChild(description);
    row2.appendChild(col2);
    row3.appendChild(col3);
    row3.appendChild(cancleMeeting);
    row3.appendChild(startMeeting);
    row3.appendChild(col4);
    body.appendChild(row);
    body.appendChild(row2);
    body.appendChild(row3);

    card.appendChild(header);
    card.appendChild(body);

    document.getElementById("MyMeetings").appendChild(card);

    });
  });
    
}


/* This function takes the date in its string format from database and returns an array of day, month, hour, min */
function parseDate(date, hour)
{ 

  // var myRe = /[\d.]+/g;
  var myRe = /([\d]+).([\d]+)/g;
  var dateArray = myRe.exec(date);
  var myRe = /([\d]+):([\d]+)/g;
  var hoursArray = myRe.exec(hour);
  console.log(dateArray, hoursArray)
  resultArray = [parseInt(dateArray[1]), parseInt(dateArray[2]), parseInt(hoursArray[1]), parseInt(hoursArray[2])];
  return resultArray;
}

/* Returns true iff time of the meeting is in the future */
function isMeetingInFuture(day, month, hour, min, year=2020)
{
  meetingTime = new Date(year, month -1 , day,hour,min,0);
  nowTime = new Date();
  return nowTime.getTime() <= meetingTime;
}


 

//show the student meetings in html - private
function htmlAllStudentMeetings(meetingList, studentName)
{
  let counter = 0;
  db.collection('meetings').get().then((snapshot) => 
  {
    var docs = snapshot.docs;

    meetingList.forEach(meetingElement =>
    {
      docs.forEach(doc => {
        timeArray = parseDate(doc.data()['date'], doc.data()['hour']);
        var bool = isMeetingInFuture(timeArray[0], timeArray[1], timeArray[2], timeArray[3]);
        if (doc.id ==meetingElement && bool)
        {
          addMeetingToStudentPrivatePage(doc.data(), doc.id, studentName);
          counter++;
        }
      });
    })
  }).then(() => {
      if (counter === 0)
      {
        let h2 = document.createElement('h2');
        h2.innerHTML = ".לא מצאנו עבורך פגישות עתידיות שנרשמת אליהן<p>";
        let buttonDiv = document.createElement('div');
        var setButton = document.createElement('button');
        setButton.className = 'prettyButton_set';
        setButton.style.width = '500px';
        var buttonLink = "location.href='Adi1.html'";
        setButton.setAttribute('onclick', buttonLink);
        setButton.textContent = "קבע פגישה חדשה";
        buttonDiv.appendChild(setButton);
        document.getElementById("MyMeetings").appendChild(h2);
        document.getElementById("MyMeetings").appendChild(buttonDiv);
      }
    });
}


//this function gets a student id and return its' meetings id- array
function getAllStudentMeeting()
{
  var userId = realUser;
  var userdoc;
  db.collection("users").get().then((Snapshot) => {
    Snapshot.docs.forEach(doc=>{
      if (doc.id == userId)
      {
        userdoc = doc;
      }
    });
    
  }).then(()=>{
    htmlAllStudentMeetings(userdoc.data()["meetingList"], userdoc.data()["name"]);
  })
}



//this function cancel the meeting
  function student_cancel_meeting(userId, meetingId){
    var over = document.createElement("div");
    over.classList.add("old_cancel_over"); 
    var massage = document.createElement("div");
    massage.innerHTML = "האם אתה בטוח <br>שאתה רוצה <br> לבטל את הפגישה הזו?";
    massage.classList.add("old_cancel");                        
    var btn_yes = document.createElement("button");  
    btn_yes.innerHTML = "כן";
    btn_yes.classList.add("old_butten_cancel_yes");
    var btn_no = document.createElement("button");  
    btn_no.innerHTML = "לא";
    btn_no.classList.add("old_butten_cancel_no");
    btn_yes.onclick = function(){
      
    
      //meeting can be taken again
      db.collection('meetings').doc(meetingId).update({
        taken: '0',
        elderPageInfo: ''}).then(() => {
          //delete from student meeting list
          db.collection('users').doc(userId).update({meetingList: firebase.firestore.FieldValue.arrayRemove(meetingId)});
        }).then(() => {
           window.location.href = '/student_page.html';
        });

      

     

    };
    btn_no.onclick = function(){massage.remove();
    btn_yes.remove();
    over.remove();
    btn_no.remove()};
    document.body.appendChild(over); 
    document.body.appendChild(massage);
    document.body.appendChild(btn_no);
    document.body.appendChild(btn_yes);       
  };

//this function open popup for sign in with option to sign in
  function old_sign_in(){
    var over = document.createElement("div");
    over.classList.add("old_cancel_over"); 
    var massage = document.createElement("div");
    massage.innerHTML = "הי אורח, אם אתה כבר רשום הכנס שם משתמש וסיסמא:";
    massage.classList.add("old_cancel");                        
    var btn_yes = document.createElement("button");  
    btn_yes.innerHTML = "כן";
    btn_yes.classList.add("old_butten_cancel_yes");
    var btn_no = document.createElement("button");  
    btn_no.innerHTML = "לא";
    btn_no.classList.add("old_butten_cancel_no");
    btn_yes.onclick = function(){
      
    
      //meeting can be taken again
      db.collection('meetings').doc(meetingId).update({taken: '0'});
      db.collection('meetings').doc(meetingId).update({elderPageInfo: ''});

      //delete from student meeting list
      db.collection('users').doc(userId).update({meetingList: firebase.firestore.FieldValue.arrayRemove(meetingId)});

      window.location.href = '/student_page.html';

    };
    btn_no.onclick = function(){massage.remove();
    btn_yes.remove();
    over.remove();
    btn_no.remove()};
    document.body.appendChild(over); 
    document.body.appendChild(massage);
    document.body.appendChild(btn_no);
    document.body.appendChild(btn_yes);       
  };





// return the doc of the meeting with this hostId. assumption: there is one meeting per each host
function getMeetingsByHost(hostId) {
  console.log("getMeetings");
  db.collection("meetings").get().then((Snapshot) => {
    Snapshot.forEach((doc) => {
      if (doc.data()['hostId'] == hostId)
      {
        //print the right value but return undefine
          return doc.id;
      }
          
    });
  });
};

function changeMeetingButton(hostId)
{
  db.collection('hosts').get().then(function (snapshot)
  {
    var docs = snapshot.docs;
    docs.forEach((doc) =>
    {
      if(doc.id == hostId)
      {
        var meetingId = doc.data()['meetingID'];
        var buttonLink = "location.href='meeting.html?id=" +meetingId+"'";
        document.getElementById("entry_btn").setAttribute('onclick', buttonLink);
      }
    });
  })
};

//bubble
function start()
{

  jQuery.fn.verticalMarquee = function(vertSpeed, horiSpeed, index) {

    this.css('float', 'left');

    vertSpeed = vertSpeed || 1;
    horiSpeed = 1 / horiSpeed || 1;

    var windowH = this.parent().height(),
      thisH = this.height(),
      parentW = (this.parent().width() - this.width()) / 2,
      rand = Math.random() * (index * 1000),
      current = this;

    this.css('margin-top', windowH + thisH);
    this.parent().css('overflow', 'hidden');

    setInterval(function() {
      current.css({
        marginTop: function(n, v) {
          return parseFloat(v) - vertSpeed;
        },
        marginLeft: function(n, v) {
          return (Math.sin(new Date().getTime() / (horiSpeed * 1000) + rand) + 1) * parentW;
        }
      });
    }, 15);

    setInterval(function() {
      if (parseFloat(current.css('margin-top')) < -thisH) {
        current.css('margin-top', windowH + thisH);
      }
    }, 250);
  };

  var message = 1;
  $('.message').each(function(message) {
    $(this).verticalMarquee(0.3, 0.3, message);
    message++
  });
};



//Elderly change meeting 
function ChangeMeeting(date, time, info, topic)
{
  let meetingID;
  db.collection('hosts').doc(realUserE).get().then((doc) =>{
    meetingID = doc.get('meetingID');
  }).then(() => {
    db.collection('meetings').doc(meetingID).update({
      date: date,
      hour: time,
      description: info, 
      topic: topic
    }).then(() => {window.location.href = "hostView.html"});
  });
}

function autoMoveBySignIn()
{
  if (realUserE != undefined)
  {
    db.collection('hosts').doc(realUserE).get().then((doc) => {
      if (doc.get('meetingID') === "")
      {
        window.location.href='appointElderly.html';
      }
      else
      {
        window.location.href='hostView.html';
      }
    });
  }
  else
  {
    location.href = 'old_first.html';
  }
}

//auth
let suffixUserName = '@gmail.com';
function sign_in(){
  var email = document.getElementById('user_name').value + suffixUserName;
  var password = document.getElementById('user_name').value;
  auth.signInWithEmailAndPassword(email, password).then(function(user) {
   // user signed in
  localStorage.setItem('realUserE', user.user.uid);
  realUserE = user.user.uid;
  document.getElementById("over_sign_in").style.display = "none";
  document.getElementById("div_sign_in").style.display = "none";
  document.getElementById("sign_in_text").style.display = "none";
  document.getElementById("user_name").style.display = "none";
  document.getElementById("password").style.display = "none";
  document.getElementById("ok_sign_in").style.display = "none";
  document.getElementById("new_meet").style.display = "block";
  document.getElementById("close-button").style.display = "none";
  document.getElementById("open_sign").style.display = "none";

  db.collection('hosts').doc(realUserE).get().then((doc) => {
    if (doc.get('meetingID') === "")
    {
      window.location.href='appointElderly.html';
    }
    else
    {
      window.location.href='hostView.html';
    }
  });
}).catch(function(error) {
    var errorCode = error.code;
    var errorMessage = error.message;

  
    // var err = document.createElement('div');
    // err.className="error";
    // err.textContent = "סיסמא או שם משתמש לא תקיניים"
    document.getElementById("div_sign_in").innerHTML = "סיסמא או שם משתמש לא תקיניים <br> נסה שנית";
    document.getElementById("div_sign_in").style.color = 'red';
    document.getElementById("user_name").value= "";
    document.getElementById("password").value = "";
    
    console.log(error);
});

}


function close_popup()
{
  document.getElementById("over_sign_in").style.display = "none";
  document.getElementById("div_sign_in").style.display = "none";
  document.getElementById("sign_in_text").style.display = "none";
  document.getElementById("user_name").style.display = "none";
  document.getElementById("password").style.display = "none";
  document.getElementById("ok_sign_in").style.display = "none";
  document.getElementById("new_meet").style.display = "block";
  document.getElementById("close-button").style.display = "none";
  document.getElementById("open_sign").style.display = "none";

}


//sign out function for elders.
function sign_out()
{
  auth.signOut().then(function() {
    realUserE = undefined;
    localStorage.removeItem('realUserE');
    //change to open page
    window.location.href = 'openning_page.html';
  }).catch(function(error) {
    // An error happened.
    console.log('logging out error');
});

}


// autheentication //
function googleSignIn()
{
  var base_provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(base_provider).then((result) => {
    console.log("loginSuccess");
    userid = result.user.uid;
    var flag =0;
    db.collection('users').get().then((snapshot) =>{
      
      snapshot.docs.forEach((doc)=>{
        if(doc.id == userid)
        {
          localStorage.setItem('realUser', result.user['uid']);
          window.location.href = 'Adi1.html'
          flag=1;
        }
      })
    }).then(()=>{
        if(flag == 0)
        {
          alert("את/ה צריך להירשם קודם")
        }
      })
    
  }).catch((err) => {
    console.log("loginFail");
  });
}

//sign out for students.
function googleSignOut()
{
  auth.signOut().then(function() {
    // Sign-out successful.
    realUser = undefined;
    localStorage.removeItem('realUser');
    localStorage.removeItem('realUser');
    //change to open page
    window.location.href = 'openning_page.html';
  }).catch(function(error) {
    // An error happened.
    console.log('student log-out fail');
  });
}



/**
 * sign up section 
 */

/**
 * this function creats an elder user(host) in the db
 */
function createElderUser(email, password, fname, lname, description, phone)
{
  //password has to be more than 6 chars
  if (password.length < 6)
  {
    alert("ההרשמה נכשלה - סיסמא צריכה להיות לפחות 6 ספרות");
    return;
  }
  
  email = email + suffixUserName;
  firebase.auth().createUserWithEmailAndPassword(email, password).then(function(user){
    //creates new doc in hosts
    db.collection('hosts').doc(user.user.uid).set({
        name: fname + ' ' + lname,
        description: description,
        phone: phone,
        meetingID: ""
    }).then(()=>{
      alert('ההרשמה בוצעה בהצלחה');
      //sign the user in
      realUserE = user.uid;
      window.location.href = 'old_first.html';
    })
  }).catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  console.log('error in creating elder user - ');
  console.log(errorMessage);
});
  
}

/**
 * this function creats a student user(host) in the db
 * they have to provide google mail for the authentication - assumption - they do so (we dont check it)
 */
function createStudentUser(fname, lname, description, phone, faculty)
{
  var base_provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(base_provider).then((result) => {
    console.log("loginSuccess");
    userid = result.user.uid;
    //creates new doc in students
    db.collection('users').doc(userid).set({
        name: fname + ' ' + lname,
        description: description,
        phone: phone,
        faculty: faculty,
        meetingList: []
    }).then(()=> {
      alert('ההרשמה בוצעה בהצלחה');
      //sign the user in
      realUser = userid;
      window.location.href = 'student_first.html';
    })
  }).catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  console.log('error in creating student user - ');
  console.log(errorMessage);
});
  
}




/**
 * this section checks if the users signed in and display buttons accordingly
 */

/**
 * this function check if the student signed in or not in order to greeting him and display signin or sign out
 */
function welcome_user_student()
{
  greeting = "היי אורח";
  if (realUser !== undefined)
  {
    db.collection('users').doc(realUser).get().then((doc) => {
      greeting = " היי " + doc.get('name');
    }).then(() =>
    {
      document.getElementById('welcome_user').textContent = greeting;
    });
  }
  else
  {
    document.getElementById('welcome_user').textContent = greeting;

  }
}

//check if student sign in 
function check_student_sign() {
  if (realUser === undefined)
  {
    alert("אינך מחובר - להתחברות לחץ 'כניסה'");
    window.location.replace('/student_first.html');
  }
}


/**
 * this function check if the host signed in or not in order to greeting him and display signin or sign out
 */

function welcome_user_elderly()
{
  greeting = "היי אורח";
  if (realUserE !== undefined)
  {
    db.collection('hosts').doc(realUserE).get().then((doc) => {
      greeting = " היי " + doc.get('name');
    }).then(() =>
    {
      document.getElementById('welcome_user').textContent = greeting;
    });
  }
  else
  {
    document.getElementById('welcome_user').textContent = greeting;
  }
}

//check if elderly  sign in 
function  check_elderly_sign() {
  if (realUserE === undefined)
  {
    alert("אינך מחובר - להתחברות לחץ 'כניסה'");
    window.location.replace('/old_first.html');
  }
}






function ifro_student(){
  var over = document.createElement("div");
  over.classList.add("old_cancel_over");
  var pop = document.createElement("div");
  pop.classList.add("pop_class");
  pop.innerHTML = " <br>היי, אני אפרת כהן, <br> לומדת ריפוי בעיסוק באוניברסיטה העברית. <br> במקור משהם, אוהבת לעשות ספורט ומתעניינת בהיסטוריה ובישול"
  var imag = document.createElement("img");
  imag.src = "images/efrat1.jpg";
  imag.classList.add("pop_class_img");
  var check = document.createElement("INPUT");
  check.type = "checkbox";
  check.classList.add("pop_check");
  var check_text = document.createElement("div");
  check_text.classList.add("pop_check_text");
  check_text.innerHTML = "אני אשמח להיפגש עם הסטודנט הזה!";
  var yes = document.createElement("button");
  yes.innerHTML = "אישור";
  yes.classList.add("yes");
  yes.style.left = "42%";
  yes.style.top = "83.5%";
  yes.onclick=function(){pop.remove();
  imag.remove();
  x.remove();
  over.remove();
  check.remove();
  check_text.remove();
  yes.remove();};
  var x = document.createElement("button");
  x.innerHTML = "X";
  x.classList.add("close_pop");
  x.onclick=function(){pop.remove();
  imag.remove();
  x.remove();
  over.remove();
  check.remove();
  check_text.remove();
  yes.remove();};
  document.body.appendChild(over);
  document.body.appendChild(pop); 
  document.body.appendChild(imag);
  document.body.appendChild(x);
  document.body.appendChild(check);
  document.body.appendChild(check_text);
  document.body.appendChild(yes);
};


var api;
var hostName;

// This function gets the page parameter from the URL
function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  query = decodeURI(query);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
    if (pair[0] == variable) {
      return pair[1];
    }
  } 
  alert('Query Variable ' + variable + ' not found');
}


/* This function creates the meeting component in the Meeting page */

function initializeMeetingPage()
{
  // initializeMeetingHeader();
  var meetingId = getQueryVariable("id");  /* Get meeting Id from URL parameter */
  var userType = getQueryVariable("userType");
  var userName = getQueryVariable("userName");
  getMeetingDataAndCreatePage(meetingId, userType, userName);
}

/* Get meeting data by id */
function getMeetingDataAndCreatePage(meetingId, userType, userName)
{
    db.collection('meetings').get().then((snapshot) => {
    snapshot.docs.forEach(meetingElement => {
      if (meetingElement.id == meetingId)
      {
        addMeetingCard(meetingElement.data(), meetingElement.id, userType);
        var title =  meetingElement.data()['title'];
        initializeMeetingComponent(meetingId, title, userName);

      }
    });
  });
}

function addMeetingCard(meeting, meetingid, userType)
{
    
    //create elements
    var card = document.createElement('div');
    //style should be added to scc - style="background:#3C8EB7; text-align:center;"
    var header = document.createElement('div');
    //style- "style="font-weight:bold;
    var title = document.createElement('h4');
    var row = document.createElement('div');
    var host = document.createElement('div');
    var body = document.createElement('div');
    var mic = document.createElement('div');
    var video = document.createElement('div');
    var phoneNum = document.createElement('p');

    var phone = "0507847365"
    // phone = getPhoneByMeetingId(meetingid);

    //define classes and text
    card.className+="card text-right w-75 bg-light mb-3 cardstyle";
    header.className+="cardheader";
    title.className+="card-title cardheader";
    title.textContent+="פגישה בנושא " + meeting['topic'];

    card.appendChild(header);
    header.appendChild(title);
    card.appendChild(body)
    body.appendChild(mic);
    body.appendChild(video);


    row.className+="row";
    // new code
    row.textContent += "אישרו הגעה:"
    host.className+="row";
    // Add host content
    var hostId = meeting['hostId'];
    db.collection('hosts').doc(hostId).get().then(function(doc) {
    if (doc.exists){
      hostName = doc.data()['name'];
    } else {
      hostName = "שם המארח אינו זמין";
    }}).catch(function(error) {
      console.log("Error getting document of host", error)
    }).then(function () {
      host.textContent += hostName;
    });
 
    // Add student content
    db.collection('users').get().then((snapshot) => {
      snapshot.docs.forEach((doc) => {
      if (doc.data()['meetingList'].includes(meetingid))
      {
        var student = document.createElement('div');
        student.className = "row";
        student.textContent += doc.data()['name'];
        body.appendChild(student);
      }
      })
    });

    // end of new code
    mic.id="micIndication";
    video.id="videoIndication";
    phoneNum.className+="card-text cardinner col-sm-3";
    phoneNum.textContent+="צור קשר: " + phone;


    body.appendChild(row);
    body.appendChild(host);
    //row.appendChild(phoneNum);

    // if (userType=="host")
    // {
    //   var additionalData = document.createElement('div');
    //   additionalData.className = "row";
    //   additionalData.innerHTML = "<p>פרטים נוספים:<p>" + meeting['elderPageInfo'] +"<p>"
    //   card.appendChild(additionalData);
    // }
    document.getElementById("meetingCard").appendChild(card);
    
}


function initializeMeetingHeader()
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


function initializeMeetingComponent(meetingID, title, userName) {
  const parentElement = document.getElementById('jitsi')
    var domain = "meet.jit.si";
    var options = {
        width: '100%', /* size of the iframe to be created under "jitsi" div */
        height: '100%',
        roomName: "kavZahav_"+meetingID, /* defines the url of the call */
        parentNode: parentElement,
        userInfo: {
        displayName: userName
        },
        configOverwrite: {
        defaultLanguage: 'he',
        prejoinPageEnabled: false,
        }
    }
    api = new JitsiMeetExternalAPI(domain, options); /* Creates an instance of a meeting */
    api.executeCommand('subject', title); /* sets the subject of the meeting */
    api.executeCommand('toggleTileView'); /* start with tile view on (show participants side by side) */
    api.on('readyToClose', () => {
      location.href = 'ending_meeting.html?id='+meetingID; 
      return false;
    });
    advancedJitsiFeatures(api);
 }

/** Functions for changing mic/camera intications */

function micIndication(isMuted)
    {
      if (isMuted.muted)
      {
      MicOffDiv()
      }
      else
      {
        MicOnDiv()
      }
    }

function videoIndication(isMuted)
{
    if (isMuted.muted)
    {
    videoOffDiv()
    }
  else
  {
    videoOnDiv()
  }
  // if (isMuted.muted)
  //   {
  //   document.getElementById('videoON').style.display='none';
  //   document.getElementById('videoOFF').style.display='block';
  //   }
  // else
  // {
  //   document.getElementById('videoON').style.display='block';
  //   document.getElementById('videoOFF').style.display='none';
  // }
}
function advancedJitsiFeatures(api)
{   
  api.on('audioMuteStatusChanged', micIndication); 
  api.on('videoMuteStatusChanged', videoIndication); 
}

function MicOnDiv()
{   
    document.getElementById("micIndication").innerHTML=" המיקרופון פועל<img id='statusIcon'; src= 'images/SuccessIcon.png'>";
}
function MicOffDiv()
{   
    document.getElementById("micIndication").innerHTML="המיקרופון כבוי <img id='statusIcon' src= 'images/ErrorIcon.png'><p id='instructions'> במסך השיחה לחץ על סמל המיקרופון כדי להפעילו.</p>";
}

function videoOnDiv()
{   
    document.getElementById("videoIndication").innerHTML=" המצלמה פועלת<img id='statusIcon' src= 'images/SuccessIcon.png'>";
}
function videoOffDiv()
{   
    document.getElementById("videoIndication").innerHTML=" המצלמה כבויה <img id='statusIcon' src= 'images/ErrorIcon.png'><p id='instructions'>במסך השיחה לחץ על סמל המצלמה כדי להפעיל</p>";
}
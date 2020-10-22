// mdc.ripple.MDCRipple.attachTo(document.querySelector('.foo-button'));
/*maya script*/




// src="https://code.angularjs.org/1.4.8/angular.js"
// angular.module('demo', []);
//function schudele_btn() {



var yes = false
var creat_meeting = false

// window.onload = () => {
//   // Load components
//   const headerLoading = new rxjs.Observable(observer => {
//     $("#header").load("components/header.html", () => observer.next());
//   });
//   // const contentLoading = new rxjs.Observable(observer => {
//   //   $("#content").load("components/content.html", () => observer.next());
//   // });
//   const footerLoading = new rxjs.Observable(observer => {
//     $("#footer").load("components/footer.html", () => observer.next());
//   });

  
//   // Wait until all components are loaded
//   rxjs.zip(
//     headerLoading,
//     //contentLoading,
//     footerLoading,
//   ).subscribe(() => {
//     // Components are loaded, display them
//     $("#components").css({ display: 'block' });
//   });
// };


//global var
if (localStorage.getItem("meetingCounter") == null)
{
  var meetingCounter = 0;
  localStorage.setItem("meetingCounter", "0");
}
var card=[{id: "card-2", topic: "בישול", date: "14/02/20", hour:"16:00", display:"1", name:"בני"}, 
          {id:"card-1", topic:"היסטוריה", date:"15/05/20", hour:"17:00", display:"1", name:"בלה"}];
if (localStorage.getItem("cards") == null)
{  localStorage.setItem("cards", JSON.stringify(card));}



//studentInit
function studentInit(allmeetingElement)
{
   // Load components
  const headerLoading = new rxjs.Observable(observer => {
    $("#header").load("components/header.html", () => observer.next());
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

  var cards = JSON.parse(localStorage.getItem("cards"));
  for (let i = 0; i < cards.length; i++)
  {
    if (cards[i].display.localeCompare("0") == 0)
    {
      continue;
    }
    var newCard = document.createElement('div');
    newCard.className+="card text-right w-75 bg-light mb-3";
    newCard.id=cards[i].id;

  //creat header
    var newCardHead = document.createElement('div');
    newCardHead.className+="card-header";

    var newTitle = document.createElement('h3');
    newTitle.className+="card-title";
    newTitle.textContent= cards[i].topic + " עם " + cards[i].name;
    

    newCardHead.appendChild(newTitle);

  //create body
    var newCardBody = document.createElement('div');
    newCardBody.className+="card-body";

    var p1 = document.createElement('p');
    var p2 = document.createElement('p');
    var button = document.createElement('button');

    p1.className+="card-text";
    p1.textContent="תאריך: " +cards[i].date;
    p2.className+="card-text";
    p2.textContent="שעה: " + cards[i].hour;
  
    button.className+="btn btn-primary appoint";
    button.textContent="קבע פגישה";
    //מוסיף פונקציה ללחיצת הכםתור 
    button.addEventListener('click', appoint_meeting.bind(null, cards[i].id));

    newCardBody.appendChild(p1);
    newCardBody.appendChild(p2);
    newCardBody.appendChild(button);

    newCard.appendChild(newCardHead);
    newCard.appendChild(newCardBody);

    allmeetingElement.appendChild(newCard);
  }

}

  //clicking on appint meeting- add in a new_meeting func
  function appoint_meeting(meetingid)
  {
    var r = confirm("Are you sure you want to appoint this meeting?");
    var index= -1;
    if (r == true) {

      var cards = JSON.parse(localStorage.getItem("cards"));

      //find the meeting
      for (let i = 0; i < cards.length; i++)
      {
        if (cards[i].id.localeCompare(meetingid) == 0)
        {
          cards[i].display = 0;
          index = i;
          break;
        }
      }

      localStorage.removeItem("cards");
      localStorage.setItem("cards", JSON.stringify(cards));

    //להעביר לפגישות שלי
    var newmeet = document.createElement('div');
    newmeet.className+="card text-right mb-3";
    
    var newCardHead = document.createElement('div');
    newCardHead.className+="card-header";

    var title = document.createElement('h4');
    title.className+="card-title";
    title.textContent=cards[index].topic + " עם חנה";

    newCardHead.appendChild(title);
    
    var newCardBody = document.createElement('div');
    newCardHead.className+="card-body";

    ///לסיים להוסיף את הפסקאות

    newmeet.appendChild(newCardHead);
    newmeet.appendChild(newCardBody);
    
    document.getElementById("allMyMeetings").appendChild(newmeet);
    chang_button();
    //פה סיימתי תכניסי את הפונקציה
    
    } 
    
  };

  

  //this function add new meeting to the student page 
  function new_meeting() 
  { 
    passvalues();
    //meeting id
    var currentid = localStorage.getItem("meetingCounter");
    var cardid = "card" + currentid;
    localStorage.setItem("meetingCounter", toString(parseInt(currentid) + 1));

    var cards = JSON.parse(localStorage.getItem("cards"));
    cards.push({id:cardid, topic: localStorage.getItem('topic'), date: "######", hour: localStorage.getItem('hour'), display:"1", name:"חנה"});
    localStorage.removeItem("cards");
    localStorage.setItem("cards", JSON.stringify(cards));

  //   var newCard = document.createElement('div');
  //   newCard.className+="card text-right w-75 bg-light mb-3";
  //   newCard.id=cardid;

  // //creat header
  //   var newCardHead = document.createElement('div');
  //   newCardHead.className+="card-header";

  //   var newTitle = document.createElement('h3');
  //   newTitle.className+="card-title";
  //   newTitle.textContent= localStorage.getItem("topic") + "עם חנה";
    

  //   newCardHead.appendChild(newTitle);

  // //create body
  //   var newCardBody = document.createElement('div');
  //   newCardBody.className+="card-body";

  //   var p1 = document.createElement('p');
  //   var p2 = document.createElement('p');
  //   var button = document.createElement('button');

  //   p1.className+="card-text";
  //   p1.textContent="תאריך: ";
  //   p2.className+="card-text";
  //   p2.textContent="שעה: " + localStorage.getItem("hour");
  
  //   button.className+="btn btn-primary appoint";
  //   button.textContent="קבע פגישה";
  //   //מוסיף פונקציה ללחיצת הכםתור 
  //   button.addEventListener('click', appoint_meeting.bind(null, cardid));

  //   newCardBody.appendChild(p1);
  //   newCardBody.appendChild(p2);
  //   newCardBody.appendChild(button);

  //   newCard.appendChild(newCardHead);
  //   newCard.appendChild(newCardBody);

  //   document.getElementById("allmeeting").appendChild(newCard);

  //כדי שלא יקרא לו פעמיים
  
  };

//hadar functions
  function cancel_meeting(){
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
    btn_yes.onclick = function(){window.location.href = 'https://adi-assulin.wakka.app/maya.html';
      var day = "יום הפגישה"
      var hour= "שעת הפגישה"
      var topic= "נושא הפגישה"
   localStorage.setItem("day",day);
   localStorage.setItem("hour",hour);
   localStorage.setItem("subject",topic);
   return false;
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

  function passvalues()
  {
   var topic=document.getElementById("topicbtn").value;
   var day=document.getElementById("DayBtn").value;
   var hour=document.getElementById("hourbtn").value; 
   var information = "שים לב, <br> הפגישה לא אושרה על ידי אף סטודנט ולכן הפגישה לא נקבעה באופן סופי";
   var color_btn = "background-color:#F3F9FC";
   var text = "הכפתור הזה עדיין לא פעיל <br> כשתיקבע פגישה הוא יהפוך לכחול ופעיל";
   localStorage.setItem("information",information);
   localStorage.setItem("day",day);
   localStorage.setItem("hour",hour);
   localStorage.setItem("topic",topic);
   localStorage.setItem("color_btn",color_btn);
   localStorage.setItem("bubble",text);
   return false;
  };

  function chang_mitting()
  {
   window.location.href = 'https://adi-assulin.wakka.app/appointElderly.html?';
   var day = document.getElementById("day").innerHTML;
   var hour=document.getElementById("hour").innerHTML;
   var topic=document.getElementById("subject").innerHTML; 
   localStorage.setItem("day",day);
   localStorage.setItem("hour",hour);
   localStorage.setItem("subject",topic);
   return false;

  };

  function chang_button()
  {
  window.location.href = 'student_page.html'; 
   var color = "background-color:#3C8EB7";
   var information = "הפגישה אושרה על ידי עדי, סטודנטית למדעי המחשב <br> והיא מחכה לפגוש אותך בשעה שנקבעה";
   localStorage.setItem("color_btn",color);
   localStorage.setItem("bubble","<br><br>");
   localStorage.setItem("information",information);
   return false;
  };

    function student_cancel_old()
  {
   var color = "background-color:#F3F9FC"
   var information = " אנחנו ממש מתנצלים, אבל הסטודנט שקבע את הפגישה נאלץ לבטל, ומוסר גם הוא את התנצלותו <br> כרגע הפגישה לא אושרה על ידי אף משתמש, ולכן לא נקבעה באופן סופי"
   var bubble = "הכפתור הזה עדיין לא פעיל <br> כשתיקבע פגישה הוא יהפוך לכחול ופעיל";
   localStorage.setItem("color_btn",color);
   localStorage.setItem("bubble",bubble);
   localStorage.setItem("information",information);
   return false;
  };


function goBack() {
  window.history.back();
};

function other_subject(){
   var other_subject = document.createElement('input');
   other_subject.classList.add("other");
   other_subject.setAttribute("type", "text");
   document.body.appendChild(other_subject);
};

function other_hour(){
   var other_hour = document.createElement('input');
   other_hour.classList.add("other");
   other_hour.setAttribute("type", "time");
   document.body.appendChild(other_hour);
};

function other_date(){
   var other_date = document.createElement('input');
   other_date.classList.add("other_date");
   other_date.setAttribute("type", "date");
   document.body.appendChild(other_date);
};

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

function ifro_student_1(){
  var over = document.createElement("div");
  over.classList.add("old_cancel_over");
  var pop = document.createElement("div");
  pop.classList.add("pop_class");
  pop.innerHTML = " היי אני ענבל שיר<br> במקור מנתניה לומדת מנהל עסקים וארכיאולוגיה<br> מתעניינת בהיסטוריה ואמנות"
  var imag = document.createElement("img");
  imag.src = "images/MAYAF.png";
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

function ifro_student2(){
  var over = document.createElement("div");
  over.classList.add("old_cancel_over");
  var pop = document.createElement("div");
  pop.classList.add("pop_class");
  pop.innerHTML = "היי, אני עמר פרי <br> סטודנטית לאינטרנט וחברה וכלכלה בירושלים <br> אוהבת לאכול ומתעניינת במוזיקה"
  var imag = document.createElement("img");
  imag.src = "images/OMER.png";
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

function ifro_student3(){
  var over = document.createElement("div");
  over.classList.add("old_cancel_over");
  var pop = document.createElement("div");
  pop.classList.add("pop_class");
  pop.innerHTML = "היי אני יובל <br> סטודנט לתואר שני <br>בפסיכולוגיה בירושלים <br> מתעניין בספורט ובישול "
  var imag = document.createElement("img");
  imag.src = "images/YUVAL.png";
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

function ifro_student4(){
  var over = document.createElement("div");
  over.classList.add("old_cancel_over");
  var pop = document.createElement("div");
  pop.classList.add("pop_class");
  pop.innerHTML = "היי אני נועם <br> במקור ממבשרת ציון <br>  לומד עיצוב תעשייתי בירושלים <br> אוהב לעשות ספורט ומתעניין בבישול"
  var imag = document.createElement("img");
  imag.src = "images/NOAM.png";
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


function cancel(){
  var over = document.createElement("div");
  over.classList.add("old_cancel_over");
  var pop = document.createElement("div");
  pop.classList.add("pop_class");
  pop.innerHTML = "<br>האם אתה בטוח <br> שאתה רוצה לבטל את המפגש?";
  var yes = document.createElement("button");
  yes.innerHTML = "כן";
  yes.classList.add("yes");
  yes.onclick=function(){location.href = 'new1.html'};
  var no = document.createElement("button");
  no.innerHTML = "לא";
  no.classList.add("no");
  no.onclick=function(){pop.remove();
  yes.remove();
  no.remove();
  x.remove();
  over.remove();};
  var x = document.createElement("button");
  x.innerHTML = "X";
  x.classList.add("close_pop");
  x.onclick=function(){pop.remove();
  yes.remove();
  no.remove();
  x.remove();
  over.remove();};
  document.body.appendChild(over);
  document.body.appendChild(pop); 
  document.body.appendChild(yes); 
  document.body.appendChild(no);
  document.body.appendChild(x);
};
//  --- Help button section: ---

function helpMessage() {
  // takes input phone number and sends it to the telegram tech support group
  var phone = document.getElementById("help_phone").value
  var over1 = document.createElement("div");
  over1.classList.add("old_cancel_over");
  var pop = document.createElement("div");
  pop.classList.add("pop_class_help");
  var yes = document.createElement("button");
  yes.innerHTML = "אישור";
  yes.classList.add("yes_help");
  yes.onclick=function(){pop.remove();
  yes.remove();
  over1.remove();
  document.getElementById("help_phone").value = "";};
  pop.innerHTML = " נציג יחזור אל המספר" + " " + phone;
  var basic = "https://api.telegram.org/bot1282060409:AAH5HC15zLAQg6N9D3RVpYAL3xf7G9BPMlE/sendMessage?chat_id=-451998497&text=" 
  var url = basic.concat("user needed help, phone number: " ,phone)
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET",url,true);
  xmlhttp.send();
  document.getElementById("help_window").style.display = "none";
  document.getElementById("over").style.display = "none";
  document.body.appendChild(over1)
  document.body.appendChild(pop)
  document.body.appendChild(yes)
};

function open_help_window() {
  // openning the help div
  document.getElementById("over").style.display = "block";
  document.getElementById("help_window").style.display = "block";
}

function close_help_window() {
  // clossing the help div
  document.getElementById("help_window").style.display = "none";
  document.getElementById("over").style.display = "none";
}


function open_sing_in(){
  document.getElementById("over_sign_in").style.display = "block";
  document.getElementById("div_sign_in").style.display = "block";
  document.getElementById("sign_in_text").style.display = "block";
  document.getElementById("user_name").style.display = "block";
  document.getElementById("password").style.display = "block";
  document.getElementById("ok_sign_in").style.display = "block";
  document.getElementById("new_meet").style.display = "none";
  document.getElementById("open_sign").style.display = "block";
  document.getElementById("close-button").style.display = "block";
}


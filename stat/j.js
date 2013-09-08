/**
 * Created with JetBrains WebStorm.
 * User: erik
 * Date: 17.08.13
 * Time: 12:46
 * To change this template use File | Settings | File Templates.
 */

var months = ["Январь","Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
var days = ["Понедельник,", "Вторник,", "Среда,", "Четверг,", "Пятница,", "Суббота,", "Воскресенье,"];

var today = new Date();
var previousMonth;
var nextMonth;
var currentMonth = today.getMonth()+1;
var currentYear = today.getFullYear();

var monthElement = document.getElementById("month");
var yearElement = document.getElementById("year");
var todayElement = document.getElementById("today");
var tds = document.getElementsByTagName("td");
var addEventButton = document.getElementById("addEvent");
var closeEventForm = document.getElementById("closeEventForm");
var eventForm = document.getElementById("addEventForm");
var createEvent = document.getElementById("createEvent");
var eventSpans = document.getElementsByClassName("eventContainer");
var updEventDiv = document.getElementById("upd-event");
var delEventButton = document.getElementById("delEvent");
var reloadButton = document.getElementById("reload");
var updEventButton = document.getElementById("updEvent");

var target;

function createCalendar(id, year, month) {
    var elem = document.getElementById(id);

    var mon = month - 1; // месяцы в JS идут от 0 до 11, а не от 1 до 12
    var d = new Date(year, mon);
    previousMonth = mon-1;
    nextMonth = mon+1;
    var table = '<table><tr>';
    setToCurrentMonth(monthElement, mon);
    setToCurrentYear(yearElement, currentYear);

    var daysInPrevMonth = getNumberOfDaysInMonth(today.getFullYear(), previousMonth+1);

    // заполнить первый ряд от понедельника
    // и до дня, с которого начинается месяц
    //noinspection JSDuplicatedDeclaration
    for (var i=0; i < getDay(d); i++) {
        table += "<td>"+days[i]+" "+(daysInPrevMonth-getDay(d)+i+1)+"</td>";
    }

    // ячейки календаря с датами
    var isFirstWeek = true;
    while(d.getMonth() == mon) {
        var day = d.getDate();
        var name = d.getFullYear()+'-'+ d.getMonth()+'-'+d.getDate();
        var eventTitle = "";
        var eventClass = "";
        var participants = "";
        var curEvent = getFromStorage(name);
        if(curEvent){
            eventTitle = curEvent.eventTitle;
            eventClass = "event";
            if(curEvent.participants){
                participants = curEvent.participants;
            }
        }

        if(isFirstWeek){
            if(day == today.getDate() && currentMonth == today.getMonth()+1 && currentYear == today.getFullYear()){
                table += '<td class="today "'+eventClass+' name='+name+'>'+days[getDay(d)]+' '+day+'<div class="eventContainer"><span class="eventTitleSpan">'+eventTitle+'</span></br><span class="tdspanpart">'+participants+'</span></div></td>';
            } else{
                table += '<td class="'+eventClass+'" name='+name+'>'+days[getDay(d)]+' '+day+'<div class="eventContainer"><span class="eventTitleSpan">'+eventTitle+'</span></br><span class="tdspanpart">'+participants+'</span></div></td>';
            }

        }else{
            if(day == today.getDate() && currentMonth == today.getMonth()+1 && currentYear == today.getFullYear()){
                table += '<td class="today '+eventClass+'" name='+name+'>'+day+'<div class="eventContainer"><span class="eventTitleSpan">'+eventTitle+'</span></br><span class="tdspanpart">'+participants+'</span></div></td>';
            }else{
                table += '<td class="'+eventClass+'" name='+name+'>'+day+'<div class="eventContainer"><span class="eventTitleSpan">'+eventTitle+'</span></br><span class="tdspanpart">'+participants+'</span></div></td>';
            }
        }
        if (getDay(d) % 7 == 6) { // вс, последний день - перевод строки
            table += '</tr><tr>';
            isFirstWeek = false;
        }
        d.setDate(d.getDate()+1);
    }

    // добить таблицу пустыми ячейками, если нужно
    if (getDay(d) != 0) {
        //noinspection JSDuplicatedDeclaration
        for (var i=getDay(d), j = 1; i<7; i++, j++) {
            table += '<td>'+j+'</td>';
        }
    }

    // закрыть таблицу
    table += '</tr></table>';

    // только одно присваивание innerHTML
    elem.innerHTML = table;
    addPickHandler();
    addEventHandler();
}

function setToCurrentMonth(elem, month){
    elem.innerHTML = months[month];
}

function setToCurrentYear(elem, year){
    elem.innerHTML = year;

}

function getDay(date) { // получить номер дня недели, от 0(пн) до 6(вс)
    var day = date.getDay();
    if (day == 0) day = 7;
    return day - 1;
}

function getNumberOfDaysInMonth(year, month){
    return new Date(year, month, 0).getDate();
}

createCalendar("cal", today.getFullYear(), today.getMonth()+1);

reloadButton.onclick = function(){
    target = undefined;
    eventForm.style.display = 'none';
    createCalendar("cal", currentYear, currentMonth);
};

var leftArrow = document.getElementById("arr-left");
var rightArrow = document.getElementById("arr-right");


leftArrow.onclick = function () {
    currentMonth--;
    if (currentMonth == 0) {
        currentYear--;
        currentMonth = 12;
    }
    createCalendar("cal", currentYear, currentMonth);
};

rightArrow.onclick = function () {
    currentMonth++;
    if (currentMonth == 13) {
        currentYear++;
        currentMonth = 1;
    }
    createCalendar("cal", currentYear, currentMonth)
};

todayElement.onclick = function () {
    currentYear = today.getFullYear();
    currentMonth = today.getMonth() + 1;
    createCalendar("cal", currentYear, currentMonth);
};

function addPickHandler(){
    for (var i = 0, tdl = tds.length; i < tdl; i++){
        tds[i].onclick = pickElement;
    }
}

function pickElement(event){
    var label = eventForm.getElementsByTagName("LABEL")[0];

    event = event || window.event;
    //remove background from previous target
    if(target)target.style.backgroundColor = "";
    target = event.target;
    switch (target.nodeName){
        case "TD":
            target.style.backgroundColor = "#f4f4f4";
            break;
        case "DIV":
            target.parentElement.style.backgroundColor = "#f4f4f4";
            target = target.parentElement;
            break;
        case "SPAN":
            target.parentElement.parentElement.style.backgroundColor = "#f4f4f4";
            target = target.parentElement.parentElement;
    }
    var dateForLabel = new Date(Date.parse(target.getAttribute("name")));

    console.log(dateForLabel);

    setDateToLabel(label, dateForLabel);
}

function putToStorage(key, object){
    localStorage.setItem(key, JSON.stringify(object));
}

function getFromStorage(key){
    return JSON.parse(localStorage.getItem(key));
}

function deleteFromStorage(key){
    localStorage.removeItem(key);
}


addEventButton.onclick = showAddEventForm;

function showAddEventForm(event){
    var label = eventForm.getElementsByTagName("LABEL")[0];
    if(target == undefined){
        label.style.display = "block";
        label.innerHTML = "Выберите день для события";
        label.setAttribute("class", "");
    }
    document.getElementById("eventText").value = "";
    eventForm.style.display = "block";
}

function closeEForm(){
    eventForm.style.display = "none";
}

closeEventForm.onclick = function(){
    closeEForm();
};

createEvent.onclick = function(){
    var event = document.getElementById("eventText").value;
    var tdname = target.getAttribute("name");
    putToStorage(tdname, prepareForStorage(target, event));
    addEventToTable(target, event);
    closeEForm();
    createCalendar("cal", currentYear, currentMonth);
};


function prepareForStorage(target, title, participants, eventTime, description){

    var oldBlob = getFromStorage(target.getAttribute("name"));

    if(oldBlob){
        addEntityFunctions(oldBlob);

        if(title){
            oldBlob.setEventTitle(title);
        }
        if(participants){
            oldBlob.setParticipants(participants);
        }
        if(eventTime){
            oldBlob.setEventTime(eventTime);
        }
        if(description){
            oldBlob.setEventDescription(description);
        }
        return oldBlob;

    }else{
        var newBlob = new Entity();
        addEntityFunctions(newBlob);
        newBlob.setTarget(target.getAttribute("name"));

        if(title){
            newBlob.setEventTitle(title);
        }
        if(participants){
            newBlob.setParticipants(participants);
        }
        if(eventTime){
            newBlob.setEventTime(eventTime);
        }
        if(description){
            newBlob.setEventDescription(description);
        }
        return newBlob;
    }
}

var Entity = function () {
    this.participants = "";
    this.eventTitle = "";
    this.eventDescription = "";
    this.eventTime = "";
    this.target = "";
};

var addEntityFunctions = function(entity){
    entity.getTarget = function(){
        return this.target;
    };
    entity.setTarget = function(target){
        this.target = target;
    };
    entity.getParticipants = function(){
        return this.participants;
    };
    entity.setParticipants = function(participants){
        this.participants = participants;
    };
    entity.getEventTime = function(){
        return this.eventTime;
    };
    entity.setEventTime = function(eventTime){
        this.eventTime = eventTime;
    };
    entity.getEventTitle = function(){
        return this.eventTitle;
    };
    entity.setEventTitle = function(eventTitle){
        this.eventTitle = eventTitle;
    };
    entity.getEventDescription = function(){
        return this.eventDescription;
    };
    entity.setEventDescription = function(eventDescription){
        this.eventDescription = eventDescription;
    };
};



function addEventToTable(target, event){
    var newSpan = document.createElement("SPAN");
    newSpan.innerHTML = event;
    target.appendChild(newSpan);
}

function addEventHandler(){
    for (var i = 0; i < eventSpans.length; i++){
        eventSpans[i].onclick = showUpdateForm;
        eventSpans[i].onmouseover = onHoverPop;
    }
}

var eee;
function onHoverPop(event){
    event = event || window.event;
//    event.fromElement.style.backgroundColor = "#ffffff";
    console.log(event.clientX+" : "+event.clientY);
//    event.srcElement.style.backgroundColor = "#c2e4fe";
    eee=event;
}



function closeUpdEventForm(){
    updEventDiv.style.display = "none";
}

function showUpdateForm(event){
    event = event || window.event;

    var key = this.parentElement.getAttribute("name");
    var currEvent = getFromStorage(key);
    var eventTitle = updEventDiv.getElementsByClassName("eventCH")[0];
    var eventTitleInput = updEventDiv.getElementsByClassName("eventC")[0];
    var participantsInput = updEventDiv.getElementsByClassName("participantsC")[0];
    var participantsSpan = updEventDiv.getElementsByClassName("partCspan")[0];
    var timeInput = updEventDiv.getElementsByClassName("timeC")[0];
    var timeSpan = updEventDiv.getElementsByClassName("timeCspan")[0];
    var description = updEventDiv.getElementsByClassName("description")[0];
    var participantsDiv = updEventDiv.getElementsByClassName("partisipants")[0];


    updEventDiv.style.display = "block";
    updEventDiv.style.left = (event.clientX+50)+"px";
    updEventDiv.style.top = (event.clientY-22)+"px";
    updEventDiv.getElementsByTagName('IMG')[0].onclick = closeUpdEventForm;

    if(currEvent){

        if(currEvent.eventTitle){
            eventTitleInput.style.display = "none";
            eventTitle.style.display = "block";
            eventTitle.innerHTML = currEvent.eventTitle;
        }else{
            eventTitle.innerHTML = "";
            eventTitle.style.display = "none";
            eventTitleInput.style.display = "block";
        }

        if(!currEvent.participants){
            participantsInput.value = "";
            participantsInput.innerHTML = "";
            participantsDiv.style.display = "none";
            participantsInput.style.display = "block";

        }else {
            participantsInput.style.display = "none";
            participantsDiv.style.display = "block";
            participantsSpan.style.display = "block";
            participantsSpan.innerHTML = currEvent.participants;
        }

        if(currEvent.eventTime == ""){
            timeInput.value = "";
            timeInput.style.display = "block";
            timeSpan.innerHTML = "";
        }else{
            timeInput.style.display = "none";
            timeSpan.style.display = "block";
            timeSpan.innerHTML = currEvent.eventTime;
        }

        description.value = currEvent.eventDescription;
    } else{
        eventTitle.style.display = "none";
        eventTitle.innerHTML = "";
        eventTitleInput.style.display = "block";
        eventTitleInput.value = "";

        timeInput.value = "";
        timeSpan.innerHTML = "";
        timeSpan.style.display = "none";
        timeInput.style.display = "block";

        description.innerHTML = "";
        description.value = "";

        participantsDiv.style.display = "none";
        participantsSpan.innerHTML = "";
        participantsInput.value = "";
        participantsInput.style.display = "block";
        participantsSpan.style.display = "none";

    }

    delEventButton.onclick = function(){
        deleteFromStorage(key);
        closeUpdEventForm();
        createCalendar("cal", currentYear, currentMonth);
    };

    updEventButton.onclick = function(){
        var tdname = target.getAttribute("name");
        var toStorage =  prepareForStorage(target, eventTitleInput.value, participantsInput.value, timeInput.value, description.value);
        putToStorage(tdname, toStorage);
        closeUpdEventForm();
        createCalendar("cal", currentYear, currentMonth);
    };
}

function setDateToLabel(labelElem, date){
    var dateForLabel = date.getDate()+"."+(date.getMonth()+1)+"."+date.getFullYear();
    labelElem.setAttribute("class", "picked");
    labelElem.innerText = dateForLabel;
}

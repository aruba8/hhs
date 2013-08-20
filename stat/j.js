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
//    var daysInNextMonth = getNumberOfDaysInMonth(today.getFullYear(), nextMonth+1);

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
        var eventText = "";
        var eventClass = "";
        if(getFromStorage(name)){
            eventText = getFromStorage(name).event;
            eventClass = "event";
        }

        if(isFirstWeek){
            if(day == today.getDate() && currentMonth == today.getMonth()+1 && currentYear == today.getFullYear()){
                table += '<td class="today "'+eventClass+' name='+name+'>'+days[getDay(d)]+' '+day+'<div class="eventContainer"><span>'+eventText+'</span></div></td>';
            } else{
                table += '<td class="'+eventClass+'" name='+name+'>'+days[getDay(d)]+' '+day+'<div class="eventContainer"><span>'+eventText+'</span></div></td>';
            }

        }else{
            if(day == today.getDate() && currentMonth == today.getMonth()+1 && currentYear == today.getFullYear()){
                table += '<td class="today '+eventClass+'" name='+name+'>'+day+'<div class="eventContainer"><span>'+eventText+'</span></div></td>';
            }else{
                table += '<td class="'+eventClass+'" name='+name+'>'+day+'<div class="eventContainer"><span>'+eventText+'</span></div></td>';
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
    createCalendar("cal", currentYear, currentMonth);
}


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
    console.log(currentMonth);
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

//todayElement.onclick = pickElement;



function addPickHandler(){
    for (var i = 0, tdl = tds.length; i < tdl; i++){
        tds[i].onclick = pickElement;
    }
}

function pickElement(event){
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


addEventButton.onclick = function(){
    document.getElementById("eventText").value = "";
    eventForm.style.display = "block";
}

function closeEForm(){
    eventForm.style.display = "none";
}

closeEventForm.onclick = function(){
    closeEForm();
}

createEvent.onclick = function(){
    var event = document.getElementById("eventText").value;
    var tdname = target.getAttribute("name");
    putToStorage(tdname, prepareForStorage(target, event));
    addEventToTable(target, event);
    closeEForm();
    createCalendar("cal", currentYear, currentMonth);
}


function prepareForStorage(target, text){
    var blob = {
        target: target.getAttribute("name"),
        created: new Date(),
        event: text,
        participants: []
    }
    return blob;
}

function addEventToTable(target, event){
    var newSpan = document.createElement("SPAN");
    newSpan.innerHTML = event;
    target.appendChild(newSpan);
}

function addEventHandler(){
    for (var i = 0; i < eventSpans.length; i++){
        eventSpans[i].onclick = showUpdateForm;
    }
}

function closeUpdEventForm(){
    updEventDiv.style.display = "none";
}


function showUpdateForm(event){
    event = event || window.event;
//    console.log(event.clientX);
//    console.log(this);

    var key = this.parentElement.getAttribute("name");
    updEventDiv.style.display = "block";
    updEventDiv.style.left = event.clientX+"px";
    updEventDiv.style.top = event.clientY+"px";

    updEventDiv.getElementsByTagName('IMG')[0].onclick = closeUpdEventForm;
    delEventButton.onclick = function(){
        deleteFromStorage(key);
        closeUpdEventForm();
        createCalendar("cal", currentYear, currentMonth);
    }

}

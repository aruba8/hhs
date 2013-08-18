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
var target;


function createCalendar(id, year, month) {
    var elem = document.getElementById(id);

    var mon = month - 1; // месяцы в JS идут от 0 до 11, а не от 1 до 12
    var d = new Date(year, mon);
//    console.log(d);
//    console.log(mon);
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
        if(isFirstWeek){
            if(day == today.getDate() && currentMonth == today.getMonth()+1 && currentYear == today.getFullYear()){
                table += '<td class="today">'+days[getDay(d)]+' '+day+'</td>';
            } else{
                table += '<td>'+days[getDay(d)]+' '+day+'</td>';
            }

        }else{
            if(day == today.getDate() && currentMonth == today.getMonth()+1 && currentYear == today.getFullYear()){
                table += '<td class="today">'+day+'</td>';
            }else{
                table += '<td>'+day+'</td>';
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
    addSelectHandler();
//    setToCurrentMonth(monthElement);
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


var leftArrow = document.getElementById("arr-left");
var rightArrow = document.getElementById("arr-right");


leftArrow.onclick = function () {
    currentMonth--;
//    console.log(currentMonth);
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
    createCalendar("cal", today.getFullYear(), currentMonth)
};

todayElement.onclick = function () {
    currentYear = today.getFullYear();
    currentMonth = today.getMonth() + 1;
    createCalendar("cal", currentYear, currentMonth);
};

//todayElement.onclick = selectElement;



function addSelectHandler(){
    for (var i = 0; i < tds.length; i++){
        tds[i].onclick = selectElement;
    }
}

function selectElement(event){
    event = event || window.event;
    if(target)target.style.backgroundColor = "";
    target = event.target;
    target.style.backgroundColor = "#f4f4f4";
}



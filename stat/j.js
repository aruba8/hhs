/**
 * Created with JetBrains WebStorm.
 * User: erik
 * Date: 17.08.13
 * Time: 12:46
 * To change this template use File | Settings | File Templates.
 */

var months = ["Январь","Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Ноябрь", "Декабрь"];
var days = ["Понедельник,", "Вторник,", "Среда,", "Четверг,", "Пятница,", "Суббота,", "Воскресенье,"];

var today = new Date();
var previousMonth;
var currentMonth;
var nextMonth;

function createCalendar(id, year, month) {
    var elem = document.getElementById(id);

    var mon = month - 1; // месяцы в JS идут от 0 до 11, а не от 1 до 12
    var d = new Date(year, mon);
    previousMonth = mon-1;
    currentMonth = mon;
    nextMonth = mon+1;
    var table = '<table><tr>';

    var innerHtml = elem.innerHTML;


    var daysInPrevMonth = getNumberOfDaysInMonth(today.getFullYear(), previousMonth+1);
    var daysInNextMonth = getNumberOfDaysInMonth(today.getFullYear(), nextMonth+1);

    console.log(daysInPrevMonth);
    console.log(daysInNextMonth);

    // заполнить первый ряд от понедельника
    // и до дня, с которого начинается месяц
    for (var i=0; i<getDay(d); i++) {
        table += "<td>"+days[i]+" "+(daysInPrevMonth-getDay(d)+i+1)+"</td>";
    }

    // ячейки календаря с датами
    var isFirstWeek = true;
    while(d.getMonth() == mon) {
        if(isFirstWeek){
            table += '<td>'+days[getDay(d)]+' '+d.getDate()+'</td>';
        }else{
            table += '<td>'+d.getDate()+'</td>';

        }
        if (getDay(d) % 7 == 6) { // вс, последний день - перевод строки
            table += '</tr><tr>';
            isFirstWeek = false;
        }

        d.setDate(d.getDate()+1);
    }

    // добить таблицу пустыми ячейками, если нужно
    if (getDay(d) != 0) {
        for (var i=getDay(d), j = 1; i<7; i++, j++) {
            table += '<td>'+j+'</td>';
        }
    }

    // закрыть таблицу
    table += '</tr></table>';

    // только одно присваивание innerHTML
    elem.innerHTML = innerHtml+table;
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


/*
Use joliDate() to get date formatted as dd/mm/YYYY hh:mm
*/

function joliDate(d){
  var date = d;//d is a date object if d is a text we an use var date = new Date(d);
  return zero(date.getDate())+"/"+zero((date.getMonth()+1))+"/"+date.getFullYear()+" "+zero(date.getHours())+":"+zero(date.getMinutes());
}

//If you extract data in a sheets for Data Studio the recommended format is YYYYMMDD
function joliDateDataStudio(d){
  var date = d;//d is a date object if d is a text we an use var date = new Date(d);
  return date.getFullYear()+zero((date.getMonth()+1))+zero(date.getDate());
}

//If you extract data in a sheets for Data Studio the recommended format HH, will be interpreted as a number in Data Studi but do the job
function joliHoursDataStudio(d){
  var date = d;//d is a date object if d is a text we an use var date = new Date(d);
  return zero(date.getHours());
}

function joliTime(d){
  var date = d;//d is a date object if d is a text we an use var date = new Date(d);
  return zero(date.getHours())+":"+zero(date.getMinutes());
}

/*
This function add a 0 if the number is under 10
*/
function zero(n){
  if(n<10){return "0"+n;}
  return n;
}

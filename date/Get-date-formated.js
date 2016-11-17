/*
Use joliDate() to get date formatted as dd/mm/YYYY hh:mm
*/

function joliDate(d){
  var date = d;//d is a date object
  return zero(date.getDate())+"/"+zero((date.getMonth()+1))+"/"+date.getFullYear()+" "+zero(date.getHours())+":"+zero(date.getMinutes());
}

/*
This function add a 0 if the number is under 10
*/
function zero(n){
  if(n<10){return "0"+n;}
  return n;
}

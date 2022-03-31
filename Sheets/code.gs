/*
 * Code to interact with a Sheets as a database
 */

function newStandardCode(){
  var data = getDataSheetsDatabase(); // new line
  for(var i = 0 ; i<data.length;i++){
    //Do some stuffs
  }
  setDataSheetsDatabase(data); // new line
}

/*
 * Get Data from a Google Sheets using a Service Account
 */

function getDataSheetsDatabase() {
  var sid = 'YOUR_SHEET_ID';
  var range = 'DATA!A:D'
  var url = 'https://sheets.googleapis.com/v4/spreadsheets/'+sid+'/values/'+range
  var service = getService();
var param = {
    method      : "get",
    headers     : {"Authorization": "Bearer " + service.getAccessToken()},
    muteHttpExceptions:false,
  };
var html = UrlFetchApp.fetch(url,param).getContentText();
  var json = JSON.parse(html)
  // console.log(html)
  var range = json.range;
  var tab = range.split('!')[0];
return json.values;
}

/*
 * Set data in a Google Sheets with a Service account
 */

function setDataSheetsDatabase(val){
  // val is a 2D array, like the json.values we retrieve just above
  var sid = 'YOUR_SHEET_ID';
  var range = 'DATA!A:D'
  var url = 'https://sheets.googleapis.com/v4/spreadsheets/'+sid+'/values/'+range+'?valueInputOption=RAW'
  var service = getService();
var data = {
    "range": range,
    "majorDimension": 'ROWS',
    "values": val
  }
var params = {
    method      : "PUT",
    headers     : {"Authorization": "Bearer " + service.getAccessToken()},
    contentType: 'application/json',
    payload : JSON.stringify(data),
    muteHttpExceptions:false,
  };
var rep = UrlFetchApp.fetch(url, params)
console.log(rep.getContentText())
}

/*
 * Simple code to interact with a Google Sheets
 */

function standardCode(){
  var sheet = SpreadsheetApp.openById('ID_SHEETS').getSheetByName('NAME');
  var data = sheet.getDataRange().getValues();
for(var i = 0 ; i<data.length;i++){
    //Do some stuffs
  }
sheet.getRange(1,1,data.length,data[0].length).setValues(data);
}

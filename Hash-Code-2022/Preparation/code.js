var folderIn = 'ID_FOLDER';
var folderOut = 'ID_FOLDER';
var appsScriptFile = 'ID_APPS_SCRIPT_FILE'

var CLEAN_OUT_FOLDER = true; // If you want to clean the output folder at each run

function runHashCode() {
  if (CLEAN_OUT_FOLDER) { cleanCsvFolderOut_(); }
  var files;
  var pageToken; var json = {}
  do {
    files = Drive.Files.list({
      q: "'" + folderIn + "'  in parents",
      maxResults: 100,
      pageToken: pageToken
    });
    if (files.items && files.items.length > 0) {
      for (var i = 0; i < files.items.length; i++) {
        var file = files.items[i];
        json[file.id] = { id: file.id, name: file.title }

        var csvData = getCsvFile(file.id);
        var csvOut = doSomeStuf(csvData)
        pushCsvToFolderOut(csvOut, file.title);
      }
    } else {
      Logger.log('No files found.');
    }
    pageToken = files.nextPageToken;
  } while (pageToken);

  createAppsScriptTxt_()
}

function getCsvFile(id) {
  var csv = DriveApp.getFileById(id)
  var csvBlob = csv.getBlob().getDataAsString();
  console.log(csv.getName())
  return Utilities.parseCsv(csvBlob, ";");
}

function doSomeStuf(csvData) {
  //var csvData = Utilities.parseCsv(csvBlob,";");
  var header = csvData.shift(); //if needed to remove first line
  var odd = []; //impair
  var even = []; //pair

  for (var i = 0; i < csvData.length; i++) {
    console.log(csvData[i])
    if (isOdd_(i + 1)) {
      odd.push(csvData[i])
    } else {
      even.push(csvData[i])
    }
  }

  console.log(odd)
  console.log(even)

  return toCSV_(odd);
}

function pushCsvToFolderOut(csvOut, title) {
  var newFile = DriveApp.createFile('out_' + title, csvOut, MimeType.PLAIN_TEXT);
  newFile.moveTo(DriveApp.getFolderById(folderOut))
}

/*
 * Helpers for the hashcode
 */

function cleanCsvFolderOut_() {
  var pageToken;
  do {
    var files = Drive.Files.list({
      q: "'" + folderOut + "'  in parents",
      maxResults: 100,
      pageToken: pageToken
    });
    if (files.items && files.items.length > 0) {
      for (var i = 0; i < files.items.length; i++) {
        var file = files.items[i]
        Drive.Files.remove(file.id)
      }
    } else {
      Logger.log('No files found.');
    }
    pageToken = files.nextPageToken;
  } while (pageToken);
}

function isOdd_(num) {
  // Check if number is odd
  //credit https://stackoverflow.com/a/5016327
  return num % 2;
}

function createAppsScriptTxt_() {
  // credit https://issuetracker.google.com/issues/36765129#comment8
  var script = Drive.Files.get(appsScriptFile)
  var url = script.exportLinks['application/vnd.google-apps.script+json']; 
  var response = UrlFetchApp.fetch(url, { 
    headers: { 
      'Authorization': 'Bearer ' + ScriptApp.getOAuthToken() 
    } 
  }); 
  var blob =  response.getBlob(); 
  var json = JSON.parse(blob.getDataAsString());

  var txt = '';
  for(var key in json.files){
    var file = json.files[key];
    txt += 'Name : '+file.name + '\n\n';
    txt +=  'Type : '+file.type + '\n\n';
    txt += 'Code : ' + Utilities.formatString('%s', file.source) + '\n\n';
  }
  var newFile = DriveApp.createFile('code_' + script.title+'.txt', txt, MimeType.PLAIN_TEXT);
  newFile.moveTo(DriveApp.getFolderById(folderOut))
}

function toCSV_(arr) {
  return arr.reduce(function (p, c) {
    p += c.join(',') + '\n';
    return p;
  }, '');
}

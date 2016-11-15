/*
 * This script will get the content of a Google Document as HTML
 * For thi sneed we have to use UrlFetchApp to grab html content and we need the ScriptApp.getOAuthToken() to be aithorized to see the file.
 */


function getGoogleDocumentAsHTML(){
  var id = DocumentApp.getActiveDocument().getId() ;
  var forDriveScope = DriveApp.getStorageUsed(); //needed to get Drive Scope requested
  var url = "https://docs.google.com/feeds/download/documents/export/Export?id="+id+"&exportFormat=html";
  var param = {
    method      : "get",
    headers     : {"Authorization": "Bearer " + ScriptApp.getOAuthToken()},
    muteHttpExceptions:true,
  };
  var html = UrlFetchApp.fetch(url,param).getContentText();
  Logger.log(html);
}

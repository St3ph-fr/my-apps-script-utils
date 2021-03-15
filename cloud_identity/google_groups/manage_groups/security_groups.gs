/*
 * Security groups are anounced here : https://gsuiteupdates.googleblog.com/2020/09/security-groups-beta.html
 * Documentaiton here : https://cloud.google.com/identity/docs/how-to/update-group-to-security-group
 */

function setSecurityGroups() {
  
  // Remember first the group need to exist before to be updated
  // !! This change can't be modified in the future even by API !!
  
  var email = "GROUP_EMAIL";
  var group = getGoogleGroups(email);
  
  var url = 'https://cloudidentity.googleapis.com/v1beta1/'+group.name+'?updateMask=labels' ;
  
  Logger.log(url)
  
  var security = {"labels" :  {
    "cloudidentity.googleapis.com/groups.security": "",
    "cloudidentity.googleapis.com/groups.discussion_forum": ""
  }
                 };
  
  var param = {
    method      : "PATCH",
    contentType : "application/json",
    headers     : {"Authorization": "Bearer " + ScriptApp.getOAuthToken() },
    payload     : JSON.stringify(security),
    muteHttpExceptions:true,
  };
  
  var group = JSON.parse(UrlFetchApp.fetch(url,param).getContentText());
  Logger.log(JSON.stringify(group))
  
}

function viewGroup(){
  var email = "GROUP_EMAIL";
  getGoogleGroups(email);
}

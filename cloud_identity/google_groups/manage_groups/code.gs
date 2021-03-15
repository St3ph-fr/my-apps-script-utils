/**
 * Use the Gogole Cloud Identoty API for Google Groups
 * 
 * ref : https://cloud.google.com/identity/docs/reference/rest/v1beta1/groups
 * 
 * For the Apps Script don't forget to copy/paste appsscript.json file
 * Go to : View >> Show manifest file
 * 
 */


/**
 * List Google Groups on your domain
 */

function listGoogleGroups() {
  var url = "https://cloudidentity.googleapis.com/v1beta1/groups?parent=customers/"+getCustomerId();
  var param = {
    method      : "get",
    headers     : {"Authorization": "Bearer " + ScriptApp.getOAuthToken()},
//    muteHttpExceptions:true,
  };
  var pageToken ;
  var results = [];
  do{
    var page = JSON.parse(UrlFetchApp.fetch(url,param).getContentText());
    if(page.groups && page.groups.length > 0){
      for(var i = 0; i< page.groups.length;i++){
        var group = page.groups[i]
        results.push([group.name,group.groupKey.id,group.displayName])
       
      }
    }
    pageToken = page.nextPageToken
  }while(pageToken)
  Logger.log(results);
}

/**
 * Get details of a Google Groups
 */

function getGoogleGroups(email){
  email = email || "YOUR_EMAIL_ADDRESS";
  var url = "https://cloudidentity.googleapis.com/v1beta1/"+getGroupName(email);
  var param = {
    method      : "get",
    headers     : {"Authorization": "Bearer " + ScriptApp.getOAuthToken()},
//    muteHttpExceptions:true,
  };
  
  var group = JSON.parse(UrlFetchApp.fetch(url,param).getContentText());
  Logger.log(JSON.stringify(group))
  return group
}

/*
 * Get users in a Google Groups
 */

function getGroupsMemberships(email){
  email = email || "YOUR_EMAIL_ADDRESS";
  var url = 'https://cloudidentity.googleapis.com/v1beta1/'+getGroupName(email)+'/memberships';
   var param = {
    method      : "get",
    headers     : {"Authorization": "Bearer " + ScriptApp.getOAuthToken()},
//    muteHttpExceptions:true,
  };
  var pageToken ;
  var results = [];
  results.push(['Email','Role','Id'])

  do{
    var page = JSON.parse(UrlFetchApp.fetch(url,param).getContentText());
    if(page.memberships && page.memberships.length > 0){
      for(var i = 0; i< page.memberships.length;i++){
        var user = page.memberships[i]
        console.log(user)
        results.push([user.preferredMemberKey.id,user.roles[0].name,user.name])
      }
    }
    pageToken = page.nextPageToken
  }while(pageToken)
  Logger.log(results);

}

/**
 * Helper function to get the customer ID
 */

function getCustomerId(){
  var me = AdminDirectory.Users.get(Session.getEffectiveUser().getEmail())
  Logger.log(me.customerId)
  return me.customerId
}


/**
 * Helper function to get the Group Name based on groups email
 * Return a name like : groups/{group_id}
 */ 

function getGroupName(email){
  var url = "https://cloudidentity.googleapis.com/v1beta1/groups?parent=customers/"+getCustomerId();
  var param = {
    method      : "get",
    headers     : {"Authorization": "Bearer " + ScriptApp.getOAuthToken()},
//    muteHttpExceptions:true,
  };
  var pageToken ;
  do{
    var page = JSON.parse(UrlFetchApp.fetch(url,param).getContentText());
    if(page.groups && page.groups.length > 0){
      for(var i = 0; i< page.groups.length;i++){
        if(page.groups[i].groupKey.id === email){
          return page.groups[i].name
        }
      }
    }
    pageToken = page.nextPageToken
  }while(pageToken)
  throw "Can't find Group Name for the email specified";
}

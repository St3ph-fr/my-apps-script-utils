/*
 * Groups Expiration are anounced here : https://workspaceupdates.googleblog.com/2021/02/automatic-membership-expiration-google-groups-generally-available.html
 * Documentaiton here : https://cloud.google.com/identity/docs/how-to/manage-expirations
 */

function setUserMembershipWithExpiration() {
  
  // Remember first the group need to exist before to be updated
  
  const email_group = 'GROUP_EMAIL';
  const email_user = 'USER_EMAIL';
  const day_expiration = 2;


  const now = new Date();
  const expiration = new Date(now.getTime() + (day_expiration * 24 * 60 * 60 * 1000));


  var group = getGoogleGroups(email_group);
  var url = 'https://cloudidentity.googleapis.com/v1beta1/'+group.name+'/memberships' ;
  
  console.log(url)
  
    const membership = {
      "preferredMemberKey": {
        "id": email_user
      },
      "roles": [
        {
          "expiryDetail": {
            "expireTime": Utilities.formatDate(expiration, "GMT", "yyyy-MM-dd'T'HH:mm:ss'Z'")
          },
          "name": "MEMBER"
        }
      ]
    }
  
  var param = {
    method      : "POST",
    contentType : "application/json",
    headers     : {"Authorization": "Bearer " + ScriptApp.getOAuthToken() },
    payload     : JSON.stringify(membership),
//    muteHttpExceptions:true,
  };
  
  var group = JSON.parse(UrlFetchApp.fetch(url,param).getContentText());
  Logger.log(JSON.stringify(group))
  
}

/**
 * Find expiration define for a user in a group
 * Get the date in expiryDetail.expireTime
 */ 

function viewUserExpiration(){
  const email_group = 'GROUP_EMAIL';
  const email_user = 'USER_EMAIL';
  const url = 'https://cloudidentity.googleapis.com/v1beta1/'+getGroupName(email_group)+'/memberships';
   const param = {
    method      : "get",
    headers     : {"Authorization": "Bearer " + ScriptApp.getOAuthToken()},
//    muteHttpExceptions:true,
  };
  var pageToken ;
  

  do{
    var page = JSON.parse(UrlFetchApp.fetch(url,param).getContentText());
    if(page.memberships && page.memberships.length > 0){
      for(var i = 0; i< page.memberships.length;i++){
        var user = page.memberships[i]
        console.log(user)
        if(user.preferredMemberKey.id == email_user){
          var membership = user.name;
          break;
        }
      }
    }
    pageToken = page.nextPageToken
  }while(pageToken)

  const url2 = 'https://cloudidentity.googleapis.com/v1beta1/'+membership;
  const param2 = {
    method      : "GET",
    contentType : "application/json",
    headers     : {"Authorization": "Bearer " + ScriptApp.getOAuthToken()},
    muteHttpExceptions:true,
  };


    const rep = UrlFetchApp.fetch(url2,param2);
    if(rep.getResponseCode() == 200){
      const user = JSON.parse(rep.getContentText())
      console.log(JSON.stringify(user))
      console.log('Expiration : '+ user.roles[0].expiryDetail.expireTime)
    }else{
      console.log('User no longer in the group.')
      console.log('Error : ' + rep.getResponseCode())
      console.log('Details : ' + rep.getContentText().split('title')[1])
 //     console.log('Full details : ' + rep.getContentText())
    }
    

}


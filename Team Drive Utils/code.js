/**
 *
 * This code has been updated to add the supportsAllDrives parameter support 
 * and use the new Drives Resource that will replace the supportsTeamDrives
 *
 */


/**
 * Create a new Team Drive.
 */
function createTeamDrive() {
  // Old way
  //var teamDrive = Drive.Teamdrives.insert({name:'Team Drive from Apps Script'}, Utilities.getUuid())
  var teamDrive = Drive.Drives.insert({name:'Team Drive from Apps Script 2'}, Utilities.getUuid())
  Logger.log(teamDrive);
}

/**
 * Retrieve Drive permission from a Team Drive
 * @param {string} id The ID of the Team Drive.
 */
function getTeamDrivePermissions(){
  var id = "YOUR_ID";
  var permissions ;
  var pageToken;
  do{
    permissions = Drive.Permissions.list(id, {maxResults:20,
                                          pageToken:pageToken,
                                          // supportsTeamDrives:true
                                          supportsAllDrives:true}) ;
    if(permissions.items && permissions.items.length > 0){
      for (var i = 0; i < permissions.items.length; i++) {
        var permission = permissions.items[i];
        Logger.log('%s is %s', permission.emailAddress, permission.role);
      }
    }else{
      Logger.log("No permissions found.");
    }
    pageToken = permissions.nextPageToken;
  }while(pageToken)
}

/**
 * List all the Team Drives of the domain.
 * Script must be run by an Administrator with sufficient rights.
 */
function adminListAllTeamDrive(){
  var pageToken;
  var teamDrives;
  do{
    /*teamDrives = Drive.Teamdrives.list({pageToken:pageToken,
                                       maxResults:50,
                                       useDomainAdminAccess:true})*/
    teamDrives = Drive.Drives.list({pageToken:pageToken,
                                       maxResults:50,
                                       useDomainAdminAccess:true})
    if(teamDrives.items && teamDrives.items.length > 0){
      for (var i = 0; i < teamDrives.items.length; i++) {
        var teamDrive = teamDrives.items[i];
       Logger.log('%s (ID : %s)', teamDrive.name, teamDrive.id);
      }
    }else{
      Logger.log("No permissions found.");
    }
    pageToken = teamDrives.nextPageToken;
  }while(pageToken)
}

/**
 * Retrieve Drive permission from a Team Drive
 * Script must be run by an Administrator with sufficient rights.
 * @param {string} id The ID of the Team Drive.
 */
function adminGetTeamDrivePermissions(){
  var id = "YOUR_ID";
  var permissions ;
  var pageToken;
  do{
    permissions = Drive.Permissions.list(id, {maxResults:20,
                                          pageToken:pageToken,
                                          // supportsTeamDrives:true
                                          supportsAllDrives:true,
                                          useDomainAdminAccess:true}) ;
    if(permissions.items && permissions.items.length > 0){
      for (var i = 0; i < permissions.items.length; i++) {
        var permission = permissions.items[i];
        Logger.log('%s is %s', permission.emailAddress, permission.role);
      }
    }else{
      Logger.log("No permissions found.");
    }
    pageToken = permissions.nextPageToken;
  }while(pageToken)
}

/**
 * Retrieve Drive permission from a Team Drive
 * Script must be run by an Administrator with sufficient rights.
 * @param {string} id The ID of the Team Drive.
 */
function setPermissions(){
  var id = "YOUR_ID";
  var roles = {
    organizer:["email1@domain.com"],
    fileOrganizer:["email2@domain.com"],
    writer:["email3@domain.com","email4@domain.com"],
    commenter:["email5@domain.com"],
    reader:[]
  };
  for(var key in roles){
    var role = roles[key];
    role.forEach(function (email){
      var resource = {
        role: key,
        type:"user",
        value:email
      }
      if(key == "commenter"){
        resource.role = "reader";
        resource.additionalRoles = ["commenter"]
      }
      //Customize parameters sendNotificationEmails:false,supportsTeamDrives:true,useDomainAdminAccess:false
      Drive.Permissions.insert(resource, id, {sendNotificationEmails:false,
                                              // supportsTeamDrives:true
                                              supportsAllDrives:true,
                                              useDomainAdminAccess:false});
    });
  }
  
}

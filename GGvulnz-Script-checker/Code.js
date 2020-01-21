function checkGroupsSettings() {
  Logger.log('start')
  var page;
  var pageToken; var rep = [];
  rep.push(['Email','Name','Description','Who can post','Who can view','GGvulnz'])
  do {
    page = AdminDirectory.Groups.list({pageToken:pageToken,customer:'my_customer',orderBy:'email',sortOrder:'ASCENDING'})
    if (page.groups && page.groups.length > 0) {
      for (var i = 0; i < page.groups.length; i++) {
        var group = page.groups[i];
        var settings = getSettingsGroup(group.email);
        rep.push([group.email,group.name,group.description,settings.whoCanPostMessage,settings.whoCanViewGroup,isGGvulnz(settings)])
      }
    } else {
      Logger.log('No groups found.');
    }
    pageToken = page.nextPageToken;
  } while (pageToken);
  var ss = SpreadsheetApp.create('Check Groups Security GGvulnz')
  var sheet = ss.getSheets()[0];
  sheet.getRange(1,1,rep.length,rep[0].length).setValues(rep);
  sheet.getRange(1,1,sheet.getLastRow(),sheet.getLastColumn()).createFilter();
  var conditionalFormatRules = sheet.getConditionalFormatRules();
  conditionalFormatRules.push(SpreadsheetApp.newConditionalFormatRule()
  .setRanges([sheet.getRange(2,1,sheet.getLastRow(),sheet.getLastColumn())])
  .whenFormulaSatisfied('=$F2')
  .setBackground('#F4C7C3')
  .build());
  sheet.setConditionalFormatRules(conditionalFormatRules);
  Logger.log(ss.getUrl())
}


function isGGvulnz(settings){
  if(settings.whoCanPostMessage == 'ANYONE_CAN_POST' && settings.whoCanViewGroup == 'ANYONE_CAN_VIEW'){
    return true;
  }
  return false
}


function getSettingsGroup(email){
  return AdminGroupsSettings.Groups.get(email)
}

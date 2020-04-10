/*
 * Advanced Calendar Service is needed
 */

function init() {
  var syncToken ;
  var page = Calendar.Events.list('primary', {}) ;
  if(page.items && page.items.length > 0){
    syncToken= page.nextSyncToken;
  }
  
  PropertiesService.getUserProperties().setProperty('SYNC_TOKEN', syncToken)
  
  ScriptApp.newTrigger('calendarSync')
  .forUserCalendar(Session.getEffectiveUser().getEmail())
  .onEventUpdated()
  .create()
}

function calendarSync(e){
  var syncToken = PropertiesService.getUserProperties().getProperty('SYNC_TOKEN')
  var page = Calendar.Events.list('primary', {syncToken:syncToken}) ;
  if(page.items && page.items.length > 0){
    for(var i = 0; i< page.items.length ; i++){
      var item = page.items[i]
      console.log(JSON.stringify(item))
      // Do what you want
    }
    syncToken= page.nextSyncToken;
  }
  PropertiesService.getUserProperties().setProperty('SYNC_TOKEN', syncToken)
}

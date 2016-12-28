var CLIENT_ID = '';
var CLIENT_SECRET = '';
var OWNER = "";
var REPO = "";

/**
 * Manage Form Answer
 * Create a trigger by going to Resources > Current projet's triggers
 * Select function manageAnswer() and create a trigger at form submission
 */

function manageAnswer(e) {
  var form = e.source;
  var rep = {
    "Title":"",
    "Message":"",
    "Email":""
  };
  var itemResponses = e.response.getItemResponses();
  for (var i = 0; i < itemResponses.length; i++) {
    var itemTitle = itemResponses[i].getItem().getTitle();
    var itemResponse = itemResponses[i].getResponse();
    rep[itemTitle] = itemResponse;
    Logger.log(itemTitle + ': ' + itemResponse  );
  }
  try{
    var issue = submitIssue(rep);
    var body = "<p>Hi,</p>"
    +"<p>Thank you for submitting your issue, you can follow it on this page : <a href='"+issue.html_url+"'>link</a>.</p>"
    +"<p>Title : "+rep.Title+"<br>"
    +"Message : "+rep.Message+"</p>"
    +"Regards";
    GmailApp.sendEmail(rep.Email, 'Issue posted on GitHub', '', {
      htmlBody:body,
    });
  }catch(e){
    GmailApp.sendEmail(Session.getEffectiveUser().getEmail(), 'Error issue submission', '', {
      htmlBody:JSON.stringify(rep),
    });
  }
}

/**
 * Function to send issue to GitHub
 */

function submitIssue(data){
  
  var service = getService();
  if (service.hasAccess()) {
    var url = 'https://api.github.com/repos/'+OWNER+'/'+REPO+'/issues';
    var bodyRequest = {
      "title":data.Title,
      "body":"_## Issue created anonymously for a user ##_\n"+data.Message
    };
    var response = UrlFetchApp.fetch(url, {
      method : "post",
      headers: {
        Authorization: 'Bearer ' + service.getAccessToken()
      },
      payload : JSON.stringify(bodyRequest)
    });
    var result = JSON.parse(response.getContentText());
    Logger.log(JSON.stringify(result, null, 2));
    return result;
  } else {
    var authorizationUrl = service.getAuthorizationUrl();
    Logger.log('Open the following URL and re-run the script: %s',
        authorizationUrl);
  }
}


/**
 * Authorizes and makes a request to the GitHub API.
 */
function run() {
  var service = getService();
  if (service.hasAccess()) {
    var url = 'https://api.github.com/user/repos';
    var response = UrlFetchApp.fetch(url, {
      headers: {
        Authorization: 'Bearer ' + service.getAccessToken()
      }
    });
    var result = JSON.parse(response.getContentText());
    Logger.log(JSON.stringify(result, null, 2));
  } else {
    var authorizationUrl = service.getAuthorizationUrl();
    Logger.log('Open the following URL and re-run the script: %s',
        authorizationUrl);
  }
}


/**
 * Configures the service.
 */
function getService() {
  return OAuth2.createService('GitHub')
      // Set the endpoint URLs.
      .setAuthorizationBaseUrl('https://github.com/login/oauth/authorize')
      .setTokenUrl('https://github.com/login/oauth/access_token')

      // Set the client ID and secret.
      .setClientId(CLIENT_ID)
      .setClientSecret(CLIENT_SECRET)

      // Set the name of the callback function that should be invoked to complete
      // the OAuth flow.
      .setCallbackFunction('authCallback')
      
      //scope for app
      .setScope('repo')

      // Set the property store where authorized tokens should be persisted.
      .setPropertyStore(PropertiesService.getUserProperties())
}

/**
 * Handles the OAuth callback.
 */
function authCallback(request) {
  var service = getService();
  var authorized = service.handleCallback(request);
  if (authorized) {
    return HtmlService.createHtmlOutput('Success!');
  } else {
    return HtmlService.createHtmlOutput('Denied');
  }
}

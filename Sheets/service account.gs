var KEY = {
  "type": "service_account",
  "project_id": "project_id",
  "private_key_id": "a8xxxxxxxxxe4d",
  "private_key": "-----BEGIN PRIVATE KEY-----\ndA82c=\n-----END PRIVATE KEY-----\n",
  "client_email": "email@iam.gserviceaccount.com",
  "client_id": "1000000000000000019",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/email.iam.gserviceaccount.com"
}

/**
 * Authorizes and makes a request to the Google Drive API.
 */
function run() {
  var service = getService();
  if (service.hasAccess()) {
    var token =service.getAccessToken()
   
    console.log('access ok')
  } else {
    Logger.log(service.getLastError());
  }
}

/**
 * Reset the authorization state, so that it can be re-tested.
 */
function reset() {
  getService().reset();
}

/**
 * Configures the service.
 */
function getService() {
  return OAuth2.createService('Sheets:SA')
      // Set the endpoint URL.
      .setTokenUrl('https://oauth2.googleapis.com/token')

      // Set the private key and issuer.
      .setPrivateKey(KEY.private_key)
      .setIssuer(KEY.client_email)

      // Set the name of the user to impersonate. This will only work for
      // Google Apps for Work/EDU accounts whose admin has setup domain-wide
      // delegation:
      // https://developers.google.com/identity/protocols/OAuth2ServiceAccount#delegatingauthority
      // .setSubject(USER_EMAIL)

      // Set the property store where authorized tokens should be persisted.
      .setPropertyStore(PropertiesService.getScriptProperties())

      // Set the scope. This must match one of the scopes configured during the
      // setup of domain-wide delegation.
      .setScope('https://www.googleapis.com/auth/spreadsheets');
}

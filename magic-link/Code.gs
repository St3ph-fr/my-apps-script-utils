/**
 * Configuration
 */
const ALLOWED_EMAILS = [
  "john.doe@example.com", 
  "admin@yourdomain.com"
];

// Returns the URL of the current Web App
const APP_URL = ScriptApp.getService().getUrl(); 

/**
 * Authentication Library (AuthLib)
 * Handles session creation, validation, and retrieval using CacheService.
 */
const AuthLib = {
  // Session duration in seconds (30 minutes = 1800 seconds)
  SESSION_TIMEOUT: 1800, 

  createSession: function(email) {
    const sessionId = Utilities.getUuid(); // Generates a unique ID
    const cache = CacheService.getScriptCache();
    cache.put(sessionId, email, this.SESSION_TIMEOUT);
    return sessionId;
  },

  isValidSession: function(sessionId) {
    if (!sessionId) return false;
    const cache = CacheService.getScriptCache();
    // If the cache returns a value, the session is still active
    return cache.get(sessionId) !== null; 
  },

  getUserEmail: function(sessionId) {
    const cache = CacheService.getScriptCache();
    return cache.get(sessionId);
  }
};

/**
 * Main Entry Point for the Web App
 */
function doGet(e) {
  const sessionId = e.parameter.sessionId;

  // 1. Check if a session ID is provided and valid
  if (AuthLib.isValidSession(sessionId)) {
    // 2. Load the authenticated app (Hello World)
    const userEmail = AuthLib.getUserEmail(sessionId);
    let template = HtmlService.createTemplateFromFile('HelloWorld');
    
    // Pass variables to the frontend
    template.userEmail = userEmail; 
    template.sessionId = sessionId; 
    
    return template.evaluate()
      .setTitle("My Secure App")
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }

  // 3. Fallback: Show the Login page if no valid session
  return HtmlService.createHtmlOutputFromFile('Login')
    .setTitle("Login Required");
}

/**
 * Endpoint called by the Login page to request a magic link
 */
function requestMagicLink(email) {
  // 1. Validate email against the whitelist
  if (!ALLOWED_EMAILS.includes(email.toLowerCase())) {
    return { success: false, message: "Access denied: Email not authorized." };
  }

  // 2. Generate Session and Magic Link
  const sessionId = AuthLib.createSession(email);
  const magicLink = APP_URL + "?sessionId=" + sessionId;

  // 3. Send the email
  const subject = "Your Magic Login Link 🪄";
  const body = "Hello,\n\n" +
               "Click the link below to access the application. " +
               "This link is valid for 30 minutes:\n\n" +
               magicLink + "\n\n" +
               "If you didn't request this, please ignore this email.";

  try {
    MailApp.sendEmail(email, subject, body);
    return { success: true, message: "Magic link sent! Please check your inbox." };
  } catch (error) {
    return { success: false, message: "Error sending email. Please try again later." };
  }
}

/**
 * Example of a protected backend function called AFTER login
 */
function doSecureAction(sessionId, data) {
  // ALWAYS verify session on every backend call
  if (!AuthLib.isValidSession(sessionId)) {
    throw new Error("Session expired. Please log in again.");
  }
  
  const user = AuthLib.getUserEmail(sessionId);
  // Perform your secure logic here...
  return "Action executed successfully for " + user + " with data: " + data;
}

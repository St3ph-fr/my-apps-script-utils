# **Google Apps Script: Magic Link Authentication 🪄**

A lightweight, passwordless authentication boilerplate for Google Apps Script Web Apps.

This project solves a common issue: how to restrict access to specific users when your Web App is deployed as **"Execute as: Me"** and accessible to **"Anyone"**, without building a complex username/password database or using third-party services like Firebase.

## **🌟 Features**

* **Passwordless Login:** Users enter their email to receive a secure "Magic Link".  
* **Zero Database Setup:** Uses native Apps Script CacheService to handle temporary sessions.  
* **Auto-Expiring Sessions:** Links and access tokens automatically expire after 30 minutes (configurable).  
* **Whitelist Access:** Only emails explicitly listed in your backend array can request a link.

## **🚀 Setup Instructions**

1. Go to [script.google.com](https://script.google.com/) and create a new project.  
2. Copy the content of the three files from this repository into your project:  
   * Code.gs (Google Apps Script file)  
   * Login.html (HTML file)  
   * HelloWorld.html (HTML file)  
3. In Code.gs, update the ALLOWED\_EMAILS array with the emails of the people you want to grant access to:  
   const ALLOWED\_EMAILS \= \[  
     "user1@example.com",   
     "client@domain.com"  
   \];

4. Click on **Deploy** \> **New deployment**.  
5. Select **Web app**.  
6. Set the configuration as follows:  
   * **Execute as:** Me (Your account)  
   * **Who has access:** Anyone  
7. Click **Deploy** and authorize the script when prompted.  
8. Copy the generated Web App URL and share it with your allowed users\!

## **🔐 Security Note**

This approach is highly practical for low-to-medium sensitivity internal tools, dashboards, or client portals.

**Keep in mind:** The session ID is passed via the URL. If a user forwards their magic link email to someone else, or copies their URL from the browser and shares it while the 30-minute window is still active, that second person will also be able to access the app.

*For highly sensitive data (PII, financial, medical), please consider using Google Workspace domain restrictions or an enterprise-grade authentication provider.*

## **📝 License**

MIT License. Feel free to use and modify it for your own projects\!

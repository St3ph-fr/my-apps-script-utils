// Made by Stéphane Giron (https://twitter.com/st3phcloud)
//
// Upload a Drive Folder to Google Cloud Storage
// Support shortcuts and upload Google Documents as MS Office files
// Script works with connected user credential for Cloud Storage
// This script will not browse sub folders
//
// More info : 
//

const FOLDER_ID = 'ENTER_FOLDER_ID_SOURCE';
const BUCKET_NAME = 'BUCKET_NAME_IN_CLOUD_STORAGE';

function uploadFilesFromFolderToCloudStorage() {
  const query = '"' + FOLDER_ID + '" in parents and trashed = false and ' +
    'mimeType != "application/vnd.google-apps.folder"';
  let files;
  let pageToken = null;

  do {
    try {
      files = Drive.Files.list({
        q: query,
        maxResults: 100,
        pageToken: pageToken
      });
      if (!files.items || files.items.length === 0) {
        console.log('No files found.');
        return;
      }
      for (let i = 0; i < files.items.length; i++) {
        let file = files.items[i];
        if (file.mimeType == 'application/vnd.google-apps.shortcut') {
          try {
            file = getFileFromShortcut(file.id)
          } catch (e) {
            console.log('Error you don\'t have access to file for shortcut id : ' + file.id);
            continue;
          }
        }
        let uploaded = uploadFileToCloudStorage(file);
        console.log('%s (ID: %s) has been uploaded', file.title, file.id);
        console.log('Cloud Storage link %s', uploaded.selfLink)
      }
      pageToken = files.nextPageToken;
    } catch (err) {
      console.log('Failed with error %s', err.message);
    }
  } while (pageToken);
}

const mime = {
  "application/vnd.google-apps.document": { extension: "docx", type: MimeType.MICROSOFT_WORD },
  "application/vnd.google-apps.presentation": { extension: "pptx", type: MimeType.MICROSOFT_POWERPOINT },
  "application/vnd.google-apps.spreadsheet": { extension: "xlsx", type: MimeType.MICROSOFT_EXCEL }
}

function uploadFileToCloudStorage(file) {
  let blob; let fileName;

  if (mime[file.mimeType]) {
    blob = UrlFetchApp.fetch(file.exportLinks[mime[file.mimeType].type], {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + ScriptApp.getOAuthToken(),
      }
    }).getBlob();
    fileName = file.title + '.' + mime[file.mimeType].extension;
  } else {
    blob = DriveApp.getFileById(file.id).getBlob();
    fileName = file.title;
  }
  const bytes = blob.getBytes();
  const url = 'https://www.googleapis.com/upload/storage/v1/b/BUCKET/o?uploadType=media&name=FILE'
    .replace('BUCKET', BUCKET_NAME)
    .replace('FILE', encodeURIComponent(fileName));

  const options = {
    method: 'POST',
    contentLength: bytes.length,
    contentType: blob.getContentType(),
    payload: bytes,
    headers: {
      Authorization: 'Bearer ' + ScriptApp.getOAuthToken(),
    }
  };
  const req = UrlFetchApp.fetch(url, options);
  const rep = JSON.parse(req.getContentText());

  return rep;
}

function getFileFromShortcut(id) {
  let rep = UrlFetchApp.fetch('https://www.googleapis.com/drive/v3/files/' + id + '?fields=shortcutDetails(targetId)',
    {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + ScriptApp.getOAuthToken(),
      }
    });

  return Drive.Files.get(JSON.parse(rep).shortcutDetails.targetId)
}

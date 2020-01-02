/**
 * Define variable for your project
 */
var projectId = 'ID_PROJECT_GCP'; //Your Project ID
var datasetId = 'new_dataset'; //Don't use - but _
var datasetDescription = 'My new dataset';
var tableId = 'new_dataset_entries'; //Don't use - but _
var tableName = 'My Table';
var tableDescription = 'Partitioned table with all my data.';

/**
 * Create BigQuery Table
 */
function createTable() {
  var tableFields = [{"description": "Unique Id","name": "id","type": "String","mode": "Required"},
    {"description": "Date event","name": "date","type": "Date","mode": "Required"} ,
    {"description": "Type of data","name": "type","type": "String","mode": "Nullable"}];
  
  // First we create Dataset
  var dataset = BigQuery.newDataset();
  dataset.setDatasetReference( BigQuery.newDatasetReference()
                              .setDatasetId(datasetId)
                              .setProjectId(projectId))
    .setDescription(datasetDescription);
  
  BigQuery.Datasets.insert(dataset,projectId);
  
  // Second we create Table
  var table = BigQuery.newTable()
  .setDescription(tableDescription)
  .setId(tableId)
  .setFriendlyName(tableName)
  .setTimePartitioning({"type": "DAY"}) // Param to partition
  .setTableReference(
    BigQuery.newTableReference()
    .setDatasetId(datasetId)
    .setProjectId(projectId)
    .setTableId(tableId)
  ).setSchema(
    BigQuery.newTableSchema().setFields(tableFields)
  );
  
  try {
    BigQuery.Tables.insert(table, projectId, datasetId)
    Logger.log('BigQuery Table created');
  } catch(e) {
    Logger.log('Error to create table : ' +  e.message );
  }
}

/**
 * Load CSV file in BigQuery
 * IMPORTANT Google sheet is a 3 comumns sheets : id | date | type
 * id and date can't be empty
 * date must be formated : YYYY-MM-DD if not it will generate an error during load
 */
function loadCsvFile(){
  var partition = getDollarsPartition();
  var urlSheets = 'https://docs.google.com/spreadsheets/d/SHEET_ID/edit#gid=0';
  var split = urlSheets.split('/');
  var fileId = split[split.length-2];
  Logger.log(fileId)
  var file = Drive.Files.get(fileId);
  var url_csv = file.exportLinks['text/csv'];
  var req = UrlFetchApp.fetch(url_csv, {
    method: "GET",
    headers: {
      Authorization: 'Bearer ' + ScriptApp.getOAuthToken()
    }
  });
  var blob = req.getBlob().setContentType('application/octet-stream');
  var job = {
    configuration: {
      load: {
        destinationTable: {
          projectId: projectId,
          datasetId: datasetId,
          tableId: tableId+partition
        },
        skipLeadingRows: 1
      }
    }
  };
  job = BigQuery.Jobs.insert(job, projectId, blob);
  
  var jobId = job.jobReference.jobId;
  
  var sleepTimeMs = 100;
  var queryResults = BigQuery.Jobs.get(projectId, jobId);
  while (queryResults.status.state != 'DONE') {
    Utilities.sleep(sleepTimeMs);
    sleepTimeMs *= 2;
    Logger.log('Wait ' + sleepTimeMs + ' ms.');
    queryResults = BigQuery.Jobs.get(projectId, jobId);
    Logger.log(queryResults.status.state)
  }
  
  if(queryResults.status.errorResult){
    var errors = queryResults.status.errors;
    errors.forEach(function (error){
      Logger.log('**** ERROR ****')
      Logger.log(JSON.stringify(error))
    })
  }else{
    Logger.log('Success !!')
  }
  
}

/**
 * Utils functions
 */
function getDollarsPartition(){
   var date = new Date();
   var txt = date.getFullYear().toString()+zero(date.getMonth() + 1).toString()+zero(date.getDate()).toString()
   return '$'+txt
}
function zero(val){
    if(val < 10){return '0'+val;}
  return val;
}

/**
 * Delete a partitioned table
 */
function deletePartiotionedTable(){
  var partition = getDollarsPartition() ; // return the curent day
  var url = 'https://bigquery.googleapis.com/bigquery/v2/projects/'+projectId+'/datasets/'+datasetId+'/tables/'+tableId+partition
var response = UrlFetchApp.fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: 'Bearer ' + ScriptApp.getOAuthToken()
    }
  });
  
  var result = JSON.parse(response.getContentText());
  if(result == ''){
    Logger.log('Delete success !')
  }else{
    Logger.log(JSON.stringify(result))
  }
}

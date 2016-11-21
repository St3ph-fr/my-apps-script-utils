/*
json must be a Gplus activity object. ref : https://developers.google.com/+/domains/api/activities#resource
json is a JSON object.
*/

function GPLUS(json) {
  this.data = json;
  this.postDate = new Date(this.data.published);
}

/*
All Functions :
getUserId()
getUserName()
getUserUrl()
getPlusOneCount()
getCommentsCount()
getReshareCount()
getDate()
getDateDataStudio()
getHoursDataStudio()
getTime()
getPostUrl()
getPostType()
getPostExposure()
getIsPrivate()
getCommunityName()
getCommunityCategory()
*/

//GETTERs

GPLUS.prototype.getUserId = function() {
  return this.data.actor.id;
}

GPLUS.prototype.getUserName = function() {
  return this.data.actor.id;
}

GPLUS.prototype.getUserUrl = function() {
  return this.data.actor.url;
}

GPLUS.prototype.getPlusOneCount = function() {
  return this.data.object.plusoners.totalItems;
}

GPLUS.prototype.getCommentsCount = function() {
  return this.data.object.replies.totalItems;
}

GPLUS.prototype.getReshareCount = function() {
  return this.data.object.resharers.totalItems;
}

GPLUS.prototype.getDate = function() {
  return joliDate(this.postDate);
}

GPLUS.prototype.getDateDataStudio = function() {
  return joliDateDataStudio(this.postDate);
}

GPLUS.prototype.getHoursDataStudio = function() {
  return joliHoursDataStudio(this.postDate);
}

GPLUS.prototype.getTime = function() {
  return joliTime(this.postDate);
}

GPLUS.prototype.getPostUrl = function() {
  return this.data.object.url;
}

GPLUS.prototype.getPostType = function() {
  if(this.isCommunityPost()){
    return "Community Post"; 
  }
  return "User Post";
}

GPLUS.prototype.getPostExposure = function() {
  return this.data.access.domainRestricted ? "Domain" : "Public"; 
}

GPLUS.prototype.getIsPrivate = function() {
  return this.data.access.description == "Shared privately" ? "Private" : "Not Private"; 
}

GPLUS.prototype.getCommunityName = function() {
  if(this.isCommunityPost()){
    var community = this.extractCommunityInfo();
    return community.name;
  }
  return "";
}

GPLUS.prototype.getCommunityCategory = function() {
  if(this.isCommunityPost()){
    var community = this.extractCommunityInfo();
    return community.cat;
  }
  return "";
}



//FUNCTIONs
GPLUS.prototype.extractCommunityInfo = function() {
  var community = {"name":"","cat":""};
  if(this.isCommunityPost()){
    var description = this.data.access.description ;
    if(description.indexOf("(") > 0){
      community.name = description.substring(0,description.indexOf("("));
      community.cat = description.substring((description.indexOf('(') + 1), (description.length -1));
    }else{
      community.name = description;
      community.cat = "No Cat";
    }
  }
  return community;
}

GPLUS.prototype.isCommunityPost = function() {
  return this.data.provider.title == "Community";
}

//UTILS
/*
Use joliDate() to get date formatted as dd/mm/YYYY hh:mm
*/

function joliDate(d){
  var date = d;//d is a date object if d is a text we an use var date = new Date(d);
  return zero(date.getDate())+"/"+zero((date.getMonth()+1))+"/"+date.getFullYear();
}

function joliDateDataStudio(d){
  var date = d;//d is a date object if d is a text we an use var date = new Date(d);
  return "'"+date.getFullYear()+zero((date.getMonth()+1))+zero(date.getDate());
}

function joliHoursDataStudio(d){
  var date = d;//d is a date object if d is a text we an use var date = new Date(d);
  return "'"+zero(date.getHours());
}

function joliTime(d){
  var date = d;//d is a date object if d is a text we an use var date = new Date(d);
  return zero(date.getHours())+":"+zero(date.getMinutes());
}
/*
This function add a 0 if the number is under 10
*/
function zero(n){
  if(n<10){return "0"+n;}
  return n;
}

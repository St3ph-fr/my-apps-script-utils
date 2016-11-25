/*
  This example reuse the example provided on the Apps Scripts developers site
  ref : https://developers.google.com/apps-script/advanced/plus-domains
*/

function getPosts() {
  var userEmail = 'Email of a user of the domain';
  var pageToken, posts;
  do {
    posts = PlusDomains.Activities.list(userEmail, 'user', {
      maxResults: 100,
      pageToken: pageToken
    });
    if (posts.items) {
      for (var i = 0; i < posts.items.length; i++) {
        var post = new GPLUS(posts.items[i]);
        Logger.log("The post %s has been published the %s is a %s", post.getPostUrl(), post.getDate(), post.getPostType());
      }
    }
    pageToken = posts.nextPageToken;
  } while (pageToken);
}

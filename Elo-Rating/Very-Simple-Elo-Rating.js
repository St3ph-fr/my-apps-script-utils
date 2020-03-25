//
// Simple Script to calculate an Elo Rating score
// Code For Google Apps Script and JavaScript
//
// If you have seen Facebook moovies and would liket to do a 
// FaceMash like app it is an Elo RAting algorithme behind the app
// I found a good article and made a simple code that caclculate step by step
// The Elo score by following blog post explanation
// VEry easy to read
//
// https://metinmediamath.wordpress.com/2013/11/27/how-to-calculate-the-elo-rating-including-example/
//
// This code is user in the Apps Script Mash web app : https://app.ez34.net/appsscriptmash/
//


function testCalculEloRating(){  
  //Source https://metinmediamath.wordpress.com/2013/11/27/how-to-calculate-the-elo-rating-including-example/
  
  var winer = 1000; //r1 and will always be the winner
  var looser = 1000; //r2
  
  var elo = calculEloRating(winer,looser)
  
  Logger.log(JSON.stringify(elo))
  // console.log(JSON.stringify(elo)) // For JavaScript
}

function calculEloRating(winer,looser) {
  
  var R1 = R(winer);
  var R2 =  R(looser);
  
  var E1 = E(R1,R2);
  var E2 = E(R2,R1);
  
  var S1 = 1; //Because it is the winer
  var S2 = 0;
  
  var newScoreWiner = newElo(winer,S1,E1)
  var newScoreLooser = newElo(looser,S2,E2)
  
  var rep = {
    winer:{oldScore:winer,newScore:newScoreWiner},
    looser:{oldScore:looser,newScore:newScoreLooser}
  }
  
  return rep;
}


function R(number){
  //Formula : R(1) = 10^(r(1)/400)
  return Math.pow(10, (number/400))
}

function E(source,dest){
  //Formula : R(1) / (R(1) + R(2))
  return source / (source+dest)
}

function newElo(r,S,E){
  var K = 32; // value uses in chess
  // Formula : r(1) + K * (S(1) – E(1))
  return Math.round(r + (K * (S-E)))
}

const Twitter = require('twitter');
const fs = require('fs');

// Load Twitter API credentials from environment variables or config file
const twitterConfig = {
    consumer_key: module.exports.consumer_key,
    consumer_secret: module.exports.consumer_secret,
    access_token: module.exports.access_token,
    access_token_secret: module.exports.access_token_secret
};

// Create a new instance of the Twitter client
const client = new Twitter(twitterConfig);

// Read the tweets from the tweets.txt file
function readTweets() {
  return new Promise((resolve, reject) => {
    fs.readFile('tweets.txt', 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        const tweets = data.split('\n').filter(tweet => tweet.trim() !== '');
        resolve(tweets);
      }
    });
  });
}

// Post a tweet
function postTweet(tweet) {
  client.post('statuses/update', { status: tweet }, (error, tweet, response) => {
    if (error) {
      console.log('Error posting tweet:', error);
    } else {
      console.log('Tweet posted successfully:', tweet.text);
    }
  });
}

// Get tweets and post them every 30 minutes
function tweetEvery30Minutes() {
  readTweets()
    .then(tweets => {
      let currentIndex = 0;
      setInterval(() => {
        if (currentIndex < tweets.length) {
          const tweet = tweets[currentIndex];
          postTweet(tweet);
          currentIndex++;
        }
      }, 0.10 * 60 * 1000); // 30 minutes
    })
    .catch(error => {
      console.log('Error reading tweets:', error);
    });
}

// Start tweeting every 30 minutes
tweetEvery30Minutes();

const TwitterStrategy = require('passport-twitter').Strategy;

// Update Twitter OAuth configuration
const twitterStrategy = new TwitterStrategy({
  consumerKey: process.env.X_CONSUMER_KEY,
  consumerSecret: process.env.X_CONSUMER_SECRET,
  callbackURL: `${process.env.API_URL}/auth/twitter/callback`,
  // Add these parameters to fix the authentication error
  includeEmail: true,
  // Use the new X API version
  userProfileURL: 'https://api.twitter.com/2/account/verify_credentials.json?include_email=true'
}, async (token, tokenSecret, profile, done) => {
  try {
    // ... existing user handling code ...
  } catch (error) {
    console.error('Twitter authentication error:', error);
    done(error);
  }
}); 
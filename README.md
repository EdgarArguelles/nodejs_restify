# nodejs_restify
Backend example developing a Rest Server using NodeJs, Restifity, Passport and Mongoose

# Frameworks
 - Restifity
 - Passport
 - Mongoose

# Engines
 - node: 0.10.x
 - npm: 1.4.x

# Install
$ npm install 
 
# Run
$ node src/app/app.js

# Test
$ mocha src/ --recursive

# Usage
 - Install and configure a local Mongo Server
 - Create a twitter App on https://apps.twitter.com/ (optional if you try to use authentication through twitter)
 - Set up and configure Mongo connection on DataBase section (app.js)
 - Set the __twitter_oauth_key and __twitter_oauth_secret values (app.js)
 - By default there is a user for login user: usertest pass: 123 (first-user.js)
 - Login under the URL http://localhost:3000/auth/signin with the POST body {"name": "usertest", "password": "123"}
 - You can create and edit users under the URL http://localhost:3000/api/users after login
 - Enroll a user with Twitter account under the URL http://localhost:3000/api/users/[id]/enroll/twitter
 - Login with Twitter authentication under the URL http://localhost:3000/auth/signin/twitter/
 - Logout under the URL http://localhost:3000/auth/signout

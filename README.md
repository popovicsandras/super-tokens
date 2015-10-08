# Super-tokens
Only super tokens, that's all.

## Pre-requisites

- Install a recent version of [Node.js and Node package manager (npm)](http://nodejs.org) via your preferred method.

- Install MongoDb. [MongoDb on OSX](http://docs.mongodb.org/manual/tutorial/install-mongodb-on-os-x/)

## Setup

### In the project directory, launch to install dependencies:

    npm install
You'll need to do this once or when dependencies change.

### Start MongoDb services (you may need sudo):

#### Production
    mongod --port 27777
    
#### Test
    mongod --dbpath /to/your/testdb --port 28888
    
### Create the production and test databases:

     npm run installdb
     npm run installtestdb


## Run

## Start the service

in development mode

    npm run serve


in production mode:

    npm start

## Test

Jshint checking ant tests:

    npm test

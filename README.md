# Guess the number

This is my attempt to build a guess the number app.

I used my usual working enviroment which is based on the angular-fullstack-generator for yeoman (a.k.a. yo) plus some more things I added like angular material. It's probably a bit overkilled for this test but it's something I'm familiar with.

## Technologies in place

- node with express.js and socket.io (even though it's not being used in this app.)
- MongoDB and Mongoose (ODM)
- grunt as task runner
- angular.js version 1.4

Server code in in the server folder and client code is in the client/app folder. APIs are defined in server/api folder.

# How to run the application
Best way to run this application is to use a couple of docker containers but you can run it on any node enabled machine with mongodb.


## Run on a local machine

You'll need to run ``npm install && bower install``

You'll also need a local instance on mongodb running.
This app assumes that you're mongodb instance is available at
`` mongodb:27017 ``
database name would be bazooka-dev

You can change this configuration editing the file

`` server/config/environment/development.js ``

then just run

`` grunt serve ``

from the root of the app. Meaning this folder.

## Running on a docker instance.

You'll need to run a docker machine with mongodb.

`` docker run --name mongodb -d mongo  ``

then from the root of this app run the following command

`` docker run -it --name hcl-machine-0 -v $PWD:/home/developer/app -w /home/developer/app --link mongodb:mongodb -p 9000:9000 davidecavaliere/mean-dev:0.12 ``

You should be dropped to a shell. Change to the developer user.

`` su developer ``

password is developer

finally you can run

`` grunt serve ``

### Open the app in the browser

You should be able to see the app in you're browser going to  ``localhost:9000`` no matter how you decided to run the app.

## What is missing
I little quirk happens when the validation message appears under the input box regarding the button on its side. I'm not fixing it for now, sorry.

## Tips and Tricks
The winning number is changing every time you refresh the page such as the number of attempts gets resetted.
If you wanna play easy just open the console and you'll see what number is the winning one.

### Last notice
There may be around some code that I may forgot to clean coming from other projects or whatever. You're free to give a look around but consider that that may be old code or code wrote just to try things. So don't be too picky about that.
Around thing I want to mention is the absense of code comment which has to reasons: the limited amount of time and the obviousness of the code itself.

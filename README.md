# vazzappa.com

Vazzappa is a projects incubator or a showcase of my part time projects. At the moment it is incubating three main projects. They all share an express.js web server, mongodb persistence layer, angular.js front end and they all make a heavy use of web socket as main communication layer for data with a socket.io engine.

## Why?

###First of all because a fullstack javascript makes the developing process pretty lean and prototyping even leaner.
Then because Node.js, with the use of require, makes javascript server side developing compact and clean and modularization is no more a issue.
Angular.js gives to the front end developer the ability to modularize and separate concerns and testing.
web sockets allows us to build blazing fast single page application reducing the overhead due to http communications and no trickery for server pushes.
We all know how important are those aspects when we need to deliver a smooth user experience.
MongoDB to finish the picture is the perfect companion of those fellows.

### Then... The importance of using web sockets

A modern web application is made of three main layers: UI, API, Persistence.
<!-- In the last few years we are migrating from a MVC model to were most of the code were server side resident to a more complex multi pattern structure.  -->
The API layer hides the business logic and the complexity of the persistence layer and interact with the UI module through http connections. Usually with ajax calls to REST APIs. Every ajax request will require a new http connection. Using web sockets for data communications gives a great performance boost to our webapp.
Arun Gupta did some nice tests here [http://blog.arungupta.me/rest-vs-websocket-comparison-benchmarks/](http://blog.arungupta.me/rest-vs-websocket-comparison-benchmarks/), and it looks like we want to forget quickly about GET, POST and so on. My personal opinion is that we are going to use web sockets for more than what they were thought to do. In other words replace every current ajax call a web app can do to a event driven paradigm.
<!-- TODO: suggest standard for REST-like data query -->

## The incubated projects... So far

### fLog
fLog is a pretty simple blogging platform with markdown support blog entries are called stories. Story submission does not use http neither ajax calls. Blogs entry are stored on mongo db and new posts are updated real time to the connected users. fLog is basically an angular.js module comprehending few directives and some services. Blog posts are first get through a API call to a standard Restfull url and then kept syncronized through web sockets. Implementation details on this [blog's story](/fLog/55cc9c5dbe9d010300448fe6)

### chat
Simple chat application. Uses web sockets for all data comunications and mongo to persist the chats. Features several mongo db goodies such as the ability to set a field of the to-be-persisted object if it is actually new (to set the owner of a room). Ability to push items to an array only if that item is not yet there (to add users to a room only if is not already there). Arrays with capacity limit (to just old the right number of message to keep in store).

### play
Small music manager application. Can upload music files and append them to a play queue. Features an [angular js uploader](https://github.com/davidecavaliere/angular-file-upload) module that streams the files to the server instead of uploading them with classic methods. Files are stored on mongodb's gridfs.

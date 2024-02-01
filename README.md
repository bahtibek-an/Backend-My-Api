# Backend My Api
Build a backend project providing an API.

What is an API?
API is the acronym for Application Programming Interface, which is a software intermediary that allows two applications to talk to each other. Each time you use an app like Facebook, send an instant message, or check the weather on your phone, you’re using an API.

When you use an application on your mobile phone, the application connects to the Internet and sends data to a server. The server then retrieves that data, interprets it, performs the necessary actions and sends it back to your phone. The application then interprets that data and presents you with the information you wanted in a readable way. This is what an API is - all of this happens via API.

![image](https://github.com/bahtibek-an/Backend-My-Api/assets/57597976/972bd4d6-8c61-4dae-9bb1-18a5d51a17f8)


## SPECIFICATIONS
This project is divided into 3 parts. At the end you will host your application in the cloud. :)

### Part I
Find a topic you like (volcanoes/earthquakes/animals/...), get a lot (more than 1k row data)

### Part II
Build an API backend using any framework you want to use.

Features of your project:

User authentification in order to administer the data

User Token (OAuth)

Get/Post/Update/Destroy on your topic
-- Get must be accessible without being connected

Get will provide pagination (max 20 elements per page)

Cache (redis)

(Optional) A Graphql interface

Documentation, but you can use swagger on your API. [Example](https://try.gitea.io/api/swagger)

A postman Documentation (and you will provide the link inside your readme)

### Part III
Your project must be hosted in the cloud. (AWS/Google Cloud/Azure/IBM)
Each of these providers have a free tier. You should be able to host it for 0$. :)

You will provide the URL of your project inside the README

# Description
    -for this project I chose Earthquakes. 
    -I was  genereted information within mockaroo.com, beacouse this this web site you can  easly generate 1000 rows information, and file format is sql or save the file format as sql or any format you want.!

# Task 
    -fo solve this problem I use express.js and pg , but I came face to face some problems . for solve -problems I search in google and some youtube channels.
# Getting startes
    how can i start this project ?
        it is to easy youy just open terminal and write 
            npm install ,
            npm start 
    this is a my api documentation's link [Api documention](https://documenter.getpostman.com/view/31716626/2s9Yynmj4t),
    [my_api](https://my-api-q5yh.onrender.com)  my hosting link
# Useg
|---my_api
    |--node_models
    |--.env
    |--.gitignore
    |--express.js
    |--package-lock.json
    |--package.josn
    |--README.md
    |--webpack.dev.js
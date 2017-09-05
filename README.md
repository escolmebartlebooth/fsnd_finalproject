# Udacity Full Stack Nano-degree: Neighbo(u)rhood Map

created by David Escolme during summer 2017
using knockout.js, google maps api, wikipedia api and new york times api
uses a MIT Licence

## pre-requisites and configuration

This project uses the following 3rd party applications:

clone the repository from: https://github.com/escolmebartlebooth/fsnd_finalproject.git (git clone <location> in the root folder for your project)

then move to the fsnd_finalproject folder

### node.js / grunt to enable the build process

if you haven't already got node installed on your device:
    + go to: https://nodejs.org/en/download/ and download the version applicable for your device
    + after downloading run npm install in the fsnd_finalproject folder of your project
    + include npm_modules folder in your gitignore file (the cloned repo should already have done this)

After this (or if you have node installed), you should only need to run the following:

    + for grunt:
        + run npm init in your root project folder to create a template package.json file
        + run npm install -g grunt-cli
        + run npm install grunt --save-dev
        + run npm install grunt-contrib-uglify --save-dev
        + run npm install grunt-contrib-cssmin --save-dev
        + run npm install grunt-contrib-copy --save-dev
        + run npm install grunt-processhtml --save-dev

    + this should update the package.json file created with npm init

    + the provided gruntfile.js should then run providing directory structures exist

    + the command grunt should build the project

the build process essentially:
    minifies css into /build/static
    minifies js into /build/js
    changes index.html to call the correct css after writing it to /build

### knockout.js

The application relies on access to

<script src="https://code.jquery.com/jquery-1.12.0.min.js"></script>

### jquery

The application relies on access to:

<script src="https://cdnjs.cloudflare.com/ajax/libs/knockout/3.4.0/knockout-min.js"></script>

### google fonts

using: Forum & Source Code Pro to style fonts.

### 3rd party APIs

keys are embedded in this code source temporarily. If you want to use your own keys:

to use the google maps api a key needs to be registered: https://developers.google.com/maps/
to use the New York Times API a key needs to be registered: https://developer.nytimes.com/?mcubz=1
to use the wikipedia API you don't need a key

the new york times and wikipedia api calls are done using ajax. These are cross-origin calls so ajax fail/error processing isn't called in the event of a failure. A timeout event handler has been implemented for each

## code structure

/
    gruntfile.js {commands for grunt}
    LICENCE
    README
    package.json {config for grunt}
    /src
        index.html
        /static
            desktop.css {generic and desktop css}
            mobile.css {mobile css}
        /js
            app.js {main application for handling data, views, API calls}
            locations.js {data for locations}
            mapstyle.js {config for styled map}
    /build
        index.html
        /static
            desktop.min.css {minified versions}
            mobile.min.css {minified versions}
        /js
            app.min.js {minified versions}
            locations.min.js {minified versions}
            mapstyle.min.js {minified versions}


## simple user instructions

open /build/index.html directly into your favourite browser on your favourite device
you should be presented with a google map with 5 location markers, filter box and hamburger menu
you can:
    + filter the locations by entering 3 or more characters into the filter box
    + click on a location to see more information and external NYT and wiki links
    + click on the hamburger menu to:
        + see which locations are active
        + click on a location to show information
        + toggle the map style from 'normal' to 'styled'
        + toggle whether the API links are shown
and that's about it

tested on google pixel phone and on chrome and edge browsers.

## enhancements {not completed}

+ do cricket based visualisation with data from a sports based 3rd party API....
+ allow change of zoom and implement re-zoom on css change
+ allow new grounds to be added and persisted to local data storage
+ make hamburger and filter box right sized on screen size adjustment when changing screen size
+ create unit tests with jasmine
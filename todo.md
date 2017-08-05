Setup
    create base build process - completed 15-07
    create base design - completed 16-07
        fonts:
            <link href="https://fonts.googleapis.com/css?family=Forum|Source+Code+Pro" rel="stylesheet">
            font-family: 'Source Code Pro', monospace;
            font-family: 'Forum', cursive;
        colors:
            #c0dfd9 column background
            #e9ece5 box backgrounds
            #b3c2bf info windows
            #3b3a36 fonts
    add css minification to build process - completed 16-07
    add index.html copy to build and to use min using grunt copy and grunt processhtml - completed 17-07

Design Framework
    create mobile layout including layered map - completed basic layering 18-07 and map 19-07
    create desktop layout including layered map - completed basic layering 20-07 and map 20-07
    create hamburger and style input box on mob and desk - completed 21-07
    play about with map height and width - completed (body margin) 21-07
    get show and hide to work for side bars left and right on mob and desk - completed 21-07
    fix build on media query on cssmin task - completed 05-08

functional framework
    review knockout.js -  completed 24-07
    review async and defer - use defer on old browsers not supporting async. async is as it is - completed 22-07
    review error handling - reviewed, need to re-review completed 22-07
    review tests - would need to use jasmine - one for the end - completed 22-07

Features
    create base map and default zoom location - completed 19-07
    create data and markers and show on initialisation - completed 22-07
    fix inability to select marker re z-index - completed 31-07
    create animated marker when selected - completed 31-07
    add css to mobile for zindex - completed 02-08
    implement deselection - completed 02-08
    implement re-zoom on css change
    make hamburger and filter box right sized on screen size
    show list of locations
    implement and populate infowindow from google maps
    implement select / deselect on locations list
    implement text based filter
    implement drop down based filter
    implement styled map
    add 2nd API information to dom element - news site
    add error handling for 404, response errors...

Additional
    do neat visualisation with data from 3rd party API....
    allow change of zoom
    persist data
    create unit tests with jasmine
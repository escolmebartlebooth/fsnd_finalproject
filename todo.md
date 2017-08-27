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
    implement deselection again and make observable - completed 05-08
    show list of locations - completed 05-08
    implement select / deselect on locations list - completed 05-08
        implement styled map - completed 05-08
        style locations list - completed 05-08
    implement and populate infowindow from google maps - completed 06-08
        implement text based filter - capture input value - completed 08-08
        implement text based filter - make selection - completed 10-08
        implement text based filter - do filter -- investigate observable on array - completed 13-08
        implement text based filter - tidy up -- make consistent and allow unfilter - completed 13-08
    add toggle open on map or Options - completed 13-08
        do basic integration to 2nd API - NYT - completed 14-08
        do basic integration to 3rd API - Wiki - completed 14-08
        fix CORS and check output of both - wasn't CORS was rate limiting - completed 15-08
        move get info to click and check if info already present first... - completed 16-08
        decide how best to add to infowindow or dom element and add it - completed 22-08
            news and wiki on location as arrays - completed 23-08
            news and wiki observables as arrays  - completed 23-08
            link news and wiki obs to dom element  - completed 23-08
            have show / hide on options menu - completed 24-08
            on click should change observable to news / wiki - completed 24-08
            on click should update news / wiki if empty - completed 24-08
            FRI: getnews / wiki should handle missing info - completed 26-08
            FRI: style nicely and limit number of articles - completed 26-08
            FRI: ensure search term is good - completed 26-08
            style info window - completed 23-08
            show information from get go and as default
    add error handling for 404, response errors
        g maps basic - completed 20-08
        SUN: g maps trap error and show
        SUN: other apis basic
        SUN: other apis trap error and show and attribute
    SAT: js review - completed 26-08
    MON: review against rubric
    MON: submit
    MON: do linux and other elements

Additional
    do neat visualisation with data from 3rd party API....
        allow change of zoom
    persist data
        implement re-zoom on css change
    make hamburger and filter box right sized on screen size adjustment
        create unit tests with jasmine
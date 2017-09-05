// global variable to hold the map
var map;
var mapState = ko.observable(false);
var mapInfoWindow;

// global variable to hold the initial map center
var initialCenter = {lat: 53.817265, lng: -1.5848782};

// icons for markers
var iconroot = 'http://maps.google.com/mapfiles/ms/icons/';
var icons = {
    locationSelected: iconroot + 'ylw-pushpin.png',
    locationNormal: iconroot + 'red-pushpin.png'
};

// data model for each location
function locationModel(initialList) {
    var self = this;
    self.name = initialList.name;
    self.ground = initialList.ground;
    self.location = initialList.location;
    self.champions = initialList.champions;
    self.filtered = ko.observable(true);
    self.news = [];
    self.wiki = [];
    self.infoContent = '<div class="infowin"><label>'+self.name+':<label><p># of championships: '+self.champions+'</p></div>'

    // function to call the new york times api
    self.getNews = function(location) {
        var nyturl = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
        // if the location's news is empty, call the api
        if (self.news.length === 0) {
            $.ajax({
                'type': 'GET',
                'url': nyturl,
                data: {
                    'q': self.ground,
                    'sort': 'newest',
                    'response-format': "jsonp",
                    'api-key': '648ff5452e49454b855476afbc2d1b9b',
                    'callback': 'svc_search_v2_articlesearch'
                },
                success: function(data) {
                    // if there are matches, put them into the news attribute
                    if (data.response.docs && data.response.docs.length > 0){
                            data.response.docs.forEach(function(entry) {
                                self.news.push({'description': entry.headline.main.substring(0,30)+'...', 'url': entry.web_url});
                            });
                        } else {
                            self.news.push({'description': 'no news', 'url': ''});
                        }
                    location.news(self.news);
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    self.news.push({'description': 'error looking for news', 'url': ''});
                    location.news(self.news);
                    console.log('jqXHR:');
                    console.log(jqXHR);
                    console.log('textStatus:');
                    console.log(textStatus);
                    console.log('errorThrown:');
                    console.log(errorThrown);
                }
            });
        } else {
            location.news(self.news);
        }
    };

    // function to get wikipedia entries for the location
    self.getWiki = function(location) {
        var wikiURL = "https://en.wikipedia.org/w/api.php?";
        wikiURL += $.param({
            'action': 'query',
            'list': 'search',
            'srsearch': self.ground,
            'format': 'json',
            'callback': 'wikiCallback'
        });

        // it the entry is empty, call wikipedia
        if (self.wiki.length === 0) {
            $.ajax({
                url: wikiURL,
                dataType: "jsonp",
                success: function(response){
                    // if the response has matches, populate the wiki attribute
                    if (response.query.search && response.query.search.length > 0){
                        response.query.search.forEach(function(entry) {
                            self.wiki.push({'description': entry.title, 'url': 'https://en.wikipedia.org/wiki/'+entry.title});
                        });
                    } else {
                        self.wiki.push({'description': 'no wiki', 'url': ''});
                    }
                    //update the selected location's wiki
                    location.wiki(self.wiki);
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    self.news.push({'description': 'error looking for wiki', 'url': ''});
                    location.news(self.wiki);
                    console.log('jqXHR:');
                    console.log(jqXHR);
                    console.log('textStatus:');
                    console.log(textStatus);
                    console.log('errorThrown:');
                    console.log(errorThrown);
                }
            });
        } else {
            location.wiki(self.wiki);
        }
    };

    // create a map marker for the location with a default custom marker
    self.marker = new google.maps.Marker({
        position: {lat: self.location.lat, lng: self.location.lng},
        icon: icons.locationNormal,
        map: map,
        title: self.name + " " + self.ground,
        location: self
    });
}

// ko viewmodel for the list of locations
function locationsViewModel() {
    var self = this;

    self.init = function() {
        // load the initial data
        var locations = [];
        var location;
        var bounds = new google.maps.LatLngBounds();

        // loop through the data and create a location model for each one
        locationdata.forEach(function(data) {
                // create the location data
                location = new locationModel(data);

                // bind event
                location.marker.addListener('click', self.markerClick);
                locations.push(location);

                // Extend the bounds to include this locations's location
                bounds.extend(location.marker.position);
            });

        // Update the locations observable array
        self.locations(locations);

        // Instruct the map to resize itself to display all markers in the
        // bounds object
        map.fitBounds(bounds);
    };

    // variable to handle news and wiki
    self.news = ko.observableArray([{'description': 'no news', 'url': ''}]);
    self.wiki = ko.observableArray([{'description':'no wiki', 'url': ''}]);

    // ko variables to track menu bar and info bar states
    self.isOpen = ko.observable(false);
    self.isInfoOpen = ko.observable(false);
    self.infoState = ko.observable(true);

    // opens and closes menu bar based on state
    self.toggle = function () {
        self.isOpen(!self.isOpen());
    };

    // opens and closes info bar based on state and accounts for show/hide status
    self.enableInfo = function () {
        if (!self.infoState()) {
            self.infoState(true);
        } else {
            self.infoState(false);
            self.hideInfo();
        }
    };

    // opens info bar based on show/hide state
    self.showInfo = function () {
        if (self.infoState()) {
            self.isInfoOpen(true);
        }
    };

    // closes info bar based on show/hide state
    self.hideInfo = function () {
        self.isInfoOpen(false);
    };

    // variable for the map style
    self.mapStyle = ko.observable();

    // manage mapstyle
    self.toggleMap = function() {
        if (map.getMapTypeId() === 'roadmap') {
            map.setMapTypeId('styled_map');
        } else {
            map.setMapTypeId('roadmap');
        }
    };

    // manages locations and selected location
    self.locations = ko.observableArray([]);
    self.selectedLocation = ko.observable(null);

    // animate the selection location
    self.locationAnimate = function() {
        // grab the news and wiki inforation and show it
        self.selectedLocation().location.getNews(self);
        self.selectedLocation().location.getWiki(self);
        self.showInfo();
        // animate the selected marker, change the marker icon, show the info window
        self.selectedLocation().setAnimation(google.maps.Animation.BOUNCE);
        self.selectedLocation().icon = icons.locationSelected;
        mapInfoWindow.setContent(self.selectedLocation().location.infoContent);
        mapInfoWindow.open(map, self.selectedLocation());
    };

    // reset the selected marker
    self.locationUnAnimate = function() {
        // hide the news and wiki
        self.hideInfo();

        // stop the animation, change the marker back, close the infowindow
        self.selectedLocation().setAnimation(null);
        self.selectedLocation().icon = icons.locationNormal;
        mapInfoWindow.close();
    };

    // handle marker selection
    self.makeSelection = function(marker) {
        // if same marker selected, stop animation
        if (self.selectedLocation() === marker) {
            self.locationUnAnimate();
            self.selectedLocation(null);
        // if different marker, stop animation, change selection and animate new marker
        } else if (self.selectedLocation() !== null) {
            self.locationUnAnimate();
            self.selectedLocation(marker);
            self.locationAnimate();
        } else {
            // just animate the marker and make it selected
            self.selectedLocation(marker);
            self.locationAnimate();
        }
    };

    // handle the marker being clicked
    self.markerClick = function() {
        self.makeSelection(this);
    };

    // handle the location being selected and pass the marker to the animation handler
    self.clickLocation = function() {
        self.makeSelection(this.marker);
    };

    // variables to handle the filter
    self.filterValue = ko.observable("");
    self.filterOn = ko.observable(false);

    // filter function
    self.applyFilter = function () {
        // make the regex the filter contents and select locations that match filter
        reg = new RegExp(self.filterValue(),'i');
        self.filterOn(true);
        self.locations().forEach(function(data,index) {
            if (!reg.test(data.name)) {
                self.locations()[index].marker.setMap(null);
                self.locations()[index].filtered(false);
            } else {
                self.locations()[index].marker.setMap(map);
                self.locations()[index].filtered(true);
            }
        });
    };

    // remove the filter
    self.removeFilter = function () {
        self.filterOn(false);
        self.locations().forEach(function(data,index) {
            self.locations()[index].marker.setMap(map);
            self.locations()[index].filtered(true);
        });
    };

    // before applying filter check string > 2 in length
    self.doFilter = function() {
        if (self.filterValue().length > 2) {
            self.applyFilter();
        } else if (self.filterOn()) {
            self.removeFilter();
        }
    };

    // initialise the view model
    self.init();
}

// handler for google maps error
function mapError() {
    alert("map error");
    mapState(true);
}

// Initialise the Google Map
function initMap() {
    // success from maps, so update state
    mapState(false);

    // create the styled map
    var styledMapType = new google.maps.StyledMapType(mapstyle,
        {name: 'locations'});

    // initialise the map
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: initialCenter,
        disableDefaultUI: true,
    });

    //Associate the styled map with the MapTypeId and set it to display.
    map.mapTypes.set('styled_map', styledMapType);
    map.setMapTypeId('styled_map');

    // create an infowindow for the marker
    mapInfoWindow = new google.maps.InfoWindow({
          content: ''
        });

    // Activate Knockout once the map is initialized
    ko.applyBindings(new locationsViewModel());
}
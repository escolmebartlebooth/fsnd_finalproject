// variable to hold the map
var map;

// variable to hold the initial map center
var initialCenter = {lat: 53.817265, lng: -1.5848782};

// icons for markers
var iconroot = 'http://maps.google.com/mapfiles/ms/icons/'
var icons = {
    locationselected: iconroot + 'ylw-pushpin.png',
    locationnormal: iconroot + 'red-pushpin.png'
}

// model for the list of locations
function locationmodel(initialList) {
    var self = this;
    self.name = initialList.name;
    self.ground = initialList.ground;
    self.location = initialList.location;
    self.champions = initialList.champions;
    self.filtered = ko.observable(true);
    self.news = [];
    self.wiki = [];

    // lazy load news and wiki
    self.getNews = function() {
        var nyturl = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
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
                    // passed function object for data processing
                    if (data.response.docs.length > 0){
                            data.response.docs.forEach(function(entry) {
                                console.log(entry);
                                self.news.push({'description': entry.headline.main, 'url': entry.web_url})
                            })
                        } else {
                            self.news.push({'description': 'no wiki'})
                        }
                    return self.news;
                }
            });
        } else {
            return self.news;
        }
    }

    self.getWiki = function() {
        var wikiURL = "https://en.wikipedia.org/w/api.php?"
        wikiURL += $.param({
            'action': 'query',
            'list': 'search',
            'srsearch': self.ground,
            'format': 'json',
            'callback': 'wikiCallback'
        });

        if (self.wiki.length === 0) {
            $.ajax({
                url: wikiURL,
                dataType: "jsonp",
                success: function(response){
                    if (response.query.search.length > 0){
                        response.query.search.forEach(function(entry) {
                            console.log(entry);
                            self.wiki.push({'description': entry.snippet})
                        })
                    } else {
                        self.wiki.push({'description': 'no wiki'})
                    }
                    return self.wiki;
                }
            });
        } else {
            return self.wiki;
        }
    }

    // create a map marker for the location
    self.marker = new google.maps.Marker({
        position: {lat: self.location.lat, lng: self.location.lng},
        icon: icons['locationnormal'],
        map: map,
        title: self.name + " " + self.ground,
        location: self
    });

    // create an infowindow for the marker
    self.infowindow = new google.maps.InfoWindow({
          content: '<div class="infowin"><label>'+self.name+':<label><p># of championships: '+self.champions+'</p></div>'
        });
}

// ko viewmodel for the list of locations
function locationsVM() {
    var self = this;

    self.init = function() {
        // load the initial data
        var locations = [];
        var location;
        var bounds = new google.maps.LatLngBounds();
        locationdata.forEach(function(data) {
                // create the location data
                location = new locationmodel(data);

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
    }

    // variable to handle news and wiki
    self.news = ko.observableArray([{'description': 'no news'}]);
    self.wiki = ko.observableArray([{'description':'no wiki'}]);

    // ko variable to track menu bar state
    self.isOpen = ko.observable(false);

    // opens and closes menu bar based on state
    self.toggle = function () {
        self.isOpen(!self.isOpen());
    };

    self.mapStyle = ko.observable()
    // manage mapstyle
    self.toggleMap = function() {
        if (map.getMapTypeId() === 'roadmap') {
            map.setMapTypeId('styled_map');
        } else {
            map.setMapTypeId('roadmap');
        }
    }

    // manages locations
    self.locations = ko.observableArray([]);
    self.selectedlocation = ko.observable(null);

    self.locationAnimate = function() {
        self.news(self.selectedlocation().location.getNews());
        self.wiki(self.selectedlocation().location.getWiki());
        self.selectedlocation().setAnimation(google.maps.Animation.BOUNCE);
        self.selectedlocation().icon = icons['locationselected'];
        self.selectedlocation().location.infowindow.open(map,self.selectedlocation());
    }

    self.locationUnAnimate = function() {
        self.selectedlocation().setAnimation(null);
        self.selectedlocation().icon = icons['locationnormal'];
        self.selectedlocation().location.infowindow.close();
    }

    self.makeselection = function(marker) {
        if (self.selectedlocation() === marker) {
            self.locationUnAnimate();
            self.selectedlocation(null);
        } else if (self.selectedlocation() !== null) {
            self.locationUnAnimate();
            self.selectedlocation(marker);
            self.locationAnimate();
        } else {
            self.selectedlocation(marker);
            self.locationAnimate();
        }
    }

    // handle the marker being clicked
    self.markerClick = function() {
        self.makeselection(this);
    }

    // handle the location being selected
    self.clicklocation = function() {
        self.makeselection(this.marker);
    }

    // handle the filter
    self.filtervalue = ko.observable("");
    self.filterOn = ko.observable(false);

    self.applyfilter = function () {
        reg = new RegExp(self.filtervalue(),'i');
        self.filterOn(true);
        self.locations().forEach(function(data,index) {
            if (!reg.test(data.name)) {
                self.locations()[index].marker.setMap(null);
                self.locations()[index].filtered(false);
            } else {
                self.locations()[index].marker.setMap(map);
                self.locations()[index].filtered(true);
            }
        })
    }

    self.removefilter = function () {
        self.filterOn(false);
        self.locations().forEach(function(data,index) {
            self.locations()[index].marker.setMap(map);
            self.locations()[index].filtered(true);
        })
    }

    self.dofilter = function() {
        if (self.filtervalue().length > 2) {
            self.applyfilter();
        } else if (self.filterOn()) {
            self.removefilter();
        }
    }
    self.init();
}

function mapError() {
    console.log("called")
}

// Initialise the Google Map
function initMap() {
    // create the styled map
    var styledMapType = new google.maps.StyledMapType(mapstyle,
        {name: 'locations'});
    // initialise the map
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: initialCenter,
        disableDefaultUI: true,
        //mapTypeControlOptions: {
            //mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain',
              //      'styled_map']
          //}
    });

    //Associate the styled map with the MapTypeId and set it to display.
    map.mapTypes.set('styled_map', styledMapType);
    map.setMapTypeId('styled_map');

    // Activate Knockout once the map is initialized
    ko.applyBindings(new locationsVM());
}
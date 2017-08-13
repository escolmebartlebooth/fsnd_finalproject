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
          content: '<div><h3>'+self.name+':<h3><p># of championships: '+self.champions+'<p></div>'
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
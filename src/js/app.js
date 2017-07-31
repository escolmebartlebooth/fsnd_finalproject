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

    // create a map marker for the location
    self.marker = new google.maps.Marker({
        position: {lat: self.location.lat, lng: self.location.lng},
        icon: icons['locationnormal'],
        map: map,
        title: self.name + " " + self.ground
    });

    // function to animate marker
    self.selected = function() {
        if (self.marker.getAnimation() === null) {
            self.marker.setAnimation(google.maps.Animation.BOUNCE);
            self.marker.icon = icons['locationselected'];
        } else {
            self.marker.setAnimation(null);
            self.marker.icon = icons['locationnormal'];
        }
    }

    // handle the marker being clicked
    self.markerClick = function() {
        self.selected();
    }

    // bind event
    self.marker.addListener('click', self.markerClick);
}

// ko viewmodel for the list of locations
function locationsVM() {
    var self = this;

    // ko variable to track menu bar state
    self.isOpen = ko.observable(false);

    // opens and closes menu bar based on state
    self.toggle = function () {
        self.isOpen(!self.isOpen());
    };

    // manages locations
    self.locations = ko.observableArray([]);

    // load the initial data
    var locations = [];
    var location;
    var bounds = new google.maps.LatLngBounds();
    locationdata.forEach(function(data) {
            // create the location data
            location = new locationmodel(data);
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


// Initialise the Google Map
function initMap() {
    // create the styled map
    //var styledMapType = new google.maps.StyledMapType(cricketgroundmapstyle,
        //{name: 'Cricket Gounds'});
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
    //map.mapTypes.set('styled_map', styledMapType);
    //map.setMapTypeId('styled_map');

    // Activate Knockout once the map is initialized
    ko.applyBindings(new locationsVM());
}
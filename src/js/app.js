// variable to hold the map
var map;

// variable to hold the initial map center
var initialCenter = {lat: 53.817265, lng: -1.5848782};


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
    //ko.applyBindings(new cricketGroundsVM());
}
// helper for ny times integration
var getNYT = function(location) {
    var nyturl = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
    $.ajax({
        'type': 'GET',
        'url': nyturl,
        data: {
            'q': location,
            'sort': 'newest',
            'response-format': "jsonp",
            'api-key': '648ff5452e49454b855476afbc2d1b9b',
            'callback': 'svc_search_v2_articlesearch'
        },
        success: function(data) {
            // passed function object for data processing
            console.log(data.response.docs[0].snippet);
            return data.respons.docs;
        }
    });
}

    /*$.getJSON(nyturl, function(result) {
    var items = [];
    $.each( result.response.docs, function( key, val ) {
        items.push([key,val.headline.main])
        console.log(items);
        return items;
        });
    }).fail(function() {
        console.log("error in NYT API Call");
        return false;
    });*/


// helper for wikipedia integration
var getWiki = function(location) {
    var wikiURL = "https://en.wikipedia.org/w/api.php?"
    wikiURL += $.param({
        'action': 'query',
        'list': 'search',
        'srsearch': location,
        'format': 'json',
        'callback': 'wikiCallback'
    });

    $.ajax({
        url: wikiURL,
        dataType: "jsonp",
        success: function(response){
            console.log(response.query.search);
            return response.query.search;
        }
    });
}

        if (self.selectedlocation().location.wiki === "") {
            self.selectedlocation().location.wiki = getWiki(self.selectedlocation().location.name);
            }
        if (self.selectedlocation().location.news === "") {
            self.selectedlocation().location.news = getNYT(self.selectedlocation().location.name);
            }


self.selectednews() = self.selectedlocation().location.news;
        self.selectedwiki() = self.selectedlocation().location.wiki;
        console.log(self.selectednews());
        console.log(self.selectedwiki());


import React, {Component} from 'react';
import ListPlaces from './ListPlaces';
//import locations from './data/locations.json';

import axios from 'axios';

class App extends Component {
  state = {
    venues: []
  }

    constructor(props) {
        super(props);
        this.state = {
            'LocationData': [
                {
                    'name': "Dinersty Restaurent",
                    'type': "Chinese Restaurant",
                    'latitude': 40.74983060359955,
                    'longitude': -73.99476,
                    'streetAddress': "411 8th Ave, New York"
                },
                {
                    'name': "Tsuru Japanese Restaurent",
                    'type': "Japanese Restaurant ",
                    'latitude': 40.65470807073356,
                    'longitude': -74.5310570132645  ,
                    'streetAddress': "413 King George Rd, New York"
                },
                {
                    'name': "Caribean",
                    'type': "Caribean Restaurent",
                    'latitude': 40.6762,
                    'longitude': -73.8736,
                    'streetAddress': "405 Shoreline Village Dr, New York"
                },
                {
                    'name': "Traditions Restaurent",
                    'type': "Restaurent",
                    'latitude': 40.726699,
                    'longitude': -74.160515,
                    'streetAddress': "179 Adams St, New York"
                },
                {
                    'name': "Caribean Fusion Restaurent",
                    'type': "Caribean Restaurent",
                    'latitude': 40.893086,
                    'longitude': -73.81994,
                    'streetAddress': "Pelham Manor, NY 10803"
                },
                {
                    'name': "Oscar's Pizza & Restaurant",
                    'type': "3-Star Hotel",
                    'latitude': 40.07027,
                    'longitude': -74.14999,
                    'streetAddress': "270 Chambers Bridge Rd"
                }

            ],
            'map': '',
            'infowindow': '',
            'prevmarker': ''
        };
        this.initMap = this.initMap.bind(this);
        this.openInfoWindow = this.openInfoWindow.bind(this);
        this.closeInfoWindow = this.closeInfoWindow.bind(this);
    }


    componentDidMount() {
       //  load the Google Maps script.Refer https://developers.google.com/maps/documentation/javascript/tutorial
       loadMapJS('https://maps.googleapis.com/maps/api/js?key=AIzaSyAyN_yf4SYMxFzuT9NxvybIm0_NjKk7U9k&callback=initMap')
       window.initMap = this.initMap
  }


    /*Initialise the map once the google map script is loaded. Refer https://developers.google.com/maps/documentation/javascript/tutorial*/
    initMap() {
        let self = this;
        let mapview = document.getElementById('map');
        mapview.style.height = window.innerHeight + "px";
        let map = new window.google.maps.Map(mapview, {
            center: {lat: 40.74983060359955, lng:-73.99476},
            zoom: 7,
            mapTypeControl: false
        });

        let InfoWindow = new window.google.maps.InfoWindow({});

        window.google.maps.event.addListener(InfoWindow, 'closeclick', function () {
            self.closeInfoWindow();
        });

        this.setState({
            'map': map,
            'infowindow': InfoWindow
        });

        window.google.maps.event.addDomListener(window, "resize", function () {
            let center = map.getCenter();
            window.google.maps.event.trigger(map, "resize");
            self.state.map.setCenter(center);
        });

        window.google.maps.event.addListener(map, 'click', function () {
            self.closeInfoWindow();
        });

        let LocationData = [];
        this.state.LocationData.forEach(function (location) {
            let name = location.name + ' - ' + location.type;
            let marker = new window.google.maps.Marker({
                position: new window.google.maps.LatLng(location.latitude, location.longitude),
                animation: window.google.maps.Animation.DROP,
                map: map
            });

            marker.addListener('click', function () {
                self.openInfoWindow(marker);
            });

            location.name = name;
            location.marker = marker;
            location.display = true;
            LocationData.push(location);
        });
        this.setState({
            'LocationData': LocationData
        });
    }

    /* Implement infowindow for the Marker location marker- Refer https://developers.google.com/maps/documentation/javascript/infowindows*/
    openInfoWindow(marker) {
        this.closeInfoWindow();
        this.state.infowindow.open(this.state.map, marker);
        marker.setAnimation(window.google.maps.Animation.BOUNCE);
        this.setState({
            'prevmarker': marker
        });
        this.state.infowindow.setContent('Fetching Data...');
        this.state.map.setCenter(marker.getPosition());
        this.state.map.panBy(0, -200);
        this.getVenues(marker);
    }


    getVenues = () => {
      let self = this;

       const url = "https://api.foursquare.com/v2/venues/explore?"
       const parameters = {
         client_id: "NWJJIQKBKV4LBP02KY5H4C0GNVONS52QK1MDABSPSUEIMP0O",
         client_secret: "2DESP0VRE0EFCVIRHEGLITQCGKY3QVIM2HHZINQZXQJ3LPOQ",
         query: "food",
         near: "Sydney",
         v: "20182507"
       }

        fetch(url)
            .then(
                function (response) {
                    if (response.status !== 200) {
                        self.state.infowindow.setContent("Error in loading data from foursquare API ");
                        return;
                    }
                    response.json().then(function (data) {
                        let location_data = data.response.venues[0];
                        let readMore = '<a href="https://foursquare.com/v/'+ location_data.id +'" target="_blank">Read More on Foursquare Website</a>'
                        self.state.infowindow.setContent(readMore);
                    });
                }
            )
            .catch(function (err) {
                self.state.infowindow.setContent("Sorry data can't be loaded");
            });
    }


    /* By defualt infowindow remains opens. Call the below func explicitilty to close for the marker.
    Refer : https://developers.google.com/maps/documentation/javascript/infowindows*/
    closeInfoWindow() {
        if (this.state.prevmarker) {
            this.state.prevmarker.setAnimation(null);
        }
        this.setState({
            'prevmarker': ''
        });
        this.state.infowindow.close();
    }

    /*Render UI (map & locations) of App*/
    render() {
        return (
            <div>
                <ListPlaces key="100" LocationData={this.state.LocationData} openInfoWindow={this.openInfoWindow}
                              closeInfoWindow={this.closeInfoWindow}/>
                <div id="map"></div>
            </div>
        );
    }
}

export default App;

/* Load the google maps Asynchronously */
function loadMapJS(src) {
    let ref = window.document.getElementsByTagName("script")[0];
    let script = window.document.createElement("script");
    script.src = src;
    script.async = true;
    script.onerror = function () {
        document.write("Google Maps can't be loaded");
    };
    ref.parentNode.insertBefore(script, ref);
}

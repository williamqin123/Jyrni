
/*global google*/

import { Loader } from "@googlemaps/js-api-loader"

import './Map.css';

import CheckMenu from './CheckMenu.js';
import Snippet from './Snippet.js';
import Catalog from './Catalog.js';

import React, { Component } from "react";

class Map extends React.Component {


    addPlaceDetails(marker,cb) {
        
        var request = {
            placeId: marker.placeResult.place_id,
            fields: ['name', 'formatted_address', 'photos', 'editorial_summary']
        };
          
        this.places.getDetails(request, callback);
          
        function callback(place, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK && place) {
                marker.placeResult = {...marker.placeResult, ...place};
                //console.log(marker.placeResult);
                cb();
            }
        }
    }

    // Search for hotels in the selected city, within the viewport of the map.
    search() {

        if (!this.state.canSearch) return;
        this.setState({canSearch : false}); // prevents searching before previous search is finished

        if (this.state.showPlacesTypes.length == 0) return;

        const search = {
            bounds: this.map.getBounds(),
            types: this.state.showPlacesTypes,
        };
    
        this.places.nearbySearch(search, (results, status, pagination) => {
                
            this.clearMarkers();

            this.setState({canSearch : true});

            if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        
                // Create a marker for each hotel found, and
                // assign a letter of the alphabetic to each marker icon.
                for (let i = 0; i < results.length; i++) {
                    const markerLetter = String.fromCharCode("A".charCodeAt(0) + (i % 26));
                    const markerIcon = this.MARKER_PATH + markerLetter + ".png";
            
                    // Use marker animation to drop the icons incrementally on the map.
                    const currentMarker = new google.maps.Marker({
                        position: results[i].geometry.location,
                        animation: google.maps.Animation.DROP,
                        icon: markerIcon,
                    });
                    this.state.markers.push(currentMarker);
                    // If the user clicks a hotel marker, show the details of that hotel
                    // in an info window.
                    // @ts-ignore TODO refactor to avoid storing on marker
                    currentMarker.placeResult = results[i];
                    google.maps.event.addListener(currentMarker, "mouseover", () => {
                        this.addPlaceDetails(currentMarker,() => {
                            this.popSnippet(currentMarker.placeResult);
                        });
                    });
                    google.maps.event.addListener(currentMarker, "mouseout", () => {
                        this.setState({hovering : null}); // remove popup
                    });
                    google.maps.event.addListener(currentMarker, "click", () => {
                        console.log('save place');
                        //this.state.savedPlaces.push(currentMarker.placeResult);
                        this.setState({savedPlaces : [...this.state.savedPlaces,currentMarker.placeResult]});
                    });
                    setTimeout(this.dropMarker(currentMarker), i * 100);
                }
            }
        });
    }

    clearMarkers() {
        for (let i = 0; i < this.state.markers.length; i++) {
            if (this.state.markers[i]) {
                this.state.markers[i].setMap(null);
            }
            else {
                console.log('null marker');
            }
        }
        
        //this.state.markers = [];
    }

    dropMarker(m) {
        return () => {
            m.setMap(this.map);
        };
    }

    popSnippet(place) {

        this.setState({hovering:place});
        console.log('show hover snippet');
    }

    constructor() {

        super();

        this.state = {
            showPlacesTypes : ['lodging','restaurant','store','museum'], // fun,sightseeing,historical,restaurants,shopping,hotels
            savedPlaces : [], // list of place objects
            markers : [],
            hovering : null,
            canSearch: true,
            mousePos:{x:0,y:0}
        };

        this.MARKER_PATH =
        "https://developers.google.com/maps/documentation/javascript/images/marker_green";
        this.COLORS_CODES = {
            'lodging':'green',
            'restaurants':'red',
            'store':'purple',
        };
        this.hostnameRegexp = new RegExp("^https?://.+?/");
        this.countries = {
        au: {
            center: { lat: -25.3, lng: 133.8 },
            zoom: 4,
        },
        br: {
            center: { lat: -14.2, lng: -51.9 },
            zoom: 3,
        },
        ca: {
            center: { lat: 62, lng: -110.0 },
            zoom: 3,
        },
        fr: {
            center: { lat: 46.2, lng: 2.2 },
            zoom: 5,
        },
        de: {
            center: { lat: 51.2, lng: 10.4 },
            zoom: 5,
        },
        mx: {
            center: { lat: 23.6, lng: -102.5 },
            zoom: 4,
        },
        nz: {
            center: { lat: -40.9, lng: 174.9 },
            zoom: 5,
        },
        it: {
            center: { lat: 41.9, lng: 12.6 },
            zoom: 5,
        },
        za: {
            center: { lat: -30.6, lng: 22.9 },
            zoom: 5,
        },
        es: {
            center: { lat: 40.5, lng: -3.7 },
            zoom: 5,
        },
        pt: {
            center: { lat: 39.4, lng: -8.2 },
            zoom: 6,
        },
        us: {
            center: { lat: 40, lng: -95 },
            zoom: 5,
        },
        uk: {
            center: { lat: 54.8, lng: -4.6 },
            zoom: 5,
        },
        };

        const loader = new Loader({
            apiKey: "AIzaSyDDH6uYOpSoa91ZPzZB6U4G0-4hAJZWIa4",
            version: "beta",
            libraries: ['places']
        });
        
        loader.load().then(() => {
            this.map = new google.maps.Map(document.querySelector(".google-map"), {
                zoom: this.countries["us"].zoom,
                center: this.countries["us"].center,
                mapTypeControl: false,
                panControl: false,
                zoomControl: false,
                fullscreenControl: false,
                streetViewControl: false,
            });
            this.places = new google.maps.places.PlacesService(this.map);
            this.map.addListener('bounds_changed', () => this.search());
            this.map.addListener('load', () => this.search());

            window.DirectionsService = new google.maps.DirectionsService();

            //this.map.addListener('mousemove', );
            //this.search();
        });
    }

    updateMousePos(e) {
        //console.log('mouse move');
        this.setState({mousePos:{x:e.clientX,y:e.clientY}});
        //console.log(this.state.mousePos);
    }

    render() {

        return (
            <div className="Map">
                <div className='map-snippet-float-layer' style={{bottom : 'calc(' + (window.innerHeight / 2 - this.state.mousePos.y) + 'px + 1rem)',left : this.state.mousePos.x + 'px',transform:'translateX(-50%)'}}>
                {
                    this.state.hovering ?
                        <Snippet place={this.state.hovering}/>
                    : null
                }
                </div>
                <header className="map-header">
                    <h1 className='trip-name text-white'>Trip Planner</h1>
                    <CheckMenu/>
                </header>
                <div className='google-map' onMouseMove={(e) => this.updateMousePos(e)}></div>
                <aside className="sidebar-list" key={this.state.savedPlaces}>
                    <Catalog title='Saved Places' items={this.state.savedPlaces}/>
                    <Catalog title='🤖 Suggestions' items={this.state.markers.slice(-4,-1).map(m => {
                        
                        this.addPlaceDetails(m,() => {
                            this.setState({});
                        });
                        return m.placeResult;
                    })}/>
                </aside>
            </div>
        );
    }
}

export default Map;

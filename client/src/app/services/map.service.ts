import { Injectable } from '@angular/core';

import { ApiService } from './api.service';
import { environment } from '../../environments/environment';
import { User } from '../models';

declare var google: any;
@Injectable()
export class MapService {
    private map: any;
    private geocoder: any;
    private infowindow: any;
    private directionsDisplay: any;
    private directionsService: any;
    private currentPosition: any;
    private bounds: any;
    constructor(
        private apiService: ApiService
    ) {
        if (typeof google !== 'undefined') {
            this.bounds = new google.maps.LatLngBounds();
            this.geocoder = new google.maps.Geocoder;
            this.infowindow = new google.maps.InfoWindow;
            this.directionsService = new google.maps.DirectionsService;
            this.directionsDisplay = new google.maps.DirectionsRenderer({
                polylineOptions: {
                    strokeColor: "#337ab7", strokeWeight: 3
                }, suppressMarkers: true
            });
        } else {
            setTimeout(() => {
                this.bounds = new google.maps.LatLngBounds();
                this.geocoder = new google.maps.Geocoder;
                this.infowindow = new google.maps.InfoWindow;
                this.directionsService = new google.maps.DirectionsService;
                this.directionsDisplay = new google.maps.DirectionsRenderer({
                    polylineOptions: {
                        strokeColor: "#337ab7", strokeWeight: 3
                    }, suppressMarkers: true
                });
            }, 100);
        }
    }
    public getUserLocation(cb: any) {
        const self = this;
        navigator.geolocation.getCurrentPosition((position) => {
            this.currentPosition = { latitude: position.coords.latitude, longitude: position.coords.longitude };

            cb(this.currentPosition);
        }, (err) => {
            this.apiService.getThirdPartyAPI(environment.ipInfo_url).subscribe((info: any) => {
                this.currentPosition = { latitude: parseFloat(info.loc.split(",")[0]), longitude: parseFloat(info.loc.split(",")[1]) };;
                cb(this.currentPosition);
            });

        }, { timeout: 10000 });
    }

    public initMap(mapElement: any, panoElement: any) {
        if (typeof google !== 'undefined') {
            this.map = new google.maps.Map(mapElement, {
                zoom: 6,
                zoomControl: false,
                center: new google.maps.LatLng(20.5937, 78.9629),
                scaleControl: true,
                scaleControlOptions: {
                    position: google.maps.ControlPosition.BOTTOM_LEFT
                },
                streetViewControl: true,
                streetViewControlOptions: {
                    position: google.maps.ControlPosition.RIGHT_CENTER
                },
                mapTypeControl: false,
                fullscreenControl: false
            });
            const panorama = new google.maps.StreetViewPanorama(panoElement, {
                pov: {
                    heading: 0, //defines the rotation angle around the camera locus in degrees relative from true north
                    pitch: 0 // defines the angle variance "up" or "down" from the camera's initial default pitch, which is often (but not always) flat horizontal.
                },
                visible: false,
                fullscreenControl: false,
                zoomControl: false,
                panControl: false,
                addressControl: false
            });
            this.map.setStreetView(panorama);
        } else {
            console.log('google undefined');
            setTimeout(() => {
                this.map = new google.maps.Map(mapElement, {
                    zoom: 6,
                    zoomControl: false,
                    center: new google.maps.LatLng(20.5937, 78.9629),
                    scaleControl: true,
                    scaleControlOptions: {
                        position: google.maps.ControlPosition.BOTTOM_LEFT
                    },
                    streetViewControl: false,
                    mapTypeControl: false,
                    fullscreenControl: false
                });
                const panorama = new google.maps.StreetViewPanorama(panoElement, {
                    position: new google.maps.LatLng(20.5937, 78.9629),
                    pov: {
                        heading: 34,
                        pitch: 10
                    },
                    visible: false,
                    fullscreenControl: false,
                    zoomControl: false,
                    panControl: false,
                    addressControl: false
                });
                this.map.setStreetView(panorama);
            }, 100);
        }

    }

    public setMarker(markers) {
        const self = this;
        for (let m of markers) {
            const position = new google.maps.LatLng(m.latitude, m.longitude);
            let marker = new google.maps.Marker({
                position: position,
                icon: m.iconUrl,
                user: m,
                animation: google.maps.Animation.DROP
            });
            marker.addListener('click', function () {
                self.directionsDisplay.setMap(null);
                self.calculateRoute(marker);
            });
            this.bounds.extend(position);
            marker.setMap(self.map);
            typeof self.map !== 'undefined' ? self.map.fitBounds(this.bounds) : null;
        }
    }

    private calculateRoute(marker) {
        const self = this;
        const request = {
            origin: `${this.currentPosition.latitude},${this.currentPosition.longitude}`,
            destination: `${marker.user.latitude},${marker.user.longitude}`,
            travelMode: 'DRIVING'
        };
        self.directionsService.route(request, function (response, status) {
            if (status == 'OK') {
                self.directionsDisplay.setMap(self.map);
                self.directionsDisplay.setDirections(response);
                self.openInfoWindow(marker, response);
            } else {
                window.alert('Directions request failed due to ' + status);
            }
        });
    }

    private openInfoWindow(marker, response) {
        const imageUrl = marker.user.image ? marker.user.image : marker.user.iconUrl;
        const contentString = `<div class="user-map-info-window" 
                                            style=" width: 350px;
                                                    position:relative;
                                                    min-height: 50px; 
                                                    display:inline-block;
                                                    overflow: hidden;">
                                            <div class="user-map-info-window-image" 
                                                style ="width: 80px;
                                                        height: 80px;
                                                        position: absolute;" >
                                                <img src=${imageUrl} class="user-img-map" width=60 height=60 style="border-radius: 5px;" >
                                            </div>
                                            <div class="user-map-info-window-address" style="padding: 0 0 0 70px;">
                                                <p style="margin:0;padding-bottom: 2px; font-size: 12px;">Email -${marker.user.email}</p>
                                                <p style="margin:0;padding-bottom: 2px; font-size: 12px;"> Distance -${response.routes[0].legs[0].distance.text}</p>
                                                <p style="margin:0;padding-bottom: 2px; font-size: 12px;"> Duration -${response.routes[0].legs[0].duration.text}</p>
                                                 <p style="margin:0; font-size: 12px;">  Travel mode -Driving</p>
                                            </div>
                                            <p style="margin:0; padding-top: 5px; font-size: 12px;">Address -${response.routes[0].legs[0].end_address}</p>
                                        </div>`;
        this.infowindow.setContent(contentString);
        this.infowindow.open(this.map, marker);
        const self = this;
        this.infowindow.addListener('closeclick', () => {
            self.directionsDisplay.setMap(null);
        })
    }

    // get user address - not in use
    // private geocodeLatLng(geocoder, map, infowindow, marker) {
    //     const latlng = { lat: marker.user.latitude, lng: marker.user.longitude };
    //     // const streetImage = `${environment.google_street_view}size=350x100&location=${latlng.lat},${latlng.lng}&signature=${environment.google_api_key}`;
    //     geocoder.geocode({ 'location': latlng }, function (results, status) {
    //         if (status === 'OK') {
    //             if (results[0]) {
    //                 const imageUrl = marker.user.image ? marker.user.image : marker.user.iconUrl;
    //                 const contentString = `<div
    //                                         class="user-map-info-window" 
    //                                         style=" width: 300px;
    //                                                 position:relative;
    //                                                 min-height: 50px; 
    //                                                 display:inline-block;
    //                                                 overflow: hidden;">
    //                             <div class="user-map-info-window-image" 
    //                                 style ="width: 60px;
    //                                         height: 60px;
    //                                         position: absolute;" >
    //                                 <img src=${imageUrl} class="user-img-map" width=50 height=50 style="border-radius: 5px;" >
    //                             </div>
    //                             <div class="user-map-info-window-address" 
    //                                 style="padding: 0 0 0 60px;">
    //                                <p style="margin:0;padding-bottom: 5px;"> <b>${marker.user.email}</b></p>
    //                             <p style="margin:0;">${results[0].formatted_address}</p>
    //                             </div>
    //                             </div>`;
    //                 infowindow.setContent(contentString);

    //                 infowindow.open(map, marker);
    //             } else {
    //                 window.alert('No results found');
    //             }
    //         } else {
    //             window.alert('Geocoder failed due to: ' + status);
    //         }
    //     });
    // }

}

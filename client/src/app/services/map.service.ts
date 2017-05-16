import { Injectable } from '@angular/core';

import { ApiService } from './api.service';
import { environment } from '../../environments/environment';
import { User } from '../models';

declare var google: any;
@Injectable()
export class MapService {
    private map: any;
    constructor(
        private apiService: ApiService
    ) { }
    public getUserLocation(cb: any) {
        const self = this;
        navigator.geolocation.getCurrentPosition((position) => {
            const latLng = { latitude: position.coords.latitude, longitude: position.coords.longitude };
            cb(latLng);
        }, (err) => {
            this.apiService.getThirdPartyAPI(environment.ipInfo_url).subscribe((info: any) => {
                const latLong = { latitude: parseFloat(info.loc.split(",")[0]), longitude: parseFloat(info.loc.split(",")[1]) };;
                cb(latLong);
            });

        }, { timeout: 10000 });
    }

    public initMap(mapElement: any) {
        if (typeof google !== 'undefined') {
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
            }, 100);
        }

    }

    public setMarker(markers) {
        let bounds = new google.maps.LatLngBounds();
        const geocoder = new google.maps.Geocoder;
        const infowindow = new google.maps.InfoWindow;
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
                self.geocodeLatLng(geocoder, self.map, infowindow, marker)
            });
            bounds.extend(position);
            marker.setMap(this.map);
            typeof this.map !== 'undefined' ? this.map.fitBounds(bounds) : null;
        }
    }
    private geocodeLatLng(geocoder, map, infowindow, marker) {
        const latlng = { lat: marker.user.latitude, lng: marker.user.longitude };
        // const streetImage = `${environment.google_street_view}size=350x100&location=${latlng.lat},${latlng.lng}&signature=${environment.google_api_key}`;
        geocoder.geocode({ 'location': latlng }, function (results, status) {
            if (status === 'OK') {
                if (results[0]) {
                    console.log(map.getStreetView())
                    const imageUrl = marker.user.image ? marker.user.image : marker.user.iconUrl;
                    const contentString = `<div
                                            class="user-map-info-window" 
                                            style=" width: 300px;
                                                    position:relative;
                                                    min-height: 50px; 
                                                    display:inline-block;
                                                    overflow: hidden;">
                                <div class="user-map-info-window-image" 
                                    style ="width: 60px;
                                            height: 60px;
                                            position: absolute;" >
                                    <img src=${imageUrl} class="user-img-map" width=50 height=50 style="border-radius: 5px;" >
                                </div>
                                <div class="user-map-info-window-address" 
                                    style="padding: 0 0 0 60px;">
                                   <p style="margin:0;padding-bottom: 5px;"> <b>${marker.user.email}</b></p>
                                <p style="margin:0;">${results[0].formatted_address}</p>
                                </div>
                                </div>`;
                    infowindow.setContent(contentString);

                    infowindow.open(map, marker);
                } else {
                    window.alert('No results found');
                }
            } else {
                window.alert('Geocoder failed due to: ' + status);
            }
        });
    }

}

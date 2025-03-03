import { HttpClient } from '@angular/common/http';
import { Component, AfterViewInit, Input, OnDestroy, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { Observable, Subscription, debounceTime, of } from 'rxjs';
import { AccommodationDTO } from 'src/app/dtos/accommodationDTO';
import { Coordinates } from 'src/app/models/coordinates';
import { DefaultAddress } from 'src/app/models/defaultAddress';
import { AccommodationService } from 'src/app/services/accommodation.service';
import { DraftService } from 'src/app/services/draft.service';
import { BACKEND_URL_PREFIX } from 'src/costants';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit, OnDestroy, OnInit {
  private map!: L.Map;
  private markers: L.Marker[] = [];
  private defaultMarkers: L.Marker[] = [];
  private subscriptions = new Subscription();
  private defaultAddresses: DefaultAddress[] = [];
  
  constructor(private httpClient: HttpClient, private draftService: DraftService, private accommodationService: AccommodationService) { }

  @Input() set accommodations$(value: Observable<AccommodationDTO[] | null>) {
    if (value) {
      this.subscriptions.add(
        value.pipe(debounceTime(50)).subscribe(accommodations => {
          this.clearMarkers();
          if (accommodations) {
            this.processMarkers(accommodations);
          }
          if (this.map) {
            this.addDefaultMarkers();
          }
        })
      );
    }
  }

  ngOnInit(): void {
    this.loadDefaultAddresses();
  }

  ngAfterViewInit(): void {
    this.initMap();
    setTimeout(() => {
      this.map.invalidateSize();
    }, 0);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private loadDefaultAddresses(): void {
    this.httpClient.get<DefaultAddress[]>(BACKEND_URL_PREFIX + '/api/address/default')
      .subscribe({
        next: (addresses) => {
          this.defaultAddresses = addresses;
          if (this.map) {
            this.addDefaultMarkers();
          }
        },
        error: (error) => {
          console.error('Error in loadDefaultAddresses:', error);
        }
      });
  }

  private async addDefaultMarkers(): Promise<void> {
    
    if (!this.defaultAddresses.length || !this.map) {
      return;
    }

    const defaultIcon = L.icon({
      iconUrl: 'assets/icons/office-building.png',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    });

    for (const address of this.defaultAddresses) {
      address.lat && address.lon
      const marker = L.marker([address.lat, address.lon], { icon: defaultIcon })
        .addTo(this.map)
        .bindPopup(`<strong>${address.name}</strong><br>${address.address}`);

      this.defaultMarkers.push(marker)
    }

    if (this.defaultMarkers.length > 0 && this.markers.length === 0) {
      const group = L.featureGroup(this.defaultMarkers);
      this.map.fitBounds(group.getBounds().pad(0.2));
    }
  }

  private async processMarkers(accommodations: AccommodationDTO[]): Promise<void> {
    const markerPromises = accommodations.map(acc => this.createMarker(acc));
    const results = await Promise.all(markerPromises);
    const validMarkers = results.filter(m => m) as L.Marker[];
    
    validMarkers.forEach(marker => {
      marker.addTo(this.map);
      this.markers.push(marker);
    });

    if (validMarkers.length > 0) {
      const allMarkers = [...this.markers, ...this.defaultMarkers];
      if (allMarkers.length > 0) {
        const group = L.featureGroup(allMarkers);
        this.map.fitBounds(group.getBounds().pad(0.2));
      }
    }
  }

  getCoordinatesFromString(cooridnates: string): Coordinates | null {
    if (!cooridnates) return null;
    
    const coordinates = cooridnates.split(',');
    if (coordinates.length !== 2) return null;
    
    return {lat: parseFloat(coordinates[0]), lng: parseFloat(coordinates[1])};
  }

  private async createMarker(accommodation: AccommodationDTO): Promise<L.Marker | null> {
    try {
      let coordinates = accommodation.coordinates ? this.getCoordinatesFromString(accommodation.coordinates) : await this.getCoordinatesFromAddress(
        `${accommodation.city}, ${accommodation.province}, ${accommodation.country}`
      );
      
      if(accommodation.coordinates) {
        coordinates = this.getCoordinatesFromString(accommodation.coordinates);
      } else {
        coordinates = await this.getCoordinatesFromAddress(
          `${accommodation.city}, ${accommodation.province}, ${accommodation.country}`
        );
        if (!coordinates) return null;
        this.accommodationService.setCoordinates(accommodation.id, coordinates);
      }
      if (!coordinates) return null;
      
      return L.marker([coordinates.lat, coordinates.lng], {
        icon: L.icon({
          iconUrl: 'assets/images/location.png',
          iconSize: [32, 32],
          iconAnchor: [16, 32],
          popupAnchor: [0, -32]
        })
      }).bindPopup(`<strong>${accommodation.title}</strong><br><a href="/accommodation/${accommodation.id}">${accommodation.city}, ${accommodation.province}, ${accommodation.country}</a>`);
    } catch (error) {
      console.error('Error creating marker:', error);
      return null;
    }
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [45.4641943,9.1896346],
      zoom: 10
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);
  }


  private clearMarkers(): void {
    this.markers.forEach(marker => marker.removeFrom(this.map));
    this.markers = [];
  }
  
  async addApartmentMarkers(accommodation: AccommodationDTO): Promise<void> {
      try {
        const coordinates = await this.getCoordinatesFromAddress(accommodation.city + ', ' + accommodation.province + ', ' + accommodation.country);
        if (coordinates) {
          const customIcon = L.icon({
            iconUrl: 'assets/images/location.png',
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32]
          });
  
          const marker = L.marker([coordinates.lat, coordinates.lng], { icon: customIcon })
            .addTo(this.map)
            .bindPopup(`
              <strong>${accommodation.title || 'Appartamento'}</strong>
            `);
          this.markers.push(marker);
        }
      } catch (error) {
        console.error('Errore nel geocoding dell\'indirizzo:', error);
      }
  
    if (this.markers.length > 0) {
      const group = L.featureGroup(this.markers);
      this.map.fitBounds(group.getBounds(), { padding: [50, 50] });
    }
  }

  private async getCoordinatesFromAddress(address: string): Promise<Coordinates | null> {
    return this.draftService.getCoordinates(address);
  }
}
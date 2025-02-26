import { HttpClient } from '@angular/common/http';
import { Component, AfterViewInit, Input, OnDestroy } from '@angular/core';
import * as L from 'leaflet';
import { Observable, Subscription, debounceTime } from 'rxjs';
import { AccommodationDTO } from 'src/app/dtos/accommodationDTO';
import { BACKEND_URL_PREFIX } from 'src/costants';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit, OnDestroy {
  private map!: L.Map;
  private markers: L.Marker[] = [];
  private subscriptions = new Subscription();

  @Input() set accommodations$(value: Observable<AccommodationDTO[] | null>) {
    this.subscriptions.add(
      value.pipe(debounceTime(50)).subscribe(accommodations => {
        this.clearMarkers();
        if (accommodations) {
          this.processMarkers(accommodations);
        }
      })
    );
  }

  ngAfterViewInit(): void {
    this.initMap();
    setTimeout(() => this.map.invalidateSize(), 0);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
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
      const group = L.featureGroup(validMarkers);
      this.map.fitBounds(group.getBounds().pad(0.2));
    }
  }

  getCoordinatesFromString(cooridnates: string): {lat: number, lon: number} | null {
    if (!cooridnates) return null;
    
    const coordinates = cooridnates.split(',');
    if (coordinates.length !== 2) return null;
    
    return {lat: parseFloat(coordinates[0]), lon: parseFloat(coordinates[1])};
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
        const coordinateObj = {"coordinates": coordinates.lat.toString() + "," + coordinates.lon.toString()};
        
        this.httpClient.post<Number[]>(BACKEND_URL_PREFIX + "/api/set_coordinates/" + accommodation.id, coordinateObj).subscribe();
      }
      if (!coordinates) return null;
      
      return L.marker([coordinates.lat, coordinates.lon], {
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

  constructor(private httpClient: HttpClient) { }

  private clearMarkers(): void {
    this.markers.forEach(marker => marker.removeFrom(this.map));
    this.markers = [];
  }
  
  async addApartmentMarkers(accommodation: AccommodationDTO): Promise<void> {
      try {
        const coordinates = await this.getCoordinatesFromAddress(accommodation.city + ', ' + accommodation.province + ', ' + accommodation.country);
        if (coordinates) {
          // Crea un'icona personalizzata
          const customIcon = L.icon({
            iconUrl: 'assets/images/location.png', // Percorso dell'immagine
            iconSize: [32, 32], // Imposta la dimensione dell'icona
            iconAnchor: [16, 32], // Punto di ancoraggio dell'icona (centro inferiore dell'icona)
            popupAnchor: [0, -32] // Punto di ancoraggio del popup (sopra l'icona)
          });
  
          // Aggiungi il marker con l'icona personalizzata
          const marker = L.marker([coordinates.lat, coordinates.lon], { icon: customIcon })
            .addTo(this.map)
            .bindPopup(`
              <strong>${accommodation.title || 'Appartamento'}</strong>
            `);
          this.markers.push(marker);
        }
      } catch (error) {
        console.error('Errore nel geocoding dell\'indirizzo:', error);
      }
  
    // Se ci sono marker, centra la mappa per mostrarli tutti
    if (this.markers.length > 0) {
      const group = L.featureGroup(this.markers);
      this.map.fitBounds(group.getBounds(), { padding: [50, 50] });
    }
  }

  private async getCoordinatesFromAddress(address: string): Promise<{lat: number, lon: number} | null> {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
      );
      const data = await response.json();

      if (data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lon: parseFloat(data[0].lon)
        };
      }
      return null;
    } catch (error) {
      console.error('Errore nella ricerca dell\'indirizzo:', error);
      return null;
    }
  }
}
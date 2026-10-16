export class PrayerRequestServiceUnavailableError extends Error {
  constructor() {
    super('El envío de peticiones estará disponible cuando se conecte el backend.');
    this.name = 'PrayerRequestServiceUnavailableError';
  }
}

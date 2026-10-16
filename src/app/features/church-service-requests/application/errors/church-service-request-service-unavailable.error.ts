export class ChurchServiceRequestUnavailableError extends Error {
  constructor() {
    super('El envío de solicitudes estará disponible cuando se conecte el backend.');
    this.name = 'ChurchServiceRequestUnavailableError';
  }
}

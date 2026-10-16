export class GroupRegistrationUnavailableError extends Error {
  constructor() {
    super('La inscripción a grupos no está habilitada porque el backend aún no está conectado.');
    this.name = 'GroupRegistrationUnavailableError';
  }
}

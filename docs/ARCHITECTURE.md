# Arquitectura de la aplicación

La aplicación organiza el código por funcionalidad y separa las responsabilidades
en capas. Cada funcionalidad nueva debe vivir en `features/<funcionalidad>/`.

```text
src/app/
├── core/                         # Servicios y configuración singleton
│   ├── config/
│   ├── guards/
│   ├── interceptors/
│   └── services/
├── features/
│   └── _template/                # Base para crear una funcionalidad nueva
│       ├── domain/                # Entidades, reglas y contratos del dominio
│       │   ├── entities/
│       │   ├── repositories/
│       │   └── value-objects/
│       ├── application/           # Casos de uso y puertos
│       │   ├── ports/
│       │   └── use-cases/
│       ├── infrastructure/        # Adaptadores y acceso a servicios externos
│       │   ├── data-sources/
│       │   ├── dtos/
│       │   ├── mappers/
│       │   └── repositories/
│       └── presentation/          # UI Angular de la funcionalidad
│           ├── components/
│           └── pages/
├── layout/                        # Estructura visual compartida de la aplicación
└── shared/                        # UI y utilidades reutilizables sin estado de negocio
    ├── components/
    ├── directives/
    └── pipes/
```

## Regla de dependencias

- `domain` no depende de Angular, HTTP ni de otras capas.
- `application` depende del dominio y expresa la lógica mediante casos de uso y
  puertos.
- `infrastructure` implementa los contratos del dominio y adapta sistemas externos.
- `presentation` invoca casos de uso; no accede directamente a fuentes de datos.
- `core`, `shared` y `layout` contienen capacidades transversales, no reglas de
  negocio de una funcionalidad.

## Patrones

- **Repository:** contratos en `domain/repositories` e implementaciones en
  `infrastructure/repositories`.
- **Adapter:** `infrastructure` adapta HTTP u otros servicios externos a los
  contratos de la aplicación.
- **Mapper:** `infrastructure/mappers` transforma DTOs en modelos del dominio y
  viceversa.
- **Use case:** cada acción de negocio se encapsula en `application/use-cases`.

Crear estos patrones solo cuando una funcionalidad los necesite; evitar clases,
abstracciones o carpetas específicas de negocio antes de tener ese requisito.

## Fuente de datos de velas de oración

La página de Adoración consume `PRAYER_CANDLE_REPOSITORY`, definido en
`features/adoration/application/ports/`. Su implementación actual,
`DemoPrayerCandleRepository`, inicia la parrilla vacía y mantiene las nuevas
inscripciones solo en memoria durante la sesión actual.

Al conectar un backend, implementar `PrayerCandleRepository` con peticiones HTTP
y sustituir la fábrica del token por esa implementación. La página mantiene las
operaciones `list()` y `create(name, slotIndex)`; el backend debe persistir y
distribuir las velas para hacerlas realmente públicas entre visitantes, y
rechazar dos reservas simultáneas del mismo espacio. Cada vela incluye
`slotIndex`, `createdAt` y `expiresAt`; la implementación actual retira las
vencidas después de 24 horas, mientras la llama comienza al 100 % y baja en
intervalos de 10 % cada 2 h 24 min. La interfaz agrega espacios apagados en
lotes de 20 cuando se llena la parrilla. El backend deberá aplicar la misma
expiración y eliminar el nombre asociado cuando venza la vela.

## Donaciones

La página independiente `/donaciones` vive en `features/donations/`. Presenta
montos sugeridos y permite elegir otro monto; hoy solo confirma la selección y
avisa que el pago no está habilitado. No procesa, registra ni simula cobros.

El puerto `DonationPaymentGateway` en
`features/donations/application/ports/` define el contrato para solicitar un
checkout en el futuro. Al integrar un proveedor, su adaptador deberá solicitar
la sesión segura al backend; nunca se deben exponer llaves privadas en el
frontend.

## Peticiones de oración

La página `/peticiones` recopila nombre, correo, teléfono opcional, petición,
consentimiento y un aporte voluntario opcional. No publica las intenciones ni
procesa pagos. Mientras no exista backend, el repositorio predeterminado
rechaza el envío y comunica que los datos no se transmitieron ni guardaron.

El puerto `PRAYER_REQUEST_REPOSITORY` define el contrato; al activar el backend
se debe registrar `HttpPrayerRequestRepository` y configurar `API_BASE_URL`.
El adaptador envía `POST /api/prayer-requests` con `fullName`, `email`,
`phone` opcional, `message`, `donationAmountCOP` opcional y
`consentToDataProcessing`. El backend debe validar los datos y el consentimiento,
proteger la información sensible de las intenciones, definir quién puede
consultarla y su plazo de retención, y nunca asumir que el aporte es un pago
confirmado. El procesamiento de pagos requiere un flujo seguro independiente.
Para habilitar el endpoint, registrar los proveedores en `app.config.ts`:

```ts
{ provide: PRAYER_REQUEST_REPOSITORY, useClass: HttpPrayerRequestRepository },
{ provide: API_BASE_URL, useValue: 'https://api.dominio-de-la-catedral.co' },
```

## Solicitudes de servicios de la Catedral

La página `/solicitudes` obtiene la lista de servicios y sus campos desde
`CHURCH_SERVICE_REQUEST_REPOSITORY`. El repositorio mock ofrece matrimonio,
aniversario de un ser querido fallecido, bautismo e intención de misa; los
campos y tipos de entrada dependen del servicio seleccionado. El frontend
recopila también nombre, correo, teléfono y consentimiento. La solicitud no
confirma fecha, disponibilidad, requisitos ni pago: la Catedral debe contactar
a la persona para confirmarlos. Mientras se usa el mock, no se transmiten ni
guardan datos.

El adaptador HTTP espera `GET /api/church-services` con una lista de servicios
en el formato `ChurchService` (`id`, `name`, `description`, `fields`; cada campo
tiene `key`, `label`, `type`, `required` y `placeholder` opcional). Envía las
solicitudes con `POST /api/church-service-requests`, incluyendo `serviceId`,
`fullName`, `email`, `phone`, `details` y `consentToDataProcessing`. Para
habilitarlo, registrar `HttpChurchServiceRequestRepository` como
`CHURCH_SERVICE_REQUEST_REPOSITORY` en `app.config.ts` y configurar
`API_BASE_URL`. El backend debe validar los IDs y campos contra su propio
catálogo, aplicar reglas de fechas y proteger la información personal.

## Inscripción a grupos parroquiales

La página `/grupos`, en `features/parish-groups/`, presenta un catálogo de
muestra (parejas, adoración eucarística, jóvenes, coro, catequesis y lectores/
ministros) y recopila nombre, correo, teléfono, un mensaje opcional y
consentimiento. Los horarios, edades y requisitos del catálogo son
orientativos y deben ser confirmados por la parroquia. El mock no transmite ni
guarda datos, y el formulario no representa una inscripción confirmada.

El puerto `PARISH_GROUP_REPOSITORY` define `listGroups()` y `register()`.
`HttpParishGroupRepository` está preparado para `GET /api/parish-groups` y
`POST /api/parish-group-registrations`. La solicitud incluye `groupId`,
`fullName`, `email`, `phone`, `message` y `consentToDataProcessing`. Para conectarlo, registrar
`HttpParishGroupRepository` como `PARISH_GROUP_REPOSITORY` en `app.config.ts`
y configurar `API_BASE_URL`. El backend debe validar el grupo contra su
catálogo vigente, proteger los datos personales y devolver una confirmación
solo después de registrar la solicitud.

## Evangelio del día

La página pública `/evangelio` está en `features/gospel/` y se enlaza desde el
menú y desde una tarjeta de Inicio. `GOSPEL_VIDEO_REPOSITORY` ofrece un adaptador
de muestra y un adaptador HTTP; la interfaz señala claramente el contenido de
muestra. El adaptador HTTP consulta `GET /api/gospel/video-of-the-day` en el
backend, usando `API_BASE_URL` como origen opcional y una ruta relativa por
defecto. El contrato de respuesta es:

```json
{
  "status": "available",
  "video": {
    "title": "Título de la publicación",
    "url": "https://www.facebook.com/reel/123456789/",
    "publishedAt": "2026-10-16T08:00:00-05:00"
  }
}
```

Si no hay publicación del día, el backend debe responder
`{"status":"not_available","date":"2026-10-16"}`. Debe elegir la publicación
según `America/Bogota`, validar que corresponda al día actual y consumir Meta
desde el servidor. El token de Meta no se envía al frontend. Actualmente el
token selecciona el repositorio de muestra; para activar el backend, sustituir
el proveedor en `app.config.ts`:

```ts
{ provide: GOSPEL_VIDEO_REPOSITORY, useClass: HttpGospelVideoRepository },
{ provide: API_BASE_URL, useValue: 'https://api.dominio-de-la-catedral.co' },
```

La aplicación integra el video con el reproductor oficial de Facebook y
conserva un enlace de respaldo; no descarga ni aloja el video.

El texto bíblico visible está separado del video en `GOSPEL_READING_MOCK`.
Actualmente contiene Lucas 12, 1-7 para el 16 de octubre de 2026 en la versión
histórica Reina-Valera Antigua. Es contenido de muestra con fecha y fuente
explícitas, no una lectura que se actualice automáticamente ni la traducción
litúrgica oficial local. Para automatizar las lecturas, el backend deberá
entregar referencia, fecha, traducción y texto aprobado por la Catedral.

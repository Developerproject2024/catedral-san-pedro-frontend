# Plataforma web de la Catedral San Pedro Apóstol de Buga

Frontend público de la Catedral, desarrollado con Angular 22, TypeScript y
RxJS. La plataforma reúne información de la Catedral, vida pastoral,
solicitudes de servicios y formularios preparados para conectarse a un backend.

> **Estado de las integraciones:** esta aplicación es el frontend. Los
> formularios y catálogos que todavía usan mocks no guardan ni transmiten
> información. No se simulan pagos ni confirmaciones de reserva o inscripción.

## Secciones públicas

| Ruta | Sección | Qué ofrece |
| --- | --- | --- |
| `/` | Inicio | Presentación de la Catedral y accesos a contenidos destacados. |
| `/catedral` | La Catedral | Información general y fotografías. |
| `/historia` | Historia | Relato histórico de la Catedral. |
| `/servicios` | Servicios | Información de servicios y horarios. |
| `/solicitudes` | Solicitar un servicio | Formulario dinámico para matrimonio, bautismo, aniversario de un ser querido fallecido e intención de misa. |
| `/adoracion` | Adoración | Experiencia de velas de oración de demostración y aporte voluntario no transaccional. |
| `/donaciones` | Donaciones | Selección de montos; no procesa pagos. |
| `/peticiones` | Peticiones | Formulario privado de intención de oración y aporte opcional; requiere backend. |
| `/grupos` | Grupos parroquiales | Catálogo de ejemplo y modal para expresar interés en un grupo. |
| `/evangelio` | Evangelio | Video y lectura de muestra; el video del día requiere integración de backend/Meta. |
| `/contacto` | Contacto | Información de contacto de la Catedral. |
| `/administracion` | CRM administrativo | Pantalla de acceso pendiente y CRUD temporal de solicitudes ficticias. |

La navegación compartida agrupa las páginas en desplegables y adapta su
presentación a pantallas móviles.

## Organización del código

Las funcionalidades están organizadas por dominio en `src/app/features/`.
Cada funcionalidad puede separar sus responsabilidades en capas:

```text
src/app/
├── app.config.ts             # Proveedores globales y configuración Angular
├── app.routes.ts             # Rutas de las páginas
├── core/                     # Configuración y servicios transversales
├── features/
│   ├── adoration/
│   ├── church-service-requests/
│   ├── donations/
│   ├── gospel/
│   ├── parish-groups/
│   └── prayer-requests/
├── layout/                   # Estructura compartida
└── shared/                   # Componentes y utilidades reutilizables
```

Dentro de una funcionalidad, las carpetas representan responsabilidades:

- `domain/`: entidades y conceptos del negocio.
- `application/`: puertos y contratos que necesita la funcionalidad.
- `infrastructure/`: mocks, repositorios y adaptadores HTTP.
- `presentation/`: páginas y componentes Angular.

La presentación depende de contratos de repositorio; la implementación se
selecciona mediante inyección de dependencias. Así se puede cambiar un mock por
un adaptador HTTP sin acoplar la pantalla a una API concreta. La estructura y
las decisiones de arquitectura están ampliadas en
[`src/app/ARCHITECTURE.md`](./src/app/ARCHITECTURE.md); los diagramas están en
[`src/app/DISENO-ARQUITECTURA.md`](./src/app/DISENO-ARQUITECTURA.md).

## Mocks y funcionalidades de demostración

Los principales datos de muestra están en:

| Contenido | Archivo |
| --- | --- |
| Grupos parroquiales | `src/app/features/parish-groups/infrastructure/data-sources/parish-groups.mock.ts` |
| Catálogo de servicios y campos | `src/app/features/church-service-requests/infrastructure/data-sources/church-services.mock.ts` |
| Video de muestra | `src/app/features/gospel/infrastructure/data-sources/gospel-video.mock.ts` |
| Lectura bíblica de muestra | `src/app/features/gospel/infrastructure/data-sources/gospel-reading.mock.ts` |
| Solicitudes ficticias para CRM | `src/app/features/admin-crm/infrastructure/data-sources/crm-requests.mock.ts` |

Otros comportamientos de demostración:

- La inscripción a grupos entrega catálogo mock y rechaza el envío con un
  mensaje claro mientras el backend no esté conectado.
- El catálogo de solicitudes de servicios usa mocks. El envío no confirma
  fecha, disponibilidad, requisitos ni pago.
- Las peticiones de oración no se envían ni se guardan.
- Las velas de Adoración se mantienen en memoria de demostración; no son
  compartidas ni persistidas entre visitantes.
- La página de Donaciones no inicia una transacción.
- El video y la lectura del Evangelio están marcados como contenido de muestra;
  no se actualizan automáticamente.
- El CRM muestra registros totalmente ficticios. Permite buscar, filtrar por
  tipo y estado, paginar, y crear, leer, editar y eliminar solicitudes,
  adoraciones y registros de donación en memoria mientras la demostración está
  abierta; los cambios se descartan al salir. No está conectado a formularios
  ni a un servidor.
- El dashboard administrativo incluye gráficas de solicitudes por sección y
  estado, y montos de donaciones de muestra, renderizados de forma interactiva
  con Chart.js. Sus indicadores se calculan desde los mocks y nunca representan
  actividad o pagos reales.
- El CRM reúne el dashboard y la bandeja de solicitudes en una sola vista.
  Las gráficas de sección y estado permiten filtrar la tabla al seleccionarlas;
  la bandeja también permite buscar y filtrar por tipo, estado y fechas.
  Peticiones, servicios, grupos, adoraciones y donaciones se muestran en la
  misma tabla. Las donaciones son registros ficticios independientes,
  marcados como no pagados; no representan dinero recibido ni transacciones
  procesadas.
- El acceso demo no autentica usuarios ni controla roles. No existe una sesión
  administrativa segura.

## Backend e integraciones previstas

El backend debe desarrollarse como un servicio separado del frontend. Puede
vivir en otro repositorio o desplegarse como API. No se deben incluir en
Angular credenciales privadas, secretos de Meta ni claves de proveedores de
pago.

### Publicación en Render

El archivo `render.yaml` define el sitio estático, el comando de compilación,
el directorio publicado y la regla SPA para que las rutas de Angular sigan
funcionando al recargar o abrir un enlace directamente. En Render, conecta el
repositorio de GitHub y selecciona **Blueprint** para aplicar esta
configuración. Si el servicio ya está creado, revisa en sus ajustes que use
`npm ci && npm run build` como Build Command y
`dist/catedral-san-pedro-frontend/browser` como Publish Directory; conserva el
rewrite `/*` → `/index.html`. Después de enviar el cambio a GitHub, inicia un
despliegue nuevo. El archivo local de configuración no cambia el servicio
remoto hasta que se despliegue o se aplique el Blueprint.

### Adaptadores HTTP ya preparados

| Funcionalidad | Endpoints esperados | Adaptador |
| --- | --- | --- |
| Grupos parroquiales | `GET /api/parish-groups`; `POST /api/parish-group-registrations` | `HttpParishGroupRepository` |
| Solicitudes de servicios | `GET /api/church-services`; `POST /api/church-service-requests` | `HttpChurchServiceRequestRepository` |
| Video del Evangelio | `GET /api/gospel/video-of-the-day` | `HttpGospelVideoRepository` |
| Peticiones de oración | `POST /api/prayer-requests` | `HttpPrayerRequestRepository` |

El CRM `/administracion` aún no consulta estos endpoints: muestra datos
ficticios de peticiones de oración, solicitudes de servicio e intereses en
grupos. Su CRUD de demostración opera solo en memoria. La autenticación,
autorización por roles, gestión de sesiones, consulta y modificación de
solicitudes requieren endpoints y adaptadores backend adicionales. No proteger
datos reales con una validación implementada solo en el frontend.

Los contratos, campos esperados y responsabilidades del backend están
documentados por funcionalidad en
[`src/app/ARCHITECTURE.md`](./src/app/ARCHITECTURE.md). El backend debe validar
los datos y el consentimiento, devolver errores HTTP apropiados y proteger los
datos personales. Las peticiones de oración requieren controles estrictos de
acceso y retención. Los servicios solicitados, grupos y fechas no deben
considerarse confirmados hasta que la Catedral responda.

### Ejemplos de solicitudes POST

Los siguientes ejemplos muestran los cuerpos JSON que espera el frontend. El
servidor debe validar cada campo y devolver una respuesta HTTP de éxito solo
después de procesar la solicitud.

#### Registrar interés en un grupo

`POST /api/parish-group-registrations`

```json
{
  "groupId": "parejas",
  "fullName": "María Fernanda Gómez",
  "email": "maria@example.com",
  "phone": "3001234567",
  "message": "Nos interesa conocer los encuentros para parejas.",
  "consentToDataProcessing": true
}
```

`groupId` debe existir y estar habilitado en el catálogo que administra el
backend. La respuesta no debe indicar que la persona ya quedó incorporada al
grupo; solo que se recibió su solicitud de contacto.

#### Solicitar un servicio de la Catedral

`POST /api/church-service-requests`

```json
{
  "serviceId": "matrimonio",
  "fullName": "María Fernanda Gómez",
  "email": "maria@example.com",
  "phone": "3001234567",
  "details": {
    "partnerNames": "María Fernanda Gómez y Andrés Pérez",
    "ceremonyDate": "2027-06-12",
    "additionalDetails": "Quisiéramos recibir información sobre los requisitos."
  },
  "consentToDataProcessing": true
}
```

Las propiedades de `details` dependen del servicio seleccionado. Por ejemplo,
para `bautismo` son `candidateName`, `birthDate`, `desiredDate` y
`additionalDetails`. El backend debe validar los campos requeridos contra el
catálogo vigente; una fecha solicitada no representa una reserva.

#### Enviar una petición de oración

`POST /api/prayer-requests`

```json
{
  "fullName": "María Fernanda Gómez",
  "email": "maria@example.com",
  "phone": "3001234567",
  "message": "Por la salud y el bienestar de mi familia.",
  "donationAmountCOP": 20000,
  "consentToDataProcessing": true
}
```

`phone` y `donationAmountCOP` son opcionales. El valor de aporte se expresa en
pesos colombianos y no es un pago: este endpoint no debe procesar ni confirmar
transacciones. Trata el contenido de la petición como información sensible,
no lo publiques y limita quién puede consultarlo.

### Configurar la URL base

El token `API_BASE_URL` está definido en
`src/app/core/config/api-base-url.ts` y por defecto usa una cadena vacía. Los
adaptadores HTTP construyen sus rutas a partir de ese origen. Para un backend
desplegado, define el proveedor en `src/app/app.config.ts`, por ejemplo:

```ts
{ provide: API_BASE_URL, useValue: 'https://api.dominio-de-la-catedral.co' },
```

También se debe habilitar CORS en el backend para el dominio del frontend.

### Activar cada adaptador

El adaptador HTTP debe registrarse en los proveedores de Angular usando el
token de la funcionalidad. Por ejemplo, para los grupos:

```ts
import { PARISH_GROUP_REPOSITORY } from './features/parish-groups/application/ports/parish-group.repository';
import { HttpParishGroupRepository } from './features/parish-groups/infrastructure/repositories/http-parish-group.repository';

// Agregar a providers en app.config.ts:
{ provide: PARISH_GROUP_REPOSITORY, useClass: HttpParishGroupRepository },
```

Repite el patrón con los tokens y adaptadores HTTP de la tabla para cada
integración que esté lista. Actualmente, los repositorios mock/inactivos se
usan como implementación predeterminada. El adaptador HTTP de Evangelio está
preparado para consultar el backend; el consumo de Meta debe ocurrir en el
servidor. Las velas y los pagos aún necesitan una implementación de backend y
sus adaptadores; no se deben presentar como persistentes o cobrados hasta
completar esa integración.

## Ejecutar el proyecto

Requisitos: Node.js compatible con el proyecto y npm. Instala las dependencias
una vez:

```bash
npm install
```

Inicia el servidor de desarrollo:

```bash
npm start
```

Angular sirve la aplicación en `http://localhost:4200/` y recarga los cambios
al guardar los archivos.

## Compilar y probar

Compilar para producción:

```bash
npm run build
```

Ejecutar las pruebas unitarias una vez, sin modo interactivo:

```bash
npm test -- --watch=false
```

Los artefactos de compilación se generan en `dist/`. El proyecto no configura
actualmente un runner de pruebas end-to-end.

## Seguridad y privacidad

- No guardar credenciales de Meta, claves privadas ni secretos en el frontend.
- Consumir APIs de Meta y proveedores de pago desde el backend.
- Autenticar al personal y autorizar cada operación en el backend; las rutas
  Angular y los controles de interfaz no son mecanismos de seguridad.
- No afirmar que un formulario se guardó o envió mientras se use un mock.
- Validar en el servidor cada campo, identificador, fecha y consentimiento; la
  validación del navegador no es suficiente.
- Definir acceso, protección y retención para datos personales, especialmente
  para las intenciones de oración.
- Usar HTTPS y configurar CORS con los orígenes permitidos del sitio.

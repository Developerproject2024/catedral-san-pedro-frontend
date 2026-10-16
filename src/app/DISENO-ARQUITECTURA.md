# Diseño gráfico de la arquitectura

Diagramas de referencia para organizar cada funcionalidad Angular según Clean
Architecture. Los ejemplos son conceptuales; no representan funcionalidades ya
implementadas.

## Vista por capas

```mermaid
flowchart TB
    subgraph UI["Presentación · presentation"]
        PAGE["Página Angular"]
        COMPONENT["Componentes"]
        PAGE --> COMPONENT
    end

    subgraph APP["Aplicación · application"]
        USECASE["Caso de uso"]
        PORT["Puerto de salida"]
        USECASE --> PORT
    end

    subgraph DOMAIN["Dominio · domain"]
        ENTITY["Entidades y reglas"]
        CONTRACT["Contrato Repository"]
        VALUE["Value Objects"]
        ENTITY --- VALUE
    end

    subgraph INFRA["Infraestructura · infrastructure"]
        REPOSITORY["Implementación Repository"]
        MAPPER["Mapper · DTO ↔ Dominio"]
        DATASOURCE["Data Source / Adapter"]
        REPOSITORY --> MAPPER --> DATASOURCE
    end

    EXTERNAL["API / Servicio externo"]

    COMPONENT --> USECASE
    PORT -. "contrato definido por dominio" .-> CONTRACT
    REPOSITORY -. "implementa" .-> CONTRACT
    USECASE --> ENTITY
    DATASOURCE <--> EXTERNAL

    classDef presentation fill:#dbeafe,stroke:#2563eb,color:#172554
    classDef application fill:#ede9fe,stroke:#7c3aed,color:#2e1065
    classDef domain fill:#dcfce7,stroke:#16a34a,color:#052e16
    classDef infrastructure fill:#ffedd5,stroke:#ea580c,color:#431407
    classDef external fill:#f3f4f6,stroke:#6b7280,color:#111827

    class PAGE,COMPONENT presentation
    class USECASE,PORT application
    class ENTITY,CONTRACT,VALUE domain
    class REPOSITORY,MAPPER,DATASOURCE infrastructure
    class EXTERNAL external
```

### Dirección de dependencias

Las dependencias de código apuntan hacia las capas internas: presentación →
aplicación → dominio. Infraestructura conoce los contratos internos para
implementarlos; el dominio no importa Angular, HTTP ni infraestructura.

```mermaid
flowchart LR
    PRESENTATION["Presentación"] --> APPLICATION["Aplicación"]
    APPLICATION --> DOMAIN["Dominio"]
    INFRASTRUCTURE["Infraestructura"] -. "implementa contratos" .-> DOMAIN
    INFRASTRUCTURE -. "adaptadores configurados por DI" .-> APPLICATION

    classDef inner fill:#dcfce7,stroke:#16a34a,color:#052e16
    classDef outer fill:#ffedd5,stroke:#ea580c,color:#431407
    class PRESENTATION,APPLICATION,DOMAIN inner
    class INFRASTRUCTURE outer
```

## Flujo de una consulta

```mermaid
sequenceDiagram
    actor Usuario
    participant UI as Página / Componente
    participant UC as Caso de uso
    participant Contract as Contrato Repository
    participant Repo as Repository (Adapter)
    participant Mapper
    participant API as API externa

    Usuario->>UI: Solicita información
    UI->>UC: Ejecutar caso de uso
    UC->>Contract: Consultar datos
    Note over Contract,Repo: El caso de uso usa el contrato, no la implementación
    Contract->>Repo: Llamada resuelta por inyección de dependencias
    Repo->>API: Petición HTTP
    API-->>Repo: DTO de respuesta
    Repo->>Mapper: Convertir DTO
    Mapper-->>Repo: Modelo de dominio
    Repo-->>UC: Resultado del contrato
    UC-->>UI: Resultado de la acción
    UI-->>Usuario: Presenta la información
```

## Dónde vive cada patrón

| Patrón | Responsabilidad | Ubicación |
|---|---|---|
| Use Case | Ejecuta una acción de negocio | `application/use-cases` |
| Repository | Define el contrato y oculta el origen de los datos | Contrato en `domain/repositories`; implementación en `infrastructure/repositories` |
| Adapter | Traduce llamadas de la aplicación a servicios externos | `infrastructure/data-sources` |
| Mapper | Convierte DTOs en modelos del dominio y viceversa | `infrastructure/mappers` |
| Dependency Injection | Conecta la abstracción con su implementación | Providers de Angular |

## Estructura de una funcionalidad

```text
features/<funcionalidad>/
├── domain/
│   ├── entities/
│   ├── repositories/
│   └── value-objects/
├── application/
│   ├── ports/
│   └── use-cases/
├── infrastructure/
│   ├── data-sources/
│   ├── dtos/
│   ├── mappers/
│   └── repositories/
└── presentation/
    ├── components/
    └── pages/
```

Usa solo las carpetas y patrones que requiera cada funcionalidad; el diagrama
describe límites de responsabilidad, no una obligación de crear clases vacías.

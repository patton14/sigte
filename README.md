# Sigte-front-nextjs

## Introducción

Sigte-front-nextjs es el front end del proyecto Sigte, construido utilizando Next.js. Este proyecto está diseñado para ser ejecutado en contenedores Docker, ofreciendo una forma moderna y eficiente de despliegue.

## Table of Contents

- [Instalación](#instalación)
- [Configuración](#configuración)
  - [Variables de Entorno](#variables-de-entorno)
  - [Configuración de reCAPTCHA](#configuración-de-recaptcha)


## Instalación

Para instalar y ejecutar Sigte-front-nextjs:

1. Clone o descargue el código fuente del proyecto.
2. Navegue al directorio del proyecto y modifique el archivo `docker-compose.yml` según sea necesario.
3. Modificar el archivo next.config.js segun se explique mas adelante.

## Configuración

 Configure el puerto `EXPOSE` y el `ENV PORT` al mismo que será puesto en el `docker-compose.yml`
### Dockerfile
    ```bash
    EXPOSE 9003

    ENV PORT 9003
    ```

### Variables de Entorno

Configure las siguientes variables de entorno en su archivo `docker-compose.yml`:

```yaml
version: '3'
services:
    nextjs-server:
        container_name: web-app-nextjs-sigte
        build:
            context: .
            dockerfile: Dockerfile
        image: web-app-nextjs-sigte:latest
        ports:
            - 9003:9003
        environment:
            - NEXTAUTH_URL=http://localhost:9003
            - API_SERVICIO_SALUD=http://10.6.22.135:8001
            - API_TIPO_CARGA=http://10.6.22.135:8002
            - API_ESTADO_CARGAS=http://10.6.22.135:8003
            - API_CARGAS=http://10.6.22.135:8004
            - API_USUARIOS=http://10.6.22.135:9200
            - API_ROLES=http://10.6.22.135:9001
            - API_ROL_ASIGNACION=http://10.6.22.135:9002
            - RECAPTCHA_SECRET_KEY=secret_key
            - API_TIPO_PRESTACION=http://192.168.1.153:8006
            - API_ESTABLECIMIENTO=http://192.168.1.153:8007
```

Variables del `docker-compose.yml`:

| Variable                       | Valores Esperados | Valores por Defecto |
|--------------------------------|-------------------|---------------------|
| `NEXTAUTH_URL`                 | URL de la aplicación (ej. `https://sigte.minsal.cl`) | `http://localhost:9003` |
| `API_SERVICIO_SALUD`           | URL del servicio de salud | - |
| `API_TIPO_CARGA`               | URL del servicio tipo de carga | - |
| `API_ESTADO_CARGAS`            | URL del servicio estado de cargas | - |
| `API_CARGAS`                   | URL del servicio de cargas | - |
| `API_USUARIOS`                 | URL del servicio de usuarios | - |
| `API_ROLES`                    | URL del servicio de roles | - |
| `API_ROL_ASIGNACION`           | URL del servicio de asignación de roles | - |
| `RECAPTCHA_SECRET_KEY`         | Clave secreta de reCAPTCHA | - |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | Clave pública de reCAPTCHA | - |
| `API_TIPO_PRESTACION`                    | URL del servicio tipo prestaciones | - |
| `API_ESTABLECIMIENTO`                    | URL del servicio de Establecimientos | - |

## Configuración del Archivo `next.config.js`

El archivo `next.config.js` es un punto crucial para la configuración de la aplicación Next.js. Aquí se establecen diversas configuraciones que impactan el comportamiento y la compilación de la aplicación. A continuación, se describen las variables más importantes dentro de este archivo:

### Variables de `next.config.js`

| Variable | Descripción | Ejemplo de Uso |
|----------|-------------|----------------|
| `env` | Permite definir variables de entorno que serán incrustadas en el código JavaScript del lado del cliente. | `env: { NEXT_PUBLIC_RECAPTCHA_SITE_KEY: 'public_key' }` |

**Nota** Es importante saber que la variable de entorno `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` debe ser definida en el archivo `next.config.js` como se ve a continuacion, ya que es una variable que debe ser inyectada al cliente, de no hacerlo de esta forma puede presentar problemas.
```js
const nextConfig = {
    reactStrictMode: false,
    trailingSlash: true,
    basePath: process.env.NODE_ENV === 'production' ? '' : '',
    publicRuntimeConfig: {
        contextPath: process.env.NODE_ENV === 'production' ? '' : '',
        uploadPath: process.env.NODE_ENV === 'production' ? '/upload.php' : '/api/upload'
    },
    output: 'standalone',
    env: {
        NEXTAUTH_SECRET:'K^_r5uMJGmJ`0f|CXGX-',
        JWT_SECRET:'3727F4D52FBF7A373A18D8AFE8F8A',
        AUTH0_ID: '1',
        AUTH0_SECRET: 'test',
        NEXT_PUBLIC_BASE_PATH: 'http://localhost:3000',
        NEXT_PUBLIC_RECAPTCHA_SITE_KEY:'public_key'
    }
};

module.exports = nextConfig;
```

**Nota:** Es importante tener en cuenta que cualquier cambio en `next.config.js` requiere reiniciar el servidor de Next.js para que los cambios tengan efecto.


### Configuración de reCAPTCHA

1. Visite [Google reCAPTCHA Admin](https://www.google.com/recaptcha/admin/site) y cree una clave para reCAPTCHA v2.
2. Asigne los hosts necesarios y configure según lo requiera.
3. Coloque las claves generadas en las variables de entorno correspondientes:

    - `RECAPTCHA_SECRET_KEY`: Clave privada de Google reCAPTCHA.
    - `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`: Clave pública de Google reCAPTCHA. **(Archivo next.config.js)**

## Uso
**Resumen de uso:**
 
 1. Configurar archivo `docker-compose.yml` con las variables de entorno correspondientes.
 2. Configurar el archivo `next.config.js` con las variables de entorno publicas como lo es la `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`.
 3. Ejecutar el comando:
 ```bash
    docker compose build
 ```

4. Si el build termina con exito ejecutar:
```bash
docker compose up -d
```

5. Acceder a la url configurada.


**Nota** es obligatorio tener online todas los servicios que fueron configurados en las variables de entorno, revise la documentacion para configurar los servicios.

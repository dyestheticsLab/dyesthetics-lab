# dys-cli

CLI para manejo de componentes con configuración flexible.

## Instalación y uso

1. Instala las dependencias:
   ```bash
   pnpm install
   ```

2. Compila el proyecto:
   ```bash
   pnpm build
   ```

3. Vincula el CLI globalmente:
   ```bash
   npm link --global
   ```

   > Para desvincularlo después:
   ```bash
   npm unlink --global
   ```
   > o también intenta con
   ```bash
   npm unlink -g dys-cli
   ```

## Comandos disponibles

- `dys build`  
  Construye los componentes.  
  Opciones:
  - `-d, --component-dir <dir>`: Directorio de componentes
  - `-o, --output-file <file>`: Archivo de salida
  - `-r, --required-files <files...>`: Archivos requeridos (separados por espacio)
  - `-c, --config <path>`: Ruta al archivo de configuración

- `dys init`  
  Crea un archivo de configuración por defecto.  
  Opciones:
  - `-f, --format <format>`: Formato del archivo (`json`|`js`), por defecto `json`

- `dys config`  
  Muestra la configuración actual.  
  Opciones:
  - `-c, --config <path>`: Ruta al archivo de configuración

Si tienes dudas sobre los comandos, ejecuta:
```bash
dys --help
```

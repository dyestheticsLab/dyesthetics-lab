#!/usr/bin/env node

import { Command } from 'commander';
import * as fs from 'fs';
import * as path from 'path';

// TODO: change this interface to match your actual configuration needs (codegen)
interface CLIOptions {
  componentDir: string;
  outputFile: string;
  requiredFiles: string[];
}

const DEFAULT_CONFIG: CLIOptions = {
  componentDir: './src/components',
  outputFile: './dist/output.js',
  requiredFiles: ['index.ts', 'package.json']
};

function loadConfigFile(configPath?: string): Partial<CLIOptions> {
  const defaultConfigPaths = [
    './cli.config.json',
    './cli.config.js',
    './.clirc.json'
  ];

  const pathsToTry = configPath ? [configPath] : defaultConfigPaths;

  for (const filePath of pathsToTry) {
    try {
      if (fs.existsSync(filePath)) {
        console.log(`📄 Cargando configuración desde: ${filePath}`);
        
        if (filePath.endsWith('.js')) {
          delete require.cache[require.resolve(path.resolve(filePath))];
          return require(path.resolve(filePath));
        } else {
          const content = fs.readFileSync(filePath, 'utf8');
          return JSON.parse(content);
        }
      }
    } catch (error: any) {
      console.warn(`⚠️ Error cargando configuración desde ${filePath}:`, error.message);
    }
  }

  return {};
}

function mergeConfig(
  defaultConfig: CLIOptions,
  fileConfig: Partial<CLIOptions>,
  cliConfig: Partial<CLIOptions>
): CLIOptions {
  return {
    componentDir: cliConfig.componentDir || fileConfig.componentDir || defaultConfig.componentDir,
    outputFile: cliConfig.outputFile || fileConfig.outputFile || defaultConfig.outputFile,
    requiredFiles: cliConfig.requiredFiles || fileConfig.requiredFiles || defaultConfig.requiredFiles
  };
}

function executeCommand(options: CLIOptions) {
  console.log('\n🚀 Ejecutando comando con la siguiente configuración:');
  console.log('┌─────────────────────────────────────────────────────────┐');
  console.log(`│ Component Dir: ${options.componentDir.padEnd(40)} │`);
  console.log(`│ Output File:   ${options.outputFile.padEnd(40)} │`);
  console.log(`│ Required Files: ${options.requiredFiles.join(', ').padEnd(39)} │`);
  console.log('└─────────────────────────────────────────────────────────┘');

  console.log('\n✅ Comando ejecutado exitosamente!');
}

const program = new Command();

program
  .name('dys-cli')
  .description('CLI para manejo de componentes con configuración flexible')
  .version('1.0.0');

program
  .command('build')
  .description('Construir los componentes')
  .option('-d, --component-dir <dir>', 'Directorio de componentes')
  .option('-o, --output-file <file>', 'Archivo de salida')
  .option('-r, --required-files <files...>', 'Archivos requeridos (separados por espacio)')
  .option('-c, --config <path>', 'Ruta al archivo de configuración')
  .action((cliOptions) => {
    const fileConfig = loadConfigFile(cliOptions.config);
    
    const cliConfig: Partial<CLIOptions> = {
      componentDir: cliOptions.componentDir,
      outputFile: cliOptions.outputFile,
      requiredFiles: cliOptions.requiredFiles
    };

    const finalConfig = mergeConfig(DEFAULT_CONFIG, fileConfig, cliConfig);
    
    executeCommand(finalConfig);
  });

program
  .command('init')
  .description('Crear archivo de configuración por defecto')
  .option('-f, --format <format>', 'Formato del archivo (json|js)', 'json')
  .action((options) => {
    const format = options.format === 'js' ? 'js' : 'json';
    const filename = format === 'js' ? 'cli.config.js' : 'cli.config.json';
    
    let content: string;
    
    if (format === 'js') {
      content = `
      module.exports = {
        componentDir: '${DEFAULT_CONFIG.componentDir}',
        outputFile: '${DEFAULT_CONFIG.outputFile}',
        requiredFiles: ${JSON.stringify(DEFAULT_CONFIG.requiredFiles, null, 2)}
      };
    `;
    } else {
      content = JSON.stringify(DEFAULT_CONFIG, null, 2);
    }

    try {
      fs.writeFileSync(filename, content);
      console.log(`✅ Archivo de configuración creado: ${filename}`);
    } catch (error: any) {
      console.error(`❌ Error creando archivo de configuración:`, error.message);
    }
  });

program
  .command('config')
  .description('Mostrar configuración actual')
  .option('-c, --config <path>', 'Ruta al archivo de configuración')
  .action((options) => {
    const fileConfig = loadConfigFile(options.config);
    const finalConfig = mergeConfig(DEFAULT_CONFIG, fileConfig, {});
    
    console.log('\n📋 Configuración actual:');
    console.log(JSON.stringify(finalConfig, null, 2));
  });

program.on('command:*', () => {
  console.error('❌ Comando no válido. Usa --help para ver comandos disponibles.');
  process.exit(1);
});

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
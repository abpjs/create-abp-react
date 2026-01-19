#!/usr/bin/env node

import { execa } from 'execa';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEMPLATE_REPO = 'https://github.com/abpjs/abp-react-template-basic.git';
const DEFAULT_FOLDER_NAME = 'abp-react-app';

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const folderName = args.find(arg => !arg.startsWith('--')) || DEFAULT_FOLDER_NAME;
  const flags = {
    help: args.includes('--help') || args.includes('-h'),
    version: args.includes('--version') || args.includes('-v'),
  };
  return { folderName, flags };
}

// Display help message
function showHelp() {
  console.log(`
${chalk.bold('create-abp-react')} - Create a new ABP React application

${chalk.bold('Usage:')}
  npx create-abp-react [folder-name]

${chalk.bold('Arguments:')}
  folder-name    Name of the folder to create (default: ${DEFAULT_FOLDER_NAME})

${chalk.bold('Examples:')}
  npx create-abp-react
  npx create-abp-react my-app
  npx create-abp-react ./my-project

${chalk.bold('Requirements:')}
  - Node.js >= 18.0.0
  - pnpm (install with: npm install -g pnpm or corepack enable pnpm)

${chalk.bold('Documentation:')}
  https://docs.abpjs.io/docs/
`);
}

// Display version
function showVersion() {
  const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'));
  console.log(pkg.version);
}

// Check if pnpm is available
async function checkPnpm() {
  try {
    const result = await execa('pnpm', ['--version'], { 
      reject: false,
      timeout: 5000
    });
    return result.exitCode === 0;
  } catch (error) {
    return false;
  }
}

// Validate folder name
function validateFolderName(folderName) {
  if (!folderName || folderName.trim() === '') {
    throw new Error('Folder name cannot be empty');
  }
  
  // Check for invalid characters
  const invalidChars = /[<>:"|?*\x00-\x1f]/;
  if (invalidChars.test(folderName)) {
    throw new Error(`Folder name contains invalid characters: ${folderName}`);
  }
  
  return true;
}

// Check if folder already exists
async function checkFolderExists(folderPath) {
  try {
    const exists = await fs.pathExists(folderPath);
    if (exists) {
      throw new Error(`Folder "${folderPath}" already exists. Please choose a different name or remove the existing folder.`);
    }
  } catch (error) {
    if (error.message.includes('already exists')) {
      throw error;
    }
    // If it's a different error (like permission), we'll let it fail later
  }
}

// Fetch template from GitHub
async function fetchTemplate(targetFolder) {
  console.log(chalk.blue('📦 Fetching template from GitHub...'));
  
  try {
    // Clone the repository
    await execa('git', ['clone', TEMPLATE_REPO, targetFolder], {
      stdio: 'inherit',
    });
    
    // Remove .git folder from template
    const gitFolder = path.join(targetFolder, '.git');
    if (await fs.pathExists(gitFolder)) {
      await fs.remove(gitFolder);
    }
    
    console.log(chalk.green('✓ Template fetched successfully'));
  } catch (error) {
    throw new Error(`Failed to fetch template: ${error.message}`);
  }
}

// Install dependencies
async function installDependencies(targetFolder) {
  console.log(chalk.blue('📥 Installing dependencies...'));
  
  try {
    await execa('pnpm', ['install'], {
      cwd: targetFolder,
      stdio: 'inherit',
    });
    console.log(chalk.green('✓ Dependencies installed successfully'));
  } catch (error) {
    throw new Error(`Failed to install dependencies: ${error.message}`);
  }
}

// Initialize git repository
async function initializeGit(targetFolder) {
  console.log(chalk.blue('🔧 Initializing git repository...'));
  
  try {
    await execa('git', ['init'], {
      cwd: targetFolder,
      stdio: 'pipe',
    });
    console.log(chalk.green('✓ Git repository initialized'));
  } catch (error) {
    // Git init failure is not critical, just warn
    console.log(chalk.yellow('⚠ Failed to initialize git repository (this is not critical)'));
  }
}

// Main function
async function main() {
  try {
    const { folderName, flags } = parseArgs();
    
    // Handle help flag
    if (flags.help) {
      showHelp();
      process.exit(0);
    }
    
    // Handle version flag
    if (flags.version) {
      showVersion();
      process.exit(0);
    }
    
    // Validate folder name
    validateFolderName(folderName);
    
    // Resolve absolute path
    const targetFolder = path.resolve(process.cwd(), folderName);
    
    // Check if folder exists
    await checkFolderExists(targetFolder);
    
    // Check for pnpm
    console.log(chalk.blue('🔍 Checking for pnpm...'));
    const pnpmAvailable = await checkPnpm();
    
    if (!pnpmAvailable) {
      console.error(chalk.red('\n✗ pnpm is required but not found.\n'));
      console.log(chalk.yellow('Please install pnpm using one of the following methods:\n'));
      console.log(chalk.cyan('  npm install -g pnpm'));
      console.log(chalk.cyan('  or'));
      console.log(chalk.cyan('  corepack enable pnpm\n'));
      console.log(chalk.gray('After installing pnpm, please run this command again.\n'));
      process.exit(1);
    }
    
    console.log(chalk.green('✓ pnpm is available\n'));
    
    // Fetch template
    await fetchTemplate(targetFolder);
    
    // Install dependencies
    await installDependencies(targetFolder);
    
    // Initialize git
    await initializeGit(targetFolder);
    
    // Success message
    console.log(chalk.green('\n✓ Project created successfully!\n'));
    console.log(chalk.bold('Next steps:'));
    console.log(chalk.cyan(`  cd ${folderName}`));
    console.log(chalk.cyan('  pnpm dev\n'));
    console.log(chalk.gray('For more information, visit: https://docs.abpjs.io/docs/\n'));
    
  } catch (error) {
    console.error(chalk.red(`\n✗ Error: ${error.message}\n`));
    process.exit(1);
  }
}

// Run main function
main();

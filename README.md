# create-abp-react

A CLI tool to quickly scaffold a new ABP React application.

## Installation

This package is designed to be run via `npx`, so you don't need to install it globally:

```bash
npx create-abp-react [folder-name]
```

## Requirements

- **Node.js** >= 18.0.0
- **pnpm** - Install with one of the following:
  ```bash
  npm install -g pnpm
  ```
  or
  ```bash
  corepack enable pnpm
  ```

## Usage

### Basic Usage

Create a new ABP React app in the default folder (`abp-react-app`):

```bash
npx create-abp-react
```

### With Custom Folder Name

Create a new ABP React app in a custom folder:

```bash
npx create-abp-react my-app
```

You can also use relative paths:

```bash
npx create-abp-react ./my-project
```

### Help

Display help information:

```bash
npx create-abp-react --help
```

### Version

Display version information:

```bash
npx create-abp-react --version
```

## What It Does

When you run `create-abp-react`, it will:

1. ✅ Fetch the latest template from [abp-react-template-basic](https://github.com/abpjs/abp-react-template-basic)
2. ✅ Check if pnpm is installed (exits with helpful message if not)
3. ✅ Install all dependencies using pnpm
4. ✅ Initialize a new git repository
5. ✅ Provide you with next steps to get started

## Getting Started

After creating your project:

```bash
cd abp-react-app  # or your custom folder name
pnpm dev
```

## Documentation

For more information about ABP React, visit the official documentation:

**https://docs.abpjs.io/docs/**

## Template Repository

The template used by this tool is available at:

**https://github.com/abpjs/abp-react-template-basic**

## License

MIT

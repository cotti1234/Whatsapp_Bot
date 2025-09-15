# Cotti WhatsApp App

Cotti WhatsApp App is a modular, testable, and extensible WhatsApp bot built with TypeScript. It features a command system that supports both TypeScript and JavaScript commands, a central downloader service for media, and a console-based test mode for development without connecting to WhatsApp.

## Features

- **Modular Command System**: Easily add new commands in `.ts` or `.js`.
- **Downloader Service**: Fetches and processes media. Initially supports YouTube MP3 downloads.
- **Console Test Mode**: Test bot functionality directly in your terminal.
- **Configuration Management**: Uses `.env` files for easy configuration, validated with Zod.
- **Robust Logging**: Powered by Pino for structured and performant logging.
- **Code Quality**: Pre-configured with ESLint, Prettier, and Husky.
- **Dockerized**: Ready for deployment with `Dockerfile` and `docker-compose.yml`.

## Project Structure

```
CottiWhatsAppApp/
├─ src/
│  ├─ index.ts           # Main entry point
│  ├─ whatsapp.ts        # Core bot class and command loader
│  ├─ config.ts          # Configuration loader and validator
│  ├─ logger.ts          # Pino logger setup
│  ├─ commands/          # Bot commands (TypeScript)
│  │  └─ legacy/          # Legacy bot commands (JavaScript)
│  ├─ services/          # Services like the downloader
│  └─ utils/             # Utility functions
├─ tests/                 # Jest tests
├─ package.json
├─ tsconfig.json
├─ .env.example           # Environment variable template
├─ README.md
├─ Dockerfile
└─ docker-compose.yml
```

## Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd CottiWhatsAppApp
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Install FFmpeg:**
    The downloader service requires FFmpeg for audio conversion. Please install it on your system.
    - **Ubuntu/Debian**: `sudo apt update && sudo apt install ffmpeg`
    - **macOS (with Homebrew)**: `brew install ffmpeg`
    - **Windows (with Chocolatey)**: `choco install ffmpeg`

## Configuration

1.  Create a `.env` file by copying the example file:
    ```bash
    cp .env.example .env
    ```

2.  Edit the `.env` file with your desired settings:
    ```env
    # Bot Configuration
    BOT_NAME=Cotti WhatsApp App
    PREFIX=!

    # Downloader Configuration
    MAX_FILE_SIZE_MB=100
    TEMP_DIR=./temp

    # Application Environment
    NODE_ENV=development
    LOG_LEVEL=info

    # Console Test Mode
    TEST_MODE=false
    ```

## Usage

### Normal Mode (Connects to WhatsApp)

1.  **Start the bot:**
    ```bash
    npm start
    ```

2.  On the first run, a QR code will appear in the terminal. Scan it with your phone using the WhatsApp "Linked Devices" feature.

3.  For production, build the project first:
    ```bash
    npm run build
    npm start
    ```

### Console Test Mode

This mode allows you to test commands without connecting to WhatsApp.

1.  **Enable Test Mode:**
    -   Set `TEST_MODE=true` in your `.env` file, OR
    -   Start the bot with the `--test` flag:
        ```bash
        npm start -- --test
        ```

2.  Enter commands in the console, e.g., `!ping`.

## Available Commands

-   `!help`: Lists all available commands.
-   `!ping`: Checks the bot's response time.
-   `!status`: Shows system and bot information.
-   `!config`: Displays the current configuration.
-   `!yt <URL or Search Term>`: Downloads the audio from a YouTube video as an MP3 file.

## Docker Deployment

1.  **Build the Docker image:**
    ```bash
    docker-compose build
    ```

2.  **Run the container:**
    ```bash
    docker-compose up -d
    ```

3.  To see the QR code and logs, view the container's logs:
    ```bash
    docker-compose logs -f
    ```

Deutsch:

Die Cotti WhatsApp App ist ein modularer, testbarer und erweiterbarer WhatsApp-Bot, der mit TypeScript erstellt wurde. Es verfügt über ein Befehlssystem, das sowohl TypeScript- als auch JavaScript-Befehle unterstützt, einen zentralen Downloader-Dienst für Medien und einen konsolenbasierten Testmodus für die Entwicklung ohne Verbindung zu WhatsApp.

## Funktionen

- **Modulares Befehlssystem**: Fügen Sie ganz einfach neue Befehle in „.ts“ oder „.js“ hinzu.
- **Downloader-Service**: Ruft Medien ab und verarbeitet sie. Unterstützt zunächst YouTube MP3-Downloads.
- **Konsolentestmodus**: Testen Sie die Bot-Funktionalität direkt in Ihrem Terminal.
- **Konfigurationsverwaltung**: Verwendet „.env“-Dateien für eine einfache Konfiguration, validiert mit Zod.
- **Robuste Protokollierung**: Unterstützt von Pino für strukturierte und leistungsstarke Protokollierung.
- **Codequalität**: Vorkonfiguriert mit ESLint, Prettier und Husky.
- **Dockerisiert**: Bereit für die Bereitstellung mit „Dockerfile“ und „docker-compose.yml“.

## Projekt Aufbau

```
CottiWhatsAppApp/
├─ src/
│  ├─ index.ts           # Haupteingangspunkt
│  ├─ whatsapp.ts        # Kernbotklasse und Befehlslader
│  ├─ config.ts          # Konfigurationslader und Validator
│  ├─ logger.ts          # Pino logger setup
│  ├─ commands/          # Bot Befehle (TypeScript)
│  │  └─ legacy/          # Legacy bot Befehle (JavaScript)
│  ├─ services/          # Dienste wie der Downloader
│  └─ utils/             # Utility funktionen
├─ tests/                 # Jest tests
├─ package.json
├─ tsconfig.json
├─ .env.example           # Vorlage für Umgebungsvariablen
├─ README.md
├─ Dockerfile
└─ docker-compose.yml
```

## Installation

1.  **Klonen Sie das Repository:**
    ```bash
    git clone <repository-url>
    cd CottiWhatsAppApp
    ```

2.  **Abhängigkeiten installieren:**
    ```bash
    npm install
    ```

3.  **Insterliere FFmpeg:**
    Der Downloader-Dienst benötigt FFmpeg für die Audiokonvertierung. Bitte installieren Sie es auf Ihrem System.
    - **Ubuntu/Debian**: `sudo apt update && sudo apt install ffmpeg`
    - **macOS (mit Homebrew)**: `brew install ffmpeg`
    - **Windows (mit Chocolatey)**: `choco install ffmpeg`

## Configuration

1.  Erstell ein `.env` Datei durch Kopieren der Beispieldatei:
    ```bash
    cp .env.example .env
    ```

2.  Bearbeiten Sie die `.env` Datei mit Ihren gewünschten Einstellungen:
    ```env
    # Bot Configuration
    BOT_NAME=Cotti WhatsApp App
    PREFIX=!

    # Downloader Configuration
    MAX_FILE_SIZE_MB=100
    TEMP_DIR=./temp

    # Application Environment
    NODE_ENV=development
    LOG_LEVEL=info

    # Console Test Mode
    TEST_MODE=false
    ```

## Usage

### Normal Modus (Verbindet sich mit WhatsApp)

1.  **Starte denn Bot:**
    ```bash
    npm start
    ```

2.  Beim ersten Durchlauf erscheint ein QR-Code im Terminal. Scannen Sie es mit Ihrem Telefon über die WhatsApp-Funktion „Verknüpfte Geräte“.

3.  Erstellen Sie für die Produktion zuerst das Projekt:
    ```bash
    npm run build
    npm start
    ```

### Konsolentestmodus

In diesem Modus können Sie Befehle testen, ohne eine Verbindung zu WhatsApp herzustellen.

1.  **Testmodus aktivieren:**
    -   Set `TEST_MODE=true` in your `.env` file, OR
    -   Start the bot with the `--test` flag:
        ```bash
        npm start -- --test
        ```

2.  Enter commands in the console, e.g., `!ping`.

## Available Commands

-   `!help`: Lists all available commands.
-   `!ping`: Checks the bot's response time.
-   `!status`: Shows system and bot information.
-   `!config`: Displays the current configuration.
-   `!yt <URL or Search Term>`: Downloads the audio from a YouTube video as an MP3 file.

## Docker Deployment

1.  **Build the Docker image:**
    ```bash
    docker-compose build
    ```

2.  **Run the container:**
    ```bash
    docker-compose up -d
    ```

3.  To see the QR code and logs, view the container's logs:
    ```bash
    docker-compose logs -f
    ```

# Page Zettel

[![Obsidian Downloads](https://img.shields.io/badge/dynamic/json?logo=obsidian&color=%23483699&label=downloads&query=%24%5B%22page-zettel%22%5D.downloads&url=https%3A%2F%2Fraw.githubusercontent.com%2Fobsidianmd%2Fobsidian-releases%2Fmaster%2Fcommunity-plugin-stats.json)](https://obsidian.md/plugins?id=page-zettel)

**Zettelkasten workflow support for Obsidian** - Manage Fleeting, Literature, and Permanent notes with ease.

[日本語版 README はこちら](README.ja.md)

## ✨ Features

### 📝 Three Note Types
Manage your knowledge through the Zettelkasten method with three distinct note types:

| Type | Emoji | Purpose |
|------|-------|---------|
| **Fleeting** | 💭 | Quick thoughts and ideas to be processed later |
| **Literature** | 📚 | Summaries and quotes from external sources |
| **Permanent** | 💎 | Atomic, interconnected knowledge units |

### 🔄 Extract to Note
Select text in any note and extract it into a new note. The original text is automatically replaced with a markdown link.

### ⬆️ Note Promotion
Promote notes through the hierarchy (Fleeting → Permanent) with automatic metadata updates and optional folder moves.

### 🔍 Orphan Detection
Find Permanent notes that aren't linked to other notes. View statistics and quickly connect orphaned notes.

### 📱 Mobile Optimized
Designed with a mobile-first approach for seamless use on phones and tablets.

### 🌐 Internationalization
Full support for English and Japanese interfaces.

## 📦 Installation

### From Community Plugins (Recommended)
1. Open Obsidian Settings → Community Plugins
2. Disable Safe Mode if enabled
3. Click "Browse" and search for "Page Zettel"
4. Click Install, then Enable

### Manual Installation
1. Download `main.js`, `styles.css`, and `manifest.json` from the [latest release](https://github.com/staticWagomU/obsidian-daily-zettel/releases)
2. Create folder: `VaultFolder/.obsidian/plugins/page-zettel/`
3. Copy the downloaded files into the folder
4. Reload Obsidian and enable the plugin in Settings → Community Plugins

## 🚀 Usage

### Commands

Access all commands via the Command Palette (`Cmd/Ctrl + P`):

| Command | Description |
|---------|-------------|
| 📝 **Extract to Note** | Extract selected text into a new note (choose type) |
| 💭 **Extract to Fleeting** | Extract directly to a Fleeting note |
| 📚 **Extract to Literature** | Extract directly to a Literature note |
| 💎 **Extract to Permanent** | Extract directly to a Permanent note |
| 📄 **Create New Note** | Create a blank note from template |
| ⬆️ **Promote Note** | Promote current note to the next type |
| ⚡ **Quick Fleeting** | Quick capture a fleeting thought |
| 🔗 **Show Orphan Notes** | Open the orphan detection sidebar |

### Basic Workflow

#### Capturing Ideas
1. **Quick Capture**: Use "Quick Fleeting" to instantly capture thoughts
2. **Extract & Create**: Select text and run "Extract to Note" to create linked notes
3. **Direct Type**: Use type-specific extract commands from the context menu

#### Processing Notes
1. Review your Fleeting notes
2. Use "Promote Note" to upgrade valuable ideas to Permanent notes
3. Connect Permanent notes using the Orphan Detection view

### Context Menu

Right-click on selected text to access:
- Extract to Fleeting Note
- Extract to Literature Note
- Extract to Permanent Note

## ⚙️ Settings

### Note Type Settings (per type)

| Setting | Description |
|---------|-------------|
| **Folder** | Target folder for notes of this type |
| **File Name Format** | Template for naming files (supports placeholders) |
| **Show Alias Input** | Prompt for alias during note creation |
| **Template Path** | Path to custom template file |

### Behavior Settings

| Setting | Description |
|---------|-------------|
| **Insert Link After Extract** | Insert markdown link where text was extracted |
| **Open After Extract** | Open newly created note after extraction |
| **Move On Promotion** | Move note to target folder when promoted |

### UI Settings

| Setting | Description |
|---------|-------------|
| **Show Emoji in Commands** | Display emojis in command names |
| **Mobile Optimized** | Mobile-first UI optimization |
| **Show Context Menu Items** | Add note operations to context menus |

## 📋 Template Placeholders

Use these placeholders in your custom templates:

| Placeholder | Description | Example |
|-------------|-------------|---------|
| `{{content}}` | Selected text (extract) or empty (create) | Selected text... |
| `{{date}}` | Creation date | 2024-01-15 |
| `{{time}}` | Creation time | 14:30:00 |
| `{{datetime}}` | Full datetime | 2024-01-15 14:30:00 |
| `{{title}}` | Generated file name | My Note Title |
| `{{alias}}` | User-provided alias | Alias Name |
| `{{zettel-id}}` | Zettelkasten ID | 20240115143000 |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

### Development Setup

```bash
# Clone the repository
git clone https://github.com/staticWagomU/obsidian-daily-zettel.git

# Install dependencies
pnpm install

# Build the plugin
pnpm run build

# Development mode (watch)
pnpm run dev

# Lint code
pnpm run lint
```

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🙏 Acknowledgments

- Inspired by the Zettelkasten method by Niklas Luhmann
- Built with the [Obsidian Plugin API](https://docs.obsidian.md)

---

**Author**: [staticWagomU](https://github.com/staticWagomU)

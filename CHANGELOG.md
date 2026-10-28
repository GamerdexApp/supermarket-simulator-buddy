# Changelog

All notable changes to Supermarket Simulator Buddy will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [UNRELEASED]

## [2.0.0] - 2026-10-28

### Added

- A new interface with a sidebar, a playthrough switcher with the store level beside it, and one
  page per area: Overview, Market, Management, Bank, Shopping list, Playthroughs and Settings.
- A Playthroughs page to create, switch, edit and delete playthroughs, with search and sort.
- Every change saves at once, and a toast offers Undo for unlocks, hires, loans, list changes,
  deletes, imports and resets.
- Optional cloud sync through Google Drive, Dropbox, OneDrive or a GitHub repository. The synced
  file has the same format as the backup file, and unlocks from two devices are merged.
- 19 languages with separate number and date formats, and a light, dark or system theme.
- Licenses can be filtered, searched and sorted. Growth and storage sections show as an ordered
  path that says why a section is locked.
- Hiring shows the hiring costs paid. The Bank and Overview show the total loan debt.
- The shopping list adds boxes to an item that is already on it, groups items by shop, and has a
  box stepper on every row.
- Product details with the shop each product is bought at.
- Import asks whether to merge or replace, and shows what will change first.
- A landing page that never redirects, a branded 404 page, and privacy policy and terms of service
  links in the footer.

### Changed

- The Dashboard is now the Overview. The old `/dashboard` address redirects to it.
- The Tablet now needs 3 licenses before it can be unlocked, as in the game.
- Undoing a growth or storage section also locks the later sections that need it, after a confirm.
- Every new playthrough becomes the active one.
- The repository moved to the GamerdexApp organization.

### Fixed

- Refreshing a page no longer sends you back to the landing page.
- The product Avacado is now spelled Avocado. Items saved under the old name still match.
- The double freezer shows its name.
- A fast double click no longer stores an unlock twice, and counts ignore ids the game data does
  not have.
- A loan entry that no longer matches a loan no longer breaks the Overview.

### Removed

- Flowbite and react-toastify. The interface is built with Tailwind and its own components.

## [1.0.0] - 2026-04-10

### Add

- Add SEO
- Add Footer to all pages
- Add Discord Link

### Fix

- Fix broken link for Vintage Book.

## [0.2.0] - 2026-3-11

### Chore

- Bump Dependencies
- Add github files

## [0.1.0] - 2025-12-05

### 🎉 Initial Release

The first public release of Supermarket Simulator Buddy - a comprehensive progress tracking companion app for Supermarket Simulator.

### ✨ Features

#### Playthrough Management

- **Multiple Playthroughs**: Create and manage unlimited playthroughs
- **Active Playthrough Selection**: Switch between playthroughs via sidebar dropdown
- **Playthrough Details**: Track name, description, creation date, and last modified date
- **Delete & Edit**: Full CRUD operations for playthrough management

#### Store Management

- **Store Level Tracking**: Monitor your store's progression through levels
- **License Management**:
  - Track all 31+ product licenses
  - View which products each license unlocks
  - See total spending on licenses
  - Undo unlock functionality for accidental purchases
- **Storage Sections**:
  - Track 14 storage section upgrades
  - Monitor store level requirements
  - View pricing and size information (4x4)
  - Undo unlock functionality
  - Total spending tracker
- **Growth Areas**:
  - Track 14 growth section expansions
  - Store level requirements and pricing
  - Undo unlock functionality
  - Total spending summary

#### Market & Purchases

- **Furniture Tracking**:
  - 50+ furniture items
  - Display capacity information
  - Total spending tracker
  - Side-by-side image and details layout
- **Paint Selection**:
  - 14 paint options
  - Visual previews
  - Price tracking
  - Horizontal layout with images
- **Tools Management**:
  - 6 essential tools
  - Requirement information
  - Free and paid options
  - Price and description details
- **Vehicle Fleet**:
  - 5 delivery vehicles
  - Store level requirements
  - Detailed descriptions
  - Total investment tracking

#### Shopping Lists

- **Smart Organization**: Automatic grouping by shop location
  - Deli and Grocery
  - Meat and Dairy
  - Green Market
  - Liquor Store
  - Janitorial Supply
  - No Shop Available (for items unavailable at shops)
- **Product Management**:
  - Add products from unlocked licenses
  - Search functionality by name or company
  - Box quantity tracking with increment/decrement
  - Visual product cards with images
  - Badge indicators for added items
- **Purchase Tracking**:
  - Checkbox system for purchased items
  - Visual distinction for completed items
  - Remove items from list
  - Reset entire list
- **Layout**:
  - Full-width display
  - 2-column grid for location groups
  - 2-column grid for items within each location
  - Responsive design for mobile, tablet, and desktop

#### Financial Tracking

- **Category Summaries**: Total spending across all major categories
- **Bank & Loans**: Loan tracking with interest rates and term lengths
- **Budget Overview**: Comprehensive financial monitoring

#### Data Management

- **Export**: Download complete playthrough data as JSON
- **Import**: Restore data from JSON backup files
- **Clear Data**: Option to reset all application data
- **Auto-Save**: Automatic persistence to browser localStorage
- **Data Validation**: Import validation to ensure data integrity

### 📦 Game Data

Complete database of Supermarket Simulator items:

- 31+ Product licenses with full product lists
- 50+ Furniture items with images and specifications
- 14 Paint options with visual previews
- 14 Storage sections with pricing
- 14 Growth areas with requirements
- 6 Essential tools
- 5 Delivery vehicles
- 5 Loan options with interest rates
- Multiple employee types (cashiers, restockers, helpers, guards, janitors)

---

**Full Changelog**: <https://github.com/GamerdexApp/supermarket-simulator-buddy/commits/0.1.0>

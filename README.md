# Family Tree Visualizer

A modern, interactive family tree visualization application built with React, TypeScript, and cutting-edge web technologies.

## 🚀 Features

### Core Functionality
- **Interactive Family Tree Visualization** - Drag-and-drop interface with smooth animations
- **Rich Person Profiles** - Comprehensive information including photos, biography, contact details
- **Multiple Layout Options** - Hierarchical, circular, grid, and radial layouts
- **Advanced Search & Filtering** - Find family members by name, gender, status, or other criteria
- **Export & Import** - Save and share family tree data as JSON
- **Responsive Design** - Works seamlessly on desktop and mobile devices

### Visual Features
- **Dark/Light Mode** - Toggle between themes for comfortable viewing
- **Animated Transitions** - Smooth animations and micro-interactions
- **Multiple View Modes** - Normal and full-image node displays
- **Statistics Dashboard** - Family insights and demographics
- **Fullscreen Mode** - Immersive viewing experience

### Technical Features
- **Type-Safe** - Full TypeScript implementation with strict typing
- **Modular Architecture** - Clean separation of concerns with atomic design
- **State Management** - Efficient state handling with Zustand
- **Error Boundaries** - Graceful error handling and recovery
- **Performance Optimized** - Memoization and lazy loading

## 🏗️ Architecture

### Folder Structure
```
src/
├── components/          # UI Components (Atomic Design)
│   ├── atoms/          # Basic building blocks
│   ├── molecules/      # Component combinations
│   ├── organisms/      # Complex UI sections
│   ├── templates/      # Page layouts
│   └── pages/          # Full page components
├── hooks/              # Custom React hooks
├── stores/             # Zustand state stores
├── services/           # Business logic layer
├── contexts/           # React contexts
├── types/              # TypeScript definitions
├── constants/          # Application constants
└── utils/              # Utility functions
```

### Design Patterns
- **Atomic Design** - Hierarchical component organization
- **Custom Hooks** - Reusable stateful logic
- **Service Layer** - Business logic separation
- **Context Providers** - Global state management
- **Error Boundaries** - Fault tolerance

## 🛠️ Technology Stack

### Core Technologies
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework

### State Management
- **Zustand** - Lightweight state management
- **React Context** - Theme and UI state

### Visualization
- **React Flow** - Interactive node-based graphs
- **Framer Motion** - Smooth animations
- **Dagre** - Automatic graph layout

### UI Components
- **shadcn/ui** - Modern component library
- **Radix UI** - Accessible primitives
- **Lucide React** - Beautiful icons

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <repository-url>

# Navigate to project directory
cd family-tree-visualizer

# Install dependencies
npm install

# Start development server
npm run dev
```

### Building for Production
```bash
# Build the application
npm run build

# Preview the build
npm run preview
```

## 📖 Usage Guide

### Adding Family Members
1. Click the "Add Person" button
2. Fill in basic information (name, gender, etc.)
3. Add personal details (birth date, occupation, biography)
4. Include contact information if desired
5. Connect to existing family members by selecting relationships

### Navigation
- **Click** nodes to view detailed information
- **Drag** nodes to reposition them
- **Search** using the search bar to find specific members
- **Filter** by gender, status, or other criteria
- **Change layouts** for different visualization styles

### Data Management
- **Export** your family tree as JSON for backup
- **Import** previously exported data
- **Share** via generated links
- **Statistics** panel shows family insights

## 🎨 Customization

### Themes
The application supports both light and dark themes with automatic system preference detection.

### Layouts
Choose from multiple layout algorithms:
- **Hierarchical** - Traditional family tree structure
- **Circular** - Members arranged in a circle
- **Grid** - Organized grid layout
- **Radial** - Radial distribution from center

### View Modes
- **Normal** - Compact cards with essential information
- **Full Image** - Larger image-focused display

## 🔧 Development

### Code Style
- **ESLint** - Code linting and formatting
- **TypeScript** - Strict type checking
- **Prettier** - Code formatting (via editor)

### Testing
```bash
# Run linting
npm run lint
```

### Project Structure Guidelines
- Components follow atomic design principles
- Business logic is separated into services
- Types are centrally defined
- Constants are organized by domain
- Utilities are pure functions

## 📝 API Reference

### Core Hooks

#### `useFamilyTree()`
Main hook for family tree operations.

```typescript
const {
  people,           // Array of family members
  addPerson,        // Add new family member
  updatePerson,     // Update existing member
  removePerson,     // Remove family member
  exportData,       // Export tree data
  importData,       // Import tree data
  // ... more methods
} = useFamilyTree();
```

#### `usePersonForm()`
Hook for managing person form state.

```typescript
const {
  formData,         // Current form data
  updateField,      // Update form field
  handleSubmit,     // Submit form
  errors,           // Validation errors
  // ... more properties
} = usePersonForm({ onSubmit, onCancel });
```

### Services

#### `FamilyTreeService`
Business logic for family tree operations.

#### `LayoutService`
Graph layout calculations and algorithms.

#### `ExportService`
Data export and import functionality.

#### `ValidationService`
Form and data validation.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow the established architecture patterns
- Write TypeScript with strict typing
- Add JSDoc comments for public APIs
- Ensure components are accessible
- Test your changes thoroughly

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **React Flow** - For the excellent graph visualization library
- **shadcn/ui** - For the beautiful component library
- **Tailwind CSS** - For the utility-first CSS framework
- **Zustand** - For the simple state management solution

## 📞 Support

For support, please open an issue on the GitHub repository or contact the development team.

---

Built with ❤️ using modern web technologies for creating beautiful family trees.
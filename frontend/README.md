# New Gate Chapel Website

A modern, responsive church website built with React, Vite, and Bootstrap.

## Features

- **Responsive Design**: Mobile-first design that works on all devices
- **Modern UI**: Clean, professional design with custom branding
- **React Icons**: Beautiful icons throughout the site
- **Bootstrap Integration**: Consistent styling and responsive components
- **Multiple Pages**: Home, About, Services, Sermons, Events, Ministries, Giving, and Contact
- **Contact Form**: Interactive contact form for visitor inquiries
- **Service Information**: Clear information about service times and what to expect

## Technology Stack

- **React 18**: Modern React with hooks
- **Vite**: Fast build tool and development server
- **React Bootstrap**: Bootstrap components for React
- **React Router**: Client-side routing
- **React Icons**: Icon library with Font Awesome icons
- **SCSS**: Custom styling with Sass
- **Bootstrap 5**: Responsive CSS framework

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository or download the files
2. Navigate to the project directory
3. Install dependencies:
   ```bash
   npm install
   ```

### Development

To start the development server:

```bash
npm run dev
```

The site will be available at `http://localhost:5173`

### Building for Production

To build the project for production:

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── Header.jsx      # Navigation header
│   ├── Footer.jsx      # Site footer
│   ├── Hero.jsx        # Hero section component
│   ├── Button.jsx      # Custom button component
│   └── CardComponent.jsx # Reusable card component
├── pages/              # Page components
│   ├── Home.jsx        # Homepage
│   ├── About.jsx       # About page
│   ├── Services.jsx    # Visit Us/Services page
│   ├── Sermons.jsx     # Sermons archive
│   ├── Events.jsx      # Events calendar
│   ├── Ministries.jsx  # Ministry information
│   ├── Giving.jsx      # Giving/donations page
│   └── Contact.jsx     # Contact information and form
├── assets/
│   └── scss/
│       └── custom.scss # Custom styles and Bootstrap overrides
├── App.jsx             # Main app component with routing
└── main.jsx           # Application entry point
```

## Customization

### Brand Colors

The site uses custom brand colors defined in `src/assets/scss/custom.scss`:

- **Primary (Blue)**: `#1e3a8a`
- **Secondary (Purple)**: `#7c3aed`
- **Accent (Red)**: `#dc2626`

### Content Updates

To update church-specific content:

1. **Contact Information**: Update in `src/pages/Contact.jsx` and `src/components/Footer.jsx`
2. **Service Times**: Update in `src/pages/Home.jsx`, `src/pages/Services.jsx`, and `src/components/Footer.jsx`
3. **Church Name**: Update in `src/components/Header.jsx` and throughout the site
4. **About Information**: Update in `src/pages/About.jsx`

### Adding Images

Place images in the `public` directory and reference them with `/image-name.jpg` in your components.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Browser Support

This website supports all modern browsers including:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Make your changes
2. Test thoroughly on different screen sizes
3. Ensure all links and forms work correctly
4. Update documentation if needed

## License

This project is created for New Gate Chapel. All rights reserved.

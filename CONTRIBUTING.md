# Contributing to FiveM Viewer

Thank you for your interest in contributing to FiveM Viewer! We welcome contributions from everyone. By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).

## How to Contribute

### 🐛 Reporting Bugs

If you find a bug, please create an issue with the following information:

- **Title**: A clear, descriptive title
- **Description**: Detailed description of the bug
- **Steps to reproduce**: Step-by-step instructions
- **Expected behavior**: What should happen
- **Actual behavior**: What actually happens
- **Environment**: Browser, OS, Node.js version
- **Screenshots**: If applicable

### 💡 Suggesting Features

Feature requests are welcome! Please create an issue with:

- **Title**: A clear, descriptive title
- **Description**: Detailed description of the proposed feature
- **Use case**: Why this feature would be useful
- **Alternatives**: Any alternative solutions you've considered

### 🛠️ Contributing Code

#### Development Setup

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/soydex/fivem-viewer.git
   cd fivem-viewer
   ```
3. **Install dependencies**:
   ```bash
   pnpm install
   ```
4. **Start development server**:
   ```bash
   pnpm dev
   ```

#### Development Workflow

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following our coding standards

3. **Test your changes**:
   ```bash
   pnpm build
   pnpm lint
   ```

4. **Commit your changes**:
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request** on GitHub

#### Coding Standards

- **TypeScript**: Strict type checking enabled
- **ESLint**: Follow the configured linting rules
- **Prettier**: Code formatting will be handled automatically
- **React**: Use functional components with hooks
- **Naming**: Use descriptive, camelCase naming conventions

#### Commit Messages

We follow conventional commit format:

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

Example: `feat: add dark mode toggle`

### 📚 Documentation

- Update README.md for new features
- Add JSDoc comments for new functions
- Update API documentation if endpoints change

### 🧪 Testing

- Test your changes in multiple browsers
- Test on both desktop and mobile
- Verify that existing functionality still works
- Test edge cases and error conditions

### 🎨 Design Guidelines

- Follow the existing TailwindCSS patterns
- Maintain responsive design principles
- Ensure accessibility (WCAG guidelines)
- Use consistent color schemes and spacing

## Project Structure

```
src/
├── components/          # Reusable UI components
├── hooks/              # Custom React hooks
├── pages/              # Page components
├── utils.ts            # Utility functions
└── main.tsx            # Application entry point
```

## Pull Request Process

1. **Update the README.md** with details of changes if needed
2. **Update the version** in package.json following semantic versioning
3. **Ensure all tests pass** and linting is clean
4. **Get approval** from maintainers
5. **Merge** your PR

## Recognition

Contributors will be acknowledged in the README.md and potentially featured in release notes.

## Questions?

If you have questions about contributing, feel free to:

- Open a GitHub Discussion
- Contact the maintainers directly

Thank you for contributing to FiveM Viewer ! 🎮✨
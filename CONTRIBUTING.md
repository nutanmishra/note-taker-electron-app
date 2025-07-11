# Contributing to NoteTaker

Thank you for your interest in contributing to NoteTaker! This project is open to contributions, and we welcome bug fixes, feature additions, documentation improvements, and more. This document outlines the process for contributing to ensure a smooth and collaborative experience.

## Getting Started

1. **Fork the Repository**:

   - Fork the repository on GitHub: `https://github.com/nutanmishra/note-taker`.
   - Clone your fork:
     ```bash
     git clone https://github.com/nutanmishra/note-taker.git
     cd note-taker
     ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Run the App**:
   ```bash
   npm start
   ```
   This launches NoteTaker with DevTools open for debugging.

## Development Environment

- **Node.js**: v16 or higher
- **npm**: Included with Node.js
- **Code Editor**: VS Code recommended
- **Electron**: v32.1.2
- **Tailwind CSS**: v2.2.19 (via CDN)
- **fs-extra**: For file system operations

## Contribution Workflow

1. **Create an Issue**:

   - Check the [Issues](https://github.com/nutanmishra/note-taker/issues) tab for existing issues.
   - Use the provided issue templates:
     - **Bug Report**: For reporting bugs (`.github/ISSUE_TEMPLATE/bug_report.md`).
     - **Feature Request**: For suggesting new features (`.github/ISSUE_TEMPLATE/feature_request.md`).
   - If no template fits, create a new issue with a clear description.

2. **Create a Branch**:

   - Create a branch for your changes:
     ```bash
     git checkout -b feature/<your-feature-name>
     ```
     Example: `git checkout -b feature/add-dark-mode`

3. **Make Changes**:

   - Follow the project structure:
     - `main.js`: Electron main process (file system, IPC).
     - `preload.js`: Secure IPC communication.
     - `renderer.js`: UI logic.
     - `index.html`: UI structure.
     - `styles.css`: Custom CSS for Tailwind.
   - Maintain security practices (e.g., `contextIsolation: true`, CSP).
   - Add tests if applicable (see "Testing" below).

4. **Test Your Changes**:

   - Run `npm start` and test the app.
   - Verify saving/deleting notes and UI rendering.
   - Check DevTools console for errors.
   - Ensure `notes.json` updates correctly in the `userData` directory.

5. **Commit Changes**:

   - Use clear, descriptive commit messages:
     ```bash
     git commit -m "Add dark mode toggle to UI"
     ```

6. **Push and Create a Pull Request**:

   - Push your branch:
     ```bash
     git push origin feature/<your-feature-name>
     ```
   - Open a Pull Request (PR) on GitHub, referencing the related issue.
   - Describe your changes in the PR description.

7. **Code Review**:
   - Respond to feedback and make necessary changes.
   - Ensure your code adheres to the project's style and security guidelines.

## Coding Guidelines

- **JavaScript**:
  - Use ES6+ syntax.
  - Follow consistent formatting (use Prettier or similar).
- **UI**:
  - Use Tailwind CSS classes for styling.
  - Add custom styles in `styles.css` for animations or overrides.
- **Security**:
  - Maintain `contextIsolation: true` and `nodeIntegration: false` in `main.js`.
  - Ensure the CSP in `index.html` restricts scripts/styles to `'self'` and `https://cdn.jsdelivr.net`.
- **File System**:
  - Use `fs-extra` for file operations.
  - Store notes in `notes.json` in the `userData` directory.

## Testing

- **Manual Testing**:
  - Test saving, deleting, and loading notes.
  - Verify UI responsiveness on different screen sizes.
  - Check console logs for errors.
- **Future Test Suite**:
  - Contributions to add automated tests (e.g., Jest, Mocha) are welcome.
  - Focus on testing IPC communication and file operations.

## Reporting Bugs

- Use the [Bug Report template](.github/ISSUE_TEMPLATE/bug_report.md) in the Issues tab.
- Provide:
  - A clear description of the bug.
  - Steps to reproduce.
  - Expected vs. actual behavior.
  - Screenshots or console logs if applicable.

## Suggesting Features

- Use the [Feature Request template](.github/ISSUE_TEMPLATE/feature_request.md) in the Issues tab.
- Describe the feature, its use case, and potential implementation.

## Questions?

Feel free to open an issue or contact the maintainer at [Your Email].

Thank you for contributing to NoteTaker! 🚀

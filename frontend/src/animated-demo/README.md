# Animated Demo Feature

This directory contains the implementation of the animated demonstration feature for the MenoX website hero section.

## Directory Structure

```
src/animated-demo/
├── config/           # Configuration files
│   └── animation-config.js
├── core/            # Core animation components (state machine, controller)
├── utils/           # Utility modules (timing, DOM manipulation, lifecycle)
└── README.md
```

## Configuration

The animation configuration is defined in `config/animation-config.js` and includes:

- **Timing values**: Duration and delays for each animation step (in milliseconds)
- **CSS class names**: Classes applied during different animation states
- **DOM selectors**: Selectors for finding animation target elements
- **Feature flags**: Enable/disable specific features (auto-start, reduced motion, etc.)

### Example Usage

```javascript
import { animationConfig, createConfig } from './config/animation-config.js';

// Use default configuration
console.log(animationConfig.timing.selectionDuration); // 600

// Create custom configuration
const customConfig = createConfig({
  timing: {
    selectionDuration: 800,
    loopDelay: 3000,
  },
  features: {
    enablePerformanceMonitoring: true,
  },
});
```

## Testing

The project uses Jest for unit testing and fast-check for property-based testing.

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run only unit tests
npm run test:unit

# Run only property-based tests
npm run test:property
```

### Test Organization

```
tests/
├── config/          # Configuration tests
├── unit/            # Unit tests for individual components
├── property/        # Property-based tests
├── integration/     # Integration tests
└── setup.js         # Test setup and global mocks
```

## Development

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

### Setup

```bash
# Install dependencies
npm install

# Run tests
npm test

# Start development server
npm run dev
```

## Architecture

The animated demo follows a state machine pattern:

1. **Animation Controller**: Orchestrates the animation sequence
2. **State Machine**: Manages state transitions and timing
3. **Timing Manager**: Handles requestAnimationFrame and delays
4. **DOM Manipulator**: Encapsulates DOM interactions
5. **Lifecycle Manager**: Handles browser events (visibility, reduced motion)

## Requirements

This implementation satisfies:
- Requirement 1.1: Animation initialization within 500ms
- Requirement 8.3: Non-blocking initialization (<50ms main thread)

See `.kiro/specs/animated-demo/requirements.md` for full requirements.

## Next Steps

1. Implement Timing Manager utility (Task 2)
2. Implement DOM Manipulator (Task 3)
3. Implement State Machine (Task 5)
4. Implement Lifecycle Manager (Task 6)
5. Implement Animation Controller (Task 8)

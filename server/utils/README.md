# Chat Utility Components

This directory contains reusable utility components for the chat functionality.

## Components

### 1. detectIntent.ts

**Purpose**: Analyzes user messages to determine their intent.

**Exports**:

- `detectIntent(message: string): Promise<IntentType>` - Rule-based intent detection
- `detectIntentWithAI(message: string): Promise<IntentType>` - AI-powered intent detection
- `IntentType` - Type definition for intent categories

**Intent Categories**:

- `"issue"` - Problems, errors, complaints
- `"request"` - Requests for mentors, help, services
- `"help"` - Questions, guidance, assistance
- `"other"` - General conversation, greetings

**Usage**:

```typescript
import { detectIntent } from "../utils";

const intent = await detectIntent(
  "Надад python сурахад туслах ментор хэрэгтэй байна."
);
// Returns: "request"
```

### 2. getAiReply.ts

**Purpose**: Generates AI responses based on user messages and context.

**Exports**:

- `getAiReply(message, intent?, studentProfile?, mentors?): Promise<string>` - Main response generator
- `getSimpleResponse(message: string): string` - Simple rule-based response
- `StudentProfile` - Interface for student information
- `MentorInfo` - Interface for mentor information

**Features**:

- AI-powered responses when OpenAI API is available
- Rule-based fallback responses
- Context-aware responses using student profile and mentor data
- Mongolian language support

**Usage**:

```typescript
import { getAiReply } from "../utils";

const response = await getAiReply(
  "Надад python сурахад туслах ментор хэрэгтэй байна.",
  "request",
  studentProfile,
  mentors
);
```

### 3. index.ts

**Purpose**: Central export file for all utilities.

**Exports**: All functions and types from both components.

**Usage**:

```typescript
import { detectIntent, getAiReply, type IntentType } from "../utils";
```

## Integration with Chat Controller

The chat controller (`chat-create.ts`) has been updated to use these components:

```typescript
import {
  detectIntent,
  getAiReply,
  type IntentType,
  type StudentProfile,
  type MentorInfo,
} from "../utils";

// In createMessage function:
const intent = await detectIntent(message);
const aiReply = await getAiReply(message, intent, finalStudentProfile, mentors);
```

## Benefits

1. **Modularity**: Functions are separated into reusable components
2. **Type Safety**: Full TypeScript support with proper interfaces
3. **Maintainability**: Easier to update and test individual components
4. **Flexibility**: Can use rule-based or AI-powered detection
5. **Consistency**: Centralized logic for intent detection and response generation

## Testing

Use the test file to verify component functionality:

```typescript
import { testComponents } from "./utils/test-components";

await testComponents();
```

## Future Enhancements

- Add more sophisticated intent detection patterns
- Implement caching for AI responses
- Add support for multiple languages
- Create more specialized response templates

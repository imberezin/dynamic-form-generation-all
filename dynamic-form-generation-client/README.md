# Dynamic Form Generation System

A modern React application for dynamically generating forms from JSON schemas with validation, submission handling, and submission history display. This implementation uses the `useReducer` pattern for state management, providing a scalable and maintainable approach for complex form state management.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Project Structure](#project-structure)
- [State Management Architecture](#state-management-architecture)
- [Installation](#installation)
- [Usage](#usage)
- [Technical Implementation](#technical-implementation)
- [API Endpoints](#api-endpoints)
- [Future Enhancements](#future-enhancements)

## Overview

This application consists of a React frontend and a Node.js backend with database storage. It allows users to:

- Create and upload form schemas via JSON or file upload
- Generate forms dynamically based on the schema
- Validate form inputs according to schema rules
- Submit form data to an API
- View submission history

The application is built with a focus on clean architecture, maintainable code, and scalable state management.

## Features

### Dynamic Form Generation

- Forms are generated based on JSON schemas that define fields, types, and validation rules
- Supports multiple field types: text, email, password, date, number, select
- Material UI components for a modern, responsive UI

### Schema Management

- Upload schemas via JSON text input
- Upload schemas via JSON file upload
- Schema validation before submission

### Form Validation

- Client-side validation based on schema rules
- Real-time field validation on blur
- Form-level validation on submission

### State Management

- Centralized state management using the `useReducer` pattern
- Separate reducer files for different concerns
- Action creators for type-safe dispatching

### Form Submission

- Submit validated form data to the API
- Loading indicators during submission
- Success/error notifications
- Form reset functionality

### Submission History

- View all previous form submissions
- Real-time updates after new submissions

## Project Structure

```
src/
├── components/
│   ├── DynamicForm.js        # Main form component
│   ├── SchemaUploader.js     # Schema upload component
│   ├── SelectFormView.js     # Select field renderer
│   ├── SubmissionsView.js    # Previous submissions display
│   └── TextFieldForm.js      # Text input field renderer
├── reducers/
│   ├── formReducer.js        # Form state management
│   ├── schemaReducer.js      # Schema uploader state management
│   ├── appReducer.js         # App-level state management
│   └── index.js              # Exports all reducers and actions
├── hooks/
│   └── useFetch.js           # Custom fetch hook
├── services/
│   └── Api.js                # API service layer
├── utils/
│   └── validation.js         # Form validation utilities
├── App.js                    # Main application
└── index.js                  # Application entry point
```

## State Management Architecture

This project implements a robust state management pattern using React's `useReducer` hook and separate reducer files:

### Reducer Structure

Each reducer file follows this pattern:

1. **Initial State**: Defines and documents all state properties
2. **Action Types**: Constants for all possible actions
3. **Reducer Function**: Pure function that handles state transitions
4. **Action Creators**: Functions that create properly formatted actions

### Benefits of This Approach

- **Maintainability**: State logic is centralized in reducers
- **Predictability**: State transitions are explicit and follow a consistent pattern
- **Debugging**: Easier to track state changes by logging actions
- **Performance**: Batch-updates related state changes
- **Scalability**: Pattern scales better as components grow in complexity
- **Testability**: Pure reducer functions are easy to test

## Installation

### Prerequisites

- Node.js (v14+)
- NPM or Yarn

### Frontend Setup

1. Clone the repository

```
git clone <repository-url>
cd dynamic-form-system
```

2. Install dependencies

```
npm install
```

3. Start the development server

```
npm start
```

4. Access the application at http://localhost:3000

### Backend Setup

1. Navigate to the server directory

```
cd server
```

2. Install dependencies

```
npm install
```

3. Set up environment variables
   Create a `.env` file with your database credentials.

4. Start the server

```
npm start
```

## Usage

### Creating a Form Schema

A form schema is a JSON object that defines the structure of the form:

```json
{
  "title": "User Registration",
  "fields": [
    {
      "name": "username",
      "label": "Username",
      "type": "text",
      "required": true,
      "minLength": 2
    },
    { "name": "email", "label": "Email", "type": "email", "required": true },
    {
      "name": "password",
      "label": "Password",
      "type": "password",
      "required": true,
      "minLength": 6
    },
    {
      "name": "birthdate",
      "label": "Birthdate",
      "type": "date",
      "required": true
    },
    {
      "name": "gender",
      "label": "Gender",
      "type": "select",
      "options": ["Male", "Female", "Other"],
      "required": true
    }
  ]
}
```

You can upload this schema either by:

1. Pasting it into the JSON input field
2. Saving it as a .json file and uploading it

### Form Submission

Once a form is generated, you can:

1. Fill in the required fields
2. Submit the form using the Submit button
3. Reset the form using the Reset button
4. View submission results in the Submissions panel

## Technical Implementation

### API Service Layer

The application uses a dedicated API service layer that:

- Centralizes all API calls
- Provides consistent error handling
- Separates concerns by service type (schema, submission)

```javascript
// Example API usage
import { schemaService, submissionService } from "../services/Api";

// Get active schema
const schema = await schemaService.getActiveSchema();

// Submit form data
await submissionService.createSubmission(formTitle, formData);
```

### useReducer Pattern Implementation

Components use the `useReducer` pattern for state management:

```javascript
// Import reducer and action creators
import formReducer, {
  initialState,
  formActions,
} from "../reducers/formReducer";

// Use reducer
const [state, dispatch] = useReducer(formReducer, initialState);

// Dispatch actions using action creators
dispatch(formActions.updateField(name, value));
```

### Custom useFetch Hook

A custom `useFetch` hook is used to:

- Handle API requests
- Manage loading states
- Handle errors
- Provide a clean interface for components

```javascript
// Example useFetch usage
const { formData, loading, error, setOptions } = useFetch({
  service: "schema",
  endpoint: "getActive",
});
```

### Form Validation

Validation is managed through a utility that:

- Generates validation schemas from form definitions
- Validates entire forms or single fields
- Provides consistent error messages

## API Endpoints

### Schemas

- `GET /api/schemas/active` - Get the active form schema
- `POST /api/schemas` - Create a new form schema
- `POST /api/upload/schema` - Upload a schema file

### Submissions

- `GET /api/submissions` - Get all form submissions
- `POST /api/submissions` - Create a new form submission
- `GET /api/submissions/:id` - Get a specific submission

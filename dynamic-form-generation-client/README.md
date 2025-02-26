# Dynamic Form Generation System

A full-stack web application for dynamically generating forms from JSON schemas, with validation, submission handling, and submission history display.

## Overview

This application consists of a React frontend and a Node.js backend with MySQL database. It allows users to:

- Create and upload form schemas via JSON or file upload
- Generate forms dynamically based on the schema
- Validate form inputs according to schema rules
- Submit form data
- View submission history

## Project Structure

```
src/
├── components/
│   ├── DynamicForm.js      # Main form component
│   ├── SchemaUploader.js   # Schema upload component
│   ├── SelectFormView.js   # Select field renderer
│   ├── SubmissionsView.js  # Previous submissions display
│   └── TextFieldForm.js    # Text input field renderer
├── hooks/
│   └── useFetch.js         # Custom fetch hook
├── services/
│   └── api.js              # API service layer
├── utils/
│   └── validation.js       # Form validation utilities
├── App.js                  # Main application
└── index.js                # Application entry point
```

## Features

### Dynamic Form Generation

- Forms are generated based on JSON schemas that define fields, types, and validation rules
- Supports multiple field types: text, email, password, date, number, select

### Schema Management

- Upload schemas via JSON text or file upload
- Switch between schemas easily

### Validation

- Client-side validation using Yup
- Validation rules are derived from the schema
- Real-time field validation on blur
- Form-level validation on submission

### Form Submission

- Submit validated form data to the server
- View submission status and errors
- Reset form after submission

### Submission History

- View all previous form submissions
- Display formatted submission data

## Technical Implementation

### API Service Layer

The application uses a dedicated API service layer that:

- Centralizes all API calls
- Provides consistent error handling
- Separates concerns by service type (schema, submission)

```javascript
// Example API usage
import { schemaService, submissionService } from "../services/api";

// Get active schema
const schema = await schemaService.getActiveSchema();

// Submit form data
await submissionService.createSubmission(formTitle, formData);
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

- Generates Yup validation schemas from form definitions
- Validates entire forms or single fields
- Provides consistent error messages

```javascript
// Example validation
const schema = generateValidationSchema(fields);
const result = await validateForm(schema, formValues);
```

## Installation and Setup

### Prerequisites

- Node.js (v14+)
- MySQL database

### Backend Setup

1. Clone the repository

```
git clone <repository-url>
cd dynamic-form-system
```

2. Install dependencies

```
cd server
npm install
```

3. Set up environment variables
   Create a `.env` file with your database credentials and server configuration.

4. Start the server

```
npm start
```

### Frontend Setup

1. Install dependencies

```
cd client
npm install
```

2. Start the development server

```
npm start
```

3. Access the application at http://localhost:3000

## API Endpoints

### Schemas

- `GET /api/schemas/active` - Get the active form schema
- `POST /api/schemas` - Create a new form schema
- `POST /api/upload/schema` - Upload a schema file

### Submissions

- `GET /api/submissions` - Get all form submissions
- `POST /api/submissions` - Create a new form submission
- `GET /api/submissions/:id` - Get a specific submission

## Future Enhancements

- User authentication
- Schema versioning
- More field types (file uploads, rich text, etc.)
- Advanced validation rules
- Form analytics
- Export of submissions to CSV/Excel

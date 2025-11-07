# Supabase Data Flow - Frontend Only Architecture

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         React Frontend                           │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Contact Form Component (App.tsx)                        │  │
│  │  - requestType: 'virtual-call' | 'task-request'          │  │
│  │  - email: string                                         │  │
│  │  - name: string                                          │  │
│  │  - message: string                                       │  │
│  └──────────────────┬───────────────────────────────────────┘  │
│                     │ POST Request                              │
│                     ▼                                           │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Supabase Client                                         │  │
│  │  - Uses anon/public key                                  │  │
│  │  - Direct HTTP API calls                                 │  │
│  └──────────────────┬───────────────────────────────────────┘  │
└─────────────────────┼───────────────────────────────────────────┘
                      │ HTTPS
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Supabase Data API                             │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Row Level Security (RLS) Policies                       │  │
│  │  - Allow INSERT for anon role                            │  │
│  │  - Block SELECT for anon role                            │  │
│  └──────────────────┬───────────────────────────────────────┘  │
│                     │                                           │
│                     ▼                                           │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  PostgreSQL Database                                     │  │
│  │  Table: contact_submissions                              │  │
│  │  - id (uuid, auto-generated)                             │  │
│  │  - request_type (text)                                   │  │
│  │  - email (text)                                          │  │
│  │  - name (text)                                           │  │
│  │  - message (text)                                        │  │
│  │  - created_at (timestamp, auto)                          │  │
│  │  - status (text, default: 'pending')                     │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Data Model

### Database Schema: `contact_submissions`

```sql
-- Create the contact_submissions table
CREATE TABLE public.contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  request_type TEXT NOT NULL CHECK (request_type IN ('virtual-call', 'task-request')),
  email TEXT NOT NULL,
  name TEXT,
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'read', 'replied', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_contact_submissions_created_at ON public.contact_submissions(created_at DESC);
CREATE INDEX idx_contact_submissions_status ON public.contact_submissions(status);
CREATE INDEX idx_contact_submissions_email ON public.contact_submissions(email);

-- Enable Row Level Security
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Allow anonymous users to INSERT
CREATE POLICY "Allow anonymous inserts"
ON public.contact_submissions
FOR INSERT
TO anon
WITH CHECK (true);

-- RLS Policy: Allow authenticated users to SELECT (for admin panel later)
CREATE POLICY "Allow authenticated selects"
ON public.contact_submissions
FOR SELECT
TO authenticated
USING (true);

-- RLS Policy: Block anonymous SELECT (prevent data leakage)
CREATE POLICY "Block anonymous selects"
ON public.contact_submissions
FOR SELECT
TO anon
USING (false);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to auto-update updated_at
CREATE TRIGGER update_contact_submissions_updated_at
    BEFORE UPDATE ON public.contact_submissions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

## Data Flow Details

### 1. Frontend Form State

**Location:** `src/App.tsx`

```typescript
interface FormData {
  requestType: 'virtual-call' | 'task-request' | ''
  email: string
  name: string
  message: string
}
```

### 2. Data Transformation

**Before sending to Supabase:**
```typescript
{
  requestType: 'virtual-call',
  email: 'user@example.com',
  name: 'John Doe',
  message: 'I would like to schedule a call...'
}
```

**Transformed for Supabase (snake_case):**
```typescript
{
  request_type: 'virtual-call',
  email: 'user@example.com',
  name: 'John Doe',
  message: 'I would like to schedule a call...'
}
```

### 3. Supabase API Request

**Endpoint:** `POST https://{project-ref}.supabase.co/rest/v1/contact_submissions`

**Headers:**
```typescript
{
  'apikey': 'your-anon-public-key',
  'Authorization': 'Bearer your-anon-public-key',
  'Content-Type': 'application/json',
  'Prefer': 'return=representation' // Optional: returns inserted row
}
```

**Body:**
```json
{
  "request_type": "virtual-call",
  "email": "user@example.com",
  "name": "John Doe",
  "message": "I would like to schedule a call..."
}
```

### 4. Database Response

**Success Response (201 Created):**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "request_type": "virtual-call",
    "email": "user@example.com",
    "name": "John Doe",
    "message": "I would like to schedule a call...",
    "status": "pending",
    "created_at": "2024-01-15T10:30:00.000Z",
    "updated_at": "2024-01-15T10:30:00.000Z"
  }
]
```

**Error Response (400/401/500):**
```json
{
  "message": "Error message",
  "details": "Detailed error information",
  "hint": "Helpful hint",
  "code": "error_code"
}
```

## Security Flow

### Request Journey

1. **User fills form** → React state updates
2. **Form submission** → Validation happens client-side
3. **Supabase client** → Adds API key to headers
4. **Supabase API** → Validates API key
5. **RLS Policy Check** → Verifies INSERT permission for anon role
6. **Data Validation** → PostgreSQL constraints checked
7. **Insert Operation** → Data written to database
8. **Response** → Success/error returned to frontend

### Security Layers

1. **API Key Authentication** - Supabase validates the anon key
2. **Row Level Security** - RLS policies enforce permissions
3. **Database Constraints** - CHECK constraints validate data
4. **HTTPS** - All traffic encrypted
5. **Input Validation** - Client and server-side validation

## Data Validation Rules

### Client-Side (React)
- ✅ `requestType`: Must be 'virtual-call' or 'task-request'
- ✅ `email`: Must be valid email format (HTML5 validation + regex)
- ✅ `name`: Optional, max 200 characters
- ✅ `message`: Optional, max 5000 characters

### Server-Side (PostgreSQL)
- ✅ `request_type`: CHECK constraint ensures valid values
- ✅ `email`: NOT NULL, should add email format validation
- ✅ `status`: Default 'pending', CHECK constraint
- ✅ `created_at`: Auto-generated timestamp

## Environment Variables

```env
# .env.local (never commit this file)
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key-here
```

## Error Handling Scenarios

### Scenario 1: Network Error
```typescript
try {
  await supabase.from('contact_submissions').insert(data)
} catch (error) {
  // Network failure, API down, etc.
  showError('Network error. Please try again.')
}
```

### Scenario 2: Validation Error
```typescript
// RLS policy violation or constraint error
{
  code: '23505', // Unique constraint violation
  message: 'duplicate key value violates unique constraint'
}
```

### Scenario 3: Rate Limiting
```typescript
// Too many requests
{
  code: '429',
  message: 'Too many requests'
}
```

## Next Steps After Implementation

1. **Monitoring** - Set up Supabase dashboard alerts
2. **Admin Panel** - Build authenticated admin view (future)
3. **Email Notifications** - Set up Supabase Edge Functions (future)
4. **Analytics** - Track submission rates
5. **Spam Protection** - Add rate limiting or CAPTCHA (future)


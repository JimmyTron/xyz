# Data Flow Diagram - Contact Form to Supabase

## Complete Data Journey

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           USER INTERACTION                              │
│                                                                          │
│  1. User clicks "LET'S GET TO WORK" or "CONTACT NOW"                    │
│  2. Modal opens with contact form                                       │
│  3. User fills in:                                                      │
│     - Request Type: "Virtual Call" or "Task Request" (required)         │
│     - Email: "user@example.com" (required)                              │
│     - Name: "John Doe" (optional)                                       │
│     - Message: "I'd like to discuss..." (optional)                      │
│  4. User clicks "Send Request"                                          │
└────────────────────────────┬────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      REACT COMPONENT (App.tsx)                          │
│                                                                          │
│  State:                                                                  │
│  ┌──────────────────────────────────────────────────────────────┐      │
│  │ formData: {                                                   │      │
│  │   requestType: 'virtual-call'                                 │      │
│  │   email: 'user@example.com'                                   │      │
│  │   name: 'John Doe'                                            │      │
│  │   message: 'I'd like to discuss...'                           │      │
│  │ }                                                             │      │
│  └──────────────────────────────────────────────────────────────┘      │
│                                                                          │
│  handleSubmit() triggers:                                                │
│  1. ✅ Client-side validation (email format, required fields)           │
│  2. ✅ Sets isSubmitting = true                                         │
│  3. ✅ Calls submitContactForm()                                        │
└────────────────────────────┬────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                  SUPABASE CLIENT (src/lib/supabase.ts)                  │
│                                                                          │
│  submitContactForm() function:                                           │
│                                                                          │
│  1. Transform data (camelCase → snake_case):                            │
│     {                                                                    │
│       requestType → request_type                                         │
│       email → email                                                      │
│       name → name                                                        │
│       message → message                                                  │
│     }                                                                    │
│                                                                          │
│  2. Create Supabase client with:                                         │
│     - URL: VITE_SUPABASE_URL                                             │
│     - Key: VITE_SUPABASE_ANON_KEY                                        │
│                                                                          │
│  3. Execute:                                                             │
│     supabase                                                             │
│       .from('contact_submissions')                                       │
│       .insert([{                                                         │
│         request_type: 'virtual-call',                                    │
│         email: 'user@example.com',                                       │
│         name: 'John Doe',                                                │
│         message: 'I'd like to discuss...'                                │
│       }])                                                                │
│       .select()                                                          │
│       .single()                                                          │
└────────────────────────────┬────────────────────────────────────────────┘
                             │
                             │ HTTPS POST Request
                             │ Headers:
                             │   - apikey: <anon-key>
                             │   - Authorization: Bearer <anon-key>
                             │   - Content-Type: application/json
                             ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    SUPABASE API GATEWAY                                 │
│                                                                          │
│  1. ✅ Validate API key                                                  │
│  2. ✅ Authenticate request (anon role)                                  │
│  3. ✅ Route to Postgres API                                             │
│  4. ✅ Apply Row Level Security (RLS) policies                           │
└────────────────────────────┬────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    ROW LEVEL SECURITY (RLS)                             │
│                                                                          │
│  Policy Check: "Allow anonymous inserts"                                │
│                                                                          │
│  ✅ Role: anon                                                           │
│  ✅ Operation: INSERT                                                    │
│  ✅ Check: WITH CHECK (true) → ALLOWED                                   │
│                                                                          │
│  Policy Check: "Block anonymous selects"                                │
│                                                                          │
│  ❌ Role: anon                                                           │
│  ❌ Operation: SELECT                                                    │
│  ❌ Check: USING (false) → BLOCKED                                       │
│  (Prevents data leakage - users can't read submissions)                 │
└────────────────────────────┬────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    POSTGRESQL DATABASE                                  │
│                                                                          │
│  Table: public.contact_submissions                                      │
│                                                                          │
│  Constraints Check:                                                      │
│  ✅ request_type IN ('virtual-call', 'task-request')                    │
│  ✅ email NOT NULL                                                       │
│  ✅ status DEFAULT 'pending'                                             │
│                                                                          │
│  INSERT Operation:                                                       │
│  ┌──────────────────────────────────────────────────────────────┐      │
│  │ id: gen_random_uuid()                                        │      │
│  │ request_type: 'virtual-call'                                 │      │
│  │ email: 'user@example.com'                                    │      │
│  │ name: 'John Doe'                                             │      │
│  │ message: 'I'd like to discuss...'                            │      │
│  │ status: 'pending' (default)                                  │      │
│  │ created_at: NOW() (auto)                                     │      │
│  │ updated_at: NOW() (auto)                                     │      │
│  └──────────────────────────────────────────────────────────────┘      │
│                                                                          │
│  Trigger: update_updated_at_column()                                    │
│  (Automatically updates updated_at on future updates)                   │
└────────────────────────────┬────────────────────────────────────────────┘
                             │
                             │ Success Response
                             │ HTTP 201 Created
                             ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         API RESPONSE                                    │
│                                                                          │
│  JSON Response:                                                          │
│  [                                                                       │
│    {                                                                     │
│      "id": "550e8400-e29b-41d4-a716-446655440000",                      │
│      "request_type": "virtual-call",                                    │
│      "email": "user@example.com",                                       │
│      "name": "John Doe",                                                │
│      "message": "I'd like to discuss...",                               │
│      "status": "pending",                                               │
│      "created_at": "2024-01-15T10:30:00.000Z",                          │
│      "updated_at": "2024-01-15T10:30:00.000Z"                           │
│    }                                                                    │
│  ]                                                                       │
└────────────────────────────┬────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                  REACT COMPONENT (App.tsx)                              │
│                                                                          │
│  handleSubmit() receives result:                                        │
│                                                                          │
│  1. ✅ result.success === true                                          │
│  2. ✅ Show success alert: "Thank you for your request!"                │
│  3. ✅ Close modal                                                      │
│  4. ✅ Reset form data                                                  │
│  5. ✅ Set isSubmitting = false                                         │
│                                                                          │
│  User sees:                                                              │
│  - Success message                                                       │
│  - Modal closes                                                          │
│  - Form is reset                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

## Error Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        ERROR SCENARIOS                                  │
│                                                                          │
│  Scenario 1: Network Error                                              │
│  ┌──────────────────────────────────────────────────────────────┐      │
│  │ User submits form                                             │      │
│  │ → Network failure / API down                                  │      │
│  │ → Error caught in try/catch                                   │      │
│  │ → submitError: "Network error. Please try again."            │      │
│  │ → User sees error message in form                             │      │
│  └──────────────────────────────────────────────────────────────┘      │
│                                                                          │
│  Scenario 2: Validation Error                                           │
│  ┌──────────────────────────────────────────────────────────────┐      │
│  │ User submits invalid email                                    │      │
│  │ → Client-side validation fails                                │      │
│  │ → submitError: "Please enter a valid email address."         │      │
│  │ → User sees error, can correct and resubmit                   │      │
│  └──────────────────────────────────────────────────────────────┘      │
│                                                                          │
│  Scenario 3: Database Constraint Error                                  │
│  ┌──────────────────────────────────────────────────────────────┐      │
│  │ Invalid request_type sent                                     │      │
│  │ → PostgreSQL CHECK constraint fails                           │      │
│  │ → Error: "new row violates check constraint"                  │      │
│  │ → submitError: "Failed to submit form. Please try again."    │      │
│  │ → Error logged to console for debugging                       │      │
│  └──────────────────────────────────────────────────────────────┘      │
│                                                                          │
│  Scenario 4: RLS Policy Violation                                       │
│  ┌──────────────────────────────────────────────────────────────┐      │
│  │ (Shouldn't happen with current setup)                         │      │
│  │ → RLS policy blocks operation                                 │      │
│  │ → Error: "new row violates row-level security policy"         │      │
│  │ → submitError: "Failed to submit form. Please try again."    │      │
│  └──────────────────────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────────────────┘
```

## Data Structure Mapping

### Frontend → Supabase

| Frontend (camelCase) | Supabase (snake_case) | Type | Required | Notes |
|---------------------|----------------------|------|----------|-------|
| `requestType` | `request_type` | TEXT | ✅ Yes | 'virtual-call' or 'task-request' |
| `email` | `email` | TEXT | ✅ Yes | Valid email format |
| `name` | `name` | TEXT | ❌ No | Optional, max 200 chars |
| `message` | `message` | TEXT | ❌ No | Optional, max 5000 chars |
| - | `id` | UUID | Auto | Generated by database |
| - | `status` | TEXT | Auto | Default: 'pending' |
| - | `created_at` | TIMESTAMPTZ | Auto | Current timestamp |
| - | `updated_at` | TIMESTAMPTZ | Auto | Current timestamp |

## Security Layers

```
┌─────────────────────────────────────────────────────────────┐
│ Layer 1: Client-Side Validation                             │
│ - Email format check                                         │
│ - Required fields check                                      │
│ - Input sanitization                                         │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ Layer 2: HTTPS Encryption                                   │
│ - All API calls encrypted in transit                        │
│ - Prevents man-in-the-middle attacks                        │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ Layer 3: API Key Authentication                             │
│ - Supabase validates anon key                               │
│ - Key tied to project                                        │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ Layer 4: Row Level Security (RLS)                           │
│ - Anonymous users can INSERT only                           │
│ - Anonymous users CANNOT SELECT                             │
│ - Prevents data leakage                                      │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ Layer 5: Database Constraints                               │
│ - CHECK constraints validate data                           │
│ - NOT NULL ensures required fields                          │
│ - Prevents invalid data insertion                           │
└─────────────────────────────────────────────────────────────┘
```

## Setup Checklist

- [ ] Create Supabase project
- [ ] Run `supabase-schema.sql` in Supabase SQL Editor
- [ ] Get API credentials from Supabase dashboard
- [ ] Create `.env.local` file with credentials
- [ ] Install dependencies: `npm install @supabase/supabase-js`
- [ ] Test form submission
- [ ] Verify data in Supabase dashboard
- [ ] Test error handling
- [ ] Set up monitoring/alerts (optional)


# Writing Agent Feature

A floating AI assistant that helps users generate, improve, and fill content across ClientForce.

## Features

- ✍️ **Write from scratch** - Generate emails, proposals, notes, and documents
- ✨ **Improve text** - Enhance clarity, tone, and professionalism
- 📝 **Summarize** - Condense long content into key points
- 📈 **Expand** - Elaborate on brief notes or ideas
- 🎭 **Tone adjustment** - Rewrite in different tones (Formal, Friendly, Persuasive, etc.)
- 🌍 **Translate** - Convert content to different languages
- 🎯 **Smart field mapping** - Auto-fills the right fields using `data-ai-slot` attributes
- ↩️ **One-click undo** - Restore previous values with full snapshots
- 🔒 **Safe & auditable** - Never auto-submits, logs all operations

## Installation

### 1. Run Database Migrations

```bash
cd api
php artisan migrate
```

This creates:
- `writer_drafts` - Stores generated content
- `writer_fill_operations` - Audit trail of field fills
- `writer_settings` - Tenant-level configuration

### 2. Register the Component

In your main Vue app file (e.g., `app.js` or `main.js`):

```javascript
import { FloatingWriterButton } from './features/writer'

// Register globally
Vue.component('FloatingWriterButton', FloatingWriterButton)

// Or use the plugin
import WriterPlugin from './features/writer'
Vue.use(WriterPlugin, { mixin: true })
```

### 3. Add to Your Layout

In your main layout component:

```vue
<template>
  <div id="app">
    <!-- Your app content -->
    
    <!-- Writing Agent (will only show if enabled) -->
    <FloatingWriterButton />
  </div>
</template>
```

### 4. Enable for Tenant

The feature is **disabled by default**. Enable it via:

```php
// In your admin settings or seeder
use App\Models\WriterSettings;

WriterSettings::updateOrCreate(
    ['tenant_id' => $tenantId],
    ['enabled' => true]
);
```

Or create an admin UI toggle in your settings page.

## Usage

### Basic Usage

1. Click the floating purple pen button (bottom-right)
2. Select an intent (Write, Improve, Summarize, etc.)
3. Enter your prompt
4. Adjust tone, length, and format
5. Click "Generate"
6. Review the preview
7. Click "Fill Fields" to auto-fill
8. Use "Undo" if needed

### Field Mapping with `data-ai-slot`

For deterministic field targeting, add `data-ai-slot` attributes:

```vue
<!-- Email composer -->
<input 
  v-model="email.subject" 
  data-ai-slot="email.subject"
  placeholder="Subject"
>

<textarea 
  v-model="email.body" 
  data-ai-slot="email.body"
  placeholder="Message"
></textarea>

<!-- Proposal editor -->
<input 
  v-model="proposal.title" 
  data-ai-slot="proposal.title"
>

<div 
  contenteditable 
  data-ai-slot="proposal.body"
></div>

<!-- Generic note -->
<textarea 
  v-model="note.content" 
  data-ai-slot="note.body"
></textarea>
```

### Blocking Sensitive Fields

Prevent the agent from filling certain fields:

```vue
<!-- Password fields are auto-blocked -->
<input type="password" v-model="password">

<!-- Explicitly block a field -->
<input 
  v-model="apiKey" 
  data-ai-skip
>

<!-- Lock a field from edits -->
<input 
  v-model="userId" 
  data-ai-lock
>
```

### Page Context Variables

The agent automatically gathers:
- Current route name and params
- Selected text on the page
- All `data-ai-slot` elements
- Field labels and placeholders

You can enhance context by adding variables in your components:

```javascript
// In your component
mounted() {
  // The WriterBus will pick up context from the route
  // You can also expose data via Vuex or props
}
```

## API Endpoints

### POST `/api/writer/generate`

Generate content based on intent and context.

**Request:**
```json
{
  "intent": "write|improve|summarize|expand|tone|translate",
  "prompt": "Write a follow-up email...",
  "tone": "Friendly",
  "length": "Medium",
  "target_format": "email",
  "context": {
    "routeName": "campaign-email-edit",
    "selection": "selected text...",
    "slots": [...],
    "variables": {...}
  }
}
```

**Response:**
```json
{
  "parts": {
    "subject": "...",
    "body": "...",
    "intro": "...",
    "bullets": [...],
    "cta": "..."
  },
  "flat": "fallback text",
  "mappingHints": {...},
  "safety": {
    "blocked": false,
    "reasons": []
  },
  "draft_id": 123
}
```

### POST `/api/writer/record-fill`

Record a fill operation for audit trail.

**Request:**
```json
{
  "draft_id": 123,
  "page_url": "https://...",
  "route": "campaign-email-edit",
  "fields_changed": [...],
  "snapshot": [...]
}
```

## Configuration

### Tenant Settings

```php
use App\Models\WriterSettings;

$settings = WriterSettings::forTenant($tenantId);

// Enable/disable
$settings->update(['enabled' => true]);

// Restrict intents
$settings->update([
  'allowed_intents' => ['write', 'improve', 'summarize']
]);

// Restrict formats
$settings->update([
  'allowed_formats' => ['email', 'note']
]);

// Block on specific routes
$settings->update([
  'blocked_routes' => ['admin.settings', 'billing.payment']
]);

// Set brand voice
$settings->update([
  'brand_voice' => [
    'instructions' => 'Always use a professional, consultative tone...'
  ]
]);
```

### LLM Configuration

The service uses your existing Sidecar client. Configure the model in `config/agents.php`:

```php
return [
    'default_model' => env('AGENT_MODEL', 'gpt-4'),
    // ... other settings
];
```

## Architecture

```
Frontend:
  FloatingWriterButton.vue  - Main UI component
  writerBus.js              - DOM manipulation & field targeting
  index.js                  - Plugin registration

Backend:
  WriterController          - API endpoints
  WriterService             - Business logic
  PromptFactory             - Prompt assembly
  
Models:
  WriterDraft               - Generated content
  WriterFillOperation       - Audit trail
  WriterSettings            - Tenant config
```

## Safety & Compliance

- ✅ Never auto-submits forms
- ✅ Requires explicit user click to fill
- ✅ Blocks password/secret fields automatically
- ✅ Full audit trail of all operations
- ✅ One-click undo with snapshots
- ✅ Content safety checks (no PII, prohibited words)
- ✅ Respects `data-ai-skip` and `data-ai-lock` attributes

## Troubleshooting

### Feature not showing

1. Check tenant settings: `WriterSettings::forTenant($id)->enabled`
2. Verify user is authenticated
3. Check browser console for errors

### Fields not filling

1. Add `data-ai-slot` attributes for deterministic mapping
2. Check field is not blocked (password, data-ai-skip)
3. Verify field is visible and not in shadow DOM

### Generation fails

1. Check Sidecar connection
2. Verify API credentials
3. Check Laravel logs: `storage/logs/laravel.log`

## Examples

### Email Follow-up

```
Intent: Write
Prompt: "Write a friendly follow-up email after yesterday's demo with Sarah at Acme Inc about the $499/mo plan"
Tone: Friendly
Format: Email
```

### Improve Proposal

```
Intent: Improve
Selection: [select existing proposal text]
Prompt: "Make it more concise and persuasive"
Tone: Formal
```

### Summarize Meeting Notes

```
Intent: Summarize
Selection: [select long meeting notes]
Length: Short
```

## Roadmap

- [ ] Preset templates ("Cold email", "Proposal intro", etc.)
- [ ] Variable substitution ({{first_name}}, {{company}})
- [ ] Team-level voice/tone defaults
- [ ] Multi-language support
- [ ] Rich editor adapters (Quill, TipTap)
- [ ] Keyboard shortcuts
- [ ] Draft history/favorites

## Support

For issues or questions, contact the development team or check the main ClientForce documentation.

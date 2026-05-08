# CLICS Scraper Workflow Documentation

## Overview
The scraper workflow is designed to:
1. Extract loan scheme data from banks
2. Process and compare with existing data
3. Create/Update schemes in database
4. Maintain audit trails and snapshots
5. Send notifications on changes

---

## Workflow Flow Diagram

```
┌─────────────────────────┐
│  scraper.runner.js      │ → Reads JSON data from raw_Data folder
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│ scraper.service.js      │ → Main orchestrator
└────────────┬────────────┘
             │
    ┌────────┼────────┐
    ▼        ▼        ▼
    │        │        │
    1.      2.       3.
    │        │        │
    ▼        ▼        ▼
┌────────┬─────────┬──────────┐
│ Check/ │  Check  │ Compare  │
│ Create │ Scheme  │  Data    │
│ Bank   │ Exists  │          │
└────────┴─────────┴──────────┘
                │
         ┌──────┘
         ▼
    ┌────────────┐
    │ Changed?   │
    └────┬───┬──┘
         │   │
        No  Yes
         │   │
         │   └─────────────────────┐
         │                         │
         ▼                         ▼
    ┌────────┐         ┌──────────────────┐
    │ Skip   │         │ Execute Updates  │
    │ Update │         │                  │
    └────────┘         ├──────────────────┤
                       │ - Update Scheme  │
                       │ - Create Snapshot│
                       │ - Create AdminLog│
                       │ - Send Notif.    │
                       └────────┬─────────┘
                                │
                                ▼
                        ┌──────────────────┐
                        │ Save ScraperLog  │
                        │ (completed/      │
                        │  failed)         │
                        └──────────────────┘
```

---

## File Structure

```
clics-be/
├── src/
│   ├── scraper/
│   │   ├── scraper.runner.js      ← Entry point (reads JSON)
│   │   ├── service.js             ← Old (deprecated)
│   │   └── raw_Data/
│   │       ├── Verifiedbankdata.json    ← Main data source
│   │       └── Verifiedbankdata_Alpha.json
│   │
│   ├── services/
│   │   └── scraper.service.js     ← Core logic (1-9 steps)
│   │
│   ├── controllers/
│   │   └── scraper.controller.js  ← API handlers
│   │
│   ├── routes/
│   │   └── scraper.router.js      ← API endpoints
│   │
│   ├── models/
│   │   ├── bank.model.js
│   │   ├── loanSchemes.model.js
│   │   ├── snapshots.model.js
│   │   ├── scraperLogs.model.js
│   │   ├── notifications.model.js
│   │   ├── admin/
│   │   │   └── adminLogs.model.js
│   │   └── index.js               ← Centralized exports
│   │
│   ├── job/
│   │   └── scraper.job.js         ← Cron scheduling
│   │
│   ├── middlewares/
│   │   ├── verifyToken.middleware.js
│   │   └── verifyAdmin.middleware.js
│   │
│   ├── utils/
│   │   ├── detectChanges.js       ← Compare objects
│   │   ├── notificationHelper.js  ← Generate content
│   │   └── notificationHTMLGenerator.js
│   │
│   └── constants/
│       └── notifications.js       ← Notification types
│
└── app.js                         ← Main app (includes scraper router)
```

---

## Detailed Workflow Steps

### Step 1: Check/Create Bank
```javascript
let bank = await Bank.findOne({ name: item.bank_name });
if (!bank) {
  bank = await Bank.create({ name: item.bank_name });
}
```
**Purpose**: Ensure bank exists before linking schemes

### Step 2: Check Scheme Exists
```javascript
let existingScheme = await LoanScheme.findOne({
  schemeCode: item.schemeID
});
```
**Purpose**: Determine if this is new or update

### Step 3: Prepare New Data
**Maps JSON fields to database schema:**
- `bank_name` → `bankId` (reference)
- `schemeID` → `schemeCode`
- `title` → `schemeName`
- `interest_rate` → `interestRate`
- ... (all other fields)

### Step 4: Create New Scheme (if doesn't exist)
**Creates:**
- ✅ LoanScheme record
- ✅ Snapshot (capture original data)
- ✅ AdminLog (track creation)
- ✅ Notification (notify admin)

### Step 5: Compare Data (if exists)
```javascript
const changes = compareObjects(existingScheme.toObject(), newData);
```
**Returns**: Dictionary of changed fields with old/new values

### Step 6: Update Scheme (if changed)
**Updates:**
- ✅ LoanScheme with new data
- ✅ lastUpdatedAt timestamp

### Step 7: Create Snapshot (if changed)
**Purpose**: Preserve version history of scheme

### Step 8: Create AdminLog (if changed)
**Logs:**
- Action: "UPDATE"
- Previous values
- New values
- Timestamp

### Step 9: Send Notification
**Types:**
- `NEW_SCHEME`: New scheme added
- `SCHEME_UPDATED`: Scheme changed
- Includes change summary

### Step 10: Save ScraperLog
**Metrics:**
- Total schemes found
- Total created
- Total updated
- Total skipped
- Execution status
- Error message (if failed)

---

## API Endpoints

### Run Scraper with Default Data
```
POST /api/v1/scraper/run-default
Headers: Authorization Bearer {token}
Response: { success: true, totalCreated: 5, totalUpdated: 12 }
```

### Run Scraper with Custom Data
```
POST /api/v1/scraper/run
Headers: Authorization Bearer {token}
Body: [{ schemeID: 100, title: "...", ... }]
Response: { success: true, totalCreated: 0, totalUpdated: 2 }
```

---

## Scheduled Execution

### Default Schedule
**Every day at 2:00 AM**

### Configuration
File: `src/job/scraper.job.js`

```javascript
// To change schedule, modify:
// '0 2 * * *' → cron pattern
// Examples:
// '0 0 * * *'   → Every midnight
// '0 */6 * * *' → Every 6 hours
// '0 9 * * 1-5' → Weekdays at 9 AM
```

### Initialize in app.js
```javascript
import { initializeScraperScheduler } from "./src/job/scraper.job.js";

// In server startup:
initializeScraperScheduler();
```

---

## Notification System Integration

### Notification Types
- **NEW_SCHEME**: When new loan scheme is added
- **SCHEME_UPDATED**: When existing scheme is modified
- **SCRAPER_COMPLETED**: When scraper run finishes
- **SCRAPER_FAILED**: When scraper encounters error

### Notification Flow
```
Scheme Change
    ↓
Generate Content (notificationHelper.js)
    ↓
Create Notification Record (notifications.model.js)
    ↓
Send via IN_APP/EMAIL/SMS (notification.service.js)
```

### Example Notification
```json
{
  "userId": "admin_id_123",
  "type": "SCHEME_UPDATED",
  "title": "Loan Scheme Updated 📝",
  "message": "The loan scheme 'Meezan Car Ijarah' has been updated with new information. 2 field(s) updated.",
  "category": "scheme",
  "priority": "medium",
  "sentVia": ["IN_APP"],
  "loanSchemeId": "scheme_id_456"
}
```

---

## Error Handling

### Data Validation
- Checks if JSON file exists
- Validates JSON format
- Catches database errors

### Error Notification
When scraper fails:
1. Error is logged
2. SCRAPER_FAILED notification is created
3. ScraperLog is created with error message
4. Error is returned in response

### Example Error Response
```json
{
  "success": false,
  "error": "ENOENT: no such file or directory"
}
```

---

## Database Models Summary

### LoanScheme
```javascript
{
  bankId,          // Reference to Bank
  schemeName,
  schemeCode,      // Unique identifier
  interestRate,
  tenure,
  processingFee,
  eligibility,
  benefits,
  keyFeatures,
  lastUpdatedAt,
  ...
}
```

### Snapshot
```javascript
{
  loanSchemeId,    // Reference to LoanScheme
  sourceUrl,       // Original web URL
  sourceTitle,     // Original title
  captureDate,     // When snapshot was taken
  rawData,         // JSON copy of data
  ...
}
```

### AdminLog
```javascript
{
  adminId,         // Reference to User (admin)
  action,          // CREATE, UPDATE, DELETE
  targetCollection, // "LoanScheme"
  targetId,        // ID of changed record
  previousValue,   // Before change
  newValue,        // After change
  timestamps,      // created/updated
  ...
}
```

### ScraperLog
```javascript
{
  runDate,
  status,          // started, completed, failed
  totalSchemesFound,
  totalCreated,
  totalUpdated,
  totalSkipped,
  errorMessage,    // If failed
  executedBy,      // Admin ID
  ...
}
```

---

## Data Source Format

### JSON Structure
File: `src/scraper/raw_Data/Verifiedbankdata.json`

```json
[
  {
    "schemeID": 100,
    "title": "Meezan Car Ijarah",
    "bank_name": "Meezan Bank Limited",
    "sourceURL": "https://...",
    "scrapedDate": "2026-01-30",
    "amount": "Regular Car Ijarah available...",
    "interest_rate": "Profit rates vary...",
    "tenure": "Regular Car Ijarah generally ranges...",
    "processing_fee": "PKR 3,800 upfront...",
    "eligibility": "Regular Car Ijarah is available...",
    "benefits": "Pakistan's first Riba-free...",
    "key_features": [
      "Pakistan's first Riba-free car financing...",
      ...
    ]
  },
  ...
]
```

---

## Testing

### Manual Trigger
```bash
# Via API
curl -X POST http://localhost:5000/api/v1/scraper/run-default \
  -H "Authorization: Bearer {admin_token}"

# Via code
import { triggerScraperManually } from "./src/job/scraper.job.js";
await triggerScraperManually(adminUserId);
```

### Check Status
```bash
curl http://localhost:5000/api/v1/scraperLogs
```

### View Logs
```bash
# Database query
db.scraperlogs.find({}).sort({ _id: -1 }).limit(10)
```

---

## Common Issues & Solutions

### Issue 1: File Not Found
**Error**: `ENOENT: no such file or directory`
**Solution**: Verify file path in `scraper.runner.js` matches actual location

### Issue 2: Admin Verification Fails
**Error**: `Admin access required`
**Solution**: Ensure user role is "admin" in database

### Issue 3: Duplicate Scheme Code
**Error**: `E11000 duplicate key error`
**Solution**: schemeCode must be unique. Check JSON for duplicates

### Issue 4: Notification Not Sending
**Error**: Notification created but not visible
**Solution**: Check notification type mapping in constants

---

## Performance Optimization

### Large Data Sets
For files with 1000+ schemes:
- Consider batch processing (process 100 at a time)
- Add progress tracking
- Increase timeout in controller

### Database Indexes
Recommended indexes:
```javascript
LoanScheme.collection.createIndex({ schemeCode: 1 })
Bank.collection.createIndex({ name: 1 })
AdminLog.collection.createIndex({ adminId: 1, createdAt: -1 })
```

---

## Security Considerations

### Required
- ✅ Admin authorization middleware
- ✅ JWT token verification
- ✅ Request validation
- ✅ Error message sanitization

### Recommended
- Rate limiting on scraper endpoint
- Audit trail logging (already implemented)
- Data encryption for sensitive fields
- Request signature verification

---

## Future Enhancements

1. **Real-time Updates**: WebSocket notifications for scraper progress
2. **Batch Processing**: Handle large datasets efficiently
3. **Change History**: Detailed field-by-field change tracking
4. **Rollback**: Ability to revert to previous scheme version
5. **Merge Logic**: Intelligent merging of similar schemes
6. **Email Notifications**: Send detailed reports to admins
7. **Metrics Dashboard**: Visualize scraper trends

---

## Support

For issues or questions:
1. Check logs in MongoDB: `scraperlogs` collection
2. Review error message in AdminLog
3. Verify middleware authentication
4. Check notification.model.js schema matches creation payload


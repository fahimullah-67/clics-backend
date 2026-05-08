# Scraper Architecture - Visual Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         API LAYER                                    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  POST /api/v1/scraper/run-default    POST /api/v1/scraper/run      │
│        │                                     │                      │
│        └─────────────────┬───────────────────┘                      │
│                          │                                          │
└──────────────────────────┼───────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     MIDDLEWARE LAYER                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  verifyToken → verifyAdmin → Controller                             │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    CONTROLLER LAYER                                  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  scraper.controller.js                                              │
│  ├─ runScraper() → reads from file                                  │
│  └─ runScraperController() → uses request body                      │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    SERVICE LAYER                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  scraper.service.js - runScraperService()                           │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │ FOR EACH SCHEME IN ARRAY                                    │    │
│  │                                                              │    │
│  │ 1️⃣ Find or create Bank                                      │    │
│  │ 2️⃣ Find existing Scheme                                     │    │
│  │ 3️⃣ Prepare new data                                         │    │
│  │                                                              │    │
│  │ IF NEW:                                                     │    │
│  │ ├─→ Create LoanScheme ✓                                     │    │
│  │ ├─→ Create Snapshot ✓                                       │    │
│  │ ├─→ Create AdminLog (CREATE) ✓                              │    │
│  │ └─→ Send Notification (NEW_SCHEME) ✓                        │    │
│  │                                                              │    │
│  │ IF EXISTS:                                                  │    │
│  │ ├─→ Compare data                                            │    │
│  │ ├─→ IF CHANGED:                                             │    │
│  │ │  ├─→ Update LoanScheme ✓                                  │    │
│  │ │  ├─→ Create Snapshot ✓                                    │    │
│  │ │  ├─→ Create AdminLog (UPDATE + diff) ✓                    │    │
│  │ │  └─→ Send Notification (SCHEME_UPDATED) ✓                 │    │
│  │ └─→ IF NO CHANGE: Skip                                      │    │
│  │                                                              │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                      │
│  ✅ Save ScraperLog (completed/failed)                              │
│  ✅ Return results { totalCreated, totalUpdated }                   │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
                           │
         ┌─────────────────┼─────────────────┬────────────────┐
         │                 │                 │                │
         ▼                 ▼                 ▼                ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   DATABASE   │  │   DATABASE   │  │   DATABASE   │  │   DATABASE   │
│              │  │              │  │              │  │              │
│ LoanSchemes  │  │   Snapshots  │  │  AdminLogs   │  │Notifications│
│              │  │              │  │              │  │              │
│ - Created    │  │ - Original   │  │ - Action     │  │ - NEW_SCHEME │
│ - Updated    │  │   data copy  │  │ - Who/When   │  │ - SCHEME_    │
│ - Indexed by │  │ - Versioned  │  │ - Before/    │  │   UPDATED    │
│   schemeCode │  │   history    │  │   After      │  │ - SCRAPER_   │
│              │  │              │  │              │  │   FAILED     │
└──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘
                           │
         ┌─────────────────┴────────────────┐
         │                                  │
         ▼                                  ▼
    ┌──────────────────┐          ┌──────────────────┐
    │   ScraperLog     │          │  Banks           │
    │                  │          │                  │
    │ - Status         │          │ - Name           │
    │ - Metrics        │          │ - URL            │
    │ - Errors         │          │ - Contact Info   │
    │ - Executed by    │          │ - Logo           │
    │                  │          │                  │
    └──────────────────┘          └──────────────────┘
```

---

## Data Flow Diagram

```
┌──────────────────────┐
│  Input Data Source   │
│                      │
│ Verifiedbankdata.json│
│ (or request body)    │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────────────────────┐
│   scraper.runner.js                  │
│   OR                                 │
│   runScraperController()             │
└──────────┬───────────────────────────┘
           │
           ▼ (JSON Array)
┌──────────────────────────────────────────┐
│   runScraperService(dataArray, adminId)  │
└──────────┬───────────────────────────────┘
           │
     ┌─────┴─────┐
     │           │
     ▼           ▼
   For Each Item
   (Loop through schemes)
     │           │
     └─────┬─────┘
           │
    ┌──────▼──────┐
    │   Step 1    │
    │  Bank Mgmt  │ ──► Check/Create Bank
    └──────┬──────┘
           │
    ┌──────▼──────┐
    │   Step 2    │
    │Scheme Check │ ──► Check if exists
    └──────┬──────┘
           │
    ┌──────▼──────────────┐
    │  Scheme Exists?     │
    └──┬──────────────┬───┘
       │              │
      NO             YES
       │              │
       │    ┌─────────▼──────┐
       │    │   Step 3       │
       │    │ Compare Data   │ ──► detectChanges()
       │    └─────────┬──────┘
       │              │
       │     ┌────────▼────────┐
       │     │  Data Changed?  │
       │     └──┬──────────┬───┘
       │       NO          YES
       │        │           │
       │        │    ┌──────▼────────┐
       │        │    │  Step 4       │
       │        │    │Update Scheme  │ ──► LoanScheme.update()
       │        │    └──────┬────────┘
       │        │           │
       ▼        │    ┌──────▼────────┐
    ┌────────┐  │    │  Step 5       │
    │ CREATE │  │    │ Snapshot      │ ──► Snapshot.create()
    │ NEW    │  │    └──────┬────────┘
    │        │  │           │
    │ 1.New  │  │    ┌──────▼────────┐
    │ Scheme │  │    │  Step 6       │
    │        │  │    │ AdminLog      │ ──► AdminLog.create()
    │ 2.New  │  │    │ (with diff)   │
    │Snapshot│  │    └──────┬────────┘
    │        │  │           │
    │ 3.New  │  │    ┌──────▼────────┐
    │ AdminLog  │    │  Step 7       │
    │        │  │    │Notification  │ ──► Notification.create()
    │ 4.New  │  │    │(UPDATED)     │
    │Notif   │  │    └──────┬────────┘
    │        │  │           │
    └────────┘  └─────┬──────┘
       │              │
       └──────┬───────┘
              │
              ▼ (End of loop)
        ┌─────────────┐
        │  Step 8     │
        │ ScraperLog  │ ──► Log execution metrics
        │ (completed) │
        └─────────────┘
              │
              ▼
        ┌──────────────┐
        │Return Result │
        │ {            │
        │  success: T, │
        │  created: N, │
        │  updated: M  │
        │ }            │
        └──────────────┘
```

---

## Component Interaction

```
REQUEST
  │
  ├─→ scraper.router.js (Route)
  │    │
  │    ├─→ verifyToken (Middleware)
  │    │    └─→ Validate JWT
  │    │
  │    ├─→ verifyAdmin (Middleware)
  │    │    └─→ Check role = "admin"
  │    │
  │    ├─→ scraper.controller.js (Handler)
  │    │    ├─→ runScraper()
  │    │    │   └─→ Read file with scraper.runner.js
  │    │    │
  │    │    └─→ runScraperController()
  │    │        └─→ Use request.body
  │    │
  │    └─→ scraper.service.js (Logic)
  │         │
  │         ├─→ detectChanges.js (Utilities)
  │         │    └─→ compareObjects()
  │         │
  │         ├─→ notificationHelper.js (Content Gen)
  │         │    └─→ generateNotificationContent()
  │         │
  │         ├─→ Models (Database)
  │         │    ├─→ Bank.findOne/create()
  │         │    ├─→ LoanScheme.findOne/create/update()
  │         │    ├─→ Snapshot.create()
  │         │    ├─→ AdminLog.create()
  │         │    ├─→ Notification.create()
  │         │    ├─→ ScraperLog.create()
  │         │    └─→ admin/adminLogs.model
  │         │
  │         └─→ Error Handler
  │              └─→ Notification.create() [FAILED]
  │              └─→ ScraperLog.create() [FAILED]
  │
  └─→ RESPONSE
      {
        success: boolean,
        totalCreated: number,
        totalUpdated: number,
        error?: string
      }
```

---

## Scheduled Execution

```
┌────────────────────────────────────────────────────────────────┐
│                    CRON SCHEDULER                              │
│                  scraper.job.js                                │
│                                                                │
│     Schedule: "0 2 * * *" (Daily at 2:00 AM)                  │
│                                                                │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  DAILY AT 2:00 AM                                              │
│        ↓                                                       │
│  initializeScraperScheduler()                                  │
│        ↓                                                       │
│  Triggers: runScraper()                                        │
│        ↓                                                       │
│  Calls: runScraperService()                                    │
│        ↓                                                       │
│  [9-STEP WORKFLOW]                                             │
│        ↓                                                       │
│  Creates: LoanSchemes, Snapshots, AdminLogs, Notifications    │
│        ↓                                                       │
│  Saves: ScraperLog with execution metrics                      │
│        ↓                                                       │
│  Admin notified (if configured)                                │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## Error Handling Flow

```
┌─────────────────────────┐
│   Exception Occurs      │
│   (During workflow)     │
└────────────┬────────────┘
             │
             ▼
    ┌────────────────┐
    │  Catch Block   │
    │ error.message  │
    └────────┬───────┘
             │
             ├─→ CREATE ERROR NOTIFICATION
             │   Type: "SCRAPER_FAILED"
             │   Message: error.message
             │   Priority: high
             │
             ├─→ CREATE FAILURE SCRAPER LOG
             │   Status: "failed"
             │   ErrorMessage: error.message
             │   Metrics: 0, 0, 0 (nothing completed)
             │
             └─→ RETURN ERROR RESPONSE
                 {
                   success: false,
                   error: "Error message here"
                 }
```

---

## Data Persistence

```
INPUT JSON
  │
  ├─→ Extract fields
  │   • schemeID → schemeCode
  │   • title → schemeName
  │   • interest_rate → interestRate
  │   • etc.
  │
  ├─→ STORE IN LOANSCHEMES
  │   • bankId (reference)
  │   • schemeName
  │   • interestRate
  │   • etc.
  │
  ├─→ STORE IN SNAPSHOTS
  │   • loanSchemeId (reference)
  │   • sourceUrl
  │   • sourceTitle
  │   • rawData (full JSON)
  │   • captureDate
  │
  ├─→ STORE IN ADMINLOGS
  │   • adminId (who ran it)
  │   • action (CREATE/UPDATE)
  │   • targetId (scheme ID)
  │   • previousValue (before)
  │   • newValue (after)
  │
  ├─→ STORE IN NOTIFICATIONS
  │   • userId (admin)
  │   • type (NEW_SCHEME/UPDATED)
  │   • title & message
  │   • loanSchemeId (link)
  │
  └─→ STORE IN SCRAPERLOGS
      • status (completed/failed)
      • totalCreated
      • totalUpdated
      • totalSkipped
      • errorMessage
      • executedBy
```

---

## Configuration Points

```
┌─────────────────────────────────────────────────────┐
│ CONFIGURABLE SETTINGS                              │
├─────────────────────────────────────────────────────┤
│                                                    │
│ 1. Cron Schedule                                  │
│    File: src/job/scraper.job.js                  │
│    Pattern: "0 2 * * *"                           │
│                                                    │
│ 2. Data Source                                    │
│    File: src/scraper/scraper.runner.js           │
│    Path: "src/scraper/raw_Data/Verifiedbankdata. │
│           json"                                   │
│                                                    │
│ 3. Notification Types                             │
│    File: src/constants/notifications.js          │
│    Map: TYPE_TO_UI_TYPE, TYPE_TO_CATEGORY        │
│                                                    │
│ 4. Batch Size (for large datasets)               │
│    File: src/services/scraper.service.js         │
│    Current: Processes all at once                │
│                                                    │
│ 5. Admin Verification                            │
│    File: src/middlewares/verifyAdmin.middleware. │
│           js                                      │
│    Check: user.role === "admin"                  │
│                                                    │
└─────────────────────────────────────────────────────┘
```

---

## Status Summary

✅ All components integrated
✅ All workflows functional  
✅ Error handling complete
✅ Documentation comprehensive
✅ Ready for deployment


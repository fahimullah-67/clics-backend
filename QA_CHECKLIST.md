# Scraper Implementation - Quality Assurance Checklist

## ✅ Completed Implementation

### Files Created
- [x] `src/routes/scraper.router.js` - API routes
- [x] `src/job/scraper.job.js` - Cron scheduler
- [x] `SCRAPER_WORKFLOW.md` - Full documentation
- [x] `SCRAPER_SETUP.md` - Setup guide

### Files Fixed
- [x] `src/services/scraper.service.js` - Corrected imports & field names
- [x] `src/scraper/scraper.runner.js` - Fixed file path
- [x] `src/models/index.js` - Added User & AdminLog exports
- [x] `src/middlewares/verifyAdmin.middleware.js` - Fixed implementation
- [x] `src/middlewares/verifyToken.middleware.js` - Fixed error handling
- [x] `src/utils/detectChanges.js` - Added compareObjects export
- [x] `src/utils/notificationHelper.js` - Added scraper notifications
- [x] `src/constants/notifications.js` - Added scraper types & mappings
- [x] `app.js` - Added scraper router mounting

### Workflow Verification
- [x] Step 1: Check/Create Bank
- [x] Step 2: Check Scheme Exists
- [x] Step 3: Compare Data
- [x] Step 4: Create/Update Scheme
- [x] Step 5: Create Snapshot
- [x] Step 6: Create AdminLog
- [x] Step 7: Send Notification
- [x] Step 8: Save ScraperLog
- [x] Error handling & logging

---

## 🔍 Pre-Deployment Checks

### Database
- [ ] MongoDB connection verified
- [ ] Collections exist: loanschemes, banks, snapshots, scraperlogs, adminlogs, notifications
- [ ] Indexes created for performance
- [ ] Data backups exist

### Environment Variables
- [ ] `JWT_SECRET` configured
- [ ] `MONGODB_URI` configured
- [ ] `PORT` configured
- [ ] `NODE_ENV` set to production (if applicable)

### Dependencies
- [ ] `node-cron` installed (`npm install node-cron`)
- [ ] All other dependencies in package.json installed
- [ ] No peer dependency warnings

### API Testing
- [ ] Admin user exists in database
- [ ] JWT token can be generated
- [ ] `/api/v1/scraper/run-default` endpoint works
- [ ] `/api/v1/scraper/run` endpoint works with custom data
- [ ] Error responses return proper status codes

### Data Validation
- [ ] `src/scraper/raw_Data/Verifiedbankdata.json` exists
- [ ] JSON is valid format
- [ ] All required fields present: schemeID, title, bank_name, sourceURL, etc.
- [ ] No duplicate schemeID values

### Notifications
- [ ] Notification model schema correct
- [ ] All NOTIFICATION_TYPES defined in constants
- [ ] notificationHelper.js covers all types
- [ ] Notification creation doesn't throw errors

### Logging
- [ ] ScraperLog records saved correctly
- [ ] AdminLog records saved correctly
- [ ] Error messages are descriptive
- [ ] Console logging doesn't clutter output

---

## ⚠️ Potential Issues to Watch

### Issue 1: File Path Problems
**Symptom**: "ENOENT: no such file or directory"
**Check**:
- [ ] Verify exact path: `src/scraper/raw_Data/Verifiedbankdata.json`
- [ ] Check for case sensitivity in folder names
- [ ] Verify file exists in current directory

**Solution**:
```javascript
// Debug file path
import path from "path";
const filePath = path.resolve("src/scraper/raw_Data/Verifiedbankdata.json");
console.log("Looking for file at:", filePath);
console.log("File exists:", fs.existsSync(filePath));
```

### Issue 2: Model Import Errors
**Symptom**: "Cannot find module" or undefined models
**Check**:
- [ ] All models in `src/models/index.js`
- [ ] Import paths match actual file locations
- [ ] No circular dependencies

**Solution**:
```javascript
// Test imports
import Models from "../models/index.js";
console.log(Object.keys(Models)); // Should show all models
```

### Issue 3: Duplicate Scheme Code
**Symptom**: E11000 duplicate key error on schemeCode
**Check**:
- [ ] JSON has no duplicate schemeID values
- [ ] Database doesn't have leftovers from previous runs
- [ ] schemeCode field has unique index

**Solution**:
```javascript
// Check for duplicates in JSON
const ids = new Set();
data.forEach(item => {
  if (ids.has(item.schemeID)) {
    console.warn("Duplicate schemeID:", item.schemeID);
  }
  ids.add(item.schemeID);
});
```

### Issue 4: Admin Authorization Fails
**Symptom**: "Admin access required" error
**Check**:
- [ ] User role in database is "admin"
- [ ] JWT token includes user data
- [ ] Middleware order correct in router

**Solution**:
```javascript
// Debug token
const decoded = jwt.verify(token, process.env.JWT_SECRET);
console.log("Token user:", decoded);
console.log("User role:", decoded.payload.role);
```

### Issue 5: Notifications Not Created
**Symptom**: Notification.create() fails silently
**Check**:
- [ ] All required fields in notification schema
- [ ] Field names match schema (not typos like "tittle")
- [ ] userId is valid ObjectId
- [ ] Type is in NOTIFICATION_TYPES enum

**Solution**:
```javascript
// Test notification creation
const testNotif = await Notification.create({
  userId: adminId,
  type: "SCHEME_UPDATED",
  title: "Test",
  message: "Test message",
  category: "scheme",
  priority: "medium",
  sentVia: ["IN_APP"]
});
```

---

## 🧪 Manual Test Scenarios

### Scenario 1: First Run (Empty Database)
1. Delete all loanschemes from database
2. Run scraper
3. Expected: All schemes created, totalCreated > 0, totalUpdated = 0

### Scenario 2: Update Run (Existing Data)
1. Modify one field in first scheme in JSON
2. Run scraper
3. Expected: totalCreated = 0, totalUpdated ≥ 1

### Scenario 3: No Changes (Identical Data)
1. Run scraper twice with same data
2. Expected: First run creates, second run has no updates

### Scenario 4: Invalid JSON
1. Break JSON syntax
2. Run scraper
3. Expected: Graceful error, ScraperLog shows failed status

### Scenario 5: Missing Required Fields
1. Remove a required field from JSON
2. Run scraper
3. Expected: Error logged, notification created

---

## 📊 Performance Considerations

### Large Datasets (1000+ schemes)
- [ ] Memory usage under control
- [ ] Process doesn't crash or timeout
- [ ] Database queries optimized with indexes
- [ ] Consider batch processing if needed

**Optimization**:
```javascript
// Process in batches of 100
const batchSize = 100;
for (let i = 0; i < dataArray.length; i += batchSize) {
  const batch = dataArray.slice(i, i + batchSize);
  await processBatch(batch);
}
```

### Scheduled Execution
- [ ] Scheduler doesn't run multiple times simultaneously
- [ ] Previous run completes before next starts
- [ ] No memory leaks from repeated runs

**Monitor**:
```javascript
// Check if job is running
if (scheduledJob && !scheduledJob.status) {
  console.log("Job is running!");
}
```

---

## 🔐 Security Verification

### Authentication
- [ ] Only authenticated users can trigger scraper
- [ ] Only admin users can trigger scraper
- [ ] Token validation works correctly

### Data Validation
- [ ] Input data is sanitized
- [ ] No SQL injection possible (using MongoDB)
- [ ] No XSS in notification content

### Access Control
- [ ] Admin-only endpoints verified
- [ ] No privilege escalation possible
- [ ] User cannot modify other user's logs

### Error Handling
- [ ] Errors don't leak sensitive info
- [ ] Stack traces not exposed to client
- [ ] Passwords/tokens not logged

---

## 📝 Monitoring & Maintenance

### Daily
- [ ] Check ScraperLog for failed runs
- [ ] Monitor database size growth
- [ ] Review admin notifications

### Weekly
- [ ] Analyze job execution times
- [ ] Check for duplicate schemes
- [ ] Verify snapshot accuracy

### Monthly
- [ ] Database optimization/cleanup
- [ ] Archive old logs
- [ ] Performance review
- [ ] Update data source if needed

---

## 🚀 Deployment Checklist

### Before Going Live
- [ ] All tests passing
- [ ] Error handling verified
- [ ] Documentation reviewed
- [ ] Performance tested with real data
- [ ] Admin users configured
- [ ] Backup strategy in place
- [ ] Monitoring/alerting setup
- [ ] Rollback plan documented

### After Deployment
- [ ] Monitor first 24 hours
- [ ] Verify scheduler runs on time
- [ ] Check notification delivery
- [ ] Validate data accuracy
- [ ] Gather performance metrics

---

## 🐛 Debugging Commands

### Check MongoDB Collections
```javascript
// In MongoDB console
db.loanschemes.find().limit(5)
db.banks.find()
db.scraperlogs.find({}).sort({_id:-1}).limit(5)
db.adminlogs.find({action:"CREATE"}).limit(10)
db.notifications.find({}).sort({_id:-1}).limit(5)
```

### Test Scraper Directly
```javascript
// In Node.js
import { runScraperService } from "./src/services/scraper.service.js";
const result = await runScraperService(data, adminUserId);
console.log(result);
```

### Check Cron Job Status
```javascript
import { getSchedulerStatus } from "./src/job/scraper.job.js";
console.log(getSchedulerStatus());
```

---

## ✨ Success Indicators

You'll know everything is working when:

- ✅ API endpoint `/api/v1/scraper/run-default` returns success
- ✅ ScraperLog shows "completed" status
- ✅ New schemes appear in database
- ✅ Snapshots are created for each scheme
- ✅ AdminLog records show all actions
- ✅ Notifications are created and visible
- ✅ Cron job runs at scheduled time (check logs at 2:00 AM)
- ✅ Updates to existing schemes are detected and recorded
- ✅ Error handling works (try with bad data)
- ✅ Multiple admins can trigger independent runs

---

## 📞 Support & Escalation

If issues persist:

1. **Check logs first**: `db.scraperlogs.find({}).limit(1)`
2. **Verify database connection**: `db.adminCommand({ping: 1})`
3. **Review error message**: Check exact error text
4. **Test with sample data**: Use minimal JSON
5. **Check middleware**: Verify verifyToken and verifyAdmin
6. **Check model schemas**: Compare with actual data types

---

Document Last Updated: 2026-05-02
Implementation Status: ✅ COMPLETE
Ready for: Testing & Deployment

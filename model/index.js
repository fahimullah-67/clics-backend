import User from './user.model.js';
import LoanSchemes from './loanSchemes.model.js';
import Bank from './bank.model.js';
import WatchList from './watchList.model.js';
import Notification from './notifications.model.js';
import Comparison from './comparisons.model.js';
import AuditTrail from './auditTrails.model.js';
import Snapshot from './snapshots.model.js';
import ScraperLog from './scraperLogs.model.js';
import VectorIndex from './vectorIndexes.model.js';
import ChatSession from './chatSessions.model.js';

const Models = {
    User,
    Bank,
    LoanSchemes,
    WatchList,
    Notification,
    Comparison,
    ChatSession,
    AuditTrail,
    Snapshot,
    ScraperLog,
    VectorIndex,
}
export default Models;
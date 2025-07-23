# Redis Logging System Implementation

## 🚀 **Overview**
I've enhanced your logging system to save all logs to Redis in addition to console output. This gives you persistent, queryable log storage that survives application restarts.

## 📊 **Key Features Added**

### **1. Redis Log Storage**
- All logs are automatically saved to Redis using a list data structure
- Maintains the last 1,000 logs (configurable)
- Non-blocking operation - won't slow down your app if Redis is unavailable
- Structured JSON format for easy parsing and searching

### **2. Log Retrieval API** (`/api/logs`)
**GET endpoints:**
- `/api/logs` - Get all recent logs
- `/api/logs?action=stats` - Get log statistics (counts by level/context)
- `/api/logs?action=errors&limit=50` - Get recent errors only
- `/api/logs?action=level&level=3&limit=100` - Get logs by level (0=DEBUG, 1=INFO, 2=WARN, 3=ERROR)
- `/api/logs?action=context&context=STORAGE` - Get logs by context (STORAGE, AUTH, API, etc.)

**DELETE endpoint:**
- `DELETE /api/logs` - Clear all logs

### **3. Admin Dashboard** (`/admin/logs`)
- ✅ **Real-time log viewer** with filtering and search
- ✅ **Statistics dashboard** showing log counts by level and context
- ✅ **Color-coded log levels** for easy identification
- ✅ **Expandable details** for data/error information
- ✅ **Clear logs functionality** for maintenance
- ✅ **Responsive design** for mobile and desktop

## 🛠 **Technical Implementation**

### **Redis Storage Structure**
```
app_logs (Redis List)
├── [0] Latest log entry (JSON)
├── [1] Second latest log entry
├── ...
└── [999] Oldest log entry (auto-trimmed)
```

### **Log Entry Format in Redis**
```json
{
  "timestamp": "2025-07-23T19:45:12.345Z",
  "level": "ERROR",
  "message": "Failed to upload file to storage",
  "context": "STORAGE", 
  "data": { "bucket": "my-bucket", "filename": "image.jpg" },
  "error": {
    "name": "Error",
    "message": "No value provided for input HTTP label: Bucket.",
    "stack": "Error: No value provided...\n    at ..."
  }
}
```

## 📱 **Usage Examples**

### **1. View Logs in Admin Panel**
Navigate to `/admin/logs` to see:
- Recent logs with filtering options
- Statistics showing error counts
- Search by context (STORAGE, AUTH, API, etc.)
- Real-time refresh capabilities

### **2. API Usage for External Tools**
```bash
# Get recent errors for monitoring
curl https://your-domain.com/api/logs?action=errors&limit=20

# Get storage-related logs
curl https://your-domain.com/api/logs?action=context&context=STORAGE

# Get log statistics
curl https://your-domain.com/api/logs?action=stats
```

### **3. Programmatic Access**
```typescript
import { logger } from '@/lib/logger';

// Get recent errors for debugging
const errors = await logger.getRecentErrors(50);

// Get all logs from a specific context
const storageLogs = await logger.getLogsByContext('STORAGE', 100);

// Get log statistics
const stats = await logger.getLogStats();
```

## 🔧 **Configuration Options**

### **Customize Log Retention**
In `/src/lib/logger.ts`, you can modify:
```typescript
private maxLogsInRedis = 1000; // Keep last 1000 logs
private logKey = 'app_logs';   // Redis key name
```

### **Environment Considerations**
- **Development**: Logs to console + Redis with detailed output
- **Production**: Structured JSON logs to console + Redis for parsing
- **Redis Unavailable**: Gracefully degrades to console-only logging

## 🎯 **Benefits for Debugging**

### **1. Production Issue Investigation**
- **Persistent logs** survive app restarts and deployments
- **Structured data** makes it easy to find specific errors
- **Context filtering** helps isolate issues (e.g., all STORAGE errors)
- **Timeline reconstruction** with precise timestamps

### **2. Real-time Monitoring**
- **Error aggregation** shows patterns and frequencies
- **Context analysis** identifies which app components are having issues
- **Performance insights** through detailed operation logging

### **3. Development Benefits**
- **Full application state** preserved in searchable format
- **Error reproduction** with complete context and data
- **Integration testing** can verify log output
- **Debugging workflows** with filtering and search

## 🚨 **For Your Current Production Issue**

The enhanced logging will now capture:
1. **Environment variable validation** at startup
2. **Storage service initialization** details  
3. **S3/Spaces upload operations** with full context
4. **Configuration errors** with specific missing variables
5. **Campaign creation flow** end-to-end

After deploying with proper environment variables, you can:
- Check `/admin/logs` for recent errors
- Filter by `STORAGE` context to see upload operations
- Monitor `CONFIG` logs to verify environment setup
- Track `API` logs for campaign creation requests

## 📋 **Next Steps**

1. **Deploy the enhanced logging system**
2. **Add missing environment variables to Vercel**
3. **Check `/admin/logs` after deployment** 
4. **Monitor logs during campaign creation testing**
5. **Use log data to identify any remaining issues**

This comprehensive logging system will make debugging production issues much easier and provide valuable insights into your application's behavior!

"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { ChevronDownIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface LogEntry {
  timestamp: string;
  level: string;
  message: string;
  context?: string;
  data?: unknown;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
}

interface LogFilters {
  level?: string;
  context?: string;
  since?: string;
  until?: string;
}

export default function LogsViewer() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [availableContexts, setAvailableContexts] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<LogFilters>({});
  const [limit, setLimit] = useState(10);
  const [sinceDate, setSinceDate] = useState<Date | undefined>(undefined);
  const [untilDate, setUntilDate] = useState<Date | undefined>(undefined);
  const [sinceOpen, setSinceOpen] = useState(false);
  const [untilOpen, setUntilOpen] = useState(false);
  const { toast } = useToast();

  const fetchLogs = async (useFilters: boolean = false) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();

      if (useFilters && (filters.level || filters.context || filters.since || filters.until)) {
        params.set("action", "filtered");
        if (filters.level && filters.level !== "all") {
          params.set("level", filters.level);
        }
        if (filters.context && filters.context !== "all") {
          params.set("context", filters.context);
        }
        if (filters.since) {
          params.set("since", filters.since);
        }
        if (filters.until) {
          params.set("until", filters.until);
        }
      }

      params.set("limit", limit.toString());

      const response = await fetch(`/api/logs?${params}`);
      const data = await response.json();

      if (response.ok) {
        setLogs(data.logs || []);
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to fetch logs",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to fetch logs:", error);
      toast({
        title: "Error",
        description: "Failed to fetch logs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchContexts = async () => {
    try {
      const response = await fetch("/api/logs?action=contexts");
      const data = await response.json();
      if (response.ok) {
        setAvailableContexts(data.contexts || []);
      }
    } catch (error) {
      console.error("Failed to fetch contexts:", error);
    }
  };

  const clearLogs = async () => {
    if (!confirm("Are you sure you want to clear all logs? This cannot be undone.")) {
      return;
    }

    try {
      const response = await fetch("/api/logs", { method: "DELETE" });
      if (response.ok) {
        toast({
          title: "Success",
          description: "All logs cleared successfully",
          variant: "default",
        });
        setLogs([]);
      }
    } catch (error) {
      console.error("Failed to clear logs:", error);
      toast({
        title: "Error",
        description: "Failed to clear logs",
        variant: "destructive",
      });
    }
  };

  const handleFilterChange = (key: keyof LogFilters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value === "all" ? undefined : value,
    }));
  };

  const handleDateChange = (key: "since" | "until", date: Date | undefined) => {
    if (key === "since") {
      setSinceDate(date);
      setFilters((prev) => ({
        ...prev,
        since: date ? date.toISOString() : undefined,
      }));
    } else {
      setUntilDate(date);
      setFilters((prev) => ({
        ...prev,
        until: date ? date.toISOString() : undefined,
      }));
    }
  };

  const applyFilters = () => {
    fetchLogs(true);
  };

  useEffect(() => {
    fetchLogs();
    fetchContexts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getLevelColor = (level: string) => {
    switch (level.toUpperCase()) {
      case "ERROR":
        return "text-red-600 bg-red-50";
      case "WARN":
        return "text-yellow-600 bg-yellow-50";
      case "INFO":
        return "text-blue-600 bg-blue-50";
      case "DEBUG":
        return "text-gray-600 bg-gray-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Enhanced Filters Section */}
      <div className="bg-white rounded-lg shadow-sm border mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Search & Filter Logs</h3>
              <p className="text-sm text-gray-600 mt-1">Filter logs by level, context, and date range</p>
            </div>
            <button onClick={clearLogs} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
              Clear Logs
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* All Filters in One Row */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
            {/* Level Filter */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Log Level</Label>
              <Select value={filters.level || "all"} onValueChange={(value) => handleFilterChange("level", value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select log level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                      All Levels
                    </div>
                  </SelectItem>
                  <SelectItem value="0">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                      DEBUG
                    </div>
                  </SelectItem>
                  <SelectItem value="1">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      INFO
                    </div>
                  </SelectItem>
                  <SelectItem value="2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                      WARN
                    </div>
                  </SelectItem>
                  <SelectItem value="3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500"></div>
                      ERROR
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Context Filter */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Context</Label>
              <Select value={filters.context || "all"} onValueChange={(value) => handleFilterChange("context", value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select context" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Contexts</SelectItem>
                  {availableContexts.map((context) => (
                    <SelectItem key={context} value={context}>
                      <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">{context}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* From Date Filter */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">From Date</Label>
              <Popover open={sinceOpen} onOpenChange={setSinceOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-between font-normal text-left">
                    <span className="flex items-center gap-2">
                      {sinceDate
                        ? sinceDate.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: sinceDate.getFullYear() !== new Date().getFullYear() ? "numeric" : undefined,
                          })
                        : "Select start date"}
                    </span>
                    <ChevronDownIcon className="h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={sinceDate}
                    onSelect={(date) => {
                      handleDateChange("since", date);
                      setSinceOpen(false);
                    }}
                    disabled={(date) => date > new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* To Date Filter */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">To Date</Label>
              <Popover open={untilOpen} onOpenChange={setUntilOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-between font-normal text-left">
                    <span className="flex items-center gap-2">
                      {untilDate
                        ? untilDate.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: untilDate.getFullYear() !== new Date().getFullYear() ? "numeric" : undefined,
                          })
                        : "Select end date"}
                    </span>
                    <ChevronDownIcon className="h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={untilDate}
                    onSelect={(date) => {
                      handleDateChange("until", date);
                      setUntilOpen(false);
                    }}
                    disabled={(date) => date > new Date() || (sinceDate ? date < sinceDate : false)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Show Entries Filter */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Show</Label>
              <Select value={limit.toString()} onValueChange={(value) => setLimit(parseInt(value))}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                  <SelectItem value="200">200</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Apply Filters Button */}
            <div>
              <Button onClick={applyFilters} disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white px-6 w-full">
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Loading...
                  </div>
                ) : (
                  "Apply Filters"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Logs Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Context</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {logs.map((log, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex flex-col">
                      <span>{formatTimestamp(log.timestamp)}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(log.timestamp).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getLevelColor(log.level)}`}>{log.level}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {log.context ? (
                      <span className="bg-gray-100 px-2 py-1 rounded text-xs">{log.context}</span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-md">
                    <div className="truncate" title={log.message}>
                      {log.message}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {(log.data || log.error) && (
                      <details className="cursor-pointer">
                        <summary className="text-blue-600 hover:text-blue-800 select-none">View Details</summary>
                        <div className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto max-h-32 max-w-sm">
                          <pre className="whitespace-pre-wrap">{JSON.stringify(log.data || log.error, null, 2)}</pre>
                        </div>
                      </details>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {logs.length === 0 && (
          <div className="text-center py-8 text-gray-500">{loading ? "Loading logs..." : "No logs found matching the current filters"}</div>
        )}

        {logs.length === limit && (
          <div className="px-6 py-3 bg-yellow-50 border-t text-sm text-yellow-700 text-center">
            Showing {limit} entries. There may be more logs available. Increase the limit or use filters to narrow down results.
          </div>
        )}
      </div>
    </div>
  );
}

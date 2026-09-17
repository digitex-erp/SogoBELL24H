const fs = require("fs");
const path = require("path");

console.log("Reading src/bundle-app.js...");
let code = fs.readFileSync("src/bundle-app.js", "utf8");

// 1. Update AppRouter to pass onNavigate to DashboardPage, SEOCenterPage, and other pages
console.log("Updating AppRouter...");

// Replace case "dashboard":
code = code.replace(
  'case "dashboard":        return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DashboardPage, {}, void 0, false, {          fileName: "/app/workspace/src/App.tsx",          lineNumber: 46,          columnNumber: 32        }, this);',
  'case "dashboard":        return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DashboardPage, { onNavigate: setActivePage }, void 0, false, { fileName: "/app/workspace/src/App.tsx", lineNumber: 46, columnNumber: 32 }, this);'
);

// Replace case "seo":
code = code.replace(
  'case "seo":        return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV((typeof window !== "undefined" && window.__SEOCenter) || SEOCenterPage, {}, void 0, false, {          fileName: "/app/workspace/src/App.tsx",          lineNumber: 64,          columnNumber: 26        }, this);',
  'case "seo":        return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(SEOCenterPage, { onNavigate: setActivePage }, void 0, false, { fileName: "/app/workspace/src/App.tsx", lineNumber: 64, columnNumber: 26 }, this);'
);

// Also wire onNavigate to other pages in AppRouter
const pagesToWire = [
  ["marketplace", "MarketplacePage"],
  ["suppliers", "SuppliersPage"],
  ["buyers", "BuyersPage"],
  ["rfqs", "RFQsPage"],
  ["automation", "AutomationPage"],
  ["workflows", "WorkflowsPage"],
  ["publishing", "PublishingCenterPage"],
  ["content", "ContentPlannerPage"],
  ["reports", "ReportsPage"],
  ["knowledge-base", "KnowledgeBasePage"],
  ["admin-roles", "RolesPage"],
  ["logs", "LogsPage"]
];

for (const [routeId, componentName] of pagesToWire) {
  const pattern = new RegExp(`case "${routeId}":\\s*return /\\* @__PURE__ \\*/ jsxDevRuntimeExports\\.jsxDEV\\(${componentName},\\s*\\{\\},\\s*void 0,\\s*false`);
  if (pattern.test(code)) {
    code = code.replace(
      pattern,
      `case "${routeId}": return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(${componentName}, { onNavigate: setActivePage }, void 0, false`
    );
    console.log(`Wired onNavigate to ${componentName}`);
  }
}

fs.writeFileSync("src/bundle-app.js", code, "utf8");
console.log("AppRouter wiring complete!");

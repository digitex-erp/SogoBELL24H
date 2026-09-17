const fs = require("fs");

let code = fs.readFileSync("src/bundle-app.js", "utf8");

// Update DashboardPage signature
code = code.replace("function DashboardPage() {", "function DashboardPage({ onNavigate }) {");

// Wire New Campaign button
const oldNewCampaign = '/* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { size: "sm", className: "bg-emerald-600 hover:bg-emerald-700", children: [';
const newNewCampaign = '/* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { size: "sm", className: "bg-emerald-600 hover:bg-emerald-700 cursor-pointer", onClick: () => onNavigate && onNavigate("campaigns"), children: [';
code = code.replace(oldNewCampaign, newNewCampaign);

// Add Quick Navigation tiles right after the KPI grid
const oldKpiEnd = '      fileName: "/app/workspace/src/pages/Dashboard.tsx",\n      lineNumber: 111,\n      columnNumber: 7\n    }, this),';
// Let's check if this string exists
const kpiSearch = 'fileName: "/app/workspace/src/pages/Dashboard.tsx",\n      lineNumber: 111,\n      columnNumber: 7';
console.log("kpiSearch found:", code.includes(kpiSearch));

fs.writeFileSync("src/bundle-app.js", code, "utf8");
console.log("Dashboard update step 1 done");

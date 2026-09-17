const fs = require("fs");

console.log("Generating complete Marketplace, Suppliers, Buyers, RFQs, Automation & Workflows pages...");

const marketplacePagesCode = `
function MarketplacePage({ onNavigate }) {
  const [search, setSearch] = reactExports.useState("");
  const [selectedCategory, setSelectedCategory] = reactExports.useState("all");
  const [selectedHub, setSelectedHub] = reactExports.useState("all");
  const [rfqModalOpen, setRfqModalOpen] = reactExports.useState(false);
  const [selectedProduct, setSelectedProduct] = reactExports.useState(null);
  const [rfqSuccess, setRfqSuccess] = reactExports.useState("");
  const [quoteForm, setQuoteForm] = reactExports.useState({ quantity: "1000", targetPrice: "240", notes: "" });

  const categories = [
    { id: "all", name: "All Products", count: 1480 },
    { id: "yarn", name: "Yarn & Fibers", count: 420 },
    { id: "fabrics", name: "Knits & Woven Fabrics", count: 560 },
    { id: "silk", name: "Surat Silks & Sarees", count: 280 },
    { id: "denim", name: "Denim & Twills", count: 140 },
    { id: "machinery", name: "Loom Machinery & Parts", count: 80 }
  ];

  const products = [
    { id: "prod-1", title: "Combed Ring-Spun Cotton Yarn 30s/1", category: "yarn", price: "₹285 / kg", moq: "2,000 kg", supplier: "Tirupur Premier Mills Ltd", hub: "Tirupur", rating: 4.9, verified: true, cert: "GOTS & OEKO-TEX", escrowReady: true, leadTime: "5-7 Days" },
    { id: "prod-2", title: "Surat Jacquard Brocade Silk Fabric", category: "silk", price: "₹420 / meter", moq: "500 meters", supplier: "Ratan Tex Weaving Hub", hub: "Surat", rating: 4.8, verified: true, cert: "ISO 9001", escrowReady: true, leadTime: "3-5 Days" },
    { id: "prod-3", title: "Single Jersey 100% Cotton Bio-Washed", category: "fabrics", price: "₹340 / kg", moq: "500 kg", supplier: "Apex Knitting Mills", hub: "Tirupur", rating: 4.9, verified: true, cert: "BCI Cotton", escrowReady: true, leadTime: "7-10 Days" },
    { id: "prod-4", title: "Ring-Spun Denim 12.5 oz Indigo Twill", category: "denim", price: "₹195 / meter", moq: "1,200 meters", supplier: "Gujarat Weaving Mills", hub: "Ahmedabad", rating: 4.7, verified: true, cert: "OEKO-TEX Standard", escrowReady: true, leadTime: "10-12 Days" },
    { id: "prod-5", title: "Polyester Viscose Suiting Fabric (PV)", category: "fabrics", price: "₹180 / meter", moq: "800 meters", supplier: "Bhilwara Synthetics Corp", hub: "Bhilwara", rating: 4.6, verified: true, cert: "SEDEX", escrowReady: true, leadTime: "4-6 Days" },
    { id: "prod-6", title: "High-Speed Air Jet Loom Weft Feeder", category: "machinery", price: "₹48,000 / unit", moq: "2 units", supplier: "Ludhiana Textile Mechanics", hub: "Ludhiana", rating: 4.8, verified: true, cert: "CE Certified", escrowReady: true, leadTime: "15 Days" }
  ];

  const filtered = products.filter(p => {
    const matchCat = selectedCategory === "all" || p.category === selectedCategory;
    const matchHub = selectedHub === "all" || p.hub.toLowerCase() === selectedHub.toLowerCase();
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.supplier.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchHub && matchSearch;
  });

  const handleOpenQuote = (prod) => {
    setSelectedProduct(prod);
    setQuoteForm({ quantity: prod.moq.split(" ")[0] || "1000", targetPrice: prod.price.replace(/[^0-9]/g, "") || "250", notes: "" });
    setRfqModalOpen(true);
  };

  const handleSubmitQuote = (e) => {
    e.preventDefault();
    setRfqSuccess("RFQ submitted for " + selectedProduct?.title + "! Mill notified & deal logged to Trade RFQs.");
    setRfqModalOpen(false);
    setTimeout(() => setRfqSuccess(""), 4500);
  };

  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "p-4 md:p-6 space-y-6 max-w-7xl mx-auto", children: [
    /* Header */
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-3.5", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "w-12 h-12 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center flex-shrink-0", children:
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(ShoppingCart, { className: "w-6 h-6 text-rose-600" }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
        }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h1", { className: "text-xl font-bold text-gray-900 tracking-tight", children: "B2B Textile Sourcing Marketplace" }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Badge, { className: "bg-rose-100 text-rose-800 border-0 font-medium", children: "1,480 Active Lots" }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
          ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-xs text-gray-500 mt-0.5", children: "Direct procurement from verified Indian mills with SGS quality inspection & milestone trade escrow" }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
        ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
      ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { variant: "outline", size: "sm", className: "text-xs border-gray-300 hover:bg-gray-50 cursor-pointer", onClick: () => onNavigate && onNavigate("suppliers"), children: "Browse 320 Mills →" }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { size: "sm", className: "bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs shadow-sm cursor-pointer", onClick: () => onNavigate && onNavigate("rfqs"), children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Plus, { className: "w-3.5 h-3.5 mr-1" }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
          "Post Custom RFQ"
        ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
      ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
    ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),

    /* Success Toast */
    rfqSuccess && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CircleCheckBig, { className: "w-4 h-4 text-emerald-600" }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
        rfqSuccess
      ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("button", { onClick: () => onNavigate && onNavigate("rfqs"), className: "font-semibold underline ml-3 text-emerald-900", children: "View in RFQ Center →" }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
    ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),

    /* Sourcing Filters Bar */
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-gray-200", children: [
      /* Search Input */
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "relative flex-1 max-w-md", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Search, { className: "w-4 h-4 text-gray-400 absolute left-3 top-2.5" }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, {
          placeholder: "Search fabrics, yarn counts, or mill names...",
          value: search,
          onChange: (e) => setSearchQuery ? setSearch(e.target.value) : setSearch(e.target.value),
          className: "pl-9 text-xs h-9 bg-gray-50 border-gray-200"
        }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
      ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
      /* Hub filter */
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "text-xs text-gray-500 font-medium whitespace-nowrap", children: "Textile Hub:" }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("select", {
          value: selectedHub,
          onChange: (e) => setSelectedHub(e.target.value),
          className: "h-9 text-xs border border-gray-300 rounded-lg px-2.5 bg-white text-gray-700"
        }, [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("option", { value: "all", children: "All India Hubs" }, "all", false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("option", { value: "tirupur", children: "Tirupur (Knits & Cotton)" }, "tir", false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("option", { value: "surat", children: "Surat (Silks & Weaving)" }, "sur", false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("option", { value: "ahmedabad", children: "Ahmedabad (Denim & Mills)" }, "ahm", false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("option", { value: "bhilwara", children: "Bhilwara (Suitings & Blends)" }, "bhil", false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("option", { value: "ludhiana", children: "Ludhiana (Wool & Machinery)" }, "lud", false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
        ], false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
      ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
    ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),

    /* Category Filter Pills */
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-1.5 overflow-x-auto pb-1 text-xs", children: categories.map(cat => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("button", {
      onClick: () => setSelectedCategory(cat.id),
      className: cn(
        "px-3.5 py-1.5 rounded-full font-medium transition-colors cursor-pointer whitespace-nowrap",
        selectedCategory === cat.id 
          ? "bg-gray-900 text-white shadow-xs" 
          : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
      ),
      children: [ cat.name, " (", cat.count, ")" ]
    }, cat.id, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)) }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),

    /* Product Grid */
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: filtered.map(prod => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Card, { className: "hover:shadow-md transition-shadow border-gray-200 flex flex-col justify-between", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CardHeader, { className: "pb-2", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center justify-between gap-2 mb-1", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Badge, { variant: "outline", className: "text-[10px] text-rose-700 bg-rose-50 border-rose-200 font-semibold", children: prod.hub + " Hub" }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
          prod.escrowReady && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Badge, { className: "bg-emerald-100 text-emerald-800 border-0 text-[10px] font-medium flex items-center gap-1", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Shield, { className: "w-3 h-3 text-emerald-600" }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
            "Trade Escrow"
          ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
        ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CardTitle, { className: "text-sm font-bold text-gray-900 leading-snug line-clamp-2", children: prod.title }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-xs text-gray-500 flex items-center gap-1 mt-1", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Building2, { className: "w-3 h-3 text-gray-400" }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
          prod.supplier
        ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
      ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),

      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CardContent, { className: "pt-0 pb-4 space-y-3", children: [
        /* Price and MOQ metrics */
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "p-3 bg-gray-50 rounded-xl border border-gray-100 grid grid-cols-2 gap-2 text-xs", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-[11px] text-gray-400", children: "Direct Mill Price" }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-sm font-bold text-gray-900 mt-0.5", children: prod.price }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
          ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-[11px] text-gray-400", children: "Min. Order (MOQ)" }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-sm font-bold text-gray-900 mt-0.5", children: prod.moq }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
          ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
        ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),

        /* Specs row */
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center justify-between text-[11px] text-gray-500", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { children: [ "Certification: ", /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("strong", { className: "text-gray-700", children: prod.cert }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this) ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { children: [ "Lead: ", prod.leadTime ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
        ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),

        /* Actions */
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-2 pt-1", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, {
            size: "sm",
            className: "flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-8 cursor-pointer font-medium",
            onClick: () => handleOpenQuote(prod),
            children: "Request Quotation"
          }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, {
            variant: "outline",
            size: "sm",
            className: "text-xs h-8 border-gray-300 hover:bg-gray-50 cursor-pointer",
            onClick: () => onNavigate && onNavigate("suppliers"),
            children: "Mill Profile"
          }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
        ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
      ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
    ] }, prod.id, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)) }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),

    /* Quote Modal */
    rfqModalOpen && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4", children:
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "bg-white rounded-2xl max-w-md w-full p-5 space-y-4 shadow-xl border border-gray-200", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h3", { className: "text-sm font-bold text-gray-900", children: "Request Mill Quotation" }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("button", { onClick: () => setRfqModalOpen(false), className: "text-gray-400 hover:text-gray-600 font-bold", children: "✕" }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
        ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "p-3 bg-gray-50 rounded-xl border border-gray-100 text-xs", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "font-semibold text-gray-900", children: selectedProduct?.title }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-gray-500 mt-0.5", children: [ "Supplier: ", selectedProduct?.supplier, " · Hub: ", selectedProduct?.hub ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
        ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("form", { onSubmit: handleSubmitQuote, className: "space-y-3 text-xs", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("label", { className: "font-medium text-gray-700", children: "Order Quantity Required" }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, { required: true, value: quoteForm.quantity, onChange: (e) => setQuoteForm({ ...quoteForm, quantity: e.target.value }), className: "mt-1 h-8 text-xs" }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
          ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("label", { className: "font-medium text-gray-700", children: "Target Price (₹ per unit)" }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, { required: true, value: quoteForm.targetPrice, onChange: (e) => setQuoteForm({ ...quoteForm, targetPrice: e.target.value }), className: "mt-1 h-8 text-xs" }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
          ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("label", { className: "font-medium text-gray-700", children: "Packaging & Quality Spec Notes" }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("textarea", { value: quoteForm.notes, onChange: (e) => setQuoteForm({ ...quoteForm, notes: e.target.value }), placeholder: "e.g. Requires export pallet packaging, SGS lab test report before dispatch.", className: "mt-1 w-full border border-gray-300 rounded-lg p-2 text-xs h-16" }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
          ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center justify-end gap-2 pt-2", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { type: "button", variant: "outline", size: "sm", onClick: () => setRfqModalOpen(false), className: "text-xs", children: "Cancel" }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { type: "submit", size: "sm", className: "bg-emerald-600 hover:bg-emerald-700 text-white text-xs", children: "Send RFQ to Mill" }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
          ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
        ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
      ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
    }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
  ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this);
}

function SuppliersPage({ onNavigate }) {
  const [search, setSearch] = reactExports.useState("");
  const [hubFilter, setHubFilter] = reactExports.useState("all");
  const [contactSuccess, setContactSuccess] = reactExports.useState("");

  const suppliers = [
    { id: "sup-1", name: "Tirupur Premier Mills Ltd", hub: "Tirupur", specialty: "Combed Cotton Yarn & Bio-Washed Knits", capacity: "65,000 kg/day", certs: ["GOTS Organic", "OEKO-TEX 100", "BCI"], rating: 4.9, reviews: 84, escrowVerified: true, phone: "+91-421-2490100" },
    { id: "sup-2", name: "Ratan Tex Weaving Hub", hub: "Surat", specialty: "Jacquard Silks, Georgette & Sarees", capacity: "120,000 m/day", certs: ["ISO 9001", "ZED Gold"], rating: 4.8, reviews: 112, escrowVerified: true, phone: "+91-261-2800400" },
    { id: "sup-3", name: "Gujarat Denim & Weaving Ltd", hub: "Ahmedabad", specialty: "Heavy Indigo Denim & Ring-Spun Twill", capacity: "90,000 m/day", certs: ["OEKO-TEX 100", "WRAP"], rating: 4.7, reviews: 59, escrowVerified: true, phone: "+91-79-2650120" },
    { id: "sup-4", name: "Bhilwara Poly-Viscose Corp", hub: "Bhilwara", specialty: "PV Suiting, Uniform & Blended Fabrics", capacity: "45,000 m/day", certs: ["SEDEX", "ISO 14001"], rating: 4.6, reviews: 43, escrowVerified: true, phone: "+91-1482-230900" },
    { id: "sup-5", name: "Ludhiana Wool & Knits Ltd", hub: "Ludhiana", specialty: "Worsted Wool, Acrylic Blends & Sweaters", capacity: "30,000 kg/day", certs: ["Woolmark", "OEKO-TEX"], rating: 4.8, reviews: 76, escrowVerified: true, phone: "+91-161-2500800" }
  ];

  const filtered = suppliers.filter(s => {
    const matchHub = hubFilter === "all" || s.hub.toLowerCase() === hubFilter.toLowerCase();
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.specialty.toLowerCase().includes(search.toLowerCase());
    return matchHub && matchSearch;
  });

  const handleContact = (name) => {
    setContactSuccess("Direct mill contact dispatched for " + name + "! Trade rep assigned via VyaparSethu.");
    setTimeout(() => setContactSuccess(""), 4000);
  };

  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "p-4 md:p-6 space-y-6 max-w-7xl mx-auto", children: [
    /* Header */
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-3.5", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "w-12 h-12 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center flex-shrink-0", children:
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Truck, { className: "w-6 h-6 text-teal-600" }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
        }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h1", { className: "text-xl font-bold text-gray-900 tracking-tight", children: "Verified Textile Mills & Exporters" }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-xs text-gray-500 mt-0.5", children: "320+ audited spinning, weaving, and processing mills across India's top manufacturing clusters" }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
        ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
      ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { variant: "outline", size: "sm", className: "text-xs border-gray-300 hover:bg-gray-50 cursor-pointer", onClick: () => onNavigate && onNavigate("marketplace"), children: "Browse Products →" }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { size: "sm", className: "bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs shadow-sm cursor-pointer", onClick: () => onNavigate && onNavigate("rfqs"), children: "Broadcast RFQ to Mills" }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
      ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
    ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),

    contactSuccess && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CircleCheckBig, { className: "w-4 h-4 text-emerald-600" }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
        contactSuccess
      ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("button", { onClick: () => setContactSuccess(""), className: "font-bold text-emerald-900", children: "✕" }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
    ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),

    /* Search and Filters */
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-gray-200", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "relative flex-1 max-w-md", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Search, { className: "w-4 h-4 text-gray-400 absolute left-3 top-2.5" }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, {
          placeholder: "Search mills by name or product specialty...",
          value: search,
          onChange: (e) => setSearch(e.target.value),
          className: "pl-9 text-xs h-9 bg-gray-50 border-gray-200"
        }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
      ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "text-xs text-gray-500 font-medium", children: "Hub:" }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("select", {
          value: hubFilter,
          onChange: (e) => setHubFilter(e.target.value),
          className: "h-9 text-xs border border-gray-300 rounded-lg px-2.5 bg-white text-gray-700"
        }, [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("option", { value: "all", children: "All Clusters" }, "all", false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("option", { value: "tirupur", children: "Tirupur (Knits)" }, "tir", false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("option", { value: "surat", children: "Surat (Silks & Weaving)" }, "sur", false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("option", { value: "ahmedabad", children: "Ahmedabad (Denim)" }, "ahm", false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("option", { value: "bhilwara", children: "Bhilwara (Suitings)" }, "bhil", false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("option", { value: "ludhiana", children: "Ludhiana (Wool)" }, "lud", false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
        ], false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
      ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
    ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),

    /* Mill Cards */
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: filtered.map(sup => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Card, { className: "border-gray-200 hover:shadow-md transition-shadow", children:
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CardContent, { className: "p-4 space-y-3", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-start justify-between gap-3", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h3", { className: "text-sm font-bold text-gray-900", children: sup.name }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Badge, { className: "bg-emerald-100 text-emerald-800 text-[10px] border-0", children: "Verified Mill" }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
            ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-xs text-gray-500 mt-0.5", children: [ "Cluster: ", /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("strong", { className: "text-gray-700", children: sup.hub }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this), " · Capacity: ", sup.capacity ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
          ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-right", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full", children: [ "★ ", sup.rating ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-[10px] text-gray-400 mt-1", children: [ sup.reviews, " orders" ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
          ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
        ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),

        /* Specialty */
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-xs text-gray-700 bg-gray-50 p-2.5 rounded-lg border border-gray-100", children: [ "Specialty: ", /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "font-medium text-gray-900", children: sup.specialty }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this) ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),

        /* Certifications Pills */
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-1.5 flex-wrap", children: sup.certs.map((c, i) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Badge, { variant: "outline", className: "text-[10px] border-gray-300 text-gray-600 bg-white", children: c }, i, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)) }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),

        /* Buttons */
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-2 pt-2 border-t border-gray-100", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { size: "sm", className: "flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-8 cursor-pointer", onClick: () => onNavigate && onNavigate("rfqs"), children: "Send Direct RFQ" }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { size: "sm", variant: "outline", className: "text-xs h-8 border-gray-300 hover:bg-gray-50 cursor-pointer", onClick: () => handleContact(sup.name), children: "Contact Mill Rep" }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
        ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
      ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
    }, sup.id, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)) }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
  ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this);
}

function BuyersPage({ onNavigate }) {
  const [search, setSearch] = reactExports.useState("");
  const [regionFilter, setRegionFilter] = reactExports.useState("all");

  const buyers = [
    { id: "by-1", name: "Al-Barakah Garments Trading LLC", region: "GCC & UAE", location: "Dubai, UAE", annualVolume: "₹4.8 Cr ($580K)", requirements: "Surat Jacquard Silk & Viscose Sarees", orders: 24, verified: true, escrowStatus: "100% On-Time" },
    { id: "by-2", name: "Nordic Organic Apparel AB", region: "Europe", location: "Stockholm, Sweden", annualVolume: "₹8.2 Cr ($990K)", requirements: "GOTS Certified Combed Cotton Single Jersey", orders: 42, verified: true, escrowStatus: "100% On-Time" },
    { id: "by-3", name: "VogueCraft US Importers", region: "USA", location: "New York, USA", annualVolume: "₹12.5 Cr ($1.5M)", requirements: "Indigo Denim Twills & Heavy Flannels", orders: 68, verified: true, escrowStatus: "100% On-Time" },
    { id: "by-4", name: "Bharat Retail Consortium", region: "Domestic", location: "Mumbai, India", annualVolume: "₹6.4 Cr", requirements: "Worsted Wool & Suiting PV Blends", orders: 38, verified: true, escrowStatus: "Verified Buyer" }
  ];

  const filtered = buyers.filter(b => {
    const matchReg = regionFilter === "all" || b.region.toLowerCase().includes(regionFilter.toLowerCase());
    const matchSearch = b.name.toLowerCase().includes(search.toLowerCase()) || b.requirements.toLowerCase().includes(search.toLowerCase());
    return matchReg && matchSearch;
  });

  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "p-4 md:p-6 space-y-6 max-w-7xl mx-auto", children: [
    /* Header */
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-3.5", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0", children:
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Users, { className: "w-6 h-6 text-blue-600" }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
        }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h1", { className: "text-xl font-bold text-gray-900 tracking-tight", children: "Global Sourcing Buyers Hub" }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-xs text-gray-500 mt-0.5", children: "Verified institutional apparel brands, international importers & retail chains with active escrow funding" }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
        ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
      ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { variant: "outline", size: "sm", className: "text-xs border-gray-300 hover:bg-gray-50 cursor-pointer", onClick: () => onNavigate && onNavigate("rfqs"), children: "View Buyer RFQs →" }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { size: "sm", className: "bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs shadow-sm cursor-pointer", onClick: () => onNavigate && onNavigate("crm"), children: "Create Direct Deal" }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
      ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
    ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),

    /* Filters */
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-gray-200", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "relative flex-1 max-w-md", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Search, { className: "w-4 h-4 text-gray-400 absolute left-3 top-2.5" }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, { placeholder: "Search buyers or sourcing requirements...", value: search, onChange: (e) => setSearch(e.target.value), className: "pl-9 text-xs h-9 bg-gray-50 border-gray-200" }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
      ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("select", {
        value: regionFilter,
        onChange: (e) => setRegionFilter(e.target.value),
        className: "h-9 text-xs border border-gray-300 rounded-lg px-2.5 bg-white text-gray-700"
      }, [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("option", { value: "all", children: "All Buyer Regions" }, "all", false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("option", { value: "gcc", children: "GCC & Middle East" }, "gcc", false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("option", { value: "europe", children: "Europe & UK" }, "eu", false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("option", { value: "usa", children: "United States" }, "us", false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("option", { value: "domestic", children: "Domestic India" }, "dom", false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
      ], false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
    ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),

    /* Buyer Cards Grid */
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: filtered.map(b => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Card, { className: "border-gray-200 hover:shadow-md transition-shadow", children:
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CardContent, { className: "p-4 space-y-3", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-start justify-between", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h3", { className: "text-sm font-bold text-gray-900", children: b.name }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-xs text-gray-500 mt-0.5", children: [ b.location, " · ", /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "text-blue-700 font-semibold", children: b.region }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this) ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
          ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Badge, { className: "bg-blue-100 text-blue-800 border-0 text-[10px]", children: b.escrowStatus }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
        ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),

        /* Requirements */
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "p-3 bg-gray-50 rounded-xl border border-gray-100 text-xs space-y-1", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-gray-500 text-[11px]", children: "Primary Sourcing Specs:" }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "font-semibold text-gray-900", children: b.requirements }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
        ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),

        /* Metrics */
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "grid grid-cols-2 gap-2 text-xs", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "text-gray-400 text-[11px]", children: "Annual Sourcing Vol" }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "font-bold text-gray-900 mt-0.5", children: b.annualVolume }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
          ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "text-gray-400 text-[11px]", children: "Completed Deals" }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "font-bold text-emerald-600 mt-0.5", children: [ b.orders, " Trade Orders" ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
          ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
        ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),

        /* Action */
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-2 pt-2 border-t border-gray-100", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { size: "sm", className: "flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-8 cursor-pointer", onClick: () => onNavigate && onNavigate("crm"), children: "Propose Deal / Quote" }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { size: "sm", variant: "outline", className: "text-xs h-8 border-gray-300 hover:bg-gray-50 cursor-pointer", onClick: () => onNavigate && onNavigate("rfqs"), children: "View RFQs" }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
        ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
      ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
    }, b.id, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)) }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
  ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this);
}

function RFQsPage({ onNavigate }) {
  const [rfqFilter, setRfqFilter] = reactExports.useState("all");
  const [createModalOpen, setCreateModalOpen] = reactExports.useState(false);
  const [bidModalOpen, setBidModalOpen] = reactExports.useState(false);
  const [selectedRfq, setSelectedRfq] = reactExports.useState(null);
  const [rfqSuccess, setRfqSuccess] = reactExports.useState("");
  const [newRfq, setNewRfq] = reactExports.useState({ title: "", category: "Knits & Cotton", quantity: "5,000 kg", targetPrice: "₹270/kg", deadline: "7 Days" });
  const [bidRate, setBidRate] = reactExports.useState("265");

  const [rfqs, setRfqs] = reactExports.useState([
    { id: "rfq-101", title: "Combed Ring-Spun Cotton Yarn 40s/1 for Export", buyer: "Nordic Organic Apparel AB", category: "Yarn & Fibers", quantity: "15,000 kg", targetPrice: "₹290 / kg", bidsCount: 6, deadline: "3 Days left", status: "open", escrowSecured: true },
    { id: "rfq-102", title: "Brocade Silk Jacquard 48-inch Width for GCC Retail", buyer: "Al-Barakah Garments Trading", category: "Silks & Sarees", quantity: "4,000 meters", targetPrice: "₹380 / meter", bidsCount: 4, deadline: "5 Days left", status: "open", escrowSecured: true },
    { id: "rfq-103", title: "Indigo Denim 11.5 oz Spandex Stretch Fabric", buyer: "VogueCraft US Importers", category: "Denim & Twill", quantity: "8,000 meters", targetPrice: "₹210 / meter", bidsCount: 9, deadline: "Awarding Today", status: "review", escrowSecured: true },
    { id: "rfq-104", title: "Organic BCI Single Jersey 180 GSM Bio-Washed", buyer: "EcoApparel London Ltd", category: "Fabrics", quantity: "2,500 kg", targetPrice: "₹360 / kg", bidsCount: 5, deadline: "Completed", status: "awarded", escrowSecured: true }
  ]);

  const handleCreateRfq = (e) => {
    e.preventDefault();
    if (!newRfq.title) return;
    const item = {
      id: "rfq-" + (100 + rfqs.length + 1),
      title: newRfq.title,
      buyer: "My Organization",
      category: newRfq.category,
      quantity: newRfq.quantity,
      targetPrice: newRfq.targetPrice,
      bidsCount: 0,
      deadline: newRfq.deadline,
      status: "open",
      escrowSecured: true
    };
    setRfqs([item, ...rfqs]);
    setCreateModalOpen(false);
    setNewRfq({ title: "", category: "Knits & Cotton", quantity: "5,000 kg", targetPrice: "₹270/kg", deadline: "7 Days" });
    setRfqSuccess("New RFQ published and broadcast to 320 verified textile mills!");
    setTimeout(() => setRfqSuccess(""), 4000);
  };

  const handleOpenBid = (r) => {
    setSelectedRfq(r);
    setBidRate(r.targetPrice.replace(/[^0-9]/g, "") || "280");
    setBidModalOpen(true);
  };

  const handleSubmitBid = (e) => {
    e.preventDefault();
    setRfqs(prev => prev.map(r => r.id === selectedRfq.id ? { ...r, bidsCount: r.bidsCount + 1 } : r));
    setBidModalOpen(false);
    setRfqSuccess("Your quotation of ₹" + bidRate + " has been submitted to " + selectedRfq.buyer + "!");
    setTimeout(() => setRfqSuccess(""), 4000);
  };

  const filtered = rfqs.filter(r => {
    if (rfqFilter === "open") return r.status === "open";
    if (rfqFilter === "review") return r.status === "review";
    if (rfqFilter === "awarded") return r.status === "awarded";
    return true;
  });

  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "p-4 md:p-6 space-y-6 max-w-7xl mx-auto", children: [
    /* Header */
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-3.5", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "w-12 h-12 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center flex-shrink-0", children:
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(FileSearch, { className: "w-6 h-6 text-orange-600" }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
        }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h1", { className: "text-xl font-bold text-gray-900 tracking-tight", children: "Tenders & RFQ Procurement Center" }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-xs text-gray-500 mt-0.5", children: "Post requests for quotation, review mill bids, and award tenders with milestone trade escrow guarantees" }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
        ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
      ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { variant: "outline", size: "sm", className: "text-xs border-gray-300 hover:bg-gray-50 cursor-pointer", onClick: () => onNavigate && onNavigate("marketplace"), children: "Catalog Items →" }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { size: "sm", className: "bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs shadow-sm cursor-pointer", onClick: () => setCreateModalOpen(true), children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Plus, { className: "w-3.5 h-3.5 mr-1" }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
          "Post New RFQ"
        ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
      ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
    ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),

    rfqSuccess && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CircleCheckBig, { className: "w-4 h-4 text-emerald-600" }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
        rfqSuccess
      ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("button", { onClick: () => setRfqSuccess(""), className: "font-bold text-emerald-900", children: "✕" }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
    ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),

    /* Filter Tabs */
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-1.5 border-b border-gray-200 pb-1 text-xs", children: [
      { id: "all", label: "All Tenders (" + rfqs.length + ")" },
      { id: "open", label: "Open Bidding (" + rfqs.filter(r => r.status === "open").length + ")" },
      { id: "review", label: "Under Review (" + rfqs.filter(r => r.status === "review").length + ")" },
      { id: "awarded", label: "Awarded & Escrow (" + rfqs.filter(r => r.status === "awarded").length + ")" }
    ].map(t => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("button", {
      onClick: () => setRfqFilter(t.id),
      className: cn(
        "px-3.5 py-2 rounded-t-lg font-medium transition-colors cursor-pointer",
        rfqFilter === t.id ? "border-b-2 border-emerald-600 text-emerald-700 bg-emerald-50/50 font-semibold" : "text-gray-600 hover:text-gray-900"
      ),
      children: t.label
    }, t.id, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)) }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),

    /* RFQs List */
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-3.5", children: filtered.map(r => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Card, { className: "border-gray-200 hover:shadow-md transition-shadow", children:
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CardContent, { className: "p-4 space-y-3", children: [
        /* Top Row */
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-2", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-0.5", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "font-mono text-[11px] font-bold text-gray-400", children: r.id }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h3", { className: "text-sm font-bold text-gray-900", children: r.title }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
            ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-xs text-gray-500", children: [ "Buyer: ", /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("strong", { className: "text-gray-700", children: r.buyer }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this), " · Category: ", r.category ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
          ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Badge, { className: r.status === "open" ? "bg-emerald-100 text-emerald-800" : r.status === "review" ? "bg-amber-100 text-amber-800" : "bg-purple-100 text-purple-800", children: r.status.toUpperCase() }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Badge, { variant: "outline", className: "text-xs text-gray-500 border-gray-300", children: r.deadline }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
          ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
        ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),

        /* Specs Pill Strip */
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "p-3 bg-gray-50 rounded-xl border border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "text-gray-400 text-[11px]", children: "Required Quantity" }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "font-bold text-gray-900 mt-0.5", children: r.quantity }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
          ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "text-gray-400 text-[11px]", children: "Target Price" }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "font-bold text-gray-900 mt-0.5", children: r.targetPrice }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
          ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "text-gray-400 text-[11px]", children: "Bids Submitted" }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "font-bold text-blue-600 mt-0.5", children: [ r.bidsCount, " Mill Quotations" ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
          ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "text-gray-400 text-[11px]", children: "Escrow Protection" }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "font-bold text-emerald-600 mt-0.5", children: "VyaparSethu Verified" }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
          ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
        ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),

        /* Actions */
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center justify-end gap-2 pt-1", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { size: "sm", variant: "outline", className: "text-xs h-8 border-gray-300 hover:bg-gray-50 cursor-pointer", onClick: () => handleOpenBid(r), children: "Submit Quotation / Bid" }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { size: "sm", className: "bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-8 cursor-pointer", onClick: () => onNavigate && onNavigate("crm"), children: "Review Bids & Escrow" }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
        ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
      ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
    }, r.id, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)) }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),

    /* Create RFQ Modal */
    createModalOpen && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4", children:
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "bg-white rounded-2xl max-w-lg w-full p-5 space-y-4 shadow-xl border border-gray-200", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h3", { className: "text-sm font-bold text-gray-900", children: "Create & Broadcast Custom RFQ" }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("button", { onClick: () => setCreateModalOpen(false), className: "text-gray-400 hover:text-gray-600 font-bold", children: "✕" }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
        ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("form", { onSubmit: handleCreateRfq, className: "space-y-3 text-xs", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("label", { className: "font-medium text-gray-700", children: "RFQ Procurement Title" }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, { required: true, placeholder: "e.g., 20,000 meters Organic Cotton Poplin 40s", value: newRfq.title, onChange: (e) => setNewRfq({ ...newRfq, title: e.target.value }), className: "mt-1 h-8 text-xs" }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
          ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "grid grid-cols-2 gap-3", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("label", { className: "font-medium text-gray-700", children: "Category" }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("select", { value: newRfq.category, onChange: (e) => setNewRfq({ ...newRfq, category: e.target.value }), className: "mt-1 w-full h-8 border border-gray-300 rounded-md px-2 bg-white text-xs" }, [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("option", { value: "Yarn & Fibers", children: "Yarn & Fibers" }, "y", false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("option", { value: "Knits & Cotton", children: "Knits & Cotton" }, "k", false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("option", { value: "Silks & Sarees", children: "Silks & Sarees" }, "s", false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("option", { value: "Denim & Twill", children: "Denim & Twill" }, "d", false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
              ], false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
            ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("label", { className: "font-medium text-gray-700", children: "Quantity Required" }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, { required: true, value: newRfq.quantity, onChange: (e) => setNewRfq({ ...newRfq, quantity: e.target.value }), className: "mt-1 h-8 text-xs" }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
            ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
          ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "grid grid-cols-2 gap-3", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("label", { className: "font-medium text-gray-700", children: "Target Price" }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, { required: true, value: newRfq.targetPrice, onChange: (e) => setNewRfq({ ...newRfq, targetPrice: e.target.value }), className: "mt-1 h-8 text-xs" }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
            ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("label", { className: "font-medium text-gray-700", children: "Bidding Window" }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, { required: true, value: newRfq.deadline, onChange: (e) => setNewRfq({ ...newRfq, deadline: e.target.value }), className: "mt-1 h-8 text-xs" }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
            ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
          ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center justify-end gap-2 pt-2", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { type: "button", variant: "outline", size: "sm", onClick: () => setCreateModalOpen(false), className: "text-xs", children: "Cancel" }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { type: "submit", size: "sm", className: "bg-emerald-600 hover:bg-emerald-700 text-white text-xs", children: "Broadcast RFQ" }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
          ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
        ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
      ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
    }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),

    /* Submit Bid Modal */
    bidModalOpen && selectedRfq && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4", children:
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "bg-white rounded-2xl max-w-md w-full p-5 space-y-4 shadow-xl border border-gray-200", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h3", { className: "text-sm font-bold text-gray-900", children: "Submit Mill Tender Bid" }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("button", { onClick: () => setBidModalOpen(false), className: "text-gray-400 hover:text-gray-600 font-bold", children: "✕" }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
        ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "p-3 bg-gray-50 rounded-xl border border-gray-100 text-xs", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "font-semibold text-gray-900", children: selectedRfq.title }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-gray-500 mt-0.5", children: [ "Target: ", selectedRfq.targetPrice, " · Quantity: ", selectedRfq.quantity ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
        ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("form", { onSubmit: handleSubmitBid, className: "space-y-3 text-xs", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("label", { className: "font-medium text-gray-700", children: "Your Offered Rate (₹ per unit)" }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, { required: true, value: bidRate, onChange: (e) => setBidRate(e.target.value), className: "mt-1 h-8 text-xs" }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
          ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center justify-end gap-2 pt-2", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { type: "button", variant: "outline", size: "sm", onClick: () => setBidModalOpen(false), className: "text-xs", children: "Cancel" }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { type: "submit", size: "sm", className: "bg-emerald-600 hover:bg-emerald-700 text-white text-xs", children: "Confirm Bid" }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
          ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
        ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
      ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
    }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
  ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this);
}

function AutomationPage({ onNavigate }) {
  const [rules, setRules] = reactExports.useState([
    { id: "rule-1", name: "High-Value Lead Auto-Routing", trigger: "New Lead Created (Score > 80)", action: "Notify Tirupur & Surat Sales Desks via WhatsApp", active: true, runs: 142 },
    { id: "rule-2", name: "Milestone Escrow Inspection Alert", trigger: "SGS Lab Test Uploaded", action: "Trigger 80% Escrow Milestone Release Approval", active: true, runs: 68 },
    { id: "rule-3", name: "RFQ Instant Mill Matcher", trigger: "New RFQ Published", action: "Match top 5 certified mills and auto-dispatch quote requests", active: true, runs: 312 },
    { id: "rule-4", name: "Campaign Ad Budget Threshold Guard", trigger: "CPC spikes > ₹350", action: "Pause ad set & alert Campaign Lead", active: false, runs: 19 }
  ]);
  const [testResult, setTestResult] = reactExports.useState("");
  const [testingId, setTestingId] = reactExports.useState(null);

  const toggleRule = (id) => {
    setRules(prev => prev.map(r => r.id === id ? { ...r, active: !r.active } : r));
  };

  const handleTestRule = (r) => {
    setTestingId(r.id);
    setTimeout(() => {
      setTestingId(null);
      setTestResult("Simulation passed for '" + r.name + "': Trigger matched condition, action executed with 0ms latency.");
      setTimeout(() => setTestResult(""), 4000);
    }, 600);
  };

  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "p-4 md:p-6 space-y-6 max-w-7xl mx-auto", children: [
    /* Header */
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-3.5", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "w-12 h-12 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center flex-shrink-0", children:
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Zap, { className: "w-6 h-6 text-violet-600" }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
        }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h1", { className: "text-xl font-bold text-gray-900 tracking-tight", children: "Business Automation Engine" }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-xs text-gray-500 mt-0.5", children: "Event-driven triggers, escrow notifications, and autonomous RFQ matchmaking workflows" }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
        ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
      ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { size: "sm", className: "bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs shadow-sm cursor-pointer", onClick: () => onNavigate && onNavigate("workflows"), children: "Visual Workflows →" }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
      ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
    ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),

    testResult && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CircleCheckBig, { className: "w-4 h-4 text-emerald-600" }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
        testResult
      ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("button", { onClick: () => setTestResult(""), className: "font-bold text-emerald-900", children: "✕" }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
    ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),

    /* Automation Rules List */
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-3", children: rules.map(r => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Card, { className: "border-gray-200 hover:shadow-sm transition-shadow", children:
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CardContent, { className: "p-4 flex flex-col md:flex-row md:items-center justify-between gap-4", children: [
        /* Left: Info */
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h3", { className: "text-sm font-bold text-gray-900", children: r.name }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Badge, { className: r.active ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-600", children: r.active ? "Active" : "Paused" }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
          ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-xs text-gray-600", children: [ "When: ", /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("strong", { className: "text-gray-800", children: r.trigger }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this) ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-xs text-gray-600", children: [ "Then: ", /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "text-emerald-700 font-medium", children: r.action }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this), " · Runs: ", r.runs ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
        ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),

        /* Right: Controls */
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, {
            size: "sm",
            variant: "outline",
            className: "text-xs h-8 border-gray-300 hover:bg-gray-50 cursor-pointer",
            disabled: testingId === r.id,
            onClick: () => handleTestRule(r),
            children: testingId === r.id ? "Testing..." : "Test Simulation"
          }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, {
            size: "sm",
            className: r.active ? "bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs h-8 cursor-pointer" : "bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-8 cursor-pointer",
            onClick: () => toggleRule(r.id),
            children: r.active ? "Pause Rule" : "Activate"
          }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
        ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
      ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
    }, r.id, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)) }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
  ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this);
}

function WorkflowsPage({ onNavigate }) {
  const [runningId, setRunningId] = reactExports.useState(null);
  const [runMessage, setRunMessage] = reactExports.useState("");

  const workflows = [
    {
      id: "wf-1",
      name: "Global Buyer Sourcing & RFQ Escalation",
      steps: ["1. Buyer posts tender", "2. AI matches top 5 verified mills", "3. Mill bids collected (48h)", "4. Escrow deposited", "5. SGS lab test released"],
      status: "Production Ready",
      successRate: "99.4%"
    },
    {
      id: "wf-2",
      name: "Autonomous SEO & Content Syndication",
      steps: ["1. Keyword rank tracker triggers", "2. AI generates category article", "3. Meta tags & Schema injected", "4. XML Sitemap pinged"],
      status: "Active",
      successRate: "98.8%"
    },
    {
      id: "wf-3",
      name: "Trade Escrow Milestone Release Flow",
      steps: ["1. Bill of Lading (BL) uploaded", "2. Customs verification check", "3. Pre-shipment inspection pass", "4. Bank escrow release"],
      status: "Secured",
      successRate: "100%"
    }
  ];

  const handleRunWorkflow = (w) => {
    setRunningId(w.id);
    setRunMessage("");
    setTimeout(() => {
      setRunningId(null);
      setRunMessage("Workflow '" + w.name + "' executed successfully! All " + w.steps.length + " pipeline stages passed.");
      setTimeout(() => setRunMessage(""), 4500);
    }, 1000);
  };

  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "p-4 md:p-6 space-y-6 max-w-7xl mx-auto", children: [
    /* Header */
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-3.5", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center flex-shrink-0", children:
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Workflow, { className: "w-6 h-6 text-indigo-600" }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
        }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h1", { className: "text-xl font-bold text-gray-900 tracking-tight", children: "Visual Workflow Pipelines" }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-xs text-gray-500 mt-0.5", children: "End-to-end multi-step orchestration for cross-border sourcing, escrow milestones, and syndication" }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
        ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
      ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { size: "sm", className: "bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs shadow-sm cursor-pointer", onClick: () => onNavigate && onNavigate("automation"), children: "Automation Rules →" }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
      ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
    ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),

    runMessage && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CircleCheckBig, { className: "w-4 h-4 text-emerald-600" }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
        runMessage
      ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("button", { onClick: () => setRunMessage(""), className: "font-bold text-emerald-900", children: "✕" }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
    ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),

    /* Workflows Pipeline Cards */
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-4", children: workflows.map(w => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Card, { className: "border-gray-200 hover:shadow-md transition-shadow", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CardHeader, { className: "pb-2 border-b border-gray-100 flex flex-row items-center justify-between", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CardTitle, { className: "text-sm font-bold text-gray-900", children: w.name }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-xs text-gray-500", children: [ "Success Rate: ", /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("strong", { className: "text-emerald-700", children: w.successRate }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this) ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
        ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Badge, { className: "bg-indigo-100 text-indigo-800 text-[10px]", children: w.status }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, {
            size: "sm",
            className: "bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-8 cursor-pointer",
            disabled: runningId === w.id,
            onClick: () => handleRunWorkflow(w),
            children: runningId === w.id ? "Executing Pipeline..." : "Run Pipeline Now"
          }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
        ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
      ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),

      /* Pipeline Step Diagram */
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CardContent, { className: "p-4", children:
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-2 overflow-x-auto pb-1 text-xs", children: w.steps.map((st, i) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-2 flex-shrink-0", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-800", children: st }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this),
          i < w.steps.length - 1 && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "text-gray-400 font-bold", children: "→" }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
        ] }, i, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)) }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
      }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
    ] }, w.id, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)) }, void 0, false, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this)
  ] }, void 0, true, { fileName: "MarketplacePages.tsx", lineNumber: 1, columnNumber: 1 }, this);
}
`;

// Read bundle-app.js
let code = fs.readFileSync("src/bundle-app.js", "utf8");

const start = code.indexOf("function MarketplacePage(");
const end = code.indexOf("function ImageFactoryPage(");

if (start === -1 || end === -1) {
  console.error("Could not find marketplace block in bundle-app.js!");
  process.exit(1);
}

console.log("Replacing Marketplace block from", start, "to", end);
code = code.slice(0, start) + marketplacePagesCode + "\n" + code.slice(end);

fs.writeFileSync("src/bundle-app.js", code, "utf8");
console.log("Marketplace block replacement complete!");

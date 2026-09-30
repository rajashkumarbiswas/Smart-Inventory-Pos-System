"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  LogOut,
  ShieldCheck,
  Plus,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  ScanBarcode,
  Menu,
  X,
  Loader2,
  Server,
  Database,
} from "lucide-react";

const API_BASE = "http://localhost:5000";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Products", href: "/products", icon: Package },
  { label: "Sales", href: "/sales", icon: ShoppingCart },
];

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export default function DashboardPage() {
  const router = useRouter();

  const [authChecked, setAuthChecked] = useState(false);
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activePath, setActivePath] = useState("/dashboard");

  const [stats, setStats] = useState({
    totalProducts: 0,
    todaysSales: 0,
    lowStockItems: 0,
    salesChange: null,
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsNote, setStatsNote] = useState("");

  const [systemStatus, setSystemStatus] = useState({
    api: "checking",
    inventory: "unknown",
    session: "checking",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (parseError) {
      setUser(null);
    }

    setSystemStatus((prev) => ({ ...prev, session: "active" }));
    setAuthChecked(true);

    const fetchStats = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/dashboard/stats`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          router.push("/login");
          return;
        }

        if (!response.ok) {
          setSystemStatus((prev) => ({
            ...prev,
            api: "online",
            inventory: "unknown",
          }));
          setStatsNote(
            "The server is running, but the dashboard stats endpoint isn't available yet. Showing zeros."
          );
          return;
        }

        const data = await response.json();

        setStats({
          totalProducts: Number(data.totalProducts ?? 0),
          todaysSales: Number(data.todaysSales ?? data.todaySales ?? 0),
          lowStockItems: Number(data.lowStockItems ?? 0),
          salesChange:
            typeof data.salesChange === "number" ? data.salesChange : null,
        });
        setSystemStatus((prev) => ({
          ...prev,
          api: "online",
          inventory: "synced",
        }));
        setStatsNote("");
      } catch (err) {
        setSystemStatus((prev) => ({
          ...prev,
          api: "offline",
          inventory: "unknown",
        }));
        setStatsNote(
          "Can't reach the server. Make sure the backend is running on port 5000."
        );
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  const handleNavigate = (href) => {
    setActivePath(href);
    setSidebarOpen(false);
    if (href !== "/dashboard") {
      router.push(href);
    }
  };

  const statusStyles = {
    online: { dot: "bg-emerald-400", text: "text-emerald-300", label: "Online" },
    offline: { dot: "bg-red-400", text: "text-red-300", label: "Offline" },
    checking: { dot: "bg-slate-500", text: "text-slate-400", label: "Checking" },
    synced: { dot: "bg-emerald-400", text: "text-emerald-300", label: "Synced" },
    unknown: { dot: "bg-amber-400", text: "text-amber-300", label: "Not available" },
    active: { dot: "bg-emerald-400", text: "text-emerald-300", label: "Signed in" },
  };

  const statusRows = [
    { key: "api", label: "API server", icon: Server },
    { key: "inventory", label: "Inventory data", icon: Database },
    { key: "session", label: "Your session", icon: ShieldCheck },
  ];

  const displayName = user?.name || user?.email || "there";
  const initial = String(displayName).charAt(0).toUpperCase();

  const statCards = [
    {
      label: "Total products",
      value: stats.totalProducts.toLocaleString("en-US"),
      hint: "Items in your inventory",
      icon: Package,
      iconClass: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    },
    {
      label: "Today's sales",
      value: currencyFormatter.format(stats.todaysSales),
      hint: "Revenue since midnight",
      icon: DollarSign,
      iconClass: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    },
    {
      label: "Low stock items",
      value: stats.lowStockItems.toLocaleString("en-US"),
      hint:
        stats.lowStockItems > 0
          ? "Products that need restocking"
          : "Nothing needs restocking",
      icon: AlertTriangle,
      iconClass: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    },
  ];

  if (!authChecked) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-400">
        <div className="flex items-center gap-3 text-sm">
          <Loader2 className="h-5 w-5 animate-spin text-cyan-400" />
          <span>Checking your session...</span>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-950/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-800 bg-slate-900 transition-transform duration-200 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-800 px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500 text-slate-950">
              <ScanBarcode className="h-5 w-5" />
            </div>
            <span className="text-base font-semibold tracking-tight">
              Smart Inventory POS
            </span>
          </div>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
            className="rounded p-1 text-slate-400 hover:text-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4" aria-label="Main navigation">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activePath === item.href;
            return (
              <button
                key={item.href}
                type="button"
                onClick={() => handleNavigate(item.href)}
                aria-current={isActive ? "page" : undefined}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 ${
                  isActive
                    ? "bg-cyan-500/10 text-cyan-300"
                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="border-t border-slate-800 p-3">
          <div className="mb-3 flex items-center gap-3 px-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-800 text-sm font-semibold text-cyan-300">
              {initial}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-100">
                {user?.name || "Staff account"}
              </p>
              <p className="truncate text-xs text-slate-500">
                {user?.email || "Signed in"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 transition hover:bg-red-500/10 hover:text-red-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
          >
            <LogOut className="h-5 w-5" />
            <span>Log out</span>
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-800 bg-slate-950/90 px-4 backdrop-blur sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
              className="rounded p-1.5 text-slate-400 hover:text-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 lg:hidden"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-lg font-semibold tracking-tight">Dashboard</h1>
          </div>

          <button
            type="button"
            onClick={() => router.push("/sales")}
            className="flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          >
            <ShoppingCart className="h-4 w-4" />
            <span>New sale</span>
          </button>
        </header>

        <main className="space-y-8 px-4 py-8 sm:px-6 lg:px-8">
          {/* Welcome */}
          <section>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Welcome back, {user?.name ? user.name.split(" ")[0] : "there"}
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Here is how your store is doing today.
            </p>
          </section>

          {statsNote && (
            <div
              role="status"
              className="flex items-start gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-300"
            >
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
              <span>{statsNote}</span>
            </div>
          )}

          {/* Stat cards */}
          <section
            aria-label="Summary statistics"
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
          >
            {statCards.map((card) => {
              const Icon = card.icon;
              const isSales = card.label === "Today's sales";
              return (
                <div
                  key={card.label}
                  className="rounded-xl border border-slate-800 bg-slate-900 p-5"
                >
                  <div className="flex items-start justify-between">
                    <p className="text-sm font-medium text-slate-400">
                      {card.label}
                    </p>
                    <span
                      className={`flex h-10 w-10 items-center justify-center rounded-lg border ${card.iconClass}`}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                  </div>

                  <div className="mt-4 flex items-end gap-3">
                    {statsLoading ? (
                      <div className="h-9 w-28 animate-pulse rounded bg-slate-800" />
                    ) : (
                      <p className="text-3xl font-semibold tracking-tight">
                        {card.value}
                      </p>
                    )}

                    {isSales &&
                      !statsLoading &&
                      stats.salesChange !== null && (
                        <span
                          className={`mb-1 flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                            stats.salesChange >= 0
                              ? "bg-emerald-500/10 text-emerald-300"
                              : "bg-red-500/10 text-red-300"
                          }`}
                        >
                          <TrendingUp
                            className={`h-3.5 w-3.5 ${
                              stats.salesChange < 0 ? "rotate-180" : ""
                            }`}
                          />
                          {Math.abs(stats.salesChange)}%
                        </span>
                      )}
                  </div>

                  <p className="mt-2 text-xs text-slate-500">{card.hint}</p>
                </div>
              );
            })}
          </section>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            {/* Recent sales */}
            <section className="rounded-xl border border-slate-800 bg-slate-900 p-5 xl:col-span-2">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold">Recent sales</h3>
                <TrendingUp className="h-5 w-5 text-slate-600" />
              </div>

              <div className="mt-6 flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-800 px-6 py-12 text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-800 text-emerald-400">
                  <ShoppingCart className="h-6 w-6" />
                </span>
                <p className="mt-4 text-sm font-medium text-slate-200">
                  No sales to show yet
                </p>
                <p className="mt-1 max-w-sm text-sm text-slate-500">
                  Complete a sale and it will appear here with its total and
                  time.
                </p>
                <button
                  type="button"
                  onClick={() => router.push("/sales")}
                  className="mt-5 flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-300 transition hover:bg-emerald-500/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                >
                  <Plus className="h-4 w-4" />
                  <span>Start a sale</span>
                </button>
              </div>
            </section>

            {/* Right column */}
            <div className="space-y-6">
              {/* Quick actions */}
              <section className="rounded-xl border border-slate-800 bg-slate-900 p-5">
                <h3 className="text-base font-semibold">Quick actions</h3>
                <div className="mt-4 space-y-3">
                  <button
                    type="button"
                    onClick={() => router.push("/products")}
                    className="flex w-full items-center gap-3 rounded-lg border border-slate-800 bg-slate-950 px-4 py-3 text-left text-sm font-medium text-slate-200 transition hover:border-cyan-500/40 hover:text-cyan-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-md bg-cyan-500/10 text-cyan-400">
                      <Plus className="h-4 w-4" />
                    </span>
                    <span>Add a product</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push("/sales")}
                    className="flex w-full items-center gap-3 rounded-lg border border-slate-800 bg-slate-950 px-4 py-3 text-left text-sm font-medium text-slate-200 transition hover:border-emerald-500/40 hover:text-emerald-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-400">
                      <ShoppingCart className="h-4 w-4" />
                    </span>
                    <span>Open the register</span>
                  </button>
                </div>
              </section>

              {/* System status */}
              <section className="rounded-xl border border-slate-800 bg-slate-900 p-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold">System status</h3>
                  <ShieldCheck className="h-5 w-5 text-emerald-400" />
                </div>

                <ul className="mt-4 divide-y divide-slate-800">
                  {statusRows.map((row) => {
                    const Icon = row.icon;
                    const style =
                      statusStyles[systemStatus[row.key]] ||
                      statusStyles.unknown;
                    return (
                      <li
                        key={row.key}
                        className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                      >
                        <span className="flex items-center gap-3 text-sm text-slate-300">
                          <Icon className="h-4 w-4 text-slate-500" />
                          {row.label}
                        </span>
                        <span
                          className={`flex items-center gap-2 text-sm font-medium ${style.text}`}
                        >
                          <span
                            className={`h-2 w-2 rounded-full ${style.dot}`}
                          />
                          {style.label}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
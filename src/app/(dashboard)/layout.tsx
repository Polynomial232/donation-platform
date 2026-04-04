"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Dashboard,
  Wallet,
  Layers,
  Settings as SettingsIcon,
  Archive,
  Time,
  Result,
  Analytics,
  User as UserIcon,
  Logout,
  ChevronDown as ChevronDownIcon,
  Activity,
  UserMultiple,
  CloudUpload,
  Notification,
} from "@carbon/icons-react";
import { cn } from "@/lib/utils";
import { IconNavigation, DetailSidebar } from "@/components/ui/sidebar-component";

interface NavItem {
  id: string;
  icon: React.ReactNode;
  label: string;
}

const navItems: NavItem[] = [
  { id: "dashboard", icon: <Dashboard size={18} />, label: "Dashboard" },
  { id: "wallet", icon: <Wallet size={18} />, label: "Financials" },
  { id: "tools", icon: <Layers size={18} />, label: "Streaming" },
  { id: "settings", icon: <SettingsIcon size={18} />, label: "Account" },
];

function getSidebarContent(activeSection: string, pathname: string): any {
  const contentMap: Record<string, any> = {
    dashboard: {
      title: "Dashboard",
      sections: [
        {
          title: "General",
          items: [
            {
              icon: <Analytics size={16} />,
              label: "Account Overview",
              href: "/dashboard",
              isActive: pathname === "/dashboard",
            },
            {
              icon: <Activity size={16} />,
              label: "Transaction History",
              href: "/dashboard/history",
              isActive: pathname === "/dashboard/history",
            },
          ],
        },
      ],
    },
    wallet: {
      title: "Financials",
      sections: [
        {
          title: "Management",
          items: [
            {
              icon: <Result size={16} />,
              label: "Payout Management",
              href: "/dashboard/withdrawals",
              isActive: pathname === "/dashboard/withdrawals",
            },
            {
              icon: <Wallet size={16} />,
              label: "Payment Accounts",
              href: "/dashboard/payouts",
              isActive: pathname === "/dashboard/payouts",
            },
          ],
        },
      ],
    },
    tools: {
      title: "Streaming Tools",
      sections: [
        {
          title: "Customization",
          items: [
            {
              icon: <Layers size={16} />,
              label: "Overlay Settings",
              href: "/dashboard/overlay",
              isActive: pathname === "/dashboard/overlay",
            },
          ],
        },
      ],
    },
    settings: {
      title: "Account",
      sections: [
        {
          title: "System",
          items: [
            {
              icon: <SettingsIcon size={16} />,
              label: "Profile Settings",
              href: "/dashboard/settings",
              isActive: pathname === "/dashboard/settings",
            },
          ],
        },
      ],
    },
  };
  return contentMap[activeSection] || contentMap.dashboard;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = React.useState(() => {
    if (pathname.includes("withdrawals") || pathname.includes("payouts")) return "wallet";
    if (pathname.includes("overlay")) return "tools";
    if (pathname.includes("settings")) return "settings";
    return "dashboard";
  });
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const router = useRouter();

  const handleLinkClick = (href: string) => {
    router.push(href);
  };

  const currentContent = getSidebarContent(activeSection, pathname);

  return (
    <div className="min-h-screen bg-slate-950 flex overflow-hidden">
      {/* Sidebar - Desktop */}
      <div className="hidden md:flex h-screen sticky top-0 shadow-xl z-20">
        <IconNavigation
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          navItems={navItems}
          bottomItems={
            <button
              onClick={() => router.push("/")}
              className="flex items-center justify-center rounded-xl size-10 min-w-10 transition-all hover:bg-slate-700/50 text-slate-400 hover:text-white"
            >
              <Logout size={18} />
            </button>
          }
        />
        <DetailSidebar
          activeSection={activeSection}
          content={currentContent}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          onLinkClick={handleLinkClick}
        />
      </div>

      {/* Main Content */}
      <main
        className={cn(
          "flex-1 p-4 md:p-8 overflow-y-auto h-screen transition-all duration-300",
          isCollapsed ? "md:max-w-[calc(100vw-8rem)]" : "md:max-w-[calc(100vw-22.5rem)]"
        )}
      >
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}

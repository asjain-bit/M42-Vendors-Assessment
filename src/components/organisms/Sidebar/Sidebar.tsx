/**
 * Sidebar — Organism
 * Expandable and collapsible left navigation sidebar using M42 white color logo, relevant icons, user avatar, and logout icon.
 */

'use client'

import React from 'react'
import { LayoutDashboard, FileText, Building2, PanelLeftClose, LogOut } from 'lucide-react'
import { Avatar } from '@/components/atoms/Avatar'

export interface SidebarProps {
  activeTab: string
  onTabChange: (tabId: string) => void
  collapsed: boolean
  onToggleCollapse: () => void
  userName?: string
  userEmail?: string
  onSignOut?: () => void
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  collapsed,
  onToggleCollapse,
  userName = 'John Doe',
  userEmail = 'john.doe@m42.ae',
  onSignOut,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'questionnaires', label: 'Questionnaires', icon: FileText },
    { id: 'vendors', label: 'Vendors', icon: Building2 },
  ]

  const userInitials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()

  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 z-50 bg-[#0d212c] text-white flex flex-col transition-all duration-300 ease-in-out shadow-xl ${
        collapsed ? 'w-[72px]' : 'w-[250px]'
      }`}
    >
      {/* Sidebar Top Header */}
      <div className="p-4 flex items-center justify-between h-[64px] border-b border-[#153443] shrink-0">
        {!collapsed ? (
          <div className="flex items-center justify-between w-full min-w-0">
            <div className="flex items-center gap-2.5 overflow-hidden min-w-0">
              <img
                src="/white-logo.png"
                alt="M42 logo"
                className="h-5 w-auto object-contain shrink-0"
              />
              <span className="font-extrabold text-xs tracking-tight text-white truncate leading-none">
                Vendor assessment
              </span>
            </div>

            {/* Collapse Sidebar Icon Button inside left nav */}
            <button
              onClick={onToggleCollapse}
              aria-label="Collapse navigation"
              title="Collapse sidebar"
              className="text-white/60 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition shrink-0 cursor-pointer"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={onToggleCollapse}
            aria-label="Expand navigation"
            title="Expand sidebar"
            className="w-full flex items-center justify-center text-white/70 hover:text-white p-2 rounded-xl hover:bg-white/10 transition cursor-pointer"
          >
            <img
              src="/white-logo.png"
              alt="M42 logo"
              className="h-5 w-auto object-contain"
            />
          </button>
        )}
      </div>

      {/* Navigation Items with relevant Lucide icons */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = activeTab === item.id
          const IconComp = item.icon
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              title={collapsed ? item.label : undefined}
              className={`flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all font-semibold text-sm cursor-pointer select-none ${
                isActive
                  ? 'bg-[#153443] text-[#36c0c9] shadow-xs'
                  : 'text-white/70 hover:bg-white/5 hover:text-white'
              } ${collapsed ? 'justify-center px-0' : ''}`}
            >
              <IconComp className="w-5 h-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </button>
          )
        })}
      </nav>

      {/* Sidebar Footer User Section with Avatar and Logout Icon */}
      <div className="p-3 border-t border-[#153443] shrink-0 bg-[#08171f]/50">
        {!collapsed ? (
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <Avatar fallback={userInitials} size="sm" className="bg-[#153443] text-white border-white/20 shrink-0" />
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-white truncate">{userName}</span>
                <span className="text-[10px] text-slate-400 truncate">{userEmail}</span>
              </div>
            </div>
            <button
              onClick={onSignOut}
              title="Sign out"
              aria-label="Sign out"
              className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-white/10 transition cursor-pointer shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={onSignOut}
            title="Sign out"
            aria-label="Sign out"
            className="w-full flex items-center justify-center p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-white/10 transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </div>
    </aside>
  )
}

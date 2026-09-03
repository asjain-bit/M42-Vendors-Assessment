'use client'

import React, { useState } from 'react'
import { LoginScreen } from '@/components/screens/LoginScreen'
import { DashboardScreen } from '@/components/screens/DashboardScreen'
import { QuestionnairesScreen } from '@/components/screens/QuestionnairesScreen'
import { VendorsScreen } from '@/components/screens/VendorsScreen'
import { Sidebar } from '@/components/organisms/Sidebar'
import { SiteHeader } from '@/components/organisms/SiteHeader'

export default function HomePage() {
  // Default to false so the user lands on the SSO Login Screen first
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeTab, setActiveTab] = useState<'dashboard' | 'questionnaires' | 'vendors'>(
    'dashboard'
  )
  const [userEmail, setUserEmail] = useState('john.doe@m42.ae')

  // Expandable/Collapsible Sidebar state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const handleLogin = (email: string) => {
    setUserEmail(email)
    setIsAuthenticated(true)
  }

  const handleSignOut = () => {
    setIsAuthenticated(false)
  }

  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} />
  }

  const formattedName = userEmail
    .split('@')[0]
    .replace('.', ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())

  const getPageHeaderProps = () => {
    switch (activeTab) {
      case 'questionnaires':
        return {
          title: 'Questionnaires',
          subtitle: '', // Subheading removed per user request
        }
      case 'vendors':
        return {
          title: 'Vendors', // Renamed per Requirement 1
          subtitle: '', // Subheading removed per user request
        }
      case 'dashboard':
      default:
        return {
          title: 'Dashboard',
          subtitle: '', // Subheading removed per user request
        }
    }
  }

  const headerProps = getPageHeaderProps()

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0d212c] flex font-sans antialiased">
      {/* Expandable/Collapsible Left Navigation Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab as 'dashboard' | 'questionnaires' | 'vendors')}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        userName={formattedName}
        userEmail={userEmail}
        onSignOut={handleSignOut}
      />

      {/* Right Main Body Layout Container */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          sidebarCollapsed ? 'pl-[72px]' : 'pl-[250px]'
        }`}
      >
        {/* Top Header Bar */}
        <SiteHeader title={headerProps.title} subtitle={headerProps.subtitle} />

        {/* Main Full-Width Content Area */}
        <main className="flex-1 w-full">
          {activeTab === 'dashboard' && <DashboardScreen />}
          {activeTab === 'questionnaires' && <QuestionnairesScreen />}
          {activeTab === 'vendors' && <VendorsScreen />}
        </main>
      </div>
    </div>
  )
}

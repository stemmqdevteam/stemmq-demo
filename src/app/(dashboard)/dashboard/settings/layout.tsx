import type { Metadata } from 'next'
import { SettingsLayoutClient } from './settings-layout-client'

export const metadata: Metadata = { title: 'Settings · StemmQ' }

/**
 * Settings layout — sits INSIDE DashboardLayout.
 * DashboardLayout already provides the main sidebar.
 * This layout only adds the inner settings navigation column.
 *
 * Structure (from outside in):
 *   DashboardLayout
 *     └── <main>   ← this is where we render
 *           └── SettingsLayout
 *                 ├── SettingsSidebar (inner nav)
 *                 └── {children} (settings page content)
 */
export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return <SettingsLayoutClient>{children}</SettingsLayoutClient>
}

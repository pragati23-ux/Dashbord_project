'use client'

import { Dashboard } from '@/components/dashboard/Dashboard'

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Dashboard />
        </div>
      </div>
    </div>
  )
}

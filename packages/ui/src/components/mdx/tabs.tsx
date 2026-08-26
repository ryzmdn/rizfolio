"use client"

import React, { useState, createContext, useContext } from "react"

interface TabsContextValue {
  activeTab: string
  setActiveTab: (val: string) => void
}

const TabsContext = createContext<TabsContextValue | null>(null)

interface TabsProps {
  defaultValue?: string
  values?: string[]
  children: React.ReactNode
  className?: string
}

export function Tabs({
  defaultValue,
  values = [],
  children,
  className = "",
}: TabsProps) {
  const initialTab = defaultValue || values[0] || ""
  const [activeTab, setActiveTab] = useState(initialTab)

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div
        className={`my-6 overflow-hidden rounded-xl border border-border/80 bg-card shadow-xs ${className}`}
      >
        {children}
      </div>
    </TabsContext.Provider>
  )
}

interface TabsListProps {
  children: React.ReactNode
  className?: string
}

export function TabsList({ children, className = "" }: TabsListProps) {
  return (
    <div
      className={`flex items-center gap-1 overflow-x-auto border-b border-border/70 bg-muted/40 px-3 py-1.5 ${className}`}
    >
      {children}
    </div>
  )
}

interface TabsTriggerProps {
  value: string
  children: React.ReactNode
  className?: string
}

export function TabsTrigger({
  value,
  children,
  className = "",
}: TabsTriggerProps) {
  const context = useContext(TabsContext)
  if (!context) return null

  const isActive = context.activeTab === value

  return (
    <button
      type="button"
      onClick={() => context.setActiveTab(value)}
      className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
        isActive
          ? "bg-background text-foreground shadow-xs ring-1 ring-border"
          : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
      } ${className}`}
    >
      {children}
    </button>
  )
}

interface TabsContentProps {
  value: string
  children: React.ReactNode
  className?: string
}

export function TabsContent({
  value,
  children,
  className = "",
}: TabsContentProps) {
  const context = useContext(TabsContext)
  if (!context) return null

  if (context.activeTab !== value) return null

  return <div className={`p-4 ${className}`}>{children}</div>
}

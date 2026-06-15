import { createContext, useContext, useState, ReactNode } from 'react'

type HubContextValue = {
  hoveredPortalId: string | null
  setHoveredPortalId: (id: string | null) => void
}

const HubContext = createContext<HubContextValue | null>(null)

export function HubProvider({ children }: { children: ReactNode }) {
  const [hoveredPortalId, setHoveredPortalId] = useState<string | null>(null)
  return (
    <HubContext.Provider value={{ hoveredPortalId, setHoveredPortalId }}>{children}</HubContext.Provider>
  )
}

export function useHub() {
  const ctx = useContext(HubContext)
  if (!ctx) throw new Error('useHub must be used within HubProvider')
  return ctx
}

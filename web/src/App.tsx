import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from '@/components/AppShell'
import { IncidentView } from '@/components/IncidentView'

function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<EmptyState />} />
        <Route path="incidents/:id" element={<IncidentView />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

function EmptyState() {
  return (
    <div className="flex h-full items-center justify-center p-12 text-sm text-muted-foreground">
      Select an incident from the list.
    </div>
  )
}

export default App

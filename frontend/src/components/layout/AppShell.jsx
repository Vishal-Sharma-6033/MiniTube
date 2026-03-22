import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

const AppShell = () => {
  return (
    <div className="app-shell-grid">
      <Sidebar />
      <main className="px-4 py-5 lg:px-8 lg:py-6">
        <Navbar />
        <section className="mt-5 fade-in">
          <Outlet />
        </section>
      </main>
    </div>
  )
}

export default AppShell

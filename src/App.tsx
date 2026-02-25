function App() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-5xl mx-auto">
        <span className="text-xl font-bold tracking-tight">Neighborhood</span>
        <div className="flex gap-6 text-sm font-medium text-gray-600">
          <a href="#about" className="hover:text-gray-900 transition-colors">About</a>
          <a href="#projects" className="hover:text-gray-900 transition-colors">Projects</a>
          <a href="#contact" className="hover:text-gray-900 transition-colors">Contact</a>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-8 py-24">
        <h1 className="text-5xl font-bold tracking-tight leading-tight">
          Hello, I'm <span className="text-blue-600">Your Name</span>.
        </h1>
        <p className="mt-4 text-lg text-gray-500 max-w-xl">
          Welcome to Neighborhood — a place to share my work, ideas, and projects.
        </p>
      </section>

      {/* About */}
      <section id="about" className="max-w-5xl mx-auto px-8 py-16">
        <h2 className="text-2xl font-bold mb-4">About</h2>
        <p className="text-gray-600 max-w-2xl">
          Write a bit about yourself here. What do you do? What are you passionate about?
        </p>
      </section>

      {/* Projects */}
      <section id="projects" className="max-w-5xl mx-auto px-8 py-16">
        <h2 className="text-2xl font-bold mb-8">Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-lg">Project {i}</h3>
              <p className="text-gray-500 mt-2 text-sm">
                A short description of this project and what it does.
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="max-w-5xl mx-auto px-8 py-16">
        <h2 className="text-2xl font-bold mb-4">Contact</h2>
        <p className="text-gray-600">
          Reach out at{' '}
          <a href="mailto:hello@example.com" className="text-blue-600 hover:underline">
            hello@example.com
          </a>
        </p>
      </section>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto px-8 py-8 text-sm text-gray-400">
        &copy; {new Date().getFullYear()} Neighborhood. All rights reserved.
      </footer>
    </div>
  )
}

export default App

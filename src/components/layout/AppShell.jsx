import { Header } from "./Header.jsx";
import { Footer } from "./Footer.jsx";

export function AppShell({ children }) {
  return (
    <div className="min-h-screen bg-base-950 text-base-100 font-body flex flex-col">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
}

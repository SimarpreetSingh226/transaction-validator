import { ConfigProvider } from "./context/ConfigContext.jsx";
import { ValidationProvider } from "./context/ValidationContext.jsx";
import { AppShell } from "./components/layout/AppShell.jsx";
import { Dashboard } from "./pages/Dashboard.jsx";

export default function App() {
  return (
    <ConfigProvider>
      <ValidationProvider>
        <AppShell>
          <Dashboard />
        </AppShell>
      </ValidationProvider>
    </ConfigProvider>
  );
}

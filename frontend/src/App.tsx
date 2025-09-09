import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import CommentsPage from "./pages/CommentsPage";

const qc = new QueryClient(); // react-query client

export default function App() {
  return (
    <QueryClientProvider client={qc}>
      <div className="min-h-screen bg-bg text-fg"> {/* app frame */}
        <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8 py-8"> {/* page container */}
          <CommentsPage /> {/* main page */}
        </div>
      </div>
    </QueryClientProvider>
  );
}
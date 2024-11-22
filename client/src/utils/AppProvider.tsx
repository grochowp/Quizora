import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { LoggedUserProvider } from "../contexts/loggedUserContext";

const queryClient = new QueryClient();

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <LoggedUserProvider>{children}</LoggedUserProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

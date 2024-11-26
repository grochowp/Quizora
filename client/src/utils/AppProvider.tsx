import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { LoggedUserProvider } from "../contexts/LoggedUserContext";
import { ModalProvider } from "../contexts/ModalContext";

const queryClient = new QueryClient();

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ModalProvider>
          <LoggedUserProvider>{children}</LoggedUserProvider>
        </ModalProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { LoggedUserProvider } from "../contexts/LoggedUserContext";
import { Provider } from "react-redux";
import store from "../store/store";

const queryClient = new QueryClient();

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <BrowserRouter>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <LoggedUserProvider>{children}</LoggedUserProvider>
        </QueryClientProvider>
      </Provider>
    </BrowserRouter>
  );
};

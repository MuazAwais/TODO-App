// Redux Provider component
// This wraps your app and provides the Redux store to all components

"use client"; // This is a Client Component (needed for Redux)

import { Provider } from "react-redux";
import { store } from "./store";

export default function ReduxProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Provider store={store}>{children}</Provider>;
}


// Custom Redux hooks with TypeScript support
// These are typed versions of the standard Redux hooks

import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import type { RootState, AppDispatch } from "./store";

// Typed version of useDispatch
// This ensures TypeScript knows about your action types
export const useAppDispatch = () => useDispatch<AppDispatch>();

// Typed version of useSelector
// This ensures TypeScript knows about your state structure
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;


// middleware/lastActionMiddleware.ts
import { Middleware } from '@reduxjs/toolkit';

// store/types.ts
export interface RootState {
  lastAction: string | null;
  // Add other slices as needed
}

export const lastActionMiddleware: Middleware<{}, RootState> =
  (storeAPI) => (next) => (action) => {
    (storeAPI.getState() as RootState).lastAction = action.type;
    return next(action);
  };

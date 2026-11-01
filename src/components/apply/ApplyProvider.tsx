"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { ApplyDrawer } from "./ApplyDrawer";

type ApplyContextValue = {
  open: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
};

const ApplyContext = createContext<ApplyContextValue>({
  open: false,
  openDrawer: () => {},
  closeDrawer: () => {},
});

export function useApply() {
  return useContext(ApplyContext);
}

export function ApplyProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const openDrawer = useCallback(() => setOpen(true), []);
  const closeDrawer = useCallback(() => setOpen(false), []);
  const value = useMemo(() => ({ open, openDrawer, closeDrawer }), [open, openDrawer, closeDrawer]);

  return (
    <ApplyContext.Provider value={value}>
      {children}
      <ApplyDrawer open={open} onClose={closeDrawer} />
    </ApplyContext.Provider>
  );
}

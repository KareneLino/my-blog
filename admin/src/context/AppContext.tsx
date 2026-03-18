import React, { createContext, useContext, useState, useEffect } from 'react';

interface ConfirmOptions {
  title: string;
  content: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'primary';
  onConfirm: () => void;
}

interface AppContextType {
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (value: boolean) => void;
  toggleSidebar: () => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (value: boolean) => void;
  confirm: (options: ConfirmOptions) => void;
  confirmOptions: ConfirmOptions | null;
  closeConfirm: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // 确认弹窗状态
  const [confirmOptions, setConfirmOptions] = useState<ConfirmOptions | null>(null);

  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);

  const confirm = (options: ConfirmOptions) => {
    setConfirmOptions(options);
  };

  const closeConfirm = () => {
    setConfirmOptions(null);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarCollapsed(true);
      } else {
        setIsSidebarCollapsed(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <AppContext.Provider
      value={{
        isSidebarCollapsed,
        setIsSidebarCollapsed,
        toggleSidebar,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
        confirm,
        confirmOptions,
        closeConfirm,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

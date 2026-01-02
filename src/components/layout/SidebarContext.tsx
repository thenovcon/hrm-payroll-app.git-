'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type SidebarContextType = {
    isOpen: boolean;
    toggleSidebar: () => void;
    closeSidebar: () => void;
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);

    // Auto-close on route change could be added here if we had router access, 
    // but users might want to keep it open on desktop. 
    // For mobile, we usually close on click.

    const toggleSidebar = () => setIsOpen(prev => !prev);
    const closeSidebar = () => setIsOpen(false);

    return (
        <SidebarContext.Provider value={{ isOpen, toggleSidebar, closeSidebar }}>
            {children}
        </SidebarContext.Provider>
    );
}

export const useSidebar = () => {
    const context = useContext(SidebarContext);
    if (!context) throw new Error('useSidebar must be used within a SidebarProvider');
    return context;
};

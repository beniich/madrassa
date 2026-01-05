import React from "react";
import DashboardSidebar from "./DashboardSidebar";
import DashboardTopBar from "./DashboardTopBar";

interface DashboardLayoutProps {
    children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
    return (
        <div className="flex min-h-screen bg-background w-full">
            <DashboardSidebar />
            <div className="flex-1 flex flex-col min-w-0">
                <DashboardTopBar />
                <main className="flex-1 p-6 overflow-auto">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;

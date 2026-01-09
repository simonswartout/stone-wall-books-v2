import React, { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { StoreProvider, useStore } from './contexts/StoreContext';
import Header from './components/organisms/Header';
import Footer from './components/organisms/Footer';
import HomeDashboard from './components/organisms/HomeDashboard';
import CatalogView from './components/organisms/CatalogView';
import ProcurementProgram from './components/organisms/ProcurementProgram';
import LibrarianDesk from './components/organisms/LibrarianDesk';

import bg1 from './assets/bg-1.jpg';
import bg2 from './assets/bg-2.jpg';
import bg3 from './assets/bg-3.jpg';

function AppContent() {
  const [activeTab, setActiveTab] = useState("Home");
  // Default empty shop to avoid crash before data loads
  const { data, isLibrarian } = useStore();
  const shop = data?.shop || {};

  // Background Logic
  const getBackgroundStyle = () => {
    if (activeTab === "Data") return { backgroundColor: "#f4f1ea" };

    let img;
    switch (activeTab) {
      case "Catalog": img = bg2; break;
      case "Procurement Program": img = bg3; break;
      case "Home":
      default: img = bg1; break;
    }
    return {
      backgroundImage: `url(${img})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    };
  };

  const isWithImage = activeTab !== "Data";

  return (
    <div className="min-h-screen font-sans transition-all duration-500 ease-in-out" style={getBackgroundStyle()}>

      {/* Overlay for readability if image is present */}
      {isWithImage && <div className="fixed inset-0 bg-[#f4f1ea]/60 backdrop-blur-[1px] -z-0 pointer-events-none" />}

      <div className="relative z-10 flex flex-col min-h-screen">
        <div className="h-1.5 bg-emerald-950 w-full" />

        <Header
          shop={shop}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isLibrarian={isLibrarian}
        />

        <main className="mx-auto max-w-6xl px-6 py-10 flex-grow w-full">
          {activeTab === "Home" && <HomeDashboard setTab={setActiveTab} />}
          {activeTab === "Catalog" && <CatalogView />}
          {activeTab === "Procurement Program" && <ProcurementProgram />}
          {activeTab === "Data" && <LibrarianDesk />}
        </main>

        <Footer setTab={setActiveTab} isLibrarian={isLibrarian} />

        {isWithImage && (
          <div className="pb-8 text-center relative z-20">
            <p className="text-xs font-serif italic text-emerald-950 font-bold tracking-wide">
              Photo Credit: Nancy Robie of Fitzwilliam, NH
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <StoreProvider>
        <AppContent />
      </StoreProvider>
    </AuthProvider>
  );
}

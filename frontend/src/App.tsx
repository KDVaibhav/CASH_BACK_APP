import React, { JSX } from "react";
import { Dashboard } from "./pages/dashboard";
import { Navbar } from "./components/navbar";
import { CustomerDashboard } from "./pages/customerDashboard";
import { CampaignDashboard } from "./pages/campaignDashboard";
import { Store } from "./pages/store";
import { useNavigationStore } from "./store/useNavigationStore";
import { BreadCrumbs } from "./components/breadCrumbs";
import { CreateCampaign } from "./pages/createCampaign";
import { CreateStore } from "./pages/createStore";
function App() {
  const currentPage = useNavigationStore((s) => s.currentPage);
  const renderPage = () => {
    switch (currentPage) {
      case "Orders":
        return <Store />;
      case "Campaigns":
        return <CampaignDashboard />;
      case "Customers":
        return <CustomerDashboard />;
      case "Create Campaign":
        return <CreateCampaign />;
      case "Create Store":
        return <CreateStore />;
      default:
        return <Dashboard />;
    }
  };
  return (
    <>
      <Navbar />
      <div className="px-8 py-2 bg-gray-50 h-screen">
        <BreadCrumbs />
        {renderPage()}
      </div>
    </>
  );
}

export default App;

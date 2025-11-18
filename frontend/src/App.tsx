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
      <div className="flex items-center justify-center bg-gray-50">
        <div className=" px-8 py-2 w-full h-screen max-w-[1200px]">
          <BreadCrumbs />
          {renderPage()}
        </div>
      </div>
    </>
  );
}

export default App;

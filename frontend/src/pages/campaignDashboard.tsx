import { Plus } from "lucide-react";
import React from "react";
import { useNavigationStore } from "../store/useNavigationStore";
import { CreateCampaign } from "./createCampaign";
import { Button } from "../components/button";

export const CampaignDashboard = () => {
  const navigate = useNavigationStore((s) => s.navigate);
  const currentPage = useNavigationStore((s) => s.currentPage);
  return (
    <div className="">
      <div className="flex justify-between">
        <span className="text-3xl font-bold">Campaigns</span>
        <Button
          onClick={() =>
            navigate("Create Campaign", [
              { label: "Home" },
              { label: "Campaigns" },
              { label: "Create Campaign" },
            ])
          }
          label={
            <span className="flex">
              <Plus className="w-4" /> <span>Create New Campaign</span>
            </span>
          }
        />
      </div>
    </div>
  );
};

import {
  Megaphone,
  PersonStanding,
  ShoppingCart,
  Speaker,
  User,
  Users2,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useAppStore } from "../store/useAppStore";
import { Store } from "../types";
import { request } from "../utils/axiosInstance";
import { useNavigationStore } from "../store/useNavigationStore";

export const Dashboard = () => {
  const { store, setStore } = useAppStore();
  const navigate = useNavigationStore((s) => s.navigate);
  const [searchVal, setSearchVal] = useState("");
  const [filteredResults, setFilteredResults] = useState<Store[] | []>([]);
  const [error, setError] = useState("");
  const isDisabled = !store;
  useEffect(() => {
    const handleSearch = async () => {
      console.log(searchVal);
      const stores: Store[] = await request.get(`/stores?search=${searchVal}`);
      setFilteredResults(stores);
    };
    handleSearch();
  }, [searchVal]);

  return (
    <div className="">
      <div className="text-center space-y-2">
        <div className="text-[40px] font-extrabold ">
          Cashback System Dashboard
        </div>
        <div className="text-gray-500">
          {store ? (
            <div>Managing store: {store.name}</div>
          ) : (
            <div>Please enter a store name to begin.</div>
          )}
        </div>
        {error && <div className="text-red-500">{error}</div>}
      </div>
      <div className="flex justify-center items-center m-4">
        <div className="flex justify-between max-w-[450px] shadow p-4 bg-white gap-2 rounded-xl w-full">
          <input
            value={searchVal}
            className="w-full bg-gray-50 p-2 rounded-xl"
            onChange={(e) => setSearchVal(e.target.value)}
            placeholder="Enter store name to manage"
          />
          <button
            onClick={() => {
              const selectedStore = filteredResults.find(
                (store) => store.name === searchVal
              );
              if (selectedStore) {
                setStore(selectedStore);
                setError("");
              } else {
                setError("Select valid store");
              }
            }}
            className="text-white p-2 rounded-xl w-32 font-bold bg-blue-500 hover:bg-blue-400"
          >
            Confirm
          </button>
        </div>
      </div>
      <div className={`flex justify-center`}>
        <div className=" p-8 grid lg:grid-cols-3 lg:max-w-[1600px] gap-8 md:grid-cols-2">
          <div
            className={`flex flex-col justify-between bg-white transition p-8 w-full md:max-w-[500px] shadow rounded-xl space-y-4
    ${isDisabled ? "opacity-40 pointer-events-none" : "hover:-translate-y-1"}
  `}
          >
            <div className="flex items-center gap-4">
              <ShoppingCart className="bg-blue-500 text-white w-15 h-15 p-3 rounded-xl" />
              <span className="font-bold text-2xl">Create an Order</span>
            </div>
            <div className="text-gray-600">
              Simulate a new order to test cashback processing.
            </div>
            <div
              onClick={() =>
                navigate("Orders", [
                  { label: "Home", path: "/" },
                  { label: "Orders", path: "/orders" },
                ])
              }
              className="w-full text-center bg-blue-500 text-white font-semibold p-3 rounded-xl hover:bg-blue-400 transition"
            >
              Create Order
            </div>
          </div>
          <div
            className={`flex flex-col justify-between bg-white transition p-8 w-full md:max-w-[500px] shadow rounded-xl space-y-4
    ${isDisabled ? "opacity-40 pointer-events-none" : "hover:-translate-y-1"}
  `}
          >
            <div className="flex items-center gap-4">
              <Megaphone className="bg-blue-500 text-white w-15 h-15 p-3 rounded-xl" />
              <span className="font-bold text-2xl">Campaigns</span>
            </div>
            <div className="text-gray-600">
              Create, view, and manage all your cashback campaigns.{" "}
            </div>
            <div
              onClick={() =>
                navigate("Campaigns", [
                  { label: "Home", path: "/" },
                  { label: "Campaigns", path: "/campaigns" },
                ])
              }
              className="w-full text-center bg-blue-500 text-white font-semibold p-3 rounded-xl hover:bg-blue-400 transition"
            >
              Configure Campaigns
            </div>
          </div>
          <div
            className={`flex flex-col justify-between bg-white transition p-8 w-full md:max-w-[500px] shadow rounded-xl space-y-4
    ${isDisabled ? "opacity-40 pointer-events-none" : "hover:-translate-y-1"}
  `}
          >
            <div className="flex items-center gap-4">
              <Users2 className="bg-blue-500 text-white w-15 h-15 p-3 rounded-xl" />
              <span className="font-bold text-2xl">Customers</span>
            </div>
            <div className="text-gray-600">
              View customer data, cashback balances, and transaction history.
            </div>
            <div
              onClick={() =>
                navigate("Customers", [
                  { label: "Home", path: "/" },
                  { label: "Customers", path: "/customers" },
                ])
              }
              className="w-full text-center bg-blue-500 text-white font-semibold p-3 rounded-xl hover:bg-blue-400 transition"
            >
              View Customers
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

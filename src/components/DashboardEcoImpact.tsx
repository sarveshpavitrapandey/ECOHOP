
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import EcoTree from "./EcoTree";

interface DashboardEcoImpactProps {
  totalCO2Saved: number;
  dailyAverage: number;
  monthlyReduction: number;
}

const DashboardEcoImpact: React.FC<DashboardEcoImpactProps> = ({
  totalCO2Saved,
  dailyAverage,
  monthlyReduction
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="col-span-1">
        <EcoTree totalCO2Saved={totalCO2Saved} />
      </div>
      
      <div className="col-span-1 lg:col-span-2 grid gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Your Eco Impact</CardTitle>
            <CardDescription>
              The difference you've made for the environment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-eco-green-50 p-4 rounded-lg text-center">
                <h3 className="text-2xl font-bold text-eco-green-700">{totalCO2Saved.toFixed(2)} kg</h3>
                <p className="text-sm text-eco-green-600">Total CO₂ Saved</p>
              </div>
              
              <div className="bg-eco-blue-50 p-4 rounded-lg text-center">
                <h3 className="text-2xl font-bold text-eco-blue-700">{dailyAverage.toFixed(2)} kg</h3>
                <p className="text-sm text-eco-blue-600">Daily Average</p>
              </div>
              
              <div className="bg-eco-amber-50 p-4 rounded-lg text-center">
                <h3 className="text-2xl font-bold text-eco-amber-700">{monthlyReduction}%</h3>
                <p className="text-sm text-eco-amber-600">Monthly Reduction</p>
              </div>
            </div>
            
            <div className="mt-6 p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Environmental Equivalents</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center">
                  <span className="flex-shrink-0 w-10 text-center">🌳</span>
                  <span>Equivalent to {(totalCO2Saved / 21).toFixed(1)} trees planted</span>
                </div>
                <div className="flex items-center">
                  <span className="flex-shrink-0 w-10 text-center">⚡</span>
                  <span>Saved {(totalCO2Saved * 2.4).toFixed(1)} kWh of energy</span>
                </div>
                <div className="flex items-center">
                  <span className="flex-shrink-0 w-10 text-center">🚗</span>
                  <span>Prevented {(totalCO2Saved / 2.3).toFixed(1)} km of car travel</span>
                </div>
                <div className="flex items-center">
                  <span className="flex-shrink-0 w-10 text-center">♻️</span>
                  <span>Equal to recycling {(totalCO2Saved * 0.8).toFixed(1)} kg of waste</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardEcoImpact;

import { TrendingUp, Award } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

export default function Progress() {
  return (
    <Card className="p-6 shadow-xs rounded-lg bg-linear-to-b from-white to-gray-50">
      <div className="flex justify-between items-center mb-4">
        <span className="text-xl font-semibold text-gray-900 px-5 py-2 rounded-full shadow-xs">
          Learning Progress
        </span>
        <Button
          variant="outline"
          size="icon"
          className="hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <TrendingUp className="w-5 h-5 text-blue-600" />
        </Button>
      </div>
      <div className="rounded-2xl bg-blue-50 p-6 text-center">
        <Award className="w-12 h-12 text-blue-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Great Progress!
        </h3>
        <p className="text-gray-600">
          You completed your tutoring session last week
        </p>
        <Button className="mt-4 bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          View Details
        </Button>
      </div>
    </Card>
  );
}

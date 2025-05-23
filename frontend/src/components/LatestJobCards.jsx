import React from "react";
import { Badge } from "./ui/badge";
import { useNavigate } from "react-router-dom";

const LatestJobCards = ({ job }) => {
  const navigate = useNavigate();

  if (!job) {
    return (
      <div className="p-5 rounded-md shadow-xl bg-white border border-gray-100">
        No job details available.
      </div>
    );
  }

  return (
    <div
      onClick={() => navigate(`/description/${job._id}`)}
      onKeyDown={(e) =>
        e.key === "Enter" && navigate(`/description/${job._id}`)
      }
      role="button"
      tabIndex={0}
      className="p-5 rounded-md shadow-xl bg-white border border-gray-100 cursor-pointer transition hover:shadow-2xl"
    >
      {/* Company and Location */}
      <div>
        <h1 className="font-medium text-lg">
          {job?.company?.name || "Unknown Company"}
        </h1>
        <p className="text-sm text-gray-500">
          {job?.location || "Location Not Available"}
        </p>
      </div>

      {/* Job Title and Description */}
      <div>
        <h1 className="font-bold text-lg my-2">
          {job?.title || "Job Title Not Available"}
        </h1>
        <p className="text-sm text-gray-600">
          {job?.description
            ? job.description.slice(0, 100) +
              (job.description.length > 100 ? "..." : "")
            : "No description provided."}
        </p>
      </div>

      {/* Badges for Additional Info */}
      <div className="flex items-center gap-2 mt-4">
        <Badge className="text-blue-700 font-bold" variant="ghost">
          {job?.position || 0} Positions
        </Badge>
        <Badge className="text-[#F83002] font-bold" variant="ghost">
          {job?.jobType || "Not specified"}
        </Badge>
        <Badge className="text-[#7209b7] font-bold" variant="ghost">
          {job?.salary ? `${job.salary} LPA` : "Salary Not Disclosed"}
        </Badge>
      </div>
    </div>
  );
};

export default LatestJobCards;

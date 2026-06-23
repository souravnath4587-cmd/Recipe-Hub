import { getAllReports } from "@/app/lib/api/recipes";
import ReportsDashboard from "./ReportDashboard";

const page = async () => {
  const allReports = await getAllReports();
  console.log(allReports);

  return (
    <div>
      <ReportsDashboard allReports={allReports} />
    </div>
  );
};

export default page;

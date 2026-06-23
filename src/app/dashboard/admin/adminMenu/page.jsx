import { getUsers } from "@/app/lib/api/users";
import AdminOverviewPage from "./AdminOverviewPage";
import { getAllRecipeData, getAllReports } from "@/app/lib/api/recipes";

const page = async () => {
  const allUsers = await getUsers();
  const allRecipes = await getAllRecipeData();
  const allReports = await getAllReports();
  return (
    <div>
      <AdminOverviewPage
        users={allUsers}
        recipes={allRecipes}
        reports={allReports}
      />
    </div>
  );
};

export default page;

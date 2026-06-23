import { getPayments } from "@/app/lib/api/payments";
import { getUserSession } from "@/app/lib/core/session";
import PurchasedRecipesPage from "./PaymentData";

const page = async () => {
  const user = await getUserSession();
  const paymentsData = await getPayments();
  const selectedUserPaymentsData = paymentsData.filter(
    (pay) => pay.userId === user?.id,
  );
  console.log(selectedUserPaymentsData);

  return (
    <div>
      <PurchasedRecipesPage paymentsData={selectedUserPaymentsData} />
    </div>
  );
};

export default page;

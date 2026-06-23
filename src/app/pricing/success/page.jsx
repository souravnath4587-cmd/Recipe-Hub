// import { redirect } from "next/navigation";
// import { Button, Card, Chip } from "@heroui/react";
// import Link from "next/link"; // Import Next.js Link normally
// import {
//   FiCheckCircle,
//   FiBookOpen,
//   FiArrowRight,
//   FiMail,
// } from "react-icons/fi";
// import { GiChefToque } from "react-icons/gi";
// import { stripe } from "@/app/lib/stripe";
// import { createSubscription } from "@/app/lib/action/subscription";

// export default async function PricingSuccessPage({ searchParams }) {
//   const { session_id } = await searchParams;

//   if (!session_id) {
//     throw new Error(
//       "Missing structural Stripe gateway transaction parameters (`session_id`)",
//     );
//   }

//   const {
//     status,
//     // customer_details: { email: customerEmail },
//     metadata,
//   } = await stripe.checkout.sessions.retrieve(session_id, {
//     expand: ["line_items", "payment_intent"],
//   });

//   // const status = session?.status;
//   // const customerEmail = session?.customer_details?.email;

//   if (status === "open") {
//     return redirect("/pricing");
//   }

//   if (status === "complete") {
//     const subsInfo = {
//       email: customerEmail,
//       planId: metadata.planId,
//     };

//     const result = await createSubscription(subsInfo);
//     console.log(result);

//     return (
//       <div className="w-full min-h-[80vh] flex items-center justify-center bg-background px-4 py-12">
//         <Card className="w-full max-w-xl bg-content1 border border-divider rounded-3xl p-8 shadow-xl text-center flex flex-col items-center space-y-6 relative overflow-hidden">
//           <div className="absolute -top-24 -left-24 w-48 h-48 bg-warning-500/10 rounded-full blur-3xl pointer-events-none" />
//           <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

//           <div className="relative flex items-center justify-center">
//             <div className="p-5 bg-warning-50 dark:bg-warning-900/20 text-warning-500 rounded-2xl border border-warning-200/30">
//               <GiChefToque size={48} />
//             </div>
//             <div className="absolute -bottom-1 -right-1 bg-background p-0.5 rounded-full">
//               <FiCheckCircle
//                 className="text-success-500 fill-background"
//                 size={20}
//               />
//             </div>
//           </div>

//           <div className="space-y-2">
//             <Chip
//               color="success"
//               variant="flat"
//               size="sm"
//               className="font-bold uppercase tracking-wider text-[10px]"
//             >
//               Payment Verified
//             </Chip>
//             <h1 className="text-3xl font-black tracking-tight text-foreground">
//               Welcome to the{" "}
//               <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">
//                 Elite Kitchen
//               </span>
//             </h1>
//             <p className="text-xs text-default-400 font-medium max-w-sm mx-auto leading-relaxed">
//               Your Recipe-Hub tier profile boundaries have been successfully
//               elevated. Your master dashboard parameters have unlocked
//               immediately.
//             </p>
//           </div>

//           {customerEmail && (
//             <div className="w-full bg-default-50 border border-divider/40 p-3.5 rounded-2xl flex items-center justify-center gap-2 text-xs text-default-600 font-medium">
//               <FiMail className="text-orange-500 flex-shrink-0" size={14} />
//               <span className="truncate">
//                 Invoice receipt transmitted to:{" "}
//                 <strong className="text-foreground">{customerEmail}</strong>
//               </span>
//             </div>
//           )}

//           {/* --- FIXED SECTION: Buttons wrapped cleanly inside Link components --- */}
//           <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
//             <Link href="/dashboard/user/overView" className="w-full">
//               <Button
//                 fullWidth
//                 color="warning"
//                 variant="solid"
//                 className="font-black text-default-700 text-xs tracking-tight"
//                 startContent={<FiBookOpen size={14} />}
//               >
//                 Go to Dashboard
//               </Button>
//             </Link>

//             <Link href="/dashboard/user/addRecipe" className="w-full">
//               <Button
//                 fullWidth
//                 color="default"
//                 variant="flat"
//                 className="font-bold text-xs tracking-tight text-default-700"
//                 endContent={<FiArrowRight size={14} />}
//               >
//                 Publish New Recipe
//               </Button>
//             </Link>
//           </div>

//           <div className="pt-4 text-[11px] text-default-400 font-medium border-t border-divider/60 w-full">
//             Encountering setup problems? Contact support pipelines at{" "}
//             <a
//               href="mailto:support@recipehub.com"
//               className="text-orange-500 hover:underline font-bold"
//             >
//               support@recipehub.com
//             </a>
//           </div>
//         </Card>
//       </div>
//     );
//   }

//   return redirect("/pricing");
// }

import { redirect } from "next/navigation";
import { Button, Card, Chip } from "@heroui/react";
import Link from "next/link";
import {
  FiCheckCircle,
  FiBookOpen,
  FiArrowRight,
  FiMail,
} from "react-icons/fi";
import { GiChefToque } from "react-icons/gi";
import { stripe } from "@/app/lib/stripe";
import { createSubscription } from "@/app/lib/action/subscription";

export default async function PricingSuccessPage({ searchParams }) {
  const { session_id } = await searchParams;

  if (!session_id) {
    throw new Error(
      "Missing structural Stripe gateway transaction parameters (`session_id`)",
    );
  }

  // FIXED: Properly destructure customer_details to get the email address safely
  const { status, customer_details, metadata } =
    await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["line_items", "payment_intent"],
    });

  const customerEmail = customer_details?.email;

  if (status === "open") {
    return redirect("/pricing");
  }

  if (status === "complete") {
    const subsInfo = {
      email: customerEmail,
      planId: metadata?.planId || "user_free", // Guarding against null metadata
    };

    // const result = await createSubscription(subsInfo);
    const result = await createSubscription(subsInfo);
    console.log(result);

    return (
      <div className="w-full min-h-[80vh] flex items-center justify-center bg-background px-4 py-12">
        <Card className="w-full max-w-xl bg-content1 border border-divider rounded-3xl p-8 shadow-xl text-center flex flex-col items-center space-y-6 relative overflow-hidden">
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-warning-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative flex items-center justify-center">
            <div className="p-5 bg-warning-50 dark:bg-warning-900/20 text-warning-500 rounded-2xl border border-warning-200/30">
              <GiChefToque size={48} />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-background p-0.5 rounded-full">
              <FiCheckCircle
                className="text-success-500 fill-background"
                size={20}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Chip
              color="success"
              variant="flat"
              size="sm"
              className="font-bold uppercase tracking-wider text-[10px]"
            >
              Payment Verified
            </Chip>
            <h1 className="text-3xl font-black tracking-tight text-foreground">
              Welcome to the{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">
                Elite Kitchen
              </span>
            </h1>
            <p className="text-xs text-default-400 font-medium max-w-sm mx-auto leading-relaxed">
              Your Recipe-Hub tier profile boundaries have been successfully
              elevated. Your master dashboard parameters have unlocked
              immediately.
            </p>
          </div>

          {customerEmail && (
            <div className="w-full bg-default-50 border border-divider/40 p-3.5 rounded-2xl flex items-center justify-center gap-2 text-xs text-default-600 font-medium">
              <FiMail className="text-orange-500 flex-shrink-0" size={14} />
              <span className="truncate">
                Invoice receipt transmitted to:{" "}
                <strong className="text-foreground">{customerEmail}</strong>
              </span>
            </div>
          )}

          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <Link href="/dashboard/user/overView" className="w-full">
              <Button
                fullWidth
                color="warning"
                variant="solid"
                className="font-black text-default-700 text-xs tracking-tight"
                startContent={<FiBookOpen size={14} />}
              >
                Go to Dashboard
              </Button>
            </Link>

            <Link href="/dashboard/user/addRecipe" className="w-full">
              <Button
                fullWidth
                color="default"
                variant="flat"
                className="font-bold text-xs tracking-tight text-default-700"
                endContent={<FiArrowRight size={14} />}
              >
                Publish New Recipe
              </Button>
            </Link>
          </div>

          <div className="pt-4 text-[11px] text-default-400 font-medium border-t border-divider/60 w-full">
            Encountering setup problems? Contact support pipelines at{" "}
            <a
              href="mailto:support@recipehub.com"
              className="text-orange-500 hover:underline font-bold"
            >
              support@recipehub.com
            </a>
          </div>
        </Card>
      </div>
    );
  }

  return redirect("/pricing");
}

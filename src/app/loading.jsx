import { Spinner } from "@heroui/react";

const loading = () => {
  return (
    <div className="flex flex-col items-center gap-2 mt-10">
      <Spinner size="xl" color="warning" />
      <span className="text-md text-muted">
        Please wait while we gather tasty recipes for you 🍽️
      </span>
    </div>
  );
};

export default loading;

// "use client";

// import { motion } from "framer-motion";
// import { FaUtensils } from "react-icons/fa";

// export default function Loading() {
//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center overflow-hidden relative">

//       {/* Background */}
//       <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-red-50 dark:from-zinc-950 dark:via-black dark:to-zinc-900" />

//       {/* Glow Effects */}
//       <div className="absolute top-20 left-20 h-72 w-72 rounded-full bg-orange-400/20 blur-3xl" />
//       <div className="absolute bottom-20 right-20 h-72 w-72 rounded-full bg-red-400/20 blur-3xl" />

//       {/* Content */}
//       <div className="relative z-10 flex flex-col items-center">

//         {/* Animated Icon */}
//         <motion.div
//           animate={{
//             rotate: 360,
//           }}
//           transition={{
//             repeat: Infinity,
//             duration: 2,
//             ease: "linear",
//           }}
//           className="w-24 h-24 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center shadow-2xl"
//         >
//           <FaUtensils className="text-white text-4xl" />
//         </motion.div>

//         {/* Title */}
//         <motion.h2
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{
//             repeat: Infinity,
//             repeatType: "reverse",
//             duration: 1.2,
//           }}
//           className="mt-8 text-3xl font-bold"
//         >
//           Preparing Delicious Recipes...
//         </motion.h2>

//         <p className="mt-3 text-default-500 text-center">
//           Please wait while we gather tasty recipes for you 🍽️
//         </p>

//         {/* Animated Dots */}
//         <div className="flex gap-2 mt-6">
//           {[0, 1, 2].map((dot) => (
//             <motion.div
//               key={dot}
//               animate={{
//                 y: [0, -10, 0],
//               }}
//               transition={{
//                 duration: 0.6,
//                 repeat: Infinity,
//                 delay: dot * 0.2,
//               }}
//               className="w-3 h-3 rounded-full bg-orange-500"
//             />
//           ))}
//         </div>

//         {/* Skeleton Cards */}
//         <div className="hidden md:grid grid-cols-3 gap-6 mt-16">
//           {[1, 2, 3].map((item) => (
//             <div
//               key={item}
//               className="w-72 rounded-2xl border border-default-200 bg-background p-4"
//             >
//               <div className="h-40 rounded-xl bg-default-200 animate-pulse" />

//               <div className="mt-4 h-4 rounded bg-default-200 animate-pulse" />

//               <div className="mt-3 h-4 w-2/3 rounded bg-default-200 animate-pulse" />

//               <div className="mt-6 h-10 rounded-lg bg-default-200 animate-pulse" />
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

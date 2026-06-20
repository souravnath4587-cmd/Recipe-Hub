const mockAdminStats = {
  // 1. Admin Profile Info (matching your provided session layout)
  user: {
    id: "6a365092398d61c8676fe803",
    name: "Admin",
    email: "admin4587@gmail.com",
    emailVerified: false,
    image:
      "https://lh3.googleusercontent.com/a/ACg8ocLAFavPt6Nw6ohvN43RStqteZLcJWC2OAwzEUhpgQzBMIYNf4w=s96-c",
    role: "admin",
  },

  // 2. Dashboard Analytics Counter Cards
  stats: {
    totalUsers: 1420,
    totalRecipes: 482,
    totalPremiumMembers: 315,
    totalReports: 8,
  },

  // 3. System Activity Logs / Recent Lists (Optional bonus for populating tables)
  recentReports: [
    {
      id: "rep_01",
      recipeName: "Expired Milk Pudding",
      reportedBy: "user_77@gmail.com",
      reason: "Inappropriate Content / Spam",
      date: "2026-06-19",
    },
    {
      id: "rep_02",
      recipeName: "Copy-pasted Secret Sauce",
      reportedBy: "chef_master@gmail.com",
      reason: "Copyright Plagiarism",
      date: "2026-06-20",
    },
  ],

  recentPremiumSignups: [
    {
      name: "Sarah Connor",
      email: "sarah.c@example.com",
      tier: "Yearly Premium",
    },
    {
      name: "Alex Mercer",
      email: "alex99@example.com",
      tier: "Monthly Premium",
    },
  ],
};

export default mockAdminStats;

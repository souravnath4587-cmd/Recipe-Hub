 // Payments related :
    app.get("/api/payments", async (req, res) => {
      const result = await paymentsCollection.find().toArray();
      res.json(result);
    });

    // Express Server Route (e.g., in your server.js or routes file)
    app.post("/api/payments/checkout", async (req, res) => {
      try {
        const { userId, userEmail, recipeId, transactionId, userPlan } =
          req.body;

        // 1. Block Free Users immediately
        if (!userPlan || userPlan === "user_free") {
          return res.status(403).json({
            success: false,
            message:
              "Free users cannot buy single recipes. Please upgrade your core plan.",
          });
        }

        // 2. Count how many single recipes this user has already bought
        const purchasedCount = await paymentsCollection.countDocuments({
          userId: userId,
          paymentStatus: "succeeded",
        });

        // 3. Enforce Tier Limits
        if (userPlan === "user_pro" && purchasedCount >= 5) {
          return res.status(403).json({
            success: false,
            message:
              "Pro tier individual purchase cap reached (Max 5). Upgrade to Premium for a higher allocation.",
          });
        }

        if (userPlan === "user_premium" && purchasedCount >= 20) {
          return res.status(403).json({
            success: false,
            message:
              "Premium tier single recipe purchase limit reached (Max 20).",
          });
        }

        // 4. Record the approved transaction item
        const paymentRecord = {
          userId,
          userEmail,
          recipeId,
          transactionId, // Provided by your payment gateway (like Stripe)
          paymentStatus: "succeeded",
          paidAt: new Date(),
        };

        const result = await paymentsCollection.insertOne(paymentRecord);

        return res.status(201).json({
          success: true,
          message: "Recipe purchase successfully authorized!",
          insertedId: result.insertedId,
        });
      } catch (error) {
        console.error("Payment registration error:", error);
        return res
          .status(500)
          .json({ success: false, error: "Internal server error" });
      }
    });

    //subcription related
    app.post("/api/subscriptions", async (req, res) => {
      const data = req.body;
      const subsInfo = {
        ...data,
        createdAt: new Date(),
      };

      // update the user plan information
      const filter = { email: data.email };
      // update the value of the 'quantity' field to 5
      const updateDocument = {
        $set: {
          plan: data.planId,
        },
      };

      const updateResult = await userCollection.updateOne(
        filter,
        updateDocument,
      );
      res.send(updateResult);
    });

    //plans related
    app.get("/api/plans", async (req, res) => {
      const query = {};
      if (req.query.plan_id) {
        query.id = req.query.plan_id;
      }
      const plan = await planCollection.findOne(query);
      res.send(plan);
    });
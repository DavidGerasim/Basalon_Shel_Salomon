const cron = require("node-cron");
const Gig = require("./models/Gig");
const GigGuest = require("./models/GigGuests");
const NewUser = require("./models/User");

cron.schedule("* * * * *", async () => {
  try {
    const now = new Date();
    const currentDate = now.toISOString().split("T")[0];
    const currentTime = now.toTimeString().split(" ")[0];
    console.log(`Running expiration check at ${now}`);
    const expiredGigs = await Gig.find({
      endTime: { $lt: now },
    });

    console.log(`Found ${expiredGigs.length} expired gigs:`);
    expiredGigs.forEach((gig) => {
      console.log(
        `Expired gig found: ID = ${gig._id}, endTime = ${gig.endTime}`
      );
    });

    const expiredGigIds = expiredGigs.map((gig) => gig._id);

    if (expiredGigIds.length > 0) {
      const deletedGigs = await Gig.deleteMany({ _id: { $in: expiredGigIds } });
      console.log(
        `Deleted ${deletedGigs.deletedCount} expired gigs from Gig collection.`
      );

      const gigGuestEntries = await GigGuest.find({
        gigId: { $in: expiredGigIds },
      });
      const userIds = gigGuestEntries.map((entry) => entry.userId);
      console.log(
        `Found ${gigGuestEntries.length} guest entries for expired gigs.`
      );

      const deletedGigGuests = await GigGuest.deleteMany({
        gigId: { $in: expiredGigIds },
      });
      console.log(
        `Deleted ${deletedGigGuests.deletedCount} guest entries from GigGuest collection.`
      );

      const updatedUsers = await NewUser.updateMany(
        { _id: { $in: userIds }, gigs: { $in: expiredGigIds } },
        { $pull: { gigs: { $in: expiredGigIds } } }
      );
      console.log(
        `Removed expired gigs from ${updatedUsers.modifiedCount} users in NewUser collection.`
      );
    } else {
      console.log("No expired gigs found.");
    }

    console.log(`Expiration check completed at ${now}`);
  } catch (error) {
    console.error("Error processing expired gigs:", error);
  }
});

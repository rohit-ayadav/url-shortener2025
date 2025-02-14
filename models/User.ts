import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        default: null,
    },
    provider: {
        type: String,
        default: "Credentials",
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    password: {
        type: String,
        required: false,
    },
    role: {
        type: String,
        required: true,
        enum: ["user", "admin", "moderator"],
        default: "user",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    subscriptionStatus: {
        type: String,
        enum: ["free", "basic", "pro", "enterprise"],
        default: "free",
    },
    subscriptionExpiration: {
        type: Date,
        default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    },
    monthlyQuotaUsed: {
        type: Number,
        default: 0,
    },
    monthlyQuotaLimit: {
        type: Number,
        default: 100,
    },
});

// Password Hashing Before Saving User
userSchema.pre("save", async function (next) {
    if (this.isModified("password") && this.password) {
        try {
            const saltRounds = 10;
            this.password = await bcrypt.hash(this.password, saltRounds);
        } catch (error: any) {
            return next(error as mongoose.CallbackError);
        }
    }
    next();
});

// Function to Check Subscription Expiry
userSchema.methods.checkSubscriptionExpiry = async function () {
    if (this.subscriptionStatus === "pro" && this.subscriptionExpiration) {
        const now = new Date();
        if (this.subscriptionExpiration < now) {
            this.subscriptionStatus = "free";
            this.monthlyQuotaLimit = 100;
            this.subscriptionExpiration = null;
            await this.save();
        }
    }
};

// Compare Password for Login
userSchema.methods.comparePassword = async function (password: string) {
    if (!this.password) {
        throw new Error("Kindly login using your social account.");
    }
    return bcrypt.compare(password, this.password);
};

// handle Monthly Quota, reset on new month
userSchema.methods.handleMonthlyQuota = async function () {
    /* This function will reset the monthlyQuotaUsed to 0 if the subscriptionExpiration date is less than the current date */
    /* And it will run every time a user creates a new short URL */

    const now = new Date();

    if (this.subscriptionExpiration < now && this.subscriptionStatus !== "free") {
        this.subscriptionStatus = "free";
        this.monthlyQuotaLimit = 100;
        this.monthlyQuotaUsed = 0;
        this.subscriptionExpiration = Date.now() + 30 * 24 * 60 * 60 * 1000;
        await this.save();
    }

    if (this.subscriptionExpiration < now) {
        this.monthlyQuotaUsed = 0;
        await this.save();
    }

    if (this.monthlyQuotaUsed > this.monthlyQuotaLimit)
        throw new Error("Monthly quota exceeded.Please upgrade your plan.")
    
}

const User = mongoose.models.User || mongoose.model("User", userSchema);

export { User };

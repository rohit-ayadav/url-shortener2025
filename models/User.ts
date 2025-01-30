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
        default: null,
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
        enum: ["user", "admin"],
        default: "user",
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
    },
    subscriptionStatus: {
        type: String,
        required: true,
        enum: ["free", "premium"],
        default: "free",
    },
    subscriptionExpiration: {
        type: Date,
        default: null,
    } as any,
    dailyQuotaUsed: {
        type: Number,
        required: true,
        default: 0,
    },
    dailyQuotaLimit: {
        type: Number,
        required: true,
        default: 10,
    },
});

userSchema.pre("save", async function (next) {
    const now = new Date();

    if (this.subscriptionExpiration && this.subscriptionExpiration < now) {
        this.subscriptionStatus = "free";
        this.dailyQuotaLimit = 10;
        this.subscriptionExpiration = null;
    }

    if (this.subscriptionStatus === "premium" && !this.subscriptionExpiration) {
        this.subscriptionExpiration = new Date();
        if (this.subscriptionExpiration instanceof Date) {
            this.subscriptionExpiration.setDate(this.subscriptionExpiration.getDate() + 30);
        }
        this.dailyQuotaLimit = 100;
    }

    if (this.isModified("password")) {
        try {
            const saltRounds = 10;
            if (this.password)
                this.password = await bcrypt.hash(this.password, saltRounds);
        } catch (error) {
            return next(error as mongoose.CallbackError);
        }
    }
    next();
});

userSchema.methods.comparePassword = async function (password: string) {
    if (typeof this.password !== "string") {
        throw new Error("Password is not a string");
    }
    return await bcrypt.compare(password, this.password);
};


const User = mongoose.models.User || mongoose.model("User", userSchema);

export { User };

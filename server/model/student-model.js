"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentModel = exports.TempUserModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const StudentSchema = new mongoose_1.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false, unique: true },
    phoneNumber: { type: Number, required: false },
    nickname: { type: String, required: false },
    createAt: { type: Date, default: Date.now },
    updateAt: { type: Date, default: Date.now },
    meetingHistory: { type: mongoose_1.Schema.ObjectId, ref: "Meeting" },
    bookedHistory: { type: mongoose_1.Schema.ObjectId, ref: "Booking" },
    googleAuth: { type: Boolean, default: false },
});
const TempUserSchema = new mongoose_1.default.Schema({
    email: { type: String, required: true, unique: true },
    code: String,
    isVerified: { type: Boolean, default: false },
    password: String,
    nickname: String,
    phoneNumber: String,
});
exports.TempUserModel = mongoose_1.default.model("TempUser", TempUserSchema);
exports.StudentModel = (0, mongoose_1.model)("Student", StudentSchema);

import { connectDB } from "@/dbConfig/dbConfig";
import User from '@/models/user.model';
import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helper/getDataFromToken";

connectDB()

export async function POST(request: NextRequest) {
    //Extract data from token

    const userId = await getDataFromToken(request)
    const user = await User.findOne({ _id: userId }).select("-password")

    //check if there's no user

    return NextResponse.json({
        message: "User Found",
        data: user,
        success:true
    })
}
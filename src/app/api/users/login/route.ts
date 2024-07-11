import { connectDB } from "@/dbConfig/dbConfig";
import User from '@/models/user.model';
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

connectDB()

export async function POST(request: NextRequest) {
    try {

        const reqBody = await request.json()
        const { email, password } = reqBody

        console.log(reqBody)

        const user = await User.findOne({ email })

        if (!user) {
            return NextResponse.json({ error: "User not found with this email" }, { status: 500 })
        }

        console.log("user exixst")

        if (!user.isVarified) {
            return NextResponse.json({ error: "User is not verified, Please verify your email" }, { status: 500 })
        }

        const validPassword = bcrypt.compare(password, user.password)

        if (!validPassword) {
            return NextResponse.json({ error: "Invalid Password" }, { status: 400 })
        }

        const tokenData = {
            id: user._id,
            email: user.email,
            username: user.username
        }

        const token = jwt.sign(tokenData, process.env.SECRET_TOKEN!, { expiresIn: '1d' })

        const response = NextResponse.json({
            message: "Logged in successfully",
            success: true
        })

        response.cookies.set("token", token, {
            httpOnly: true
        })

        return response

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import * as bcrypt from "bcrypt";
import {PrismaClient} from "@repo/db/client"

const db = new PrismaClient();

export const authOptions : AuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                phone: { label:"Phone Number", type: "text", placeholder:"9876543210"},
                password: { label: "Password", type: "password"}
            },
            //change type from any to proper type
            async authorize(credentials: any) {
                // Ensure phone and password are provided , do zod validation here
                // OTP validation can be done here
                if (!credentials?.phone || !credentials?.password) {
                    throw new Error("Phone number and password are required.");
                }
            
                // Attempt to find an existing user
                const existingUser = await db.user.findFirst({
                    where: {
                        number: credentials.phone,
                    },
                });
            
                if (existingUser) {

                    const isPasswordValid = await bcrypt.compare(credentials.password, existingUser.password);
                    
                    if (isPasswordValid) {
                        return {
                            id: existingUser.id.toString(),
                            name: existingUser.name || "Anonymous",
                            email: existingUser.email || null,
                        };
                    } else {
                        throw new Error("Invalid phone number or password.");
                    }
                }
            
                try {
                    const hashedPassword = await bcrypt.hash(credentials.password, 10);
                    const newUser = await db.user.create({
                        data: {
                            number: credentials.phone,
                            password: hashedPassword,
                            name: "New User", // Default name
                            email: null, // Can be null if not required
                        },
                    });
            
                    return {
                        id: newUser.id.toString(),
                        name: newUser.name,
                        email: newUser.email,
                    };
                } catch (error) {
                    console.error("Error creating new user:", error);
                    throw new Error("Failed to create user.");
                }
            }            
        })
    ],
    secret: process.env.JWT_SECRET || "SECRET",
    callbacks: {
        //change type from any to proper type
        async session({token,session}:any){
            session.user.id = token.sub;
            return session;
        }
    }
}
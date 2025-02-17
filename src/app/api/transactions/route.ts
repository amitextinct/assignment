import connect from "@/dbConfig/dbConfig"
import Transaction from "@/model/transactionModel"
import { NextRequest, NextResponse } from "next/server"


// Connect to database at the start
await connect();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json()
        const { amount, description, category } = reqBody

        // Validate the input
        if (!amount || !category) {
            return NextResponse.json(
                { error: "Amount and category are required" },
                { status: 400 }
            );
        }

        const newTransaction = new Transaction({
            amount,
            description,
            category
        })

        const savedTransaction = await newTransaction.save()

        return NextResponse.json({
            message: "Transaction added successfully",
            success: true,
            savedTransaction
        })
    } catch (error) {
        console.error("Transaction creation error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const transactions = await Transaction.find()
        return NextResponse.json({
            success: true,
            transactions
        })
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message },
                { status: 500 }
            )
        } else {
            return NextResponse.json("An error occurred",
                { status: 500 }
            )
        }
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { id } = await request.json()
        const deletedTransaction = await Transaction.findByIdAndDelete(id)
        if (!deletedTransaction) {
            return NextResponse.json({
                error: "Transaction not found"
            }, { status: 404 })
        }
        return NextResponse.json({
            success: true,
            deletedTransaction
        })
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message },
                { status: 500 }
            )
        } else {
            return NextResponse.json("An error occurred",
                { status: 500 }
            )
        }
    }
}

export async function PUT(request: NextRequest) {
    try {
        const reqBody = await request.json()
        const { id, amount, description, category } = reqBody

        // Validate the input
        if (!amount || !category) {
            return NextResponse.json(
                { error: "Amount and category are required" },
                { status: 400 }
            );
        }

        const updatedTransaction = await Transaction.findByIdAndUpdate(id, {
            amount,
            description,
            category
        }, { new: true })

        if (!updatedTransaction) {
            return NextResponse.json({
                error: "Transaction not found"
            }, { status: 404 })
        }

        return NextResponse.json({
            success: true,
            updatedTransaction
        })
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message },
                { status: 500 }
            )
        } else {
            return NextResponse.json("An error occurred",
                { status: 500 }
            )
        }
    }
}


import connect from "@/dbConfig/dbConfig"
import Transaction from "@/model/transactionModel"
import { NextRequest, NextResponse } from "next/server"
import { log } from "node:console"



connect()
export async function POST(request:NextRequest){
    try {
       const reqBody =  await request.json()
       const {amount , description ,category} = reqBody
       log(reqBody);

       const newTransaction = new Transaction({
        amount,
        description,
        category
       })

       const savedTransaction = await newTransaction.save()
       log(savedTransaction)

       return NextResponse.json({
        message : "transaction added successfully",
        success : true,
        savedTransaction
       })
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({error : error.message},
                {status : 500}
            )
          } else {
            return NextResponse.json("An error occurred",
                {status : 500}
            )
          }
    }
}
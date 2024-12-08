"use client"

import { useBalance } from "@repo/store/useBalance"

export const Test = ()=>{
    const balance = useBalance();
    return <div>
        Your balance is {balance}
    </div>
}
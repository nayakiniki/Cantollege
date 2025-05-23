"use client"

import { Smartphone, WalletIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function Wallet() {
  return (
    <Card className="w-full glass-card">
      <CardHeader>
        <CardTitle className="text-2xl font-audiowide gradient-text">Payment Methods</CardTitle>
        <CardDescription>Manage your payment methods</CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="cards">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="cards" className="flex items-center gap-2">
              <WalletIcon className="h-4 w-4" />
              <span>Cards</span>
            </TabsTrigger>
            <TabsTrigger value="upi" className="flex items-center gap-2">
              <Smartphone className="h-4 w-4" />
              <span>UPI</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cards">
            <div className="space-y-4">
              <div className="rounded-lg bg-gradient-to-r from-purple-500 to-indigo-600 p-4 text-white">
                <div className="flex justify-between items-start mb-8">
                  <div className="space-y-1">
                    <p className="text-xs opacity-80">Balance</p>
                    <p className="text-2xl font-bold">₹2,500.00</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">Cantollege Pay</p>
                    <p className="text-xs opacity-80">Virtual Wallet</p>
                  </div>
                </div>

                <div className="flex justify-between items-end">
                  <p className="text-sm font-medium">**** **** **** 4242</p>
                  <p className="text-xs opacity-80">Exp: 12/25</p>
                </div>
              </div>

              <div className="text-center text-sm text-muted-foreground">
                <p>This is a simulated wallet for demonstration purposes.</p>
                <p>No real transactions will be processed.</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="upi">
            <div className="space-y-4">
              <div className="rounded-lg bg-gradient-to-r from-orange-500 to-amber-600 p-4 text-white">
                <div className="flex justify-between items-start mb-8">
                  <div className="space-y-1">
                    <p className="text-xs opacity-80">UPI ID</p>
                    <p className="text-lg font-bold">user@cantollege</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">Cantollege UPI</p>
                    <p className="text-xs opacity-80">Virtual Payment</p>
                  </div>
                </div>

                <div className="flex justify-between items-end">
                  <p className="text-sm font-medium">Linked to: XXXX Bank</p>
                  <p className="text-xs opacity-80">Verified</p>
                </div>
              </div>

              <div className="text-center text-sm text-muted-foreground">
                <p>This is a simulated UPI ID for demonstration purposes.</p>
                <p>No real transactions will be processed.</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

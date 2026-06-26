import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { APP_NAME_ARABIC, PLANS } from "@/lib/constants"
import { SubscriptionButton } from "@/components/payments/subscription-button"

export default function PricingPage() {
  return (
    <div className="container py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">اختر الباقة المناسبة لك</h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          ابدأ مجاناً وطور مهاراتك مع {APP_NAME_ARABIC}. اشتراك شهري أو سنوي مع وصول غير محدود لجميع الدورات
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {PLANS.map((plan) => (
          <Card key={plan.id} className={`flex flex-col ${plan.id === "monthly" ? "border-primary shadow-lg scale-105" : ""}`}>
            <CardHeader>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <CardDescription>
                <span className="text-4xl font-bold text-foreground">{plan.price === 0 ? "مجاني" : `${plan.price} ج.م`}</span>
                {plan.price > 0 && <span className="text-base"> / شهرياً</span>}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-500 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <SubscriptionButton planId={plan.id} className="w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

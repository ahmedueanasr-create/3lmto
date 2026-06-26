import { LoginForm } from "@/components/auth/login-form"
import { APP_NAME_ARABIC } from "@/lib/constants"

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12">
      <div className="w-full max-w-md px-4">
        <LoginForm />
      </div>
    </div>
  )
}

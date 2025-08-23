import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex min-h-[calc(100vh-200px)] items-center justify-center">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Welcome Back</h1>
            <p className="text-muted-foreground">
              Sign in to your account or create a new one
            </p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}

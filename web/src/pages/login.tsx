import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useAuth from "@/hooks/use-auth";
import { getPagePath, redirectPage } from "@nanostores/router";
import { $router } from "@/lib/router";

const Login = () => {
  const { login } = useAuth();

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    await login(username, password);
    redirectPage($router, "home");
  };

  return (
    <div className="w-full max-w-sm space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-center text-foreground">
          Sign in to your account
        </h2>
        <p className="mt-2 text-sm text-center text-muted-foreground">
          Or{" "}
          <a
            href={getPagePath($router, "register")}
            className="font-medium text-primary hover:text-primary/80 hover:underline"
          >
            create a new account
          </a>
        </p>
      </div>
      <form className="space-y-6" onSubmit={handleFormSubmit} method="POST">
        <div>
          <Label htmlFor="username">Username</Label>
          <div className="mt-1">
            <Input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              placeholder="Enter a username"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <div className="mt-1">
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="Enter a password"
            />
          </div>
        </div>
        <div>
          <Button type="submit" className="w-full">
            Sign in
          </Button>
        </div>
      </form>
      
      {/* ✅ Add GitHub OAuth Login Button */}
      <div className="text-center">
        <a
          href="http://localhost:3000/auth/github" // ✅ Replace with actual backend URL
          className="block w-full text-center text-white bg-black hover:bg-gray-800 font-medium py-2 px-4 rounded"
        >
          Sign in with GitHub
        </a>
      </div>
    </div>
  );
};

export default Login;

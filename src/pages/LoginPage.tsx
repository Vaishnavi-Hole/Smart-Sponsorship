import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { LogIn, Shield, Heart } from "lucide-react";

export default function LoginPage() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "sponsor">("sponsor");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const success = login(email, password, role);
    if (success) {
      navigate(role === "admin" ? "/admin" : "/sponsor");
    } else {
      setError("Invalid credentials. Try admin@kindredpath.org for admin or rahul@gmail.com for sponsor.");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="card-kindred bg-card p-8 shadow-lg">
          <div className="text-center mb-6">
            <Heart className="h-10 w-10 mx-auto text-accent fill-accent mb-2" />
            <h1 className="text-2xl font-bold text-foreground">Welcome Back</h1>
            <p className="text-sm text-muted-foreground mt-1">Sign in to Kindred Path</p>
          </div>

          {/* Role selector */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setRole("sponsor")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-pill text-sm font-medium transition-all ${role === "sponsor" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}
            >
              <Heart className="h-4 w-4" /> Sponsor
            </button>
            <button
              onClick={() => setRole("admin")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-pill text-sm font-medium transition-all ${role === "admin" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}
            >
              <Shield className="h-4 w-4" /> Admin
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground block mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-input rounded-lg px-3 py-2.5 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder={role === "admin" ? "admin@kindredpath.org" : "rahul@gmail.com"}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-input rounded-lg px-3 py-2.5 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="••••••••"
                required
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <button type="submit" className="w-full btn-pill bg-primary text-primary-foreground flex items-center justify-center gap-2 hover:opacity-90">
              <LogIn className="h-4 w-4" /> Sign In
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-4">
            New sponsor? <Link to="/register" className="text-primary font-medium hover:underline">Register here</Link>
          </p>

          <div className="mt-4 p-3 rounded-lg bg-secondary text-xs text-muted-foreground">
            <p className="font-medium mb-1">Demo Credentials:</p>
            <p>Admin: admin@kindredpath.org / any password</p>
            <p>Sponsor: rahul@gmail.com / any password</p>
          </div>
        </div>
      </div>
    </div>
  );
}

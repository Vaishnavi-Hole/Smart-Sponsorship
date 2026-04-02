import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { UserPlus, Heart } from "lucide-react";

export default function RegisterPage() {
  const { setLastQuery } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", password: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLastQuery(`INSERT INTO Sponsors (Name, Email, Phone, Address, Password, Join_Date) VALUES ('${form.name}', '${form.email}', '${form.phone}', '${form.address}', '***', CURRENT_DATE);`);
    alert("Registration successful! Please login.");
    navigate("/login");
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="card-kindred bg-card p-8 shadow-lg">
          <div className="text-center mb-6">
            <Heart className="h-10 w-10 mx-auto text-accent fill-accent mb-2" />
            <h1 className="text-2xl font-bold text-foreground">Become a Sponsor</h1>
            <p className="text-sm text-muted-foreground mt-1">Join us in changing lives</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { key: "name", label: "Full Name", type: "text", placeholder: "Your Name" },
              { key: "email", label: "Email", type: "email", placeholder: "your@email.com" },
              { key: "phone", label: "Phone", type: "tel", placeholder: "9876543210" },
              { key: "address", label: "Address", type: "text", placeholder: "Your City" },
              { key: "password", label: "Password", type: "password", placeholder: "••••••••" },
            ].map((field) => (
              <div key={field.key}>
                <label className="text-sm font-medium text-foreground block mb-1">{field.label}</label>
                <input
                  type={field.type}
                  value={form[field.key as keyof typeof form]}
                  onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                  className="w-full border border-input rounded-lg px-3 py-2.5 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder={field.placeholder}
                  required
                />
              </div>
            ))}

            <button type="submit" className="w-full btn-pill bg-accent text-accent-foreground flex items-center justify-center gap-2 hover:opacity-90">
              <UserPlus className="h-4 w-4" /> Register as Sponsor
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-4">
            Already registered? <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

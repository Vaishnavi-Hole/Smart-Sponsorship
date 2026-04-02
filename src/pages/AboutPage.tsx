import { Heart, Target, Globe, Users } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="animate-fade-in py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-foreground mb-3">About Bright Paths Pro</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We are a non-profit organization dedicated to empowering underprivileged children through education, healthcare, and compassionate sponsorship.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {[
            { icon: <Heart className="h-8 w-8" />, title: "Our Mission", desc: "To provide every child with access to quality education, nutrition, and healthcare through community-driven sponsorship programs." },
            { icon: <Target className="h-8 w-8" />, title: "Our Vision", desc: "A world where no child is left behind due to financial constraints. Every child deserves the chance to learn, grow, and thrive." },
            { icon: <Globe className="h-8 w-8" />, title: "Our Reach", desc: "Operating across multiple cities in India, we connect sponsors with children in underserved communities, creating lasting bonds." },
            { icon: <Users className="h-8 w-8" />, title: "Our Team", desc: "A dedicated team of social workers, educators, and volunteers working tirelessly to ensure every donation makes maximum impact." },
          ].map((item, i) => (
            <div key={i} className="card-kindred bg-card p-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">{item.icon}</div>
              <h3 className="text-lg font-bold text-foreground mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="card-kindred bg-card p-8 text-center">
          <h2 className="text-xl font-bold text-foreground mb-3">DBMS Demonstration Project</h2>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-xl mx-auto">
            This application is a Child Sponsorship Management System built to demonstrate key DBMS operations including INSERT, UPDATE, DELETE, SELECT with WHERE, ORDER BY, GROUP BY, and JOIN queries. The SQL Query Display Panel at the top shows each query as it executes.
          </p>
        </div>
      </div>
    </div>
  );
}

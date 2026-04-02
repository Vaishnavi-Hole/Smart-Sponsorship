import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { children, donations, sponsors, getChildAge } from "@/data/mockData";
import { Heart, Users, DollarSign, ArrowRight, Star, Shield } from "lucide-react";

export default function HomePage() {
  const { setLastQuery } = useApp();

  const totalDonations = donations.reduce((sum, d) => sum + d.Amount, 0);
  const featuredChildren = children.slice(0, 3);

  useEffect(() => {
    setLastQuery("SELECT Children.*, Sponsorship_Plans.Plan_Name FROM Children LEFT JOIN Donations ON Children.Child_ID = Donations.Child_ID LEFT JOIN Sponsorship_Plans ON Donations.Plan_ID = Sponsorship_Plans.Plan_ID LIMIT 3;");
  }, [setLastQuery]);

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="gradient-hero py-20 px-4">
        <div className="container mx-auto text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-pill px-4 py-1.5 text-sm font-medium mb-6">
            <Star className="h-4 w-4" /> Smart Child Sponsorship System
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight mb-4">
            Every Child Deserves a <span className="text-primary">Bright Future</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            Kindred Path connects generous sponsors with children in need. Your support provides education, healthcare, and hope.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/register" className="btn-pill bg-accent text-accent-foreground text-base hover:opacity-90 inline-flex items-center gap-2">
              <Heart className="h-5 w-5" /> Sponsor a Child
            </Link>
            <Link to="/children" className="btn-pill bg-primary text-primary-foreground text-base hover:opacity-90 inline-flex items-center gap-2">
              Browse Children <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-4">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
          <div className="stat-card">
            <Users className="h-8 w-8 mx-auto text-primary mb-2" />
            <p className="text-3xl font-bold text-foreground">{children.length}</p>
            <p className="text-sm text-muted-foreground">Children Supported</p>
          </div>
          <div className="stat-card">
            <Heart className="h-8 w-8 mx-auto text-accent mb-2" />
            <p className="text-3xl font-bold text-foreground">{sponsors.length}</p>
            <p className="text-sm text-muted-foreground">Active Sponsors</p>
          </div>
          <div className="stat-card">
            <DollarSign className="h-8 w-8 mx-auto text-success mb-2" />
            <p className="text-3xl font-bold text-foreground">₹{totalDonations.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Total Donations</p>
          </div>
        </div>
      </section>

      {/* Featured Children */}
      <section className="py-12 px-4 bg-secondary/50">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold text-center text-foreground mb-2">Children Waiting for Sponsors</h2>
          <p className="text-center text-muted-foreground mb-8">Meet the children whose lives you can transform</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredChildren.map((child) => (
              <div key={child.Child_ID} className="card-kindred bg-card overflow-hidden">
                <div className="gradient-primary h-32 flex items-center justify-center">
                  <span className="text-5xl">{child.Gender === "Female" ? "👧" : "👦"}</span>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-foreground">{child.Name}</h3>
                  <p className="text-sm text-muted-foreground">Age {getChildAge(child.Date_of_Birth)} • {child.Gender}</p>
                  <p className="text-sm text-muted-foreground mt-1">{child.School_Name}</p>
                  <p className="text-sm text-muted-foreground">{child.Address}</p>
                  <Link to="/children" className="mt-4 inline-flex items-center gap-1 text-sm text-primary font-medium hover:underline">
                    View Profile <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-2xl font-bold text-foreground mb-8">How Sponsorship Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <Users className="h-8 w-8" />, title: "Choose a Child", desc: "Browse profiles and select a child to support" },
              { icon: <Shield className="h-8 w-8" />, title: "Pick a Plan", desc: "Choose from Basic, Standard, or Premium plans" },
              { icon: <Heart className="h-8 w-8" />, title: "Make a Difference", desc: "Track progress and see the impact of your sponsorship" },
            ].map((step, i) => (
              <div key={i} className="space-y-3">
                <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
                  {step.icon}
                </div>
                <h3 className="font-semibold text-foreground">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { children, donations, sponsorshipPlans, educationRecords, medicalRecords, getChildAge } from "@/data/mockData";
import { Navigate } from "react-router-dom";
import { Heart, DollarSign, CreditCard, History } from "lucide-react";

export default function SponsorDashboard() {
  const { user, setLastQuery } = useApp();
  const [tab, setTab] = useState<"dashboard" | "browse" | "donate" | "history">("dashboard");
  const [selectedChildId, setSelectedChildId] = useState<number | null>(null);
  const [selectedPlanId, setSelectedPlanId] = useState<number>(1);
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [donationsList, setDonationsList] = useState([...donations]);

  if (!user || user.role !== "sponsor") return <Navigate to="/login" />;

  const myDonations = donationsList.filter((d) => d.Sponsor_ID === user.id);
  const myTotal = myDonations.reduce((s, d) => s + d.Amount, 0);

  const handleDonate = () => {
    if (!selectedChildId) return;
    const plan = sponsorshipPlans.find((p) => p.Plan_ID === selectedPlanId)!;
    const newDonation = {
      Donation_ID: donationsList.length + 1,
      Sponsor_ID: user.id,
      Child_ID: selectedChildId,
      Plan_ID: selectedPlanId,
      Amount: plan.Amount,
      Donation_Date: new Date().toISOString().split("T")[0],
      Payment_Method: paymentMethod,
    };
    setDonationsList([...donationsList, newDonation]);
    setLastQuery(`INSERT INTO Donations (Sponsor_ID, Child_ID, Plan_ID, Amount, Donation_Date, Payment_Method) VALUES (${user.id}, ${selectedChildId}, ${selectedPlanId}, ${plan.Amount}, CURRENT_DATE, '${paymentMethod}');`);
    setSelectedChildId(null);
    setTab("history");
  };

  const tabs = [
    { key: "dashboard" as const, label: "My Dashboard", icon: <Heart className="h-4 w-4" /> },
    { key: "browse" as const, label: "Browse Children", icon: <Heart className="h-4 w-4" /> },
    { key: "donate" as const, label: "Make Donation", icon: <DollarSign className="h-4 w-4" /> },
    { key: "history" as const, label: "Donation History", icon: <History className="h-4 w-4" /> },
  ];

  return (
    <div className="animate-fade-in py-6 px-4">
      <div className="container mx-auto max-w-5xl">
        <h1 className="text-2xl font-bold text-foreground mb-1">Welcome, {user.name}!</h1>
        <p className="text-sm text-muted-foreground mb-6">Sponsor Dashboard</p>

        <div className="flex gap-1 overflow-x-auto pb-2 mb-6">
          {tabs.map((t) => (
            <button key={t.key} onClick={() => {
              setTab(t.key);
              if (t.key === "dashboard") setLastQuery(`SELECT d.*, c.Name FROM Donations d JOIN Children c ON d.Child_ID = c.Child_ID WHERE d.Sponsor_ID = ${user.id};`);
              if (t.key === "browse") setLastQuery("SELECT * FROM Children ORDER BY Name ASC;");
              if (t.key === "history") setLastQuery(`SELECT d.*, c.Name, p.Plan_Name FROM Donations d JOIN Children c ON d.Child_ID = c.Child_ID JOIN Sponsorship_Plans p ON d.Plan_ID = p.Plan_ID WHERE d.Sponsor_ID = ${user.id} ORDER BY d.Donation_Date DESC;`);
            }} className={`flex items-center gap-1.5 px-4 py-2 rounded-pill text-sm font-medium whitespace-nowrap transition-all ${tab === t.key ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Dashboard */}
        {tab === "dashboard" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="stat-card">
                <DollarSign className="h-8 w-8 mx-auto text-primary mb-2" />
                <p className="text-3xl font-bold text-foreground">₹{myTotal.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Donated</p>
              </div>
              <div className="stat-card">
                <Heart className="h-8 w-8 mx-auto text-accent mb-2" />
                <p className="text-3xl font-bold text-foreground">{new Set(myDonations.map((d) => d.Child_ID)).size}</p>
                <p className="text-sm text-muted-foreground">Children Sponsored</p>
              </div>
            </div>

            {/* Sponsored children with progress */}
            <div className="card-kindred bg-card p-5">
              <h3 className="font-bold text-foreground mb-4">Children You Sponsor</h3>
              {[...new Set(myDonations.map((d) => d.Child_ID))].map((cid) => {
                const child = children.find((c) => c.Child_ID === cid);
                const edu = educationRecords.find((e) => e.Child_ID === cid);
                if (!child) return null;
                return (
                  <div key={cid} className="flex items-center gap-4 p-3 rounded-xl bg-secondary mb-2">
                    <span className="text-3xl">{child.Gender === "Female" ? "👧" : "👦"}</span>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{child.Name}</p>
                      <p className="text-xs text-muted-foreground">{child.School_Name} • Grade {edu?.Grade || "N/A"}</p>
                    </div>
                    {edu && <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-pill">{edu.Performance}</span>}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Browse Children */}
        {tab === "browse" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {children.map((child) => {
              const med = medicalRecords.find((m) => m.Child_ID === child.Child_ID);
              return (
                <div key={child.Child_ID} className="card-kindred bg-card overflow-hidden">
                  <div className="gradient-primary h-24 flex items-center justify-center">
                    <span className="text-4xl">{child.Gender === "Female" ? "👧" : "👦"}</span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-foreground">{child.Name}</h3>
                    <p className="text-sm text-muted-foreground">Age {getChildAge(child.Date_of_Birth)} • {child.School_Name}</p>
                    {med && <p className="text-xs text-muted-foreground mt-1">Health: {med.Health_Status}</p>}
                    <button onClick={() => { setSelectedChildId(child.Child_ID); setTab("donate"); setLastQuery(`SELECT * FROM Children WHERE Child_ID = ${child.Child_ID};`); }} className="mt-3 btn-pill bg-accent text-accent-foreground text-sm inline-flex items-center gap-1 hover:opacity-90">
                      <Heart className="h-3.5 w-3.5" /> Sponsor
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Donate */}
        {tab === "donate" && (
          <div className="max-w-md mx-auto card-kindred bg-card p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">Make a Donation</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground block mb-1">Select Child</label>
                <select value={selectedChildId || ""} onChange={(e) => setSelectedChildId(Number(e.target.value))} className="w-full border border-input rounded-lg px-3 py-2.5 text-sm bg-background text-foreground">
                  <option value="">Choose a child...</option>
                  {children.map((c) => <option key={c.Child_ID} value={c.Child_ID}>{c.Name} (ID: {c.Child_ID})</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1">Sponsorship Plan</label>
                <div className="space-y-2">
                  {sponsorshipPlans.map((p) => (
                    <label key={p.Plan_ID} className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${selectedPlanId === p.Plan_ID ? "bg-primary/10 border-2 border-primary" : "bg-secondary border-2 border-transparent"}`}>
                      <input type="radio" name="plan" checked={selectedPlanId === p.Plan_ID} onChange={() => setSelectedPlanId(p.Plan_ID)} className="accent-primary" />
                      <div>
                        <p className="font-medium text-foreground text-sm">{p.Plan_Name} — ₹{p.Amount.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">{p.Description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1">Payment Method</label>
                <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="w-full border border-input rounded-lg px-3 py-2.5 text-sm bg-background text-foreground">
                  <option>UPI</option><option>Card</option><option>Cash</option>
                </select>
              </div>
              <button onClick={handleDonate} disabled={!selectedChildId} className="w-full btn-pill bg-accent text-accent-foreground flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50">
                <CreditCard className="h-4 w-4" /> Donate Now
              </button>
            </div>
          </div>
        )}

        {/* History */}
        {tab === "history" && (
          <div className="card-kindred bg-card overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border">
                <th className="text-left p-3 text-muted-foreground font-medium">Date</th>
                <th className="text-left p-3 text-muted-foreground font-medium">Child</th>
                <th className="text-left p-3 text-muted-foreground font-medium">Plan</th>
                <th className="text-left p-3 text-muted-foreground font-medium">Amount</th>
                <th className="text-left p-3 text-muted-foreground font-medium">Method</th>
              </tr></thead>
              <tbody>{myDonations.map((d) => {
                const child = children.find((c) => c.Child_ID === d.Child_ID);
                const plan = sponsorshipPlans.find((p) => p.Plan_ID === d.Plan_ID);
                return (
                  <tr key={d.Donation_ID} className="border-b border-border hover:bg-secondary/50 transition-colors">
                    <td className="p-3 text-foreground">{d.Donation_Date}</td>
                    <td className="p-3 font-medium text-foreground">{child?.Name}</td>
                    <td className="p-3 text-foreground">{plan?.Plan_Name}</td>
                    <td className="p-3 font-medium text-primary">₹{d.Amount.toLocaleString()}</td>
                    <td className="p-3 text-foreground">{d.Payment_Method}</td>
                  </tr>
                );
              })}</tbody>
            </table>
            {myDonations.length === 0 && <p className="p-6 text-center text-muted-foreground">No donations yet.</p>}
          </div>
        )}
      </div>
    </div>
  );
}

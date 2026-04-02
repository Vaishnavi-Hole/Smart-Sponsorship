import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { children as allChildren, sponsors, donations, sponsorshipPlans, educationRecords, medicalRecords, getChildAge, type Child } from "@/data/mockData";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Users, Heart, DollarSign, Plus, Trash2, Edit, BookOpen, Stethoscope, FileText, Baby } from "lucide-react";
import { Navigate } from "react-router-dom";

type Tab = "dashboard" | "children" | "sponsors" | "plans" | "donations" | "education" | "medical" | "reports";

const CHART_COLORS = ["hsl(174, 85%, 30%)", "hsl(350, 88%, 60%)", "hsl(25, 95%, 55%)", "hsl(45, 95%, 55%)", "hsl(160, 60%, 40%)"];

export default function AdminDashboard() {
  const { user, setLastQuery } = useApp();
  const [tab, setTab] = useState<Tab>("dashboard");
  const [childrenList, setChildrenList] = useState<Child[]>([...allChildren]);
  const [showAddChild, setShowAddChild] = useState(false);
  const [editChild, setEditChild] = useState<Child | null>(null);
  const [newChild, setNewChild] = useState({ Name: "", Date_of_Birth: "", Gender: "Male", Address: "", School_Name: "" });

  if (!user || user.role !== "admin") return <Navigate to="/login" />;

  const totalDonations = donations.reduce((s, d) => s + d.Amount, 0);

  // GROUP BY data
  const donationsPerChild = childrenList.map((c) => ({
    name: c.Name,
    total: donations.filter((d) => d.Child_ID === c.Child_ID).reduce((s, d) => s + d.Amount, 0),
  }));

  // JOIN data
  const joinData = donations.map((d) => {
    const child = childrenList.find((c) => c.Child_ID === d.Child_ID);
    const sponsor = sponsors.find((s) => s.Sponsor_ID === d.Sponsor_ID);
    const plan = sponsorshipPlans.find((p) => p.Plan_ID === d.Plan_ID);
    return { ...d, childName: child?.Name, sponsorName: sponsor?.Name, planName: plan?.Plan_Name };
  });

  const handleAddChild = (e: React.FormEvent) => {
    e.preventDefault();
    const id = Math.max(...childrenList.map((c) => c.Child_ID)) + 1;
    const child: Child = { Child_ID: id, ...newChild, Admission_Date: new Date().toISOString().split("T")[0] };
    setChildrenList([...childrenList, child]);
    setLastQuery(`INSERT INTO Children (Child_ID, Name, Date_of_Birth, Gender, Address, School_Name) VALUES (${id}, '${newChild.Name}', '${newChild.Date_of_Birth}', '${newChild.Gender}', '${newChild.Address}', '${newChild.School_Name}');`);
    setShowAddChild(false);
    setNewChild({ Name: "", Date_of_Birth: "", Gender: "Male", Address: "", School_Name: "" });
  };

  const handleDeleteChild = (id: number) => {
    setChildrenList(childrenList.filter((c) => c.Child_ID !== id));
    setLastQuery(`DELETE FROM Children WHERE Child_ID = ${id};`);
  };

  const handleUpdateChild = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editChild) return;
    setChildrenList(childrenList.map((c) => (c.Child_ID === editChild.Child_ID ? editChild : c)));
    setLastQuery(`UPDATE Children SET Name = '${editChild.Name}', Address = '${editChild.Address}', School_Name = '${editChild.School_Name}' WHERE Child_ID = ${editChild.Child_ID};`);
    setEditChild(null);
  };

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "dashboard", label: "Dashboard", icon: <FileText className="h-4 w-4" /> },
    { key: "children", label: "Children", icon: <Baby className="h-4 w-4" /> },
    { key: "sponsors", label: "Sponsors", icon: <Users className="h-4 w-4" /> },
    { key: "plans", label: "Plans", icon: <Heart className="h-4 w-4" /> },
    { key: "donations", label: "Donations", icon: <DollarSign className="h-4 w-4" /> },
    { key: "education", label: "Education", icon: <BookOpen className="h-4 w-4" /> },
    { key: "medical", label: "Medical", icon: <Stethoscope className="h-4 w-4" /> },
    { key: "reports", label: "Reports", icon: <FileText className="h-4 w-4" /> },
  ];

  return (
    <div className="animate-fade-in py-6 px-4">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-2xl font-bold text-foreground mb-1">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground mb-6">Manage children, sponsors, and donations</p>

        {/* Tabs */}
        <div className="flex gap-1 overflow-x-auto pb-2 mb-6 scrollbar-none">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => {
                setTab(t.key);
                if (t.key === "dashboard") setLastQuery("SELECT COUNT(*) as count FROM Children; SELECT COUNT(*) as count FROM Sponsors; SELECT SUM(Amount) as total FROM Donations;");
                if (t.key === "children") setLastQuery("SELECT * FROM Children ORDER BY Name ASC;");
                if (t.key === "sponsors") setLastQuery("SELECT * FROM Sponsors ORDER BY Join_Date DESC;");
                if (t.key === "plans") setLastQuery("SELECT * FROM Sponsorship_Plans;");
                if (t.key === "donations") setLastQuery("SELECT d.*, c.Name as Child_Name, s.Name as Sponsor_Name, p.Plan_Name FROM Donations d JOIN Children c ON d.Child_ID = c.Child_ID JOIN Sponsors s ON d.Sponsor_ID = s.Sponsor_ID JOIN Sponsorship_Plans p ON d.Plan_ID = p.Plan_ID;");
                if (t.key === "education") setLastQuery("SELECT e.*, c.Name FROM Education_Records e JOIN Children c ON e.Child_ID = c.Child_ID;");
                if (t.key === "medical") setLastQuery("SELECT m.*, c.Name FROM Medical_Records m JOIN Children c ON m.Child_ID = c.Child_ID;");
                if (t.key === "reports") setLastQuery("SELECT c.Name, SUM(d.Amount) as total FROM Children c LEFT JOIN Donations d ON c.Child_ID = d.Child_ID GROUP BY c.Child_ID;");
              }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-pill text-sm font-medium whitespace-nowrap transition-all ${tab === t.key ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-muted"}`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Dashboard */}
        {tab === "dashboard" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="stat-card"><Users className="h-8 w-8 mx-auto text-primary mb-2" /><p className="text-3xl font-bold text-foreground">{childrenList.length}</p><p className="text-sm text-muted-foreground">Total Children</p></div>
              <div className="stat-card"><Heart className="h-8 w-8 mx-auto text-accent mb-2" /><p className="text-3xl font-bold text-foreground">{sponsors.length}</p><p className="text-sm text-muted-foreground">Active Sponsors</p></div>
              <div className="stat-card"><DollarSign className="h-8 w-8 mx-auto text-success mb-2" /><p className="text-3xl font-bold text-foreground">₹{totalDonations.toLocaleString()}</p><p className="text-sm text-muted-foreground">Total Donations</p></div>
            </div>

            <div className="card-kindred bg-card p-6">
              <h3 className="font-bold text-foreground mb-4">Donations per Child (GROUP BY)</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={donationsPerChild}>
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="total" fill="hsl(174, 85%, 30%)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Children Management */}
        {tab === "children" && (
          <div className="space-y-4">
            <button onClick={() => setShowAddChild(true)} className="btn-pill bg-primary text-primary-foreground text-sm inline-flex items-center gap-2">
              <Plus className="h-4 w-4" /> Add Child (INSERT)
            </button>

            {/* Add Child Form */}
            {showAddChild && (
              <div className="card-kindred bg-card p-5">
                <h3 className="font-bold text-foreground mb-3">Add New Child</h3>
                <form onSubmit={handleAddChild} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input value={newChild.Name} onChange={(e) => setNewChild({ ...newChild, Name: e.target.value })} className="border border-input rounded-lg px-3 py-2 text-sm bg-background" placeholder="Name" required />
                  <input type="date" value={newChild.Date_of_Birth} onChange={(e) => setNewChild({ ...newChild, Date_of_Birth: e.target.value })} className="border border-input rounded-lg px-3 py-2 text-sm bg-background" required />
                  <select value={newChild.Gender} onChange={(e) => setNewChild({ ...newChild, Gender: e.target.value })} className="border border-input rounded-lg px-3 py-2 text-sm bg-background">
                    <option>Male</option><option>Female</option>
                  </select>
                  <input value={newChild.Address} onChange={(e) => setNewChild({ ...newChild, Address: e.target.value })} className="border border-input rounded-lg px-3 py-2 text-sm bg-background" placeholder="Address" required />
                  <input value={newChild.School_Name} onChange={(e) => setNewChild({ ...newChild, School_Name: e.target.value })} className="border border-input rounded-lg px-3 py-2 text-sm bg-background" placeholder="School Name" required />
                  <div className="flex gap-2">
                    <button type="submit" className="btn-pill bg-primary text-primary-foreground text-sm">Save</button>
                    <button type="button" onClick={() => setShowAddChild(false)} className="btn-pill bg-secondary text-secondary-foreground text-sm">Cancel</button>
                  </div>
                </form>
              </div>
            )}

            {/* Edit Child Form */}
            {editChild && (
              <div className="card-kindred bg-card p-5">
                <h3 className="font-bold text-foreground mb-3">Update Child (UPDATE)</h3>
                <form onSubmit={handleUpdateChild} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input value={editChild.Name} onChange={(e) => setEditChild({ ...editChild, Name: e.target.value })} className="border border-input rounded-lg px-3 py-2 text-sm bg-background" />
                  <input value={editChild.Address} onChange={(e) => setEditChild({ ...editChild, Address: e.target.value })} className="border border-input rounded-lg px-3 py-2 text-sm bg-background" />
                  <input value={editChild.School_Name} onChange={(e) => setEditChild({ ...editChild, School_Name: e.target.value })} className="border border-input rounded-lg px-3 py-2 text-sm bg-background" />
                  <div className="flex gap-2">
                    <button type="submit" className="btn-pill bg-primary text-primary-foreground text-sm">Update</button>
                    <button type="button" onClick={() => setEditChild(null)} className="btn-pill bg-secondary text-secondary-foreground text-sm">Cancel</button>
                  </div>
                </form>
              </div>
            )}

            {/* Children Table */}
            <div className="card-kindred bg-card overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-3 text-muted-foreground font-medium">ID</th>
                    <th className="text-left p-3 text-muted-foreground font-medium">Name</th>
                    <th className="text-left p-3 text-muted-foreground font-medium">Age</th>
                    <th className="text-left p-3 text-muted-foreground font-medium">Gender</th>
                    <th className="text-left p-3 text-muted-foreground font-medium">School</th>
                    <th className="text-left p-3 text-muted-foreground font-medium">Address</th>
                    <th className="text-left p-3 text-muted-foreground font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {childrenList.map((c) => (
                    <tr key={c.Child_ID} className="border-b border-border hover:bg-secondary/50 transition-colors">
                      <td className="p-3 text-foreground">{c.Child_ID}</td>
                      <td className="p-3 font-medium text-foreground">{c.Name}</td>
                      <td className="p-3 text-foreground">{getChildAge(c.Date_of_Birth)}</td>
                      <td className="p-3 text-foreground">{c.Gender}</td>
                      <td className="p-3 text-foreground">{c.School_Name}</td>
                      <td className="p-3 text-foreground">{c.Address}</td>
                      <td className="p-3 flex gap-2">
                        <button onClick={() => setEditChild(c)} className="text-primary hover:text-primary/80"><Edit className="h-4 w-4" /></button>
                        <button onClick={() => handleDeleteChild(c.Child_ID)} className="text-destructive hover:text-destructive/80"><Trash2 className="h-4 w-4" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Sponsors */}
        {tab === "sponsors" && (
          <div className="card-kindred bg-card overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border">
                <th className="text-left p-3 text-muted-foreground font-medium">ID</th>
                <th className="text-left p-3 text-muted-foreground font-medium">Name</th>
                <th className="text-left p-3 text-muted-foreground font-medium">Email</th>
                <th className="text-left p-3 text-muted-foreground font-medium">Phone</th>
                <th className="text-left p-3 text-muted-foreground font-medium">Address</th>
                <th className="text-left p-3 text-muted-foreground font-medium">Joined</th>
              </tr></thead>
              <tbody>{sponsors.map((s) => (
                <tr key={s.Sponsor_ID} className="border-b border-border hover:bg-secondary/50 transition-colors">
                  <td className="p-3 text-foreground">{s.Sponsor_ID}</td>
                  <td className="p-3 font-medium text-foreground">{s.Name}</td>
                  <td className="p-3 text-foreground">{s.Email}</td>
                  <td className="p-3 text-foreground">{s.Phone}</td>
                  <td className="p-3 text-foreground">{s.Address}</td>
                  <td className="p-3 text-foreground">{s.Join_Date}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}

        {/* Plans */}
        {tab === "plans" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sponsorshipPlans.map((p) => (
              <div key={p.Plan_ID} className="card-kindred bg-card p-6 text-center">
                <h3 className="text-lg font-bold text-foreground">{p.Plan_Name}</h3>
                <p className="text-3xl font-bold text-primary mt-2">₹{p.Amount.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground mt-1">{p.Duration} months</p>
                <p className="text-sm text-muted-foreground mt-3">{p.Description}</p>
              </div>
            ))}
          </div>
        )}

        {/* Donations (JOIN) */}
        {tab === "donations" && (
          <div className="card-kindred bg-card overflow-x-auto">
            <div className="p-4 border-b border-border"><h3 className="font-bold text-foreground">Donations — JOIN Query (Sponsors ⟕ Children ⟕ Plans)</h3></div>
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border">
                <th className="text-left p-3 text-muted-foreground font-medium">ID</th>
                <th className="text-left p-3 text-muted-foreground font-medium">Sponsor</th>
                <th className="text-left p-3 text-muted-foreground font-medium">Child</th>
                <th className="text-left p-3 text-muted-foreground font-medium">Plan</th>
                <th className="text-left p-3 text-muted-foreground font-medium">Amount</th>
                <th className="text-left p-3 text-muted-foreground font-medium">Date</th>
                <th className="text-left p-3 text-muted-foreground font-medium">Method</th>
              </tr></thead>
              <tbody>{joinData.map((d) => (
                <tr key={d.Donation_ID} className="border-b border-border hover:bg-secondary/50 transition-colors">
                  <td className="p-3 text-foreground">{d.Donation_ID}</td>
                  <td className="p-3 font-medium text-foreground">{d.sponsorName}</td>
                  <td className="p-3 text-foreground">{d.childName}</td>
                  <td className="p-3 text-foreground">{d.planName}</td>
                  <td className="p-3 font-medium text-primary">₹{d.Amount.toLocaleString()}</td>
                  <td className="p-3 text-foreground">{d.Donation_Date}</td>
                  <td className="p-3 text-foreground">{d.Payment_Method}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}

        {/* Education */}
        {tab === "education" && (
          <div className="card-kindred bg-card overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border">
                <th className="text-left p-3 text-muted-foreground font-medium">Child</th>
                <th className="text-left p-3 text-muted-foreground font-medium">School</th>
                <th className="text-left p-3 text-muted-foreground font-medium">Grade</th>
                <th className="text-left p-3 text-muted-foreground font-medium">Performance</th>
                <th className="text-left p-3 text-muted-foreground font-medium">Attendance</th>
                <th className="text-left p-3 text-muted-foreground font-medium">Year</th>
              </tr></thead>
              <tbody>{educationRecords.map((e) => {
                const child = allChildren.find((c) => c.Child_ID === e.Child_ID);
                return (
                  <tr key={e.Education_ID} className="border-b border-border hover:bg-secondary/50 transition-colors">
                    <td className="p-3 font-medium text-foreground">{child?.Name}</td>
                    <td className="p-3 text-foreground">{e.School_Name}</td>
                    <td className="p-3 text-foreground">{e.Grade}</td>
                    <td className="p-3 text-foreground">{e.Performance}</td>
                    <td className="p-3 text-foreground">{e.Attendance}%</td>
                    <td className="p-3 text-foreground">{e.Academic_Year}</td>
                  </tr>
                );
              })}</tbody>
            </table>
          </div>
        )}

        {/* Medical */}
        {tab === "medical" && (
          <div className="card-kindred bg-card overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border">
                <th className="text-left p-3 text-muted-foreground font-medium">Child</th>
                <th className="text-left p-3 text-muted-foreground font-medium">Health Status</th>
                <th className="text-left p-3 text-muted-foreground font-medium">Doctor</th>
                <th className="text-left p-3 text-muted-foreground font-medium">Hospital</th>
                <th className="text-left p-3 text-muted-foreground font-medium">Last Checkup</th>
              </tr></thead>
              <tbody>{medicalRecords.map((m) => {
                const child = allChildren.find((c) => c.Child_ID === m.Child_ID);
                return (
                  <tr key={m.Medical_ID} className="border-b border-border hover:bg-secondary/50 transition-colors">
                    <td className="p-3 font-medium text-foreground">{child?.Name}</td>
                    <td className="p-3 text-foreground">{m.Health_Status}</td>
                    <td className="p-3 text-foreground">{m.Doctor_Name}</td>
                    <td className="p-3 text-foreground">{m.Hospital_Name}</td>
                    <td className="p-3 text-foreground">{m.Last_Checkup_Date}</td>
                  </tr>
                );
              })}</tbody>
            </table>
          </div>
        )}

        {/* Reports */}
        {tab === "reports" && (
          <div className="space-y-6">
            <div className="card-kindred bg-card p-6">
              <h3 className="font-bold text-foreground mb-4">Total Donations per Child (GROUP BY)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={donationsPerChild}>
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="total" radius={[6, 6, 0, 0]}>
                    {donationsPerChild.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="card-kindred bg-card p-6">
              <h3 className="font-bold text-foreground mb-4">Donations by Payment Method</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={[
                      { name: "UPI", value: donations.filter((d) => d.Payment_Method === "UPI").reduce((s, d) => s + d.Amount, 0) },
                      { name: "Card", value: donations.filter((d) => d.Payment_Method === "Card").reduce((s, d) => s + d.Amount, 0) },
                      { name: "Cash", value: donations.filter((d) => d.Payment_Method === "Cash").reduce((s, d) => s + d.Amount, 0) },
                    ]}
                    cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ₹${value}`}
                  >
                    {CHART_COLORS.slice(0, 3).map((c, i) => <Cell key={i} fill={c} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { children as initialChildren, donations, sponsors, educationRecords, medicalRecords, getChildAge, type Child } from "@/data/mockData";
import { Search, ArrowUpDown, Heart, MapPin, School, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

export default function ChildrenPage() {
  const { setLastQuery, user } = useApp();
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<"Name" | "Date_of_Birth" | "Address">("Name");
  const [filtered, setFiltered] = useState<Child[]>(initialChildren);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);

  useEffect(() => {
    let result = [...initialChildren];
    if (search) {
      result = result.filter((c) => c.Name.toLowerCase().includes(search.toLowerCase()));
      setLastQuery(`SELECT * FROM Children WHERE Name LIKE '%${search}%' ORDER BY ${sortField} ASC;`);
    } else {
      setLastQuery(`SELECT * FROM Children ORDER BY ${sortField} ASC;`);
    }
    result.sort((a, b) => {
      if (sortField === "Name") return a.Name.localeCompare(b.Name);
      if (sortField === "Date_of_Birth") return a.Date_of_Birth.localeCompare(b.Date_of_Birth);
      return a.Address.localeCompare(b.Address);
    });
    setFiltered(result);
  }, [search, sortField, setLastQuery]);

  const viewProfile = (child: Child) => {
    setSelectedChild(child);
    setLastQuery(`SELECT c.*, e.Grade, e.Performance, e.Attendance, m.Health_Status, m.Doctor_Name FROM Children c LEFT JOIN Education_Records e ON c.Child_ID = e.Child_ID LEFT JOIN Medical_Records m ON c.Child_ID = m.Child_ID WHERE c.Child_ID = ${child.Child_ID};`);
  };

  const childEducation = (id: number) => educationRecords.find((e) => e.Child_ID === id);
  const childMedical = (id: number) => medicalRecords.find((m) => m.Child_ID === id);
  const childDonations = (id: number) => donations.filter((d) => d.Child_ID === id);
  const totalForChild = (id: number) => childDonations(id).reduce((s, d) => s + d.Amount, 0);

  return (
    <div className="animate-fade-in py-8 px-4">
      <div className="container mx-auto max-w-5xl">
        <h1 className="text-2xl font-bold text-foreground mb-6">Children Gallery</h1>

        {/* Search & Sort */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 border border-input rounded-lg text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Search by name (WHERE clause)..."
            />
          </div>
          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
            <select
              value={sortField}
              onChange={(e) => setSortField(e.target.value as any)}
              className="border border-input rounded-lg px-3 py-2.5 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="Name">Sort by Name</option>
              <option value="Date_of_Birth">Sort by Age</option>
              <option value="Address">Sort by Address</option>
            </select>
          </div>
        </div>

        {/* Child detail modal */}
        {selectedChild && (
          <div className="fixed inset-0 bg-foreground/40 z-40 flex items-center justify-center p-4" onClick={() => setSelectedChild(null)}>
            <div className="card-kindred bg-card max-w-lg w-full max-h-[85vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
              <div className="gradient-primary rounded-xl h-24 flex items-center justify-center mb-4">
                <span className="text-5xl">{selectedChild.Gender === "Female" ? "👧" : "👦"}</span>
              </div>
              <h2 className="text-xl font-bold text-foreground">{selectedChild.Name}</h2>
              <p className="text-sm text-muted-foreground">Age {getChildAge(selectedChild.Date_of_Birth)} • {selectedChild.Gender} • {selectedChild.Address}</p>

              {/* Education */}
              {childEducation(selectedChild.Child_ID) && (
                <div className="mt-4 p-4 rounded-xl bg-secondary">
                  <h3 className="font-semibold text-foreground text-sm mb-2">📚 Education</h3>
                  <p className="text-sm text-muted-foreground">Grade: {childEducation(selectedChild.Child_ID)!.Grade}</p>
                  <p className="text-sm text-muted-foreground">Performance: {childEducation(selectedChild.Child_ID)!.Performance}</p>
                  <p className="text-sm text-muted-foreground">Attendance: {childEducation(selectedChild.Child_ID)!.Attendance}%</p>
                </div>
              )}

              {/* Medical */}
              {childMedical(selectedChild.Child_ID) && (
                <div className="mt-3 p-4 rounded-xl bg-secondary">
                  <h3 className="font-semibold text-foreground text-sm mb-2">🏥 Medical</h3>
                  <p className="text-sm text-muted-foreground">Status: {childMedical(selectedChild.Child_ID)!.Health_Status}</p>
                  <p className="text-sm text-muted-foreground">Doctor: {childMedical(selectedChild.Child_ID)!.Doctor_Name}</p>
                </div>
              )}

              {/* Donations */}
              <div className="mt-3 p-4 rounded-xl bg-secondary">
                <h3 className="font-semibold text-foreground text-sm mb-2">💰 Donations Received: ₹{totalForChild(selectedChild.Child_ID).toLocaleString()}</h3>
                {/* Progress bar */}
                <div className="w-full bg-muted rounded-full h-2.5 mt-2">
                  <div className="bg-primary h-2.5 rounded-full" style={{ width: `${Math.min((totalForChild(selectedChild.Child_ID) / 10000) * 100, 100)}%` }} />
                </div>
              </div>

              <div className="flex gap-3 mt-5">
                {user?.role === "sponsor" && (
                  <Link to="/sponsor" className="btn-pill bg-accent text-accent-foreground text-sm hover:opacity-90">
                    <Heart className="h-4 w-4 inline mr-1" /> Donate
                  </Link>
                )}
                <button onClick={() => setSelectedChild(null)} className="btn-pill bg-secondary text-secondary-foreground text-sm">Close</button>
              </div>
            </div>
          </div>
        )}

        {/* Children Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((child) => (
            <div key={child.Child_ID} className="card-kindred bg-card overflow-hidden cursor-pointer" onClick={() => viewProfile(child)}>
              <div className="gradient-primary h-28 flex items-center justify-center">
                <span className="text-4xl">{child.Gender === "Female" ? "👧" : "👦"}</span>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-foreground">{child.Name}</h3>
                <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                  <Calendar className="h-3.5 w-3.5" /> Age {getChildAge(child.Date_of_Birth)} • {child.Gender}
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <School className="h-3.5 w-3.5" /> {child.School_Name}
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" /> {child.Address}
                </div>
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Donations</span>
                    <span>₹{totalForChild(child.Child_ID).toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5">
                    <div className="bg-primary h-1.5 rounded-full transition-all" style={{ width: `${Math.min((totalForChild(child.Child_ID) / 10000) * 100, 100)}%` }} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">No children found matching your search.</div>
        )}
      </div>
    </div>
  );
}

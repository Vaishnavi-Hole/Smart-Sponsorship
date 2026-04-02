// Mock database simulating MySQL tables

export interface Child {
  Child_ID: number;
  Name: string;
  Date_of_Birth: string;
  Gender: string;
  Address: string;
  School_Name: string;
  Admission_Date: string;
}

export interface Sponsor {
  Sponsor_ID: number;
  Name: string;
  Email: string;
  Phone: string;
  Address: string;
  Password: string;
  Join_Date: string;
}

export interface SponsorshipPlan {
  Plan_ID: number;
  Plan_Name: string;
  Amount: number;
  Duration: number;
  Description: string;
}

export interface Donation {
  Donation_ID: number;
  Sponsor_ID: number;
  Child_ID: number;
  Plan_ID: number;
  Amount: number;
  Donation_Date: string;
  Payment_Method: string;
}

export interface EducationRecord {
  Education_ID: number;
  Child_ID: number;
  School_Name: string;
  Grade: string;
  Performance: string;
  Attendance: number;
  Academic_Year: string;
}

export interface MedicalRecord {
  Medical_ID: number;
  Child_ID: number;
  Health_Status: string;
  Doctor_Name: string;
  Hospital_Name: string;
  Last_Checkup_Date: string;
}

export const children: Child[] = [
  { Child_ID: 101, Name: "Riya", Date_of_Birth: "2012-05-10", Gender: "Female", Address: "Pune", School_Name: "Sunrise School", Admission_Date: "2024-01-01" },
  { Child_ID: 102, Name: "Aman", Date_of_Birth: "2011-07-15", Gender: "Male", Address: "Delhi", School_Name: "Green Valley School", Admission_Date: "2024-01-02" },
  { Child_ID: 103, Name: "Sita", Date_of_Birth: "2013-03-20", Gender: "Female", Address: "Mumbai", School_Name: "Bright Future School", Admission_Date: "2024-01-03" },
  { Child_ID: 104, Name: "Arjun", Date_of_Birth: "2010-11-08", Gender: "Male", Address: "Chennai", School_Name: "Hope Academy", Admission_Date: "2024-02-01" },
  { Child_ID: 105, Name: "Priya", Date_of_Birth: "2014-01-25", Gender: "Female", Address: "Kolkata", School_Name: "Little Stars School", Admission_Date: "2024-02-15" },
];

export const sponsors: Sponsor[] = [
  { Sponsor_ID: 1, Name: "Rahul Sharma", Email: "rahul@gmail.com", Phone: "9876543210", Address: "Delhi", Password: "password123", Join_Date: "2024-01-10" },
  { Sponsor_ID: 2, Name: "Anita Patel", Email: "anita@gmail.com", Phone: "9876543220", Address: "Mumbai", Password: "password123", Join_Date: "2024-02-12" },
  { Sponsor_ID: 3, Name: "John Thomas", Email: "john@gmail.com", Phone: "9876543230", Address: "Pune", Password: "password123", Join_Date: "2024-03-15" },
];

export const sponsorshipPlans: SponsorshipPlan[] = [
  { Plan_ID: 1, Plan_Name: "Basic Plan", Amount: 2000, Duration: 12, Description: "Covers basic education needs including books and supplies" },
  { Plan_ID: 2, Plan_Name: "Standard Plan", Amount: 5000, Duration: 12, Description: "Includes education, nutrition, and health checkups" },
  { Plan_ID: 3, Plan_Name: "Premium Plan", Amount: 10000, Duration: 12, Description: "Complete care: education, health, nutrition, and extracurriculars" },
];

export const donations: Donation[] = [
  { Donation_ID: 1, Sponsor_ID: 1, Child_ID: 101, Plan_ID: 1, Amount: 2000, Donation_Date: "2024-02-10", Payment_Method: "UPI" },
  { Donation_ID: 2, Sponsor_ID: 2, Child_ID: 102, Plan_ID: 2, Amount: 5000, Donation_Date: "2024-02-15", Payment_Method: "Card" },
  { Donation_ID: 3, Sponsor_ID: 3, Child_ID: 101, Plan_ID: 3, Amount: 10000, Donation_Date: "2024-03-01", Payment_Method: "Cash" },
  { Donation_ID: 4, Sponsor_ID: 1, Child_ID: 103, Plan_ID: 1, Amount: 2000, Donation_Date: "2024-03-05", Payment_Method: "UPI" },
];

export const educationRecords: EducationRecord[] = [
  { Education_ID: 1, Child_ID: 101, School_Name: "Sunrise School", Grade: "6th", Performance: "Good", Attendance: 92, Academic_Year: "2024" },
  { Education_ID: 2, Child_ID: 102, School_Name: "Green Valley School", Grade: "7th", Performance: "Average", Attendance: 85, Academic_Year: "2024" },
  { Education_ID: 3, Child_ID: 103, School_Name: "Bright Future School", Grade: "5th", Performance: "Excellent", Attendance: 95, Academic_Year: "2024" },
];

export const medicalRecords: MedicalRecord[] = [
  { Medical_ID: 1, Child_ID: 101, Health_Status: "Healthy", Doctor_Name: "Dr. Mehta", Hospital_Name: "City Hospital", Last_Checkup_Date: "2024-02-01" },
  { Medical_ID: 2, Child_ID: 102, Health_Status: "Minor Cold", Doctor_Name: "Dr. Sharma", Hospital_Name: "Green Cross Hospital", Last_Checkup_Date: "2024-02-05" },
  { Medical_ID: 3, Child_ID: 103, Health_Status: "Healthy", Doctor_Name: "Dr. Patel", Hospital_Name: "Sunshine Clinic", Last_Checkup_Date: "2024-02-10" },
];

export function getChildAge(dob: string): number {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
  return age;
}

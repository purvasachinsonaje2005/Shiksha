export interface SideNavItem {
  icon: React.ReactNode;
  title: string;
  path: string;
  submenu?: boolean;
  subMenuItems?: SideNavItem[];
}

export interface School {
  _id?: string;
  name: string;
  registrationId: string;
  email?: string;
  contactNumber?: string;
  board: string;
  image: File | null;
  logo?: {
    contentType: string;
    data: Buffer;
  };
  address?: string;
  village?: string;
  taluka?: string;
  district?: string;
  state?: string;
  country?: string;
  pincode?: string;
  principal: Principal;
  teachers?: Teacher[];
  students?: string[];
  scholarships?: string[];
}

export interface Principal {
  _id?: string;
  name: string;
  email: string;
  password: string;
  school?: School;
}

export interface Teacher {
  _id?: string;
  name: string;
  phone: string;
  image: File | null;
  profileImage: {
    contentType: string;
    data: Buffer;
  };
  email: string;
  password: string;
  qualifications?: string;
  school: School | string;
  classes?: string[];
  password: string;
}

export interface Class {
  _id?: string;
  name: string;
  school: School | string;
  students?: string[];
  subjects?: {
    subjectName: string;
    teacher: Teacher;
  }[];
}

export interface Notice {
  _id?: string;
  title: string;
  content: string;
  date?: Date;
  tempImage?: File | null;
  principal: Principal;
  school: School;
  image?: {
    contentType: string;
    data: Buffer;
  };
  tags?: string[] | string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Student {
  _id?: string;
  studentId: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: Date;
  father: {
    name: string;
    occupation: string;
    email?: string;
    educationLevel?: number;
  };
  mother: {
    name: string;
    occupation: string;
    email?: string;
    educationLevel?: number;
  };
  finalGrade: number;
  grade2: number;
  grade1: number;
  numberOfFailures?: number;
  wantsHigherEducation: "yes" | "no";
  familyRelationship: number;
  freeTime: number;
  goingOut: number;
  age: number;
  weekdayAlcoholConsumption: number;
  weekendAlcoholConsumption: number;
  reasonForChoosingSchool: "course" | "home" | "reputation" | "other";
  gender: "M" | "F";
  internetAccess: "yes" | "no";
  guardian: "mother" | "father" | "other";
  parentalStatus: "T" | "A";
  attendedNursery: "yes" | "no";
  familySupport: "yes" | "no";
  extraPaidClasses: "yes" | "no";
  address: string;
  travelTime: number;
  studyTime: number;
  healthStatus: number;
  extraCurricularActivities: "yes" | "no";
  inRelationship: "yes" | "no";
  familySize: "GT3" | "LE3";
  class?: Class;
  school?: School;
  password: string;
  profileImage?: {
    contentType: string;
    data: Buffer;
  };
  dropoutPrediction?: {
    willDropout: "yes" | "no";
    confidence: number;
  };
}

export interface Resource {
  _id?: string;
  type: string;
  title: string;
  authors: {
    name: string;
    bio?: string;
    birthDate?: Date;
    nationality?: string;
  }[];
  description?: string;
  publishedYear?: number;
  categories?: string[];
  isbn?: string;
  fileUrl?: string;
  coverImage?: string;
  createdAt?: Date;
}

export interface Result {
  student: Student;
  class: Class;
  examType: "FA1" | "FA2" | "MidTerm" | "Final" | "Custom";
  subjectResults: {
    subjectName: string;
    marks: number;
    maxMarks?: number;
  }[];
  remarks?: string;
}

export interface Attendance {
  _id?: string;
  date: Date;
  class: Class;
  teacher: Teacher;
  records: {
    student: Student;
    status: "Present" | "Absent";
    timeMarked: Date;
  }[];
}

export interface FAQ {
  _id?: string;
  question: string;
  answers: {
    responder: Student | Teacher | Principal | Parent;
    role: "Student" | "Teacher" | "Principal" | "Parent";
    response: string;
    time: Date;
  }[];
}

export interface Conversation {
  _id?: string;
  type: "single" | "group";
  participants: {
    _id: Student | Teacher | Principal | Parent;
    model: "Student" | "Teacher" | "Principal" | "Parent";
  }[];
  groupInfo?: {
    name: string;
    class: Class;
    school: School;
  };
  messages: {
    sender: {
      _id: Student | Teacher | Principal | Parent;
      model: "Student" | "Teacher" | "Principal" | "Parent";
    };
    content: string;
    createdAt?: Date;
  }[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ScholarshipApplication {
  _id?: string;
  student: Student;
  school: School;
  class?: Class;
  reasonForScholarship: string;
  annualFamilyIncome: number;
  supportingDocuments: {
    url: string;
    fileType: string;
  }[];
  status: "Submitted" | "PrincipalReview" | "Approved" | "Rejected";
  principalReview?: {
    reviewedBy: Principal;
    remarks: string;
    date: Date;
  };
  adminReview?: {
    reviewedBy: string;
    remarks: string;
    date: Date;
  };
  granted: {
    isGranted: boolean;
    grantDate: Date;
    amountGranted: number;
  };
}

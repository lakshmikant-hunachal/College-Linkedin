export type UserRole = 'STUDENT' | 'SENIOR_ALUMNI' | 'PLACEMENT_COORDINATOR' | 'ADMINISTRATOR';

export type VerificationStatus = 'DEMO' | 'PENDING_VERIFICATION' | 'VERIFIED' | 'REJECTED' | 'ARCHIVED';

export type PostType =
  | 'PLACEMENT_EXPERIENCE'
  | 'INTERNSHIP_EXPERIENCE'
  | 'PROJECT_SHOWCASE'
  | 'CODING_MILESTONE'
  | 'ACADEMIC_NOTES'
  | 'CAREER_ADVICE'
  | 'GENERAL';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  collegeId?: string;
  fullName: string;
  department: string;
  currentSemester: number;
  graduationYear: number;
  headline?: string;
  bio?: string;
  profilePhoto?: string;
  skills: string[];
  areasOfInterest: string[];
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  isPublicProfile?: boolean;
}

export interface ChatMessage {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  isSender: boolean;
  isRead: boolean;
  createdAt: string;
}

export interface Conversation {
  user: {
    id: string;
    fullName: string;
    headline?: string;
    department?: string;
    currentSemester?: number;
    graduationYear?: number;
    role: UserRole;
    profilePhoto?: string;
  };
  lastMessage?: {
    id: string;
    content: string;
    createdAt: string;
    isSender: boolean;
    isRead: boolean;
  } | null;
  unreadCount: number;
  connectedSince: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  postType: PostType;
  companyName?: string;
  jobRole?: string;
  recruitmentYear?: number;
  isVerifiedPlacementPost: boolean;
  mediaUrls: string[];
  likesCount: number;
  commentsCount: number;
  isLikedByMe: boolean;
  isSavedByMe: boolean;
  createdAt: string;
  author: {
    id: string;
    fullName: string;
    headline?: string;
    department?: string;
    currentSemester?: number;
    graduationYear?: number;
    role: UserRole;
    profilePhoto?: string;
  };
}

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    fullName: string;
    headline?: string;
    role: UserRole;
    profilePhoto?: string;
  };
}

export interface StudentProfile {
  id: string;
  role: UserRole;
  collegeId?: string;
  fullName: string;
  department: string;
  currentSemester: number;
  graduationYear: number;
  headline?: string;
  bio?: string;
  profilePhoto?: string;
  skills: string[];
  areasOfInterest: string[];
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  connectionStatus?: string | null;
  isRequester?: boolean;
  recentPosts?: any[];
}

export interface Company {
  id: string;
  name: string;
  slug: string;
  categories: string[];
  industry: string;
  website?: string;
  description: string;
  headquarters?: string;
  isRecruitingAtBmsceConfirmed: boolean;
  relevantJobRoles: string[];
  requiredSkills: string[];
  interviewStages?: string[];
  preparationResources?: string[];
  offersInternship: boolean;
  offersFullTime: boolean;
  verifiedPlacementsCount?: number;
}

export interface JobRole {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  requiredSkills: string[];
  learningSequence: string[];
  dsaTopics: string[];
  coreCsTopics: string[];
  systemDesignTopics: string[];
  projectSuggestions: string[];
  interviewStages: string[];
  averageExperienceLevel: string;
}

export interface RoadmapTopic {
  id: string;
  category: 'ACADEMIC' | 'PROGRAMMING' | 'DEVELOPMENT' | 'CAREER_PREP' | 'ADVANCED';
  title: string;
  description: string;
  resources: { title: string; url: string; type: string }[];
  projectSuggestions: string[];
  prerequisites: string[];
  estimatedHours: number;
  orderIndex: number;
  isCompleted: boolean;
  completedAt?: string | null;
  notes?: string | null;
}

export interface SemesterRoadmap {
  id: string;
  semesterNumber: number;
  title: string;
  description: string;
  focusGoal: string;
  progressSummary: {
    totalTopics: number;
    completedTopics: number;
    progressPercentage: number;
  };
  topics: RoadmapTopic[];
}

export interface PlacementRecord {
  id: string;
  companyId?: string;
  companyName: string;
  recruitmentYear: number;
  academicYear: string;
  companyCategory: string;
  jobRole: string;
  employmentType: string;
  eligibleDepartments: string[];
  eligibleGraduationYears: number[];
  minimumEligibilityCriteria?: string;
  requiredSkills: string[];
  selectionProcess: string[];
  numberSelected?: number | null;
  isSalaryAvailable: boolean;
  currency: string;
  annualCtc?: number | null;
  fixedCompensation?: number | null;
  variableCompensation?: number | null;
  compensationPeriod: string;
  compensationNotes?: string;
  internshipStipend?: number | null;
  dataSource: string;
  verificationStatus: VerificationStatus;
  isDemo: boolean;
  dateLastVerified?: string | null;
  verifiedBy?: string | null;
  createdAt: string;
  companyDetails?: any;
}

export interface LearningResource {
  id: string;
  title: string;
  category: string;
  track: string;
  semesterNumber?: number;
  url: string;
  resourceType: string;
  description: string;
  tags: string[];
  isOfficialCollegeResource: boolean;
}

export interface GeneralInfo {
  fullName: string;
  nickname: string;
  age: string;
  idNumber: string;
  birthDate: string;
  address: string;
  phone: string;
  emergencyPhone: string;
  emergencyRelationship: string;
  maritalStatus: string;
  religion: string;
  education: string;
  healthConditions: string;
  weight: string;
  height: string;
  diet: string;
  allergies: string;
  formerOccupation: string;
  currentOccupation: string;
  specialSkills: string;
  transportationNeeds: string;
  nearbyLandmarks: string;
}

export interface SurveyInfo {
  schedulePreference: string;
  m1_interests: string[];
  m2_interests: string[];
  m3_interests: string[];
  m4_interests: string[];
  m5_interests: string[];
  m6_interests: string[];
  otherInterests: string;
  reasonsForApplying: string[];
  sourceOfInfo: string[];
  otherSuggestions: string;
}

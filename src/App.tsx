import { useState, useEffect } from "react";
import React from "react";
import { motion, AnimatePresence } from "motion/react";
import liff from "@line/liff";
import { 
  User, 
  MapPin, 
  Smartphone, 
  HeartPulse, 
  GraduationCap, 
  Car, 
  Briefcase,
  ChevronRight,
  ChevronLeft,
  Loader2,
  ClipboardList,
  CheckCircle2
} from "lucide-react";

import FormInput from "./components/FormInput";
import SubmissionSuccess from "./components/SubmissionSuccess";
import { GeneralInfo, SurveyInfo } from "./types";

const LIFF_ID = import.meta.env.VITE_LIFF_ID;
const GAS_URL = import.meta.env.VITE_GAS_URL;

export default function App() {
  const [liffError, setLiffError] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form States
  const [general, setGeneral] = useState<GeneralInfo>({
    fullName: "", nickname: "", age: "", idNumber: "", birthDate: "",
    address: "", phone: "", emergencyPhone: "", emergencyRelationship: "",
    maritalStatus: "", religion: "", education: "", healthConditions: "",
    weight: "", height: "", diet: "", allergies: "", formerOccupation: "",
    currentOccupation: "", specialSkills: "", transportationNeeds: "",
    nearbyLandmarks: ""
  });

  const [survey, setSurvey] = useState<SurveyInfo>({
    schedulePreference: "",
    m1_interests: [],
    m2_interests: [],
    m3_interests: [],
    m4_interests: [],
    m5_interests: [],
    m6_interests: [],
    otherInterests: "",
    reasonsForApplying: [],
    sourceOfInfo: [],
    otherSuggestions: ""
  });

  useEffect(() => {
    const initLiff = async () => {
      try {
        if (!LIFF_ID) {
          console.warn("LIFF ID is missing in .env");
          return;
        }
        await liff.init({ liffId: LIFF_ID });
        if (!liff.isLoggedIn() && liff.isInClient()) {
          liff.login();
        }
      } catch (err) {
        console.error("LIFF Init error:", err);
        setLiffError("Failed to initialize LINE LIFF");
      }
    };
    initLiff();
  }, []);

  const handleGeneralChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setGeneral(prev => ({ ...prev, [name]: value }));
  };

  const handleSurveyChange = (name: keyof SurveyInfo, value: any) => {
    setSurvey(prev => ({ ...prev, [name]: value }));
  };

  const toggleInterest = (category: keyof SurveyInfo, value: string) => {
    const current = survey[category] as string[];
    if (current.includes(value)) {
      handleSurveyChange(category, current.filter(v => v !== value));
    } else {
      handleSurveyChange(category, [...current, value]);
    }
  };

  const handleSubmit = async () => {
    if (!GAS_URL) {
      alert("กรุณาตั้งค่า VITE_GAS_URL ใน .env");
      return;
    }
    setIsSubmitting(true);
    try {
      await fetch(GAS_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ general, survey })
      });
      setIsSuccess(true);
    } catch (err) {
      console.error("Submit error:", err);
      // Even with no-cors, it might throw if network fails
      alert("เกิดข้อผิดพลาดในการส่งข้อมูล กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) return <div className="min-h-screen bg-slate-50 p-6 flex items-center justify-center"><SubmissionSuccess /></div>;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      {/* Header */}
      <header className="bg-blue-600 text-white p-8 rounded-b-[3rem] shadow-xl shadow-blue-100 flex flex-col items-center space-y-2 mb-8">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white/20 p-4 rounded-full backdrop-blur-md"
        >
          <GraduationCap size={40} className="text-white" />
        </motion.div>
        <h1 className="text-2xl font-bold tracking-tight">โรงเรียนผู้สูงอายุ</h1>
        <p className="text-blue-100 text-sm">เทศบาลเมืองแสนสุข จ.ชลบุรี</p>
      </header>

      <main className="max-w-xl mx-auto px-6">
        {/* Progress UI */}
        <div className="relative flex justify-between items-center mb-8 px-4">
          {[1, 2].map((i) => (
            <div key={i} className="flex flex-col items-center space-y-2 z-10">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 transition-all ${
                step >= i ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200" : "bg-white border-slate-200 text-slate-300"
              }`}>
                {i}
              </div>
              <span className={`text-xs font-medium ${step >= i ? "text-blue-600" : "text-slate-400"}`}>
                {i === 1 ? "ข้อมูลทั่วไป" : "แบบสำรวจ"}
              </span>
            </div>
          ))}
          <div className="absolute left-1/2 top-5 -translate-x-1/2 w-full h-1 bg-slate-200 -z-0 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-blue-600"
              initial={{ width: "0%" }}
              animate={{ width: step === 1 ? "0%" : "100%" }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <SectionHeader icon={<User size={20}/>} title="ข้อมูลส่วนตัว" />
              <div className="grid grid-cols-1 gap-4">
                <FormInput label="ชื่อ-นามสกุล" name="fullName" value={general.fullName} onChange={handleGeneralChange} required placeholder="ระบุชื่อจริง-นามสกุล" />
                <div className="grid grid-cols-2 gap-4">
                  <FormInput label="ชื่อเล่น" name="nickname" value={general.nickname} onChange={handleGeneralChange} required placeholder="เบลล์" />
                  <FormInput label="อายุ (ปี)" name="age" type="number" value={general.age} onChange={handleGeneralChange} required />
                </div>
                <FormInput label="เลขบัตรประจำตัวประชาชน" name="idNumber" value={general.idNumber} onChange={handleGeneralChange} required placeholder="x-xxxx-xxxxx-xx-x" />
                <FormInput label="วัน/เดือน/ปีเกิด" name="birthDate" type="date" value={general.birthDate} onChange={handleGeneralChange} required />
              </div>

              <SectionHeader icon={<MapPin size={20}/>} title="ที่อยู่และการติดต่อ" />
              <FormInput label="ที่อยู่ปัจจุบัน" name="address" value={general.address} onChange={handleGeneralChange} required isTextArea placeholder="เลขที่บ้าน, ถนน, ตำบล, อำเภอ..." />
              <div className="grid grid-cols-1 gap-4">
                <FormInput label="เบอร์โทรศัพท์" name="phone" value={general.phone} onChange={handleGeneralChange} required type="tel" />
                <div className="grid grid-cols-2 gap-4">
                  <FormInput label="เบอร์ติดต่อฉุกเฉิน" name="emergencyPhone" value={general.emergencyPhone} onChange={handleGeneralChange} required type="tel" />
                  <FormInput label="ความสัมพันธ์" name="emergencyRelationship" value={general.emergencyRelationship} onChange={handleGeneralChange} required placeholder="บุตร" />
                </div>
              </div>

              <SectionHeader icon={<Briefcase size={20}/>} title="สถานะและประวัติ" />
              <div className="grid grid-cols-2 gap-4">
                <FormInput label="สถานภาพสมรส" name="maritalStatus" value={general.maritalStatus} onChange={handleGeneralChange} options={["โสด", "สมรส", "หม้าย", "หย่าร้าง/แยกกันอยู่"]} />
                <FormInput label="ศาสนา" name="religion" value={general.religion} onChange={handleGeneralChange} options={["พุทธ", "คริสต์", "อิสลาม", "อื่นๆ"]} />
              </div>
              <FormInput label="ระดับการศึกษาสูงสุด" name="education" value={general.education} onChange={handleGeneralChange} placeholder="ระบุวุฒิการศึกษา" />

              <SectionHeader icon={<HeartPulse size={20}/>} title="สุขภาพ" />
              <div className="grid grid-cols-2 gap-4">
                <FormInput label="น้ำหนัก (กก.)" name="weight" type="number" value={general.weight} onChange={handleGeneralChange} />
                <FormInput label="ส่วนสูง (ซม.)" name="height" type="number" value={general.height} onChange={handleGeneralChange} />
              </div>
              <FormInput label="การรับประทานอาหาร" name="diet" value={general.diet} onChange={handleGeneralChange} options={["ปกติ", "มังสวิรัติ", "อาหารอิสลาม", "อื่นๆ"]} />
              <FormInput label="โรคประจำตัว (ถ้ามี)" name="healthConditions" value={general.healthConditions} onChange={handleGeneralChange} isTextArea />
              <FormInput label="อาหารที่แพ้ (ระบุ)" name="allergies" value={general.allergies} onChange={handleGeneralChange} />

              <SectionHeader icon={<Briefcase size={20}/>} title="อาชีพและความสามารถ" />
              <div className="grid grid-cols-2 gap-4">
                <FormInput label="อาชีพก่อนเกษียณ" name="formerOccupation" value={general.formerOccupation} onChange={handleGeneralChange} />
                <FormInput label="อาชีพปัจจุบัน" name="currentOccupation" value={general.currentOccupation} onChange={handleGeneralChange} />
              </div>
              <FormInput label="ความสามารถพิเศษ" name="specialSkills" value={general.specialSkills} onChange={handleGeneralChange} isTextArea />

              <SectionHeader icon={<Car size={20}/>} title="การอำนวยความสะดวก" />
              <FormInput label="ความต้องการรถรับ-ส่ง" name="transportationNeeds" value={general.transportationNeeds} onChange={handleGeneralChange} options={["ต้องการ", "ไม่ต้องการ"]} />
              <FormInput label="สถานที่สำคัญใกล้บ้าน (ระบุเพื่อจุดรับ-ส่ง)" name="nearbyLandmarks" value={general.nearbyLandmarks} onChange={handleGeneralChange} isTextArea />

              <button 
                onClick={() => setStep(2)}
                className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-200 flex items-center justify-center gap-2 mt-8 hover:bg-blue-700 active:scale-[0.98] transition-all"
              >
                ต่อไป <ChevronRight size={20} />
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <SectionHeader icon={<ClipboardList size={20}/>} title="แบบสำรวจความต้องการเรียน" />
              
              <FormInput 
                label="กำหนดเวลาเรียนสัปดาห์ละ 1 วัน (ทุกวันพฤหัสบดี) วันละ 5 ชม. (9.00 - 15.00 น.) ท่านเห็นด้วยหรือไม่"
                name="schedulePreference"
                value={survey.schedulePreference}
                onChange={(e) => handleSurveyChange("schedulePreference", e.target.value)}
                options={["เห็นด้วย", "ไม่เห็นด้วย"]}
                required
              />

              <InterestSection 
                title="มิติที่ 1 ด้านสุขภาพร่างกายและสุขภาพจิตที่ดี"
                items={[
                  "การเปลี่ยนแปลงตามวัยในผู้สูงอายุ", "อาหารและโภชนาการ", "การออกกำลังกาย", 
                  "การพัฒนาจิตสำหรับผู้สูงอายุ", "การดูแลสุขภาพช่องปาก", 
                  "การดูแลสุขภาพด้วยศาสตร์การแพทย์แผนไทย", "ปัญหาสุขภาพที่พบบ่อยในผู้สูงอายุ", 
                  "การใช้ยาอย่างปลอดภัยในผู้สูงอายุ"
                ]}
                selected={survey.m1_interests}
                onToggle={(v) => toggleInterest("m1_interests", v)}
              />

              <InterestSection 
                title="มิติที่ 2 ด้านเศรษฐกิจและวิชาชีพ"
                items={[
                  "การออมในวัยสูงอายุ", "เศรษฐกิจพอเพียง", "การฝึกอาชีพสำหรับผู้สูงอายุ", 
                  "งานฝีมือต่างๆ (ศิลปะ/หัตถกรรม/อื่นๆ)"
                ]}
                selected={survey.m2_interests}
                onToggle={(v) => toggleInterest("m2_interests", v)}
              />

              <InterestSection 
                title="มิติที่ 3 ด้านศาสนา ประเพณี และวัฒนธรรม"
                items={[
                  "วัฒนธรรมและภูมิปัญญาท้องถิ่น", "การทำสมาธิวิปัสสนา", "การนำหลักศาสนามาใช้ในชีวิตประจำวัน"
                ]}
                selected={survey.m3_interests}
                onToggle={(v) => toggleInterest("m3_interests", v)}
              />

              <InterestSection 
                title="มิติที่ 4 ด้านสังคม สิ่งแวดล้อม และจิตอาสา"
                items={[
                  "การใช้ชีวิตในวัยสูงอายุ", "การเสวนาแลกเปลี่ยนเรียนรู้", "สิ่งแวดล้อมที่ปลอดภัยสำหรับผู้สูงอายุ", 
                  "อาสาสมัครกับการมีส่วนร่วมในสังคม", "กิจกรรมนันทนาการสำหรับผู้สูงอายุ", "ดนตรีกับจังหวะชีวิต"
                ]}
                selected={survey.m4_interests}
                onToggle={(v) => toggleInterest("m4_interests", v)}
              />

              <InterestSection 
                title="มิติที่ 5 ด้านเทคโนโลยีและการสื่อสาร"
                items={["ผู้สูงวัยในยุคดิจิทัล", "การป้องกันภัยสำหรับผู้สูงอายุ"]}
                selected={survey.m5_interests}
                onToggle={(v) => toggleInterest("m5_interests", v)}
              />

              <InterestSection 
                title="มิติที่ 6 ด้านสวัสดิการ"
                items={["กฎหมายและสิทธิประโยชน์ของผู้สูงอายุ"]}
                selected={survey.m6_interests}
                onToggle={(v) => toggleInterest("m6_interests", v)}
              />

              <FormInput 
                label="หัวข้ออื่นๆ ที่ท่านสนใจ (โปรดระบุ)" 
                name="otherInterests" 
                value={survey.otherInterests} 
                onChange={(e) => handleSurveyChange("otherInterests", e.target.value)} 
                isTextArea
              />

              <InterestSection 
                title="เหตุผลที่ท่านสนใจสมัครเข้าเรียน"
                items={[
                  "ต้องการพัฒนาตนเอง", "ต้องการความรู้ไปใช้ในชีวิตประจำวัน", 
                  "ต้องการพบปะแลกเปลี่ยน พูดคุยกับเพื่อน", "ต้องการใช้เวลาว่างให้เป็นประโยชน์", 
                  "ต้องการคลายความเหงา", "ต้องการถ่ายทอดภูมิปัญญาความรู้", 
                  "ต้องการมีส่วนร่วมในการทำกิจกรรมของชมรมฯ"
                ]}
                selected={survey.reasonsForApplying}
                onToggle={(v) => toggleInterest("reasonsForApplying", v)}
              />

              <InterestSection 
                title="ท่านได้รับข้อมูลข่าวสารเปิดรับสมัครจากแหล่งใด"
                items={[
                  "เพจเฟซบุ๊กศูนย์พัฒนาศักยภาพผู้สูงอายุ", "เพจเฟซบุ๊กเทศบาลเมืองแสนสุข", 
                  "แอปพลิเคชันไลน์กลุ่มต่างๆ", "ป้ายประชาสัมพันธ์", "ใบปลิว/แผ่นพับ", 
                  "คนในครอบครัว/เพื่อนแนะนำ"
                ]}
                selected={survey.sourceOfInfo}
                onToggle={(v) => toggleInterest("sourceOfInfo", v)}
              />

              <FormInput 
                label="ข้อเสนอแนะอื่นๆ" 
                name="otherSuggestions" 
                value={survey.otherSuggestions} 
                onChange={(e) => handleSurveyChange("otherSuggestions", e.target.value)} 
                isTextArea
              />

              <div className="flex gap-4 pt-4">
                <button 
                  onClick={() => setStep(1)}
                  className="flex-1 py-4 bg-white text-slate-600 font-bold rounded-2xl border-2 border-slate-100 shadow-lg shadow-slate-100 flex items-center justify-center gap-2 hover:bg-slate-50 transition-all"
                >
                  <ChevronLeft size={20} /> ย้อนกลับ
                </button>
                <button 
                  disabled={isSubmitting}
                  onClick={handleSubmit}
                  className="flex-[2] py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-100 flex items-center justify-center gap-2 hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" /> : "ส่งใบสมัคร"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function SectionHeader({ icon, title }: { icon: React.ReactNode, title: string }) {
  return (
    <div className="flex items-center gap-3 border-l-4 border-blue-500 pl-4 py-1 mt-8 mb-4">
      <div className="text-blue-600 bg-blue-50 p-2 rounded-lg">{icon}</div>
      <h2 className="text-lg font-bold text-slate-800 tracking-tight">{title}</h2>
    </div>
  );
}

function InterestSection({ title, items, selected, onToggle }: { title: string, items: string[], selected: string[], onToggle: (val: string) => void }) {
  return (
    <div className="space-y-3">
      <h4 className="text-sm font-bold text-slate-600 ml-1">{title}</h4>
      <div className="grid grid-cols-1 gap-2">
        {items.map(item => (
          <label key={item} className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
            selected.includes(item) 
              ? "bg-blue-50 border-blue-200 shadow-[2px_2px_0px_0px_rgba(30,64,175,0.1)]" 
              : "bg-white border-slate-100 hover:border-slate-200 shadow-[4px_4px_0px_0px_rgba(30,64,175,0.05)]"
          }`}>
            <input 
              type="checkbox" 
              className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 hidden"
              checked={selected.includes(item)}
              onChange={() => onToggle(item)}
            />
            <div className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-all ${
              selected.includes(item) ? "bg-blue-600 border-blue-600" : "bg-white border-slate-300"
            }`}>
              {selected.includes(item) && <CheckCircle2 size={14} className="text-white" />}
            </div>
            <span className={`text-sm ${selected.includes(item) ? "text-blue-900 font-medium" : "text-slate-700"}`}>
              {item}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}

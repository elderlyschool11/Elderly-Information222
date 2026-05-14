import { useState, useEffect } from "react";
import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import liff from "@line/liff";
import { 
  User, 
  MapPin, 
  Smartphone, 
  HeartPulse, 
  Car, 
  Briefcase,
  ChevronRight,
  ChevronLeft,
  Loader2,
  ClipboardList,
  CheckCircle2,
  GraduationCap,
  ShieldCheck
} from "lucide-react";

import FormInput from "../components/FormInput";
import SubmissionSuccess from "../components/SubmissionSuccess";
import { GeneralInfo, SurveyInfo } from "../types";

const LIFF_ID = import.meta.env.VITE_LIFF_ID;
const GAS_URL = import.meta.env.VITE_GAS_URL;

export default function RegistrationPage() {
  const navigate = useNavigate();
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
        if (!LIFF_ID) return;
        if ((window as any)._liffInitialized) return;
        if ((window as any)._liffInitializing) return;

        (window as any)._liffInitializing = true;
        await liff.init({ liffId: LIFF_ID });
        (window as any)._liffInitialized = true;

        if (!liff.isLoggedIn() && liff.isInClient()) {
          liff.login();
        }
      } catch (err: any) {
        console.error("LIFF Init error:", err);
      } finally {
        (window as any)._liffInitializing = false;
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
    const activeGasUrl = GAS_URL || "https://script.google.com/macros/s/AKfycbzQW9HDE9eHGOXKMgiTOpuKjZgDjHsdWqa-bBK5JnVf2O9joXYmmxjZruHMY0hb0mEn/exec";
    
    if (!activeGasUrl) {
      alert("ไม่พบการเชื่อมต่อกับระบบหลังบ้าน (VITE_GAS_URL) กรุณาตรวจสอบการตั้งค่า");
      return;
    }
    
    setIsSubmitting(true);
    try {
      console.log("RegistrationPage: Submitting to:", activeGasUrl);
      const response = await fetch(activeGasUrl, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ general, survey })
      });
      
      console.log("RegistrationPage: Submission attempt finished.");
      setIsSuccess(true);
    } catch (err: any) {
      console.error("RegistrationPage: Submit error:", err);
      alert("ไม่สามารถส่งข้อมูลได้: " + (err.message || "กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต"));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) return <div className="min-h-screen bg-slate-50 p-6 flex items-center justify-center"><SubmissionSuccess /></div>;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      <header className="bg-white border-b border-slate-100 p-8 flex flex-col items-center space-y-4 mb-8">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative w-40 h-40 rounded-full shadow-2xl shadow-blue-100/50 border-4 border-white overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 flex flex-col items-center justify-center group"
        >
          <div className="relative z-10 flex flex-col items-center">
            <motion.div
              animate={{ rotate: [0, -5, 5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <GraduationCap size={72} strokeWidth={1.5} className="text-white drop-shadow-lg" />
            </motion.div>
            <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full mt-2 ring-1 ring-white/30">
              <span className="text-[10px] font-black text-white tracking-widest uppercase">Senior School</span>
            </div>
          </div>
          <div className="absolute inset-0 bg-blue-400/20 animate-pulse scale-150 rounded-full" />
          <img 
            src="/logo.png" 
            alt="School Logo" 
            className="w-full h-full object-contain absolute inset-0 z-20"
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </motion.div>
        <div className="text-center">
          <h1 className="text-4xl font-black text-slate-800 tracking-tight leading-tight">โรงเรียนผู้สูงอายุ</h1>
          <p className="text-blue-600 font-bold text-base tracking-widest uppercase mt-1">เทศบาลเมืองแสนสุข จ.ชลบุรี</p>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-6">
        <div className="relative flex justify-between items-center mb-12 px-8">
          {[1, 2].map((i) => (
            <div key={i} className="flex flex-col items-center space-y-3 z-10">
              <motion.div 
                animate={{ 
                  scale: step === i ? 1.1 : 1,
                  backgroundColor: step >= i ? "#2563eb" : "#ffffff"
                }}
                className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl border-2 transition-all ${
                step >= i ? "border-blue-600 text-white shadow-xl shadow-blue-100" : "border-slate-100 text-slate-300 shadow-sm"
              }`}>
                {i}
              </motion.div>
              <span className={`text-sm font-black tracking-tight ${step >= i ? "text-blue-600" : "text-slate-400"}`}>
                {i === 1 ? "ข้อมูลทั่วไป" : "แบบสำรวจความสนใจ"}
              </span>
            </div>
          ))}
          <div className="absolute left-1/2 top-7 -translate-x-1/2 w-[60%] h-1 bg-slate-100 -z-0 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-blue-600"
              initial={{ width: "0%" }}
              animate={{ width: step === 1 ? "0%" : "100%" }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-6">
              <SectionHeader icon={<User size={24}/>} title="ข้อมูลส่วนตัว" />
              <div className="grid grid-cols-1 gap-6">
                <FormInput label="ชื่อ-นามสกุล" name="fullName" value={general.fullName} onChange={handleGeneralChange} required placeholder="ระบุชื่อจริง-นามสกุล" />
                <div className="grid grid-cols-2 gap-6">
                  <FormInput label="ชื่อเล่น" name="nickname" value={general.nickname} onChange={handleGeneralChange} required placeholder="เบลล์" />
                  <FormInput label="อายุ (ปี)" name="age" type="number" value={general.age} onChange={handleGeneralChange} required />
                </div>
                <FormInput label="เลขบัตรประจำตัวประชาชน" name="idNumber" value={general.idNumber} onChange={handleGeneralChange} required placeholder="x-xxxx-xxxxx-xx-x" />
                <FormInput label="วัน/เดือน/ปีเกิด" name="birthDate" value={general.birthDate} onChange={handleGeneralChange} required placeholder="เช่น 01/01/2490" />
              </div>

              <SectionHeader icon={<MapPin size={24}/>} title="ที่อยู่และการติดต่อ" />
              <FormInput label="ที่อยู่ปัจจุบัน" name="address" value={general.address} onChange={handleGeneralChange} required isTextArea placeholder="เลขที่บ้าน, ถนน, ตำบล, อำเภอ..." />
              <div className="grid grid-cols-1 gap-6">
                <FormInput label="เบอร์โทรศัพท์" name="phone" value={general.phone} onChange={handleGeneralChange} required type="tel" />
                <div className="grid grid-cols-2 gap-6">
                  <FormInput label="เบอร์ติดต่อฉุกเฉิน" name="emergencyPhone" value={general.emergencyPhone} onChange={handleGeneralChange} required type="tel" />
                  <FormInput label="ความสัมพันธ์" name="emergencyRelationship" value={general.emergencyRelationship} onChange={handleGeneralChange} required placeholder="บุตร" />
                </div>
              </div>

              <SectionHeader icon={<Briefcase size={24}/>} title="สถานะและประวัติ" />
              <div className="grid grid-cols-2 gap-6">
                <FormInput label="สถานภาพสมรส" name="maritalStatus" value={general.maritalStatus} onChange={handleGeneralChange} options={["โสด", "สมรส", "หม้าย", "หย่าร้าง/แยกกันอยู่"]} />
                <FormInput label="ศาสนา" name="religion" value={general.religion} onChange={handleGeneralChange} options={["พุทธ", "คริสต์", "อิสลาม", "อื่นๆ"]} />
              </div>
              <FormInput label="ระดับการศึกษาสูงสุด" name="education" value={general.education} onChange={handleGeneralChange} placeholder="ระบุวุฒิการศึกษา" />

              <SectionHeader icon={<HeartPulse size={24}/>} title="สุขภาพ" />
              <div className="grid grid-cols-2 gap-6">
                <FormInput label="น้ำหนัก (กก.)" name="weight" type="number" value={general.weight} onChange={handleGeneralChange} />
                <FormInput label="ส่วนสูง (ซม.)" name="height" type="number" value={general.height} onChange={handleGeneralChange} />
              </div>
              <FormInput label="การรับประทานอาหาร" name="diet" value={general.diet} onChange={handleGeneralChange} options={["ปกติ", "มังสวิรัติ", "อาหารอิสลาม", "อื่นๆ"]} />
              <FormInput label="โรคประจำตัว (ถ้ามี)" name="healthConditions" value={general.healthConditions} onChange={handleGeneralChange} isTextArea />
              <FormInput label="อาหารที่แพ้ (ระบุ)" name="allergies" value={general.allergies} onChange={handleGeneralChange} />

              <SectionHeader icon={<Briefcase size={24}/>} title="อาชีพและความสามารถ" />
              <div className="grid grid-cols-2 gap-6">
                <FormInput label="อาชีพก่อนเกษียณ" name="formerOccupation" value={general.formerOccupation} onChange={handleGeneralChange} />
                <FormInput label="อาชีพปัจจุบัน" name="currentOccupation" value={general.currentOccupation} onChange={handleGeneralChange} />
              </div>
              <FormInput label="ความสามารถพิเศษ" name="specialSkills" value={general.specialSkills} onChange={handleGeneralChange} isTextArea />

              <SectionHeader icon={<Car size={24}/>} title="การอำนวยความสะดวก" />
              <FormInput label="ความต้องการรถรับ-ส่ง" name="transportationNeeds" value={general.transportationNeeds} onChange={handleGeneralChange} options={["ต้องการ", "ไม่ต้องการ"]} />
              <FormInput label="สถานที่สำคัญใกล้บ้าน (ระบุเพื่อจุดรับ-ส่ง)" name="nearbyLandmarks" value={general.nearbyLandmarks} onChange={handleGeneralChange} isTextArea />

              <button 
                onClick={() => setStep(2)}
                className="w-full py-6 bg-gradient-to-br from-blue-600 to-blue-800 text-white text-2xl font-black rounded-[2.5rem] shadow-[0_20px_40px_-10px_rgba(37,99,235,0.3)] flex items-center justify-center gap-4 mt-16 hover:shadow-[0_25px_50px_-12px_rgba(37,99,235,0.4)] hover:-translate-y-1 active:scale-[0.98] transition-all duration-300"
              >
                ต่อไป <ChevronRight size={28} />
              </button>
            </motion.div>
          ) : (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
              <SectionHeader icon={<ClipboardList size={28}/>} title="แบบสำรวจความต้องการเรียน" />
              
              <FormInput 
                label="กำหนดเวลาเรียนสัปดาห์ละ 1 วัน (ทุกวันพฤหัสบดี) วันละ 5 ชม. (9.00 - 15.00 น.) ท่านเห็นด้วยหรือไม่"
                name="schedulePreference"
                value={survey.schedulePreference}
                onChange={(e) => handleSurveyChange("schedulePreference", e.target.value)}
                options={["เห็นด้วย", "ไม่เห็นด้วย"]}
                required
              />

              <InterestCategory title="มิติที่ 1 ด้านสุขภาพร่างกายและสุขภาพจิตที่ดี" items={["การเปลี่ยนแปลงตามวัยในผู้สูงอายุ", "อาหารและโภชนาการ", "การออกกำลังกาย", "การพัฒนาจิตสำหรับผู้สูงอายุ", "การดูแลสุขภาพช่องปาก", "การดูแลสุขภาพด้วยศาสตร์การแพทย์แผนไทย", "ปัญหาสุขภาพที่พบบ่อยในผู้สูงอายุ", "การใช้ยาอย่างปลอดภัยในผู้สูงอายุ"]} selected={survey.m1_interests} onToggle={(v) => toggleInterest("m1_interests", v)} />
              <InterestCategory title="มิติที่ 2 ด้านเศรษฐกิจและอาชีพ" items={["การออมในวัยสูงอายุ", "เศรษฐกิจพอเพียง", "การฝึกอาชีพสำหรับผู้สูงอายุ", "งานฝีมือต่างๆ"]} selected={survey.m2_interests} onToggle={(v) => toggleInterest("m2_interests", v)} />
              <InterestCategory title="มิติที่ 3 ด้านศาสนา วัฒนธรรม" items={["วัฒนธรรมและภูมิปัญญาท้องถิ่น", "การทำสมาธิวิปัสสนา", "การนำหลักศาสนามาใช้ในชีวิตประจำวัน"]} selected={survey.m3_interests} onToggle={(v) => toggleInterest("m3_interests", v)} />
              <InterestCategory title="มิติที่ 4 ด้านสังคม สิ่งแวดล้อม" items={["การใช้ชีวิตในวัยสูงอายุ", "การเสวนาแลกเปลี่ยนเรียนรู้", "สิ่งแวดล้อมที่ปลอดภัยสำหรับผู้สูงอายุ", "อาสาสมัครกับการมีส่วนร่วมในสังคม", "กิจกรรมนันทนาการสำหรับผู้สูงอายุ", "ดนตรีกับจังหวะชีวิต"]} selected={survey.m4_interests} onToggle={(v) => toggleInterest("m4_interests", v)} />
              <InterestCategory title="มิติที่ 5 ด้านเทคโนโลยี" items={["ผู้สูงวัยในยุคดิจิทัล", "การป้องกันภัยสำหรับผู้สูงอายุ"]} selected={survey.m5_interests} onToggle={(v) => toggleInterest("m5_interests", v)} />
              <InterestCategory title="มิติที่ 6 ด้านสวัสดิการ" items={["กฎหมายและสิทธิประโยชน์ของผู้สูงอายุ"]} selected={survey.m6_interests} onToggle={(v) => toggleInterest("m6_interests", v)} />

              <FormInput label="หัวข้ออื่นๆ ที่ท่านสนใจ" name="otherInterests" value={survey.otherInterests} onChange={(e) => handleSurveyChange("otherInterests", e.target.value)} isTextArea />

              <InterestCategory title="เหตุผลที่ท่านสนใจสมัคร" items={["ต้องการพัฒนาตนเอง", "ต้องการความรู้ไปใช้", "ต้องการพบปะเพื่อน", "ต้องการใช้เวลาว่าง", "ต้องการคลายความเหงา", "ต้องการถ่ายทอดภูมิปัญญา", "ต้องการมีส่วนร่วม"]} selected={survey.reasonsForApplying} onToggle={(v) => toggleInterest("reasonsForApplying", v)} />
              <InterestCategory title="ช่องทางการรับข่าวสาร" items={["เพจเฟซบุ๊กศูนย์ฯ", "เพจเฟซบุ๊กเทศบาล", "ไลน์กลุ่ม", "ป้ายประชาสัมพันธ์", "ใบปลิว", "คนแนะนำ"]} selected={survey.sourceOfInfo} onToggle={(v) => toggleInterest("sourceOfInfo", v)} />

              <FormInput label="ข้อเสนอแนะอื่นๆ" name="otherSuggestions" value={survey.otherSuggestions} onChange={(e) => handleSurveyChange("otherSuggestions", e.target.value)} isTextArea />

              <div className="flex gap-4 pt-4">
                <button onClick={() => setStep(1)} className="flex-1 py-4 bg-white text-slate-600 font-bold rounded-2xl border-2 border-slate-100 shadow-lg shadow-slate-100 flex items-center justify-center gap-2 hover:bg-slate-50 transition-all">
                  <ChevronLeft size={20} /> ย้อนกลับ
                </button>
                <button disabled={isSubmitting} onClick={handleSubmit} className="flex-[2] py-6 bg-gradient-to-br from-blue-600 to-blue-800 text-white text-2xl font-black rounded-[2.5rem] shadow-[0_20px_40px_-10px_rgba(37,99,235,0.3)] flex items-center justify-center gap-4 hover:shadow-[0_25px_50px_-12px_rgba(37,99,235,0.4)] hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 disabled:opacity-50">
                  {isSubmitting ? <Loader2 className="animate-spin" size={28} /> : "ส่งใบสมัคร"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="mt-20 py-10 border-t border-slate-100 flex flex-col items-center gap-4">
        <p className="text-slate-400 text-sm font-medium">© 2026 โรงเรียนผู้สูงอายุ เทศบาลเมืองแสนสุข</p>
        <button 
          onClick={() => navigate("/dashboard")}
          className="text-xs font-black text-slate-300 hover:text-blue-500 uppercase tracking-widest transition-colors flex items-center gap-2"
        >
          <ShieldCheck size={14} /> ระบบจัดการข้อมูล (Admin)
        </button>
      </footer>
    </div>
  );
}

function SectionHeader({ icon, title }: { icon: React.ReactNode, title: string }) {
  return (
    <div className="flex items-center gap-5 bg-white p-6 rounded-[2.5rem] border-2 border-blue-600 shadow-[0_8px_30px_rgb(0,0,0,0.04)] mt-16 mb-8 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-150 duration-700 opacity-50" />
      <div className="text-white bg-blue-600 p-4 rounded-2xl shadow-lg shadow-blue-200 z-10 transition-transform group-hover:rotate-6">{icon}</div>
      <h2 className="text-2xl font-black text-slate-900 tracking-tight z-10">{title}</h2>
    </div>
  );
}

function InterestCategory({ title, items, selected, onToggle }: { title: string, items: string[], selected: string[], onToggle: (val: string) => void }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 ml-2">
        <div className="w-2 h-10 bg-blue-600 rounded-full" />
        <h4 className="text-xl font-black text-slate-900 tracking-tight">{title}</h4>
      </div>
      <div className="grid grid-cols-1 gap-3">
        {items.map(item => (
          <label key={item} className={`flex items-center gap-4 p-6 rounded-[1.5rem] border transition-all cursor-pointer ${
            selected.includes(item) 
              ? "bg-blue-50 border-blue-200 shadow-md shadow-blue-100/50" 
              : "bg-white border-slate-100 hover:border-slate-200 shadow-sm"
          }`}>
            <input 
              type="checkbox" 
              className="hidden"
              checked={selected.includes(item)}
              onChange={() => onToggle(item)}
            />
            <div className={`w-6 h-6 rounded-lg flex items-center justify-center border-2 transition-all ${
              selected.includes(item) ? "bg-blue-600 border-blue-600" : "bg-white border-slate-300"
            }`}>
              {selected.includes(item) && <CheckCircle2 size={16} className="text-white font-bold" />}
            </div>
            <span className={`text-lg ${selected.includes(item) ? "text-blue-900 font-bold" : "text-slate-700 font-medium"}`}>
              {item}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}

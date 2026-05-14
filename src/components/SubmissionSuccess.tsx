import { useState } from "react";
import { motion } from "motion/react";
import { CheckCircle2, GraduationCap } from "lucide-react";
import liff from "@line/liff";

export default function SubmissionSuccess() {
  const isInLiff = liff.isInClient();
  const [logoError, setLogoError] = useState(false);

  const handleClose = () => {
    if (isInLiff) {
      liff.closeWindow();
    } else {
      try {
        window.close();
      } catch (err) {
        console.error("Window close error:", err);
      }
      
      // Fallback for browsers that block window.close
      setTimeout(() => {
        alert("กรุณาปิดแท็บหรือหน้าต่างนี้ด้วยตนเอง");
      }, 300);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8 relative py-12 px-6 overflow-hidden">
      {/* Luxury Background Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-50/30 rounded-full blur-[100px] -z-0" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-50/20 rounded-full blur-[80px] -z-0" />

      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 15, duration: 0.8 }}
        className="relative w-40 h-40 mb-8 bg-white rounded-full p-6 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] ring-8 ring-blue-50/50 flex items-center justify-center z-10"
      >
        <img 
          src="logo.png" 
          alt="School Logo" 
          className="w-full h-full object-contain"
          onError={(e) => {
            e.currentTarget.src = "/logo.png";
          }}
        />
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
          className="absolute -bottom-2 -right-2 bg-green-500 text-white p-3 rounded-full shadow-lg ring-4 ring-white"
        >
          <CheckCircle2 size={28} />
        </motion.div>
      </motion.div>
      
      <div className="space-y-3 z-10">
        <h2 className="text-5xl font-black text-slate-800 tracking-tight">ลงทะเบียนสำเร็จ</h2>
        <p className="text-slate-500 text-lg font-medium max-w-md mx-auto">ทางโรงเรียนได้รับข้อมูลใบสมัครของคุณเข้าสู่ระบบเรียบร้อยแล้ว</p>
      </div>

      <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] max-w-sm w-full text-left space-y-8 relative overflow-hidden z-10">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/40 rounded-full -mr-16 -mt-16" />
        
        <div className="flex items-center gap-4">
          <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-100">
             <ClipboardList size={24} className="text-white" />
          </div>
          <h3 className="text-2xl font-black text-slate-800 tracking-tight">สิ่งที่ต้องดำเนินการต่อ</h3>
        </div>
        
        <div className="space-y-5">
          <p className="text-sm font-black text-blue-600 uppercase tracking-widest flex items-center gap-2">
            <span className="w-8 h-[2px] bg-blue-600 rounded-full" /> เอกสารที่ต้องเตรียมมา
          </p>
          {[
            "สำเนาบัตรประชาชน 1 ฉบับ",
            "สำเนาทะเบียนบ้าน 1 ฉบับ"
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-4 group">
              <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                <ShieldCheck size={20} />
              </div>
              <span className="text-xl text-slate-700 font-bold leading-tight">{item}</span>
            </div>
          ))}
        </div>
        
        <div className="pt-2">
          <div className="inline-flex items-center gap-3 bg-amber-50 px-5 py-3 rounded-2xl border border-amber-100/50">
            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <p className="text-sm font-black text-amber-700 uppercase tracking-wider">
              เซ็นรับรองสำเนาถูกต้องทุกฉบับ
            </p>
          </div>
        </div>
      </div>

      <div className="w-full max-w-sm pt-8 space-y-6 z-10">
        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleClose}
          className="w-full px-8 py-7 bg-gradient-to-br from-blue-600 to-blue-800 text-white text-2xl font-black rounded-[3rem] shadow-[0_25px_50px_-12px_rgba(37,99,235,0.3)] hover:shadow-[0_30px_60px_-12px_rgba(37,99,235,0.4)] transition-all flex items-center justify-center gap-4 group"
        >
          {isInLiff ? "กลับสู่หน้าแชท LINE" : "รับทราบและปิดหน้านี้"}
          <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
            <CheckCircle2 size={24} />
          </div>
        </motion.button>
        
        {!isInLiff && (
          <p className="text-sm text-slate-400 font-bold bg-white/50 backdrop-blur-sm px-6 py-3 rounded-full border border-slate-100 inline-block">
            หากหน้าต่างไม่ปิดอัตโนมัติ รบกวนปิดด้วยตนเองค่ะ
          </p>
        )}
      </div>
    </div>
  );
}

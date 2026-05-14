import { motion } from "motion/react";
import { CheckCircle2 } from "lucide-react";
import liff from "@line/liff";

export default function SubmissionSuccess() {
  const isInLiff = liff.isInClient();

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
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", damping: 12 }}
        className="relative w-32 h-32 mb-4 bg-white rounded-full p-4 shadow-xl shadow-green-100 ring-4 ring-green-50 flex items-center justify-center"
      >
        <img 
          src="/logo.png" 
          alt="School Logo" 
          className="w-full h-full object-contain"
          onError={(e) => e.currentTarget.style.display = 'none'}
          referrerPolicy="no-referrer"
        />
        <div className="absolute -bottom-2 -right-2 bg-green-500 text-white p-2 rounded-full shadow-lg">
          <CheckCircle2 size={24} />
        </div>
      </motion.div>
      
      <div className="space-y-2 px-4">
        <h2 className="text-3xl font-black text-slate-800">ส่งใบสมัครสำเร็จ!</h2>
        <p className="text-slate-500 font-medium">บันทึกข้อมูลของคุณเข้าสู่ระบบเรียบร้อยแล้ว</p>
      </div>

      <div className="bg-white p-8 rounded-[2.5rem] border-2 border-blue-50 shadow-2xl shadow-blue-100/30 max-w-sm w-full text-left space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50/50 rounded-full -mr-12 -mt-12" />
        
        <h3 className="text-xl font-black text-blue-900 flex items-center gap-3">
          <span className="bg-blue-100 p-2 rounded-xl text-blue-600">📄</span> 
          เอกสารที่ต้องเตรียมมา
        </h3>
        
        <div className="space-y-4">
          {[
            "สำเนาบัตรประชาชน 1 ฉบับ",
            "สำเนาทะเบียนบ้าน 1 ฉบับ"
          ].map((item, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <div className="mt-1.5 w-2 h-2 rounded-full bg-blue-500 shrink-0" />
              <span className="text-lg text-slate-700 font-bold leading-tight">{item}</span>
            </div>
          ))}
        </div>
        
        <div className="pt-2">
          <p className="text-xs text-slate-400 font-bold bg-slate-50 p-3 rounded-xl border border-slate-100 inline-block uppercase tracking-wider">
            * กรุณาเซ็นรับรองสำเนาถูกต้องทุกฉบับ
          </p>
        </div>
      </div>

      <div className="w-full max-w-sm pt-4 space-y-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleClose}
          className="w-full px-8 py-6 bg-blue-600 text-white text-xl font-black rounded-[2.5rem] shadow-xl shadow-blue-200 hover:shadow-2xl transition-all flex items-center justify-center gap-3 group"
        >
          {isInLiff ? "กลับสู่หน้าแชท LINE" : "รับทราบและปิดหน้านี้"}
          <motion.div animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
            <CheckCircle2 size={24} />
          </motion.div>
        </motion.button>
        
        {!isInLiff && (
          <p className="text-xs text-slate-400 font-medium">
            หากปุ่มมีปัญหา ท่านสามารถกด "ปิด" ที่มุมบนเบราว์เซอร์
          </p>
        )}
      </div>
    </div>
  );
}

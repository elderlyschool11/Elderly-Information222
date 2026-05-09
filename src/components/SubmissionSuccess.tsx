import { motion } from "motion/react";
import { CheckCircle2 } from "lucide-react";
import liff from "@line/liff";

export default function SubmissionSuccess() {
  const handleClose = () => {
    if (liff.isInClient()) {
      liff.closeWindow();
    } else {
      window.close();
      // Fallback message for browsers that don't allow window.close()
      alert("กรุณาปิดหน้าต่างนี้เพื่อกลับสู่ LINE");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", damping: 12 }}
        className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4"
      >
        <CheckCircle2 size={48} />
      </motion.div>
      
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-slate-800">ลงทะเบียนสำเร็จ!</h2>
        <p className="text-slate-500">ข้อมูลของคุณถูกบันทึกเรียบร้อยแล้ว</p>
      </div>

      <div className="bg-white p-8 rounded-[2rem] border border-blue-100 shadow-xl shadow-blue-100/20 max-w-sm w-full text-left space-y-4">
        <h3 className="text-xl font-black text-blue-900 flex items-center gap-2">
          <span>📄</span> เอกสารที่ต้องเตรียม
        </h3>
        <ul className="text-lg text-slate-600 space-y-3 list-disc list-inside font-medium">
          <li>สำเนาบัตรประชาชน 1 ใบ</li>
          <li>สำเนาทะเบียนบ้าน 1 ใบ</li>
        </ul>
        <p className="text-xs text-slate-400 mt-2">* กรุณาเซ็นสำเนาถูกต้องทุกฉบับ</p>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleClose}
        className="w-full px-8 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xl font-black rounded-[2rem] shadow-lg shadow-blue-100 hover:shadow-xl transition-all"
      >
        ตกลง และกลับสู่ LINE
      </motion.button>
    </div>
  );
}

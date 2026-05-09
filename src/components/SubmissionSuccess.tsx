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

      <div className="bg-blue-50 p-6 rounded-2xl border-2 border-blue-100 max-w-sm w-full text-left space-y-4">
        <h3 className="font-bold text-blue-800 flex items-center gap-2">
          <span>📄</span> เอกสารที่ต้องเตรียมมาในวันแรก
        </h3>
        <ul className="text-sm text-blue-700 space-y-2 list-disc list-inside">
          <li>สำเนาบัตรประชาชน 1 ใบ พร้อมเซ็นสำเนาถูกต้อง</li>
          <li>สำเนาทะเบียนบ้าน 1 ใบ พร้อมเซ็นสำเนาถูกต้อง</li>
        </ul>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleClose}
        className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-colors"
      >
        ตกลง และกลับสู่ LINE
      </motion.button>
    </div>
  );
}

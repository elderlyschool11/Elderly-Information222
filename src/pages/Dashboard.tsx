import { useState, useEffect } from "react";
import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Users, 
  TrendingUp, 
  Settings, 
  Search, 
  Trash2, 
  Edit, 
  X, 
  Check, 
  ShieldCheck,
  UserCircle,
  GraduationCap,
  LogOut,
  Calendar,
  HeartPulse
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie
} from "recharts";
import liff from "@line/liff";

const GAS_URL = import.meta.env.VITE_GAS_URL;
const ADMIN_PIN = "1111";

export default function Dashboard() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [pin, setPin] = useState("");
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingStudent, setEditingStudent] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    fetchData();
    initLiff();
  }, []);

  const initLiff = async () => {
    try {
      await liff.init({ liffId: import.meta.env.VITE_LIFF_ID });
      if (liff.isLoggedIn()) {
        const p = await liff.getProfile();
        setProfile(p);
      }
    } catch (err) {
      console.error("LIFF Dashboard error:", err);
    }
  };

  const fetchData = async () => {
    if (!GAS_URL) return;
    try {
      const res = await fetch(GAS_URL);
      const data = await res.json();
      setStudents(data);
    } catch (err) {
      console.error("Fetch stats error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id: number, updatedData: any) => {
    try {
      await fetch(GAS_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update", id, data: updatedData })
      });
      fetchData(); // Refresh
      setEditingStudent(null);
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("ยืนยันการลบข้อมูล?")) return;
    try {
      await fetch(GAS_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", id })
      });
      fetchData(); // Refresh
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // Stats Calculations
  const stats = {
    total: students.length,
    avgAge: students.length ? (students.reduce((acc, s) => acc + (parseInt(s.Age) || 0), 0) / students.length).toFixed(1) : 0,
    transportation: students.filter(s => s.Transportation === "ต้องการ").length,
    dietNeeds: students.filter(s => s.Diet && s.Diet !== "ปกติ").length
  };

  const filteredStudents = students.filter(s => 
    s.Name?.toLowerCase().includes(search.toLowerCase()) || 
    s.Nickname?.toLowerCase().includes(search.toLowerCase())
  );

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white p-10 rounded-[3rem] shadow-2xl w-full max-w-md text-center border-b-[8px] border-blue-600"
        >
          <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600 ring-8 ring-blue-50">
            <ShieldCheck size={48} />
          </div>
          <h1 className="text-3xl font-black text-slate-800 mb-2">Admin Login</h1>
          <p className="text-slate-500 mb-8 font-medium">กรุณาระบุรหัสผ่านเพื่อเข้าใช้งาน</p>
          <div className="flex gap-3 mb-8 justify-center">
            {[1,2,3,4].map((i) => (
              <div key={i} className={`w-4 h-4 rounded-full border-2 transition-all ${pin.length >= i ? "bg-blue-600 border-blue-600 scale-125" : "border-slate-200"}`} />
            ))}
          </div>
          <div className="grid grid-cols-3 gap-4 font-black">
            {[1,2,3,4,5,6,7,8,9, "C", 0, "OK"].map((n) => (
              <button
                key={n}
                onClick={() => {
                  if (n === "C") setPin("");
                  else if (n === "OK") {
                    if (pin === ADMIN_PIN) setIsAdmin(true);
                    else { alert("รหัสผ่านผิด!"); setPin(""); }
                  } else if (pin.length < 4) setPin(p => p + n);
                }}
                className={`h-16 rounded-2xl flex items-center justify-center text-2xl transition-all ${
                  n === "OK" ? "bg-blue-600 text-white col-span-2" : "bg-slate-50 text-slate-700 hover:bg-slate-100 active:scale-95"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-72 bg-white border-r border-slate-100 flex flex-col items-center py-10 px-6 gap-8 relative z-20">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 p-5 shadow-xl shadow-blue-100">
            <GraduationCap className="text-white w-full h-full" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Admin System</h2>
            <p className="text-blue-600 text-xs font-black tracking-widest uppercase mt-1">Elderly School Dashboard</p>
          </div>
        </div>

        {profile && (
          <div className="w-full bg-slate-50 p-4 rounded-3xl flex items-center gap-4">
            <img src={profile.pictureUrl} className="w-12 h-12 rounded-2xl ring-4 ring-white shadow-sm" alt="Profile" />
            <div className="text-left overflow-hidden">
              <p className="text-xs font-black text-slate-400">User Access</p>
              <p className="font-bold text-slate-700 truncate">{profile.displayName}</p>
            </div>
          </div>
        )}

        <nav className="w-full space-y-2">
          {[
            { icon: <TrendingUp size={20}/>, label: "Overview", active: true },
            { icon: <Users size={20}/>, label: "Students", active: false },
            { icon: <Settings size={20}/>, label: "Settings", active: false }
          ].map(item => (
            <button key={item.label} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${item.active ? "bg-blue-600 text-white shadow-lg shadow-blue-100" : "text-slate-500 hover:bg-slate-50"}`}>
              {item.icon} {item.label}
            </button>
          ))}
        </nav>

        <button 
          onClick={() => { setIsAdmin(false); setPin(""); }}
          className="mt-auto w-full py-4 text-red-500 font-bold flex items-center justify-center gap-3 hover:bg-red-50 rounded-2xl transition-all"
        >
          <LogOut size={20}/> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto max-h-screen">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black text-slate-800 tracking-tight">สถิติภาพรวม</h1>
            <p className="text-slate-500 font-medium">โรงเรียนผู้สูงอายุ เทศบาลเมืองแสนสุข</p>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                placeholder="ค้นหารายชื่อนักเรียน..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all font-medium"
              />
            </div>
          </div>
        </header>

        {loading ? (
          <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-blue-600" size={48} /></div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {[
                { label: "นักเรียนทั้งหมด", value: stats.total, icon: <Users size={24}/>, color: "text-blue-600", bg: "bg-blue-50" },
                { label: "อายุเฉลี่ย", value: `${stats.avgAge} ปี`, icon: <Calendar size={24}/>, color: "text-indigo-600", bg: "bg-indigo-50" },
                { label: "ต้องการรถรับส่ง", value: stats.transportation, icon: <Car size={24}/>, color: "text-orange-600", bg: "bg-orange-50" },
                { label: "จำกัดอาหาร", value: stats.dietNeeds, icon: <HeartPulse size={24}/>, color: "text-rose-600", bg: "bg-rose-50" }
              ].map(card => (
                <motion.div whileHover={{ y: -5 }} key={card.label} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-6">
                  <div className={`${card.bg} ${card.color} p-4 rounded-3xl`}>{card.icon}</div>
                  <div>
                    <h3 className="text-xl font-black text-slate-800">{card.value}</h3>
                    <p className="text-slate-400 text-sm font-bold">{card.label}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Table */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                <h3 className="text-2xl font-black text-slate-800 flex items-center gap-4">
                  <UserCircle size={28} className="text-blue-600"/> ระเบียนรายชื่อนักเรียน
                </h3>
                <span className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm font-black">
                  {filteredStudents.length} รายการ
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-white text-slate-400 font-bold uppercase text-xs tracking-widest border-b border-slate-50">
                    <tr>
                      <th className="px-8 py-6 italic opacity-50">#ID</th>
                      <th className="px-8 py-6">ชื่อ-นามสกุล</th>
                      <th className="px-8 py-6">อายุ</th>
                      <th className="px-8 py-6">เบอร์โทรศัพท์</th>
                      <th className="px-8 py-6">สุขภาพ</th>
                      <th className="px-8 py-6 text-right">จัดการ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredStudents.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-50/80 transition-colors group">
                        <td className="px-8 py-6 text-slate-300 font-mono">#{s.id}</td>
                        <td className="px-8 py-6">
                          <div className="font-black text-slate-800">{s.Name}</div>
                          <div className="text-sm text-slate-400 font-bold">({s.Nickname})</div>
                        </td>
                        <td className="px-8 py-6 font-bold text-slate-600">{s.Age} ปี</td>
                        <td className="px-8 py-6 font-medium text-slate-600">{s.Phone}</td>
                        <td className="px-8 py-6">
                          {s["Health Conditions"] ? (
                            <span className="px-4 py-1 bg-red-50 text-red-600 rounded-full text-xs font-black ring-1 ring-red-100">
                              มีโรคประจำตัว
                            </span>
                          ) : (
                            <span className="text-emerald-500 font-bold text-sm">ปกติ</span>
                          )}
                        </td>
                        <td className="px-8 py-6 text-right">
                          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => setEditingStudent(s)} className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all"><Edit size={18}/></button>
                            <button onClick={() => handleDelete(s.id)} className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all"><Trash2 size={18}/></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingStudent(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-[3rem] w-full max-w-2xl shadow-2xl relative z-60 overflow-hidden border-b-[12px] border-blue-600"
            >
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="text-2xl font-black text-slate-800">แก้ไขข้อมูล: {editingStudent.Name}</h3>
                <button onClick={() => setEditingStudent(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X size={24}/></button>
              </div>
              <div className="p-10 grid grid-cols-2 gap-6 max-h-[60vh] overflow-y-auto">
                {Object.keys(editingStudent).filter(k => k !== 'id' && k !== 'Timestamp').map(key => (
                  <div key={key} className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">{key}</label>
                    <input 
                      type="text" 
                      value={editingStudent[key]}
                      onChange={(e) => setEditingStudent({...editingStudent, [key]: e.target.value})}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 font-bold text-slate-700"
                    />
                  </div>
                ))}
              </div>
              <div className="p-10 flex gap-4 pt-0">
                <button onClick={() => setEditingStudent(null)} className="flex-1 py-4 font-black text-slate-400 hover:bg-slate-50 rounded-2xl transition-all">ยกเลิก</button>
                <button 
                  onClick={() => handleUpdate(editingStudent.id, editingStudent)} 
                  className="flex-[2] py-5 bg-blue-600 text-white font-black rounded-3xl shadow-xl shadow-blue-100 flex items-center justify-center gap-3 hover:-translate-y-1 transition-all"
                >
                  <Check size={24}/> บันทึกการเปลี่ยนแปลง
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

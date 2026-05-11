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
  HeartPulse,
  Loader2,
  Car
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
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pin, setPin] = useState("");
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingStudent, setEditingStudent] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "students">("overview");
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

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
    avgAge: students.length ? Math.round(students.reduce((acc, s) => acc + (parseInt(s.Age) || 0), 0) / students.length) : 0,
    transportation: students.filter(s => s.Transportation === "ต้องการ").length,
    dietNeeds: students.filter(s => s.Diet && s.Diet !== "ปกติ").length,
    chronicCondition: students.filter(s => s["Health Conditions"] && s["Health Conditions"] !== "-").length,
    healthy: students.filter(s => !s["Health Conditions"] || s["Health Conditions"] === "-").length
  };

  // Chart Data: Age Distribution
  const ageDist = [
    { name: "60-65", value: students.filter(s => parseInt(s.Age) >= 60 && parseInt(s.Age) <= 65).length },
    { name: "66-70", value: students.filter(s => parseInt(s.Age) >= 66 && parseInt(s.Age) <= 70).length },
    { name: "71-75", value: students.filter(s => parseInt(s.Age) >= 71 && parseInt(s.Age) <= 75).length },
    { name: "76+", value: students.filter(s => parseInt(s.Age) > 75).length },
  ];

  // Chart Data: Health Status
  const healthData = [
    { name: "สุขภาพปกติ", value: stats.healthy, color: "#10b981" },
    { name: "มีโรคประจำตัว", value: stats.chronicCondition, color: "#ef4444" }
  ];

  // Chart Data: Transportation
  const transportData = [
    { name: "เดินทางเอง", value: stats.total - stats.transportation, color: "#3b82f6" },
    { name: "ต้องการรถรับส่ง", value: stats.transportation, color: "#f59e0b" }
  ];

  const filteredStudents = students.filter(s => 
    s.Name?.toLowerCase().includes(search.toLowerCase()) || 
    s.Nickname?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-72 bg-white border-r border-slate-100 flex flex-col py-10 px-6 gap-8 relative z-20">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-24 h-24 rounded-3xl bg-white p-2 shadow-xl shadow-blue-100 ring-2 ring-blue-50 overflow-hidden flex items-center justify-center">
            <img 
              src="./logo.png" 
              className="w-full h-full object-contain" 
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement?.classList.add('bg-blue-600', 'p-5');
                const icon = document.createElement('div');
                icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2v-5"/></svg>';
                e.currentTarget.parentElement?.appendChild(icon.firstChild as Node);
              }}
              alt="Logo" 
            />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">{isAdmin ? "Admin System" : "Dashboard"}</h2>
            <p className="text-blue-600 text-xs font-black tracking-widest uppercase mt-1">Elderly School {isAdmin ? "Admin" : "Stats"}</p>
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
            { icon: <TrendingUp size={20}/>, label: "Overview", id: "overview" },
            { icon: <Users size={20}/>, label: "Students", id: "students" },
          ].map(item => (
            <button 
              key={item.id} 
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === item.id ? "bg-blue-600 text-white shadow-lg shadow-blue-100" : "text-slate-500 hover:bg-slate-50"}`}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </nav>

        {isAdmin ? (
          <button 
            onClick={() => { setIsAdmin(false); setPin(""); }}
            className="mt-auto w-full py-4 text-red-500 font-bold flex items-center justify-center gap-3 hover:bg-red-50 rounded-2xl transition-all"
          >
            <LogOut size={20}/> Logout Admin
          </button>
        ) : (
          <button 
            onClick={() => setShowLoginModal(true)}
            className="mt-auto w-full py-4 text-blue-600 font-bold flex items-center justify-center gap-3 hover:bg-blue-50 rounded-2xl transition-all border-2 border-dashed border-blue-200"
          >
            <ShieldCheck size={20}/> Admin Login
          </button>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto max-h-screen">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black text-slate-800 tracking-tight">
              {activeTab === "overview" ? "สถิติภาพรวม" : "ระเบียนนักเรียน"}
            </h1>
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
          <div className="space-y-12">
            {activeTab === "overview" && (
              <>
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { label: "นักเรียนทั้งหมด", value: stats.total, icon: <Users size={24}/>, color: "text-blue-600", bg: "bg-blue-50" },
                    { label: "อายุเฉลี่ย", value: `${stats.avgAge} ปี`, icon: <Calendar size={24}/>, color: "text-indigo-600", bg: "bg-indigo-50" },
                    { label: "ต้องการรถรับส่ง", value: stats.transportation, icon: <Car size={24}/>, color: "text-orange-600", bg: "bg-orange-50" },
                    { label: "มีโรคประจำตัว", value: stats.chronicCondition, icon: <HeartPulse size={24}/>, color: "text-rose-600", bg: "bg-rose-50" }
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

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                  {/* Age Distribution Chart */}
                  <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col">
                    <div className="flex justify-between items-center mb-8">
                      <h3 className="text-lg font-black text-slate-800 tracking-tight">ช่วงอายุ</h3>
                      <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl"><Calendar size={18} /></div>
                    </div>
                    <div className="h-64 mt-auto">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={ageDist}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontWeight: 600, fontSize: 12}} />
                          <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontWeight: 600, fontSize: 12}} />
                          <Tooltip 
                            contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '15px' }}
                            itemStyle={{ fontWeight: 800, color: '#1e293b' }}
                          />
                          <Bar dataKey="value" radius={[10, 10, 10, 10]} barSize={32}>
                            {ageDist.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={index === ageDist.length - 1 ? '#6366f1' : '#cbd5e1'} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Health Status Pie Chart */}
                  <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-black text-slate-800 tracking-tight">สภาวะสุขภาพ</h3>
                      <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl"><HeartPulse size={18} /></div>
                    </div>
                    <div className="h-64 flex flex-col items-center justify-center">
                      <div className="w-full h-48">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={healthData}
                              cx="50%"
                              cy="50%"
                              innerRadius={50}
                              outerRadius={70}
                              paddingAngle={8}
                              dataKey="value"
                            >
                              {healthData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip 
                              contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="flex gap-6 mt-4">
                        {healthData.map((item) => (
                          <div key={item.name} className="flex flex-col items-center">
                            <div className="text-sm font-black text-slate-800">{item.value}</div>
                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{item.name}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Transportation Pie Chart */}
                  <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-black text-slate-800 tracking-tight">การรับ-ส่ง</h3>
                      <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl"><Car size={18} /></div>
                    </div>
                    <div className="h-64 flex flex-col items-center justify-center">
                      <div className="w-full h-48">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={transportData}
                              cx="50%"
                              cy="50%"
                              innerRadius={50}
                              outerRadius={70}
                              paddingAngle={8}
                              dataKey="value"
                            >
                              {transportData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip 
                              contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="flex gap-6 mt-4">
                        {transportData.map((item) => (
                          <div key={item.name} className="flex flex-col items-center">
                            <div className="text-sm font-black text-slate-800">{item.value}</div>
                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{item.name}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === "students" && (
              <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                  <h3 className="text-2xl font-black text-slate-800 flex items-center gap-4">
                    <UserCircle size={28} className="text-blue-600"/> ระเบียบรายชื่อนักเรียน
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
                        <th className="px-8 py-6 text-right">รายละเอียด</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {filteredStudents.map((s) => (
                        <tr key={s.id} className="hover:bg-slate-50/80 transition-colors group">
                          <td className="px-8 py-6 text-slate-300 font-mono">#{s.id}</td>
                          <td className="px-8 py-6">
                            <div className="font-black text-slate-800 leading-tight">{s.Name}</div>
                            <div className="text-sm text-slate-400 font-bold italic">({s.Nickname})</div>
                          </td>
                          <td className="px-8 py-6 font-bold text-slate-600">{s.Age} ปี</td>
                          <td className="px-8 py-6 font-medium text-slate-600">{s.Phone}</td>
                          <td className="px-8 py-6">
                            {(s["Health Conditions"] && s["Health Conditions"] !== "-") ? (
                              <span className="px-4 py-1 bg-red-50 text-red-600 rounded-full text-[10px] font-black ring-1 ring-red-100 uppercase">
                                Chronic Condition
                              </span>
                            ) : (
                              <span className="px-4 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black ring-1 ring-emerald-100 uppercase">
                                Healthy
                              </span>
                            )}
                          </td>
                          <td className="px-8 py-6 text-right">
                            <div className="flex justify-end gap-2">
                              <button 
                                onClick={() => setSelectedStudent(s)}
                                className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                              >
                                <Search size={18}/>
                              </button>
                              {isAdmin && (
                                <>
                                  <button onClick={() => setEditingStudent(s)} className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"><Edit size={18}/></button>
                                  <button onClick={() => handleDelete(s.id)} className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm"><Trash2 size={18}/></button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredStudents.length === 0 && (
                    <div className="p-20 text-center flex flex-col items-center gap-4">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                        <Search size={32} />
                      </div>
                      <p className="text-slate-400 font-bold">ไม่พบรายชื่อที่ค้นหา</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Student Detail Modal (Quick View) */}
      <AnimatePresence>
        {selectedStudent && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedStudent(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ y: 20, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 20, opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[3rem] w-full max-w-lg shadow-2xl relative z-[130] overflow-hidden"
            >
              <div className="p-8 bg-blue-600 flex justify-between items-start text-white">
                <div className="flex gap-6 items-center">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center text-white font-black text-3xl">
                    {selectedStudent.Nickname?.[0] || selectedStudent.Name?.[0]}
                  </div>
                  <div>
                    <h3 className="text-3xl font-black leading-tight">{selectedStudent.Name}</h3>
                    <p className="text-blue-100 font-bold">ชื่อเล่น: {selectedStudent.Nickname || "-"}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedStudent(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X size={24}/></button>
              </div>
              <div className="p-10 grid grid-cols-2 gap-8">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">อายุ</label>
                  <p className="text-xl font-black text-slate-800">{selectedStudent.Age} ปี</p>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">ภาวะสุขภาพ</label>
                  <p className="text-xl font-black text-slate-800">{selectedStudent["Health Conditions"] || "ปกติ"}</p>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">ความต้องการพิเศษ</label>
                  <p className="text-slate-600 font-bold">{selectedStudent["Diet"] || "ไม่มี"}</p>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">การเดินทาง</label>
                  <div className="flex items-center gap-2 text-slate-600 font-bold">
                    <Car size={16} className="text-orange-500" />
                    {selectedStudent.Transportation === "ต้องการ" ? "ต้องการรถรับส่ง" : "เดินทางเอง"}
                  </div>
                </div>
              </div>
              <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-center">
                <button onClick={() => setSelectedStudent(null)} className="px-10 py-4 bg-white border border-slate-200 text-slate-600 font-black rounded-2xl hover:bg-slate-100 transition-all shadow-sm">
                  ปิดหน้าต่างนี้
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Modal (Admin Only View) */}
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
      {/* Admin Login Modal */}
      <AnimatePresence>
        {showLoginModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLoginModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ y: 20, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 20, opacity: 0, scale: 0.9 }}
              className="bg-white p-10 rounded-[3rem] shadow-2xl w-full max-w-md text-center border-b-[8px] border-blue-600 relative z-[110]"
            >
              <button 
                onClick={() => setShowLoginModal(false)}
                className="absolute right-6 top-6 p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
              >
                <X size={20} />
              </button>
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
                        if (pin === ADMIN_PIN) {
                          setIsAdmin(true);
                          setShowLoginModal(false);
                          setPin("");
                        } else { 
                          alert("รหัสผ่านผิด!"); 
                          setPin(""); 
                        }
                      } else if (pin.length < 4) {
                        const newPin = pin + n;
                        setPin(newPin);
                        if (newPin.length === 4 && newPin === ADMIN_PIN) {
                           // Auto login if 4 digits match
                           setTimeout(() => {
                             setIsAdmin(true);
                             setShowLoginModal(false);
                             setPin("");
                           }, 300);
                        }
                      }
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
        )}
      </AnimatePresence>
    </div>
  );
}

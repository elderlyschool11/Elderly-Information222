import { motion } from "motion/react";
import React from "react";

interface FormInputProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  required?: boolean;
  placeholder?: string;
  options?: string[];
  isTextArea?: boolean;
}

export default function FormInput({
  label,
  name,
  type = "text",
  value,
  onChange,
  required = false,
  placeholder = "",
  options,
  isTextArea = false
}: FormInputProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      viewport={{ once: true }}
      className="flex flex-col space-y-2 w-full"
    >
      <label htmlFor={name} className="text-sm font-bold text-slate-600 ml-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      {options ? (
        <div className="relative group">
          <select
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            className="w-full px-5 py-4 bg-white border-2 border-slate-200 rounded-2xl shadow-[6px_6px_0px_0px_rgba(59,130,246,0.1)] focus:shadow-[2px_2px_0px_0px_rgba(59,130,246,0.2)] focus:border-blue-500 focus:outline-none transition-all duration-300 appearance-none font-medium"
          >
            <option value="" disabled>{placeholder || "เลือก..."}</option>
            {options.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
          </div>
        </div>
      ) : isTextArea ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          rows={3}
          className="w-full px-5 py-4 bg-white border-2 border-slate-200 rounded-2xl shadow-[6px_6px_0px_0px_rgba(59,130,246,0.1)] focus:shadow-[2px_2px_0px_0px_rgba(59,130,246,0.2)] focus:border-blue-500 focus:outline-none transition-all duration-300 resize-none font-medium"
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          className="w-full px-5 py-4 bg-white border-2 border-slate-200 rounded-2xl shadow-[6px_6px_0px_0px_rgba(59,130,246,0.1)] focus:shadow-[2px_2px_0px_0px_rgba(59,130,246,0.2)] focus:border-blue-500 focus:outline-none transition-all duration-300 font-medium"
        />
      )}
    </motion.div>
  );
}

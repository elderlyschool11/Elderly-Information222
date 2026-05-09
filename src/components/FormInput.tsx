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
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="flex flex-col space-y-2 w-full"
    >
      <label htmlFor={name} className="text-sm font-medium text-slate-700 ml-1">
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
            className="w-full px-4 py-3 bg-white border-2 border-slate-100 rounded-xl shadow-[4px_4px_0px_0px_rgba(30,64,175,0.1)] focus:shadow-[2px_2px_0px_0px_rgba(30,64,175,0.2)] focus:border-blue-400 focus:outline-none transition-all duration-200 appearance-none"
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
          className="w-full px-4 py-3 bg-white border-2 border-slate-100 rounded-xl shadow-[4px_4px_0px_0px_rgba(30,64,175,0.1)] focus:shadow-[2px_2px_0px_0px_rgba(30,64,175,0.2)] focus:border-blue-400 focus:outline-none transition-all duration-200 resize-none"
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
          className="w-full px-4 py-3 bg-white border-2 border-slate-100 rounded-xl shadow-[4px_4px_0px_0px_rgba(30,64,175,0.1)] focus:shadow-[2px_2px_0px_0px_rgba(30,64,175,0.2)] focus:border-blue-400 focus:outline-none transition-all duration-200"
        />
      )}
    </motion.div>
  );
}

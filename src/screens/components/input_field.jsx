export default function InputField({
  id,
  type,
  label,
  onChange,
  value,
  isDelete = false,
}) {
  const color = isDelete ? "accent-red" : "dark-purple-blue";
  const bgColor = isDelete ? "natural-white" : "natural-grey-blue";
  return (
    <div className="relative">
      <input
        id={id}
        type={type}
        placeholder=" "
        onChange={onChange}
        value={value}
        className={`peer w-full rounded-lg border p-2 border-${color} border-1 outline-none`}
      />
      <label
        htmlFor={id}
        className={`absolute left-3 -top-2 bg-${bgColor} px-1 text-sm transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:left-2 peer-placeholder-shown:text-base peer-focus:-top-2 peer-focus:left-3 peer-focus:text-sm text-${color}`}
      >
        {label}
      </label>
    </div>
  );
}

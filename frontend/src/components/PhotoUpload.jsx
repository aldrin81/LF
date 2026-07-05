import React, { useEffect, useRef, useState } from "react";

const PhotoUpload = ({ name, value, onChange }) => {
  const ref = useRef(null);
  const [preview, setPreview] = useState(null);

  const handleFile = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);

    onChange({
      target: {
        name,
        value: file,
      },
    });
  };

  const handleRemove = () => {
    setPreview(null);

    onChange({
      target: {
        name,
        value: null,
      },
    });

    if (ref.current) {
      ref.current.value = "";
    }
  };

  useEffect(() => {
    if (!value) {
      setPreview(null);
      if (ref.current) {
        ref.current.value = "";
      }
    }
  }, [value]);

  return (
    <div>
      <label className="block text-m font-semibold uppercase text-slate-700 mb-2">Photo (optional)</label>

      {preview ? (
        <div className="relative w-full h-32 rounded-2xl overflow-hidden border border-slate-200">
          <img
            src={preview}
            alt="preview"
            className="w-full h-full object-cover"
          />

          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 bg-black/50 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-500 transition-all"
          >
            ✕
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => ref.current.click()}
          className="w-full h-20 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-1 text-slate-400 hover:border-[#2D366D]/40 hover:text-[#2D366D] transition-all text-xs font-black uppercase tracking-widest font-sans"
        >
          📷 Upload Photo
        </button>
      )}

      <input
        ref={ref}
        type="file"
        name={name}
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />
    </div>
  );
};

export default PhotoUpload;

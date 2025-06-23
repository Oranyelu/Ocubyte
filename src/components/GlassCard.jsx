const GlassCard = ({ title, children }) => {
  return (
    <div className="backdrop-blur-2xl bg-white/10 border border-white/10 rounded-xl p-6 shadow-lg text-white">
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      {children}
    </div>
  );
};

export default GlassCard;

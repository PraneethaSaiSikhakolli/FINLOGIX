const testimonials = [
  {
    name: 'Alex',
    comment: 'FinLogix helped me track my expenses effortlessly. The AI insights are a game-changer!',
  },
  {
    name: 'Priya',
    comment: 'I’ve finally gained control over my budget — the charts are simple and powerful.',
  },
  {
    name: 'Daniel',
    comment: 'Love the clean UI and how easy it is to use. Highly recommended!',
  },
];

const Testimonials = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {testimonials.map((t, idx) => (
        <div key={idx} className="bg-[#192a44] p-6 rounded-lg shadow-md text-white">
          <p className="italic mb-4">“{t.comment}”</p>
          <h4 className="text-sm font-semibold text-indigo-300">— {t.name}</h4>
        </div>
      ))}
    </div>
  );
};

export default Testimonials;

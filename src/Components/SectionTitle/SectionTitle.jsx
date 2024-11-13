const SectionTitle = ({ subHeading, heading}) => {
  return (
    <div>
      <p className="text-orange-400 text-center mb-4 mt-12">
        --- {subHeading} ---
      </p>
      <h3 className="py-4 mx-auto w-64 text-center text-xl font-bold border-y-2">
        {heading}
      </h3>
    </div>
  );
};

export default SectionTitle;

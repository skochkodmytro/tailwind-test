type InstructionListProps = {
  onNext: () => void;
};

const InstructionList = ({ onNext }: InstructionListProps) => {
  return (
    <div>
      <h2 className="text-2xl font-bold">Upload Instructions</h2>
      <ul className="text-left list-disc list-inside space-y-2 text-gray-700">
        <li>Photograph all pages of the completed form.</li>
        <li>
          Photograph the written or printed med profile left in the patients
          form.
        </li>
        <li>Record a spoken message including the narrative if needed.</li>
        <li>Click “Next” to start uploading.</li>
      </ul>
      <button
        onClick={onNext}
        className="mt-6 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-xl transition"
      >
        Next
      </button>
    </div>
  );
};

export default InstructionList;

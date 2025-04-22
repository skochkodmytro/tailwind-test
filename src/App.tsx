import { useState } from "react";

import { InstructionList, UploadForm } from "./components";

enum StepsEnum {
  INSTRUCTION,
  UPLOAD_FORM,
  SUCCESS,
}

function App() {
  const [step, setStep] = useState(StepsEnum.INSTRUCTION);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-2xl space-y-6 text-center">
      {step === StepsEnum.INSTRUCTION && (
        <InstructionList onNext={() => setStep(StepsEnum.UPLOAD_FORM)} />
      )}

      {step === StepsEnum.UPLOAD_FORM && (
        <UploadForm onNext={() => setStep(StepsEnum.SUCCESS)} />
      )}

      {step === StepsEnum.SUCCESS && (
        <>
          <h2 className="text-2xl font-bold text-green-600">Success!</h2>
          <p className="text-gray-700">
            Your photos have been uploaded to Google Drive.
          </p>
        </>
      )}
    </div>
  );
}

export default App;

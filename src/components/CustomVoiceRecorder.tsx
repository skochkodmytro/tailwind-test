import { useRef, useState } from "react";

type CustomVoiceRecorderProps = {
  onAudioRecorded: (file: File | null) => void;
};

const CustomVoiceRecorder = ({ onAudioRecorded }: CustomVoiceRecorderProps) => {
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      // await (window.navigator.permissions as any)
      //   .query({ name: "microphone" })
      //   .then(function (result: PermissionStatus) {
      //     console.log(result, "----result");
      //     // setPermissionState(result.state);
      //   });
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });

        const file = new File([audioBlob], `voice-${Date.now()}.mp3`, {
          type: "audio/mp3",
        });

        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        onAudioRecorded(file);
      };

      mediaRecorderRef.current.start();
      setRecording(true);
    } catch (err) {
      alert("Please give access to microphone");
      console.error("Error accessing microphone:", err);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  const deleteRecording = () => {
    setAudioURL(null);
    onAudioRecorded(null);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Voice Recorder</h2>

      {!audioURL ? (
        <button
          onClick={recording ? stopRecording : startRecording}
          className={`py-2 px-4 rounded-xl transition ${
            recording
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          {recording ? "Stop Recording" : "Start Recording"}
        </button>
      ) : null}

      {audioURL && (
        <div className="bg-gray-100 rounded-xl pv-2 pr-4 flex items-center justify-between">
          <audio src={audioURL} controls className="w-full mr-4" />
          <button
            onClick={deleteRecording}
            className="text-red-500 hover:text-red-700 text-sm"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default CustomVoiceRecorder;

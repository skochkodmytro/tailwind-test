import { useRef, useState } from "react";

type CustomVoiceRecorderProps = {
  onAudioRecorded: (file: File | null) => void;
};

const CustomVoiceRecorder = ({ onAudioRecorded }: CustomVoiceRecorderProps) => {
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>("audio/webm");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      let preferredMimeType = "";
      if (MediaRecorder.isTypeSupported("audio/mp4")) {
        preferredMimeType = "audio/mp4";
      } else if (MediaRecorder.isTypeSupported("audio/aac")) {
        preferredMimeType = "audio/aac";
      } else if (MediaRecorder.isTypeSupported("audio/webm;codecs=opus")) {
        preferredMimeType = "audio/webm;codecs=opus";
      } else {
        alert("No supported audio format available.");
        return;
      }

      setMimeType(preferredMimeType);
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: preferredMimeType,
        });

        const fileExtension = preferredMimeType.includes("mp4")
          ? "mp4"
          : preferredMimeType.includes("aac")
          ? "aac"
          : "webm";

        const file = new File(
          [audioBlob],
          `voice-${Date.now()}.${fileExtension}`,
          {
            type: preferredMimeType,
          }
        );

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
          <audio src={audioURL} controls className="w-full mr-4">
            <audio controls className="w-full mr-4">
              <source src={audioURL} type={mimeType} />
              Your browser does not support the audio element.
            </audio>
          </audio>
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

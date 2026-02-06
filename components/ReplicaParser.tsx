import { useState, useRef } from 'react';

interface Props {
  replicas: any[];
  setReplicas: (replicas: any[]) => void;
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  onDone: () => void;
}

export default function ReplicaParser({ replicas, setReplicas, currentIndex, setCurrentIndex, onDone }: Props) {
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  if (currentIndex >= replicas.length) {
    onDone();
    return null;
  }

  const { name, text } = replicas[currentIndex];

  const handleChoice = (isMine: boolean) => {
    const updated = [...replicas];
    updated[currentIndex].isMine = isMine;
    setReplicas(updated);
    if (isMine) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Start recording prompt
    }
  };

  const startRecording = async () => {
    setRecording(true);
    audioChunksRef.current = [];
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);
    mediaRecorderRef.current.ondataavailable = e => audioChunksRef.current.push(e.data);
    mediaRecorderRef.current.start();
  };

  const stopRecording = () => {
    setRecording(false);
    mediaRecorderRef.current?.stop();
    mediaRecorderRef.current?.addEventListener('stop', () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/ogg' });
      const updated = [...replicas];
      updated[currentIndex].audioBlob = audioBlob;
      setReplicas(updated);
      setCurrentIndex(currentIndex + 1);
    });
  };

  const rerecord = () => {
    const updated = [...replicas];
    updated[currentIndex].audioBlob = null;
    setReplicas(updated);
  };

  return (
    <div className="border p-4 mb-4 overflow-y-auto max-h-40">
      <p className="font-bold">{name}</p>
      <p>{text}</p>
      <button onClick={() => handleChoice(true)} className="bg-green-500 text-white p-1 mr-2">Моя</button>
      <button onClick={() => handleChoice(false)} className="bg-blue-500 text-white p-1">Партнёр</button>
      {!replicas[currentIndex].isMine && (
        <>
          {!replicas[currentIndex].audioBlob && (
            <>
              <button onClick={startRecording} disabled={recording} className="bg-red-500 text-white p-1 ml-2">Записать</button>
              {recording && <button onClick={stopRecording} className="bg-red-500 text-white p-1 ml-2">Остановить</button>}
            </>
          )}
          {replicas[currentIndex].audioBlob && (
            <button onClick={rerecord} className="bg-yellow-500 text-white p-1 ml-2">Переписать</button>
          )}
        </>
      )}
    </div>
  );
}

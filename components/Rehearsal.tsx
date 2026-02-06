interface Props {
  replicas: any[];
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  onExit: () => void;
}

export default function Rehearsal({ replicas, currentIndex, setCurrentIndex, onExit }: Props) {
  const { name, text, isMine, audioBlob } = replicas[currentIndex] || {};

  const playAudio = () => {
    if (!isMine && audioBlob) {
      const audio = new Audio(URL.createObjectURL(audioBlob));
      audio.play();
    }
  };

  useEffect(playAudio, [currentIndex]);

  if (!replicas.length) return null;

  return (
    <div>
      <div className="border p-4 mb-4 overflow-y-auto max-h-40">
        <p className="font-bold">{name}</p>
        <p>{text}</p>
      </div>
      <button onClick={() => setCurrentIndex(currentIndex + 1)} disabled={currentIndex >= replicas.length - 1} className="bg-blue-500 text-white p-2 mr-2">Дальше</button>
      <button onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))} className="bg-blue-500 text-white p-2 mr-2">Предыдущая</button>
      <button onClick={() => setCurrentIndex(0)} className="bg-blue-500 text-white p-2 mr-2">Начать сначала</button>
      <button onClick={onExit} className="bg-red-500 text-white p-2">Выйти</button>
    </div>
  );
}

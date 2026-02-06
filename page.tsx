import { useState, useEffect } from 'react';
import SceneLoader from '../components/SceneLoader';
import ReplicaParser from '../components/ReplicaParser';
import Rehearsal from '../components/Rehearsal';
import Help from '../components/Help';

export default function Home() {
  const [stage, setStage] = useState<'menu' | 'load' | 'parse' | 'rehearse'>('menu');
  const [replicas, setReplicas] = useState<any[]>([]); // [{name, text, isMine, audioBlob?}]
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem('replicas');
    if (saved) setReplicas(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (replicas.length) localStorage.setItem('replicas', JSON.stringify(replicas));
  }, [replicas]);

  const handleNewScene = () => setStage('load');
  const handleRehearse = () => {
    if (replicas.every(r => r.isMine || r.audioBlob)) setStage('rehearse');
    else alert('Не все реплики партнёра записаны!');
  };
  const handleClear = () => {
    setReplicas([]);
    localStorage.removeItem('replicas');
    setStage('menu');
  };
  const handleDonate = () => {
    alert('Поддержка проекта\nДенежные средства перечисляются в качестве добровольного пожертвования автору проекта.\nПеречисление средств не является оплатой услуг и не влечёт возникновения обязательств.\nСсылка: https://tbank.ru/cf/AhDR5Hn9ci3');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">🎭 ПОДАЙ РЕПЛИКУ</h1>
      <p className="mb-4">Телеграм-суфлёр для актёров, режиссёров и репетиций. Предназначен для повторения текста из самопроб и прослушиваний.</p>

      {stage === 'menu' && (
        <div className="space-y-4">
          <button onClick={handleNewScene} className="bg-blue-500 text-white p-2 rounded">Новая сцена</button>
          <button onClick={handleRehearse} className="bg-green-500 text-white p-2 rounded">Репетиция</button>
          <Help />
          <button onClick={handleClear} className="bg-red-500 text-white p-2 rounded">Очистить</button>
          <button onClick={handleDonate} className="bg-yellow-500 text-white p-2 rounded">
            ☕ Поддержать проект
            <span className="text-xs block">Добровольная поддержка проекта</span>
          </button>
          <p className="text-sm">Автор: Владимир Кисаров | Telegram: <a href="https://t.me/kisarov_1" className="text-blue-500">t.me/kisarov_1</a></p>
        </div>
      )}

      {stage === 'load' && (
        <SceneLoader onLoad={(parsedReplicas) => {
          setReplicas(parsedReplicas);
          setStage('parse');
        }} />
      )}

      {stage === 'parse' && (
        <ReplicaParser replicas={replicas} setReplicas={setReplicas} currentIndex={currentIndex} setCurrentIndex={setCurrentIndex} onDone={() => setStage('menu')} />
      )}

      {stage === 'rehearse' && (
        <Rehearsal replicas={replicas} currentIndex={currentIndex} setCurrentIndex={setCurrentIndex} onExit={() => setStage('menu')} />
      )}
    </div>
  );
}

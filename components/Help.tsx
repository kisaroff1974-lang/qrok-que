import { useState } from 'react';

export default function Help() {
  const [show, setShow] = useState(false);

  return (
    <>
      <button onClick={() => setShow(!show)} className="bg-purple-500 text-white p-2 rounded">Help</button>
      {show && (
        <div className="mt-2 p-2 border">
          <p>📝 Инструкция:</p>
          <ul className="list-disc pl-4">
            <li>Загружайте сцену текстом, PDF или DOCX.</li>
            <li>Формат: ИМЕНА ЗАГЛАВНЫМИ, реплики ниже.</li>
            <li>Для каждой реплики выбирайте "Моя" или "Партнёр".</li>
            <li>Для партнёра запишите голос.</li>
            <li>Репетируйте с кнопками.</li>
          </ul>
          <p>Автор: Владимир Кисаров\nTelegram: https://t.me/kisarov_1</p>
        </div>
      )}
    </>
  );
}

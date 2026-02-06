import { useState } from 'react';
import * as pdfjs from 'pdfjs-dist';
import { Document as DocxDocument } from 'docx';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

interface Props {
  onLoad: (replicas: any[]) => void;
}

export default function SceneLoader({ onLoad }: Props) {
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const parseScene = (inputText: string) => {
    const lines = inputText.split('\n');
    const replicas = [];
    let currentName = null;
    let currentText = [];
    for (let line of lines) {
      line = line.trim();
      if (line.match(/^[A-ZА-ЯЁ\s]+$/)) { // UPPERCASE name
        if (currentName) replicas.push({ name: currentName, text: currentText.join(' ').trim(), isMine: null, audioBlob: null });
        currentName = line.replace(/:$/, '').trim();
        currentText = [];
      } else if (line) {
        currentText.push(line);
      }
    }
    if (currentName) replicas.push({ name: currentName, text: currentText.join(' ').trim(), isMine: null, audioBlob: null });
    onLoad(replicas);
  };

  const handleFile = async () => {
    if (!file) return;
    let extractedText = '';
    if (file.name.endsWith('.pdf')) {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        extractedText += content.items.map(item => (item as any).str).join(' ') + '\n';
      }
    } else if (file.name.endsWith('.docx')) {
      const arrayBuffer = await file.arrayBuffer();
      const doc = await DocxDocument({ buffer: arrayBuffer });
      extractedText = doc.paragraphs.map(p => p.text).join('\n');
    }
    parseScene(extractedText);
  };

  const handleSubmit = () => {
    if (text) parseScene(text);
    else if (file) handleFile();
  };

  return (
    <div>
      <textarea placeholder="Вставьте текст сцены" value={text} onChange={e => setText(e.target.value)} className="w-full p-2 border mb-2" rows={10} />
      <input type="file" accept=".pdf,.docx" onChange={e => setFile(e.target.files?.[0] || null)} className="mb-2" />
      <button onClick={handleSubmit} className="bg-blue-500 text-white p-2 rounded">Загрузить</button>
    </div>
  );
}

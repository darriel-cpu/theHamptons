import React, { useRef, useEffect, useState } from 'react';
import { Bold, Italic, List, AlignLeft, AlignCenter, AlignRight, Heading1, Heading2 } from 'lucide-react';

interface WYSIWYGEditorProps {
  value: string;
  onChange: (html: string) => void;
  className?: string;
}

const WYSIWYGEditor: React.FC<WYSIWYGEditorProps> = ({ value, onChange, className = '' }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  // Initialize content
  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML && !isFocused) {
      editorRef.current.innerHTML = value;
    }
  }, [value, isFocused]);

  const execCommand = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  return (
    <div className={`border border-gray-300 rounded-lg overflow-hidden bg-white flex flex-col ${className}`}>
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 bg-gray-50 border-b border-gray-200 flex-wrap">
        <button type="button" onClick={() => execCommand('bold')} className="p-1.5 hover:bg-gray-200 rounded text-gray-700" title="Bold">
          <Bold size={16} />
        </button>
        <button type="button" onClick={() => execCommand('italic')} className="p-1.5 hover:bg-gray-200 rounded text-gray-700" title="Italic">
          <Italic size={16} />
        </button>
        <div className="w-px h-4 bg-gray-300 mx-1"></div>
        <button type="button" onClick={() => execCommand('formatBlock', 'H2')} className="p-1.5 hover:bg-gray-200 rounded text-gray-700" title="Heading 1">
          <Heading1 size={16} />
        </button>
        <button type="button" onClick={() => execCommand('formatBlock', 'H3')} className="p-1.5 hover:bg-gray-200 rounded text-gray-700" title="Heading 2">
          <Heading2 size={16} />
        </button>
        <div className="w-px h-4 bg-gray-300 mx-1"></div>
        <button type="button" onClick={() => execCommand('insertUnorderedList')} className="p-1.5 hover:bg-gray-200 rounded text-gray-700" title="Bullet List">
          <List size={16} />
        </button>
        <div className="w-px h-4 bg-gray-300 mx-1"></div>
        <button type="button" onClick={() => execCommand('justifyLeft')} className="p-1.5 hover:bg-gray-200 rounded text-gray-700" title="Align Left">
          <AlignLeft size={16} />
        </button>
        <button type="button" onClick={() => execCommand('justifyCenter')} className="p-1.5 hover:bg-gray-200 rounded text-gray-700" title="Align Center">
          <AlignCenter size={16} />
        </button>
        <button type="button" onClick={() => execCommand('justifyRight')} className="p-1.5 hover:bg-gray-200 rounded text-gray-700" title="Align Right">
          <AlignRight size={16} />
        </button>
      </div>

      {/* Editable Area */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="flex-1 p-4 min-h-[300px] outline-none prose prose-sm max-w-none text-gray-800"
        style={{ overflowY: 'auto' }}
      />
    </div>
  );
};

export default WYSIWYGEditor;

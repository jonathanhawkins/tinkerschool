"use client";

/**
 * PythonEditor -- Monaco-based Python code editor for the workshop.
 *
 * Band 2 ("Builder"): Read-only "peek at Python" mode. Kids can see the
 * generated code from their Blockly blocks but cannot edit it.
 *
 * Band 3+ ("Inventor" and above): Fully editable. Kids write MicroPython
 * directly with syntax highlighting, autocomplete, and error markers.
 */

import { useCallback, useState } from "react";
import Editor from "@monaco-editor/react";
import { motion } from "framer-motion";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface PythonEditorProps {
  /** The Python code to display. */
  code: string;
  /** Called when the user edits code (only fires for Band 3+). */
  onCodeChange?: (code: string) => void;
  /** Whether the editor is read-only (Band 2) or editable (Band 3+). */
  readOnly?: boolean;
  /** Additional CSS class for the outer container. */
  className?: string;
}

// ---------------------------------------------------------------------------
// Editor loading skeleton
// ---------------------------------------------------------------------------

function EditorLoadingSkeleton() {
  return (
    <div className="flex h-full min-h-[480px] flex-col gap-2 p-4">
      <Skeleton className="h-4 w-3/4 rounded bg-white/10" />
      <Skeleton className="h-4 w-1/2 rounded bg-white/10" />
      <Skeleton className="h-4 w-2/3 rounded bg-white/10" />
      <Skeleton className="h-4 w-1/3 rounded bg-white/10" />
      <Skeleton className="h-4 w-3/5 rounded bg-white/10" />
      <Skeleton className="h-4 w-2/5 rounded bg-white/10" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Monaco editor options
// ---------------------------------------------------------------------------

const BASE_EDITOR_OPTIONS = {
  minimap: { enabled: false },
  fontSize: 15,
  lineNumbers: "on" as const,
  scrollBeyondLastLine: false,
  wordWrap: "on" as const,
  automaticLayout: true,
  padding: { top: 16, bottom: 16 },
  lineHeight: 24,
  fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
  fontLigatures: true,
  renderLineHighlight: "gutter" as const,
  smoothScrolling: true,
  cursorSmoothCaretAnimation: "on" as const,
  cursorBlinking: "smooth" as const,
  bracketPairColorization: { enabled: true },
  guides: {
    indentation: true,
    bracketPairs: true,
  },
  scrollbar: {
    verticalScrollbarSize: 8,
    horizontalScrollbarSize: 8,
    verticalSliderSize: 8,
  },
  overviewRulerLanes: 0,
  hideCursorInOverviewRuler: true,
  overviewRulerBorder: false,
  contextmenu: false,
};

const READ_ONLY_OPTIONS = {
  ...BASE_EDITOR_OPTIONS,
  readOnly: true,
  domReadOnly: true,
  cursorStyle: "line-thin" as const,
  renderLineHighlight: "none" as const,
};

const EDITABLE_OPTIONS = {
  ...BASE_EDITOR_OPTIONS,
  readOnly: false,
  suggestOnTriggerCharacters: true,
  quickSuggestions: true,
  tabCompletion: "on" as const,
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

function PythonEditor({
  code,
  onCodeChange,
  readOnly = false,
  className,
}: PythonEditorProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  const handleEditorDidMount = useCallback(() => {
    setIsLoaded(true);
  }, []);

  const handleChange = useCallback(
    (value: string | undefined) => {
      if (!readOnly && onCodeChange && value !== undefined) {
        onCodeChange(value);
      }
    },
    [readOnly, onCodeChange],
  );

  const editorOptions = readOnly ? READ_ONLY_OPTIONS : EDITABLE_OPTIONS;
  const displayCode = code || "# Drag some blocks to see Python code here!";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn(
        "relative flex min-h-[480px] flex-col overflow-hidden rounded-2xl border-2 border-primary/20 bg-[#1e1e2e] shadow-md",
        className,
      )}
    >
      {/* macOS-style header bar */}
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5">
        <div className="flex gap-1.5">
          <span className="size-3 rounded-full bg-red-400/70" />
          <span className="size-3 rounded-full bg-yellow-400/70" />
          <span className="size-3 rounded-full bg-green-400/70" />
        </div>
        <span className="ml-2 text-xs font-medium text-white/50">
          generated-code.py
        </span>
      </div>

      {/* Read-only / editable badge */}
      <div className="absolute right-3 top-2.5 z-10 rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-medium text-white/40">
        {readOnly ? "read-only" : "editable"}
      </div>

      {/* Monaco editor */}
      <div className="relative flex-1">
        {!isLoaded && <EditorLoadingSkeleton />}
        <div className={cn("h-full", !isLoaded && "invisible")}>
          <Editor
            height="100%"
            defaultLanguage="python"
            value={displayCode}
            theme="vs-dark"
            options={editorOptions}
            onChange={handleChange}
            onMount={handleEditorDidMount}
          />
        </div>
      </div>
    </motion.div>
  );
}

export default PythonEditor;

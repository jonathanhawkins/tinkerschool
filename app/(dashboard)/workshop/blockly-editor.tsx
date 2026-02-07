"use client";

/**
 * BlocklyEditor -- interactive visual code editor for the M5StickC Plus 2.
 *
 * Renders a Blockly workspace with custom M5Stick blocks, generates
 * MicroPython on every workspace change, and exposes a ref-based API
 * for reading the current workspace XML (used for saving projects).
 */

import {
  useRef,
  useCallback,
  useImperativeHandle,
  forwardRef,
  useEffect,
  useState,
} from "react";
import { Card, CardContent } from "@/components/ui/card";
import { m5stickToolbox } from "@/lib/blocks/m5stick-toolbox";

import type { WorkspaceSvg } from "blockly";

// ---------------------------------------------------------------------------
// Public ref handle
// ---------------------------------------------------------------------------

/** Methods exposed to parent components via `ref`. */
export interface BlocklyEditorHandle {
  /** Return the current workspace state as Blockly XML (for persistence). */
  getWorkspaceXml: () => string | null;
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface BlocklyEditorProps {
  /** Called whenever the generated Python code changes. */
  onCodeChange?: (python: string) => void;
  /** Optional initial XML to restore a previously-saved workspace. */
  initialXml?: string;
}

// ---------------------------------------------------------------------------
// Workspace configuration -- kid-friendly, large blocks, zoom, scroll
// ---------------------------------------------------------------------------

const WORKSPACE_CONFIG = {
  grid: {
    spacing: 24,
    length: 3,
    colour: "#E0E0E0",
    snap: true,
  },
  zoom: {
    controls: true,
    wheel: true,
    startScale: 1.1,
    maxScale: 2.0,
    minScale: 0.5,
    scaleSpeed: 1.1,
  },
  trashcan: true,
  move: {
    scrollbars: true,
    drag: true,
    wheel: true,
  },
  sounds: true,
  renderer: "zelos", // rounded, kid-friendly block renderer
} as const;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const BlocklyEditor = forwardRef<BlocklyEditorHandle, BlocklyEditorProps>(
  function BlocklyEditor({ onCodeChange, initialXml }, ref) {
    const containerRef = useRef<HTMLDivElement>(null);
    const workspaceRef = useRef<WorkspaceSvg | null>(null);
    const [isReady, setIsReady] = useState(false);

    // Cache the Blockly module after dynamic import so we can use it
    // synchronously in imperative callbacks (no require() needed).
    const blocklyModuleRef = useRef<typeof import("blockly") | null>(null);

    // Keep the latest onCodeChange callback in a ref so the workspace
    // change listener always calls the freshest version.
    const onCodeChangeRef = useRef(onCodeChange);
    useEffect(() => {
      onCodeChangeRef.current = onCodeChange;
    }, [onCodeChange]);

    // Lazy-initialise Blockly -- browser-only, never runs during SSR.
    useEffect(() => {
      let disposed = false;

      async function initBlockly() {
        // Dynamic imports -- order matters: blocks must be registered
        // before the workspace is created.
        const Blockly = await import("blockly");
        const { pythonGenerator } = await import("blockly/python");

        // Register standard block definitions (logic, loops, math, etc.)
        await import("blockly/blocks");

        // Register custom M5Stick blocks and their Python generators.
        await import("@/lib/blocks/m5stick-blocks");

        if (disposed || !containerRef.current) return;

        blocklyModuleRef.current = Blockly;

        // Inject the workspace into the DOM container
        const workspace = Blockly.inject(containerRef.current, {
          ...WORKSPACE_CONFIG,
          toolbox: m5stickToolbox,
        });

        workspaceRef.current = workspace;

        // Restore from saved XML if provided
        if (initialXml) {
          try {
            const dom = Blockly.utils.xml.textToDom(initialXml);
            Blockly.Xml.domToWorkspace(dom, workspace);
          } catch {
            console.warn("BlocklyEditor: failed to restore initial XML");
          }
        }

        // Generate code on every workspace change
        const handleChange = () => {
          const cb = onCodeChangeRef.current;
          if (!cb) return;
          try {
            const code = pythonGenerator.workspaceToCode(workspace);
            cb(code);
          } catch {
            // Generator can fail while blocks are mid-drag; ignore.
          }
        };

        workspace.addChangeListener(handleChange);

        // Auto-close the toolbox flyout after a block is dragged out
        workspace.addChangeListener((event) => {
          if (event.type === Blockly.Events.BLOCK_CREATE) {
            workspace.getToolbox()?.clearSelection();
          }
        });

        // Fire once immediately so the parent gets the initial code
        handleChange();

        setIsReady(true);
      }

      initBlockly();

      return () => {
        disposed = true;
        if (workspaceRef.current) {
          workspaceRef.current.dispose();
          workspaceRef.current = null;
        }
      };
      // initialXml is intentionally omitted -- we only restore once at mount
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Expose imperative methods to parent via ref
    const getWorkspaceXml = useCallback((): string | null => {
      const workspace = workspaceRef.current;
      const Blockly = blocklyModuleRef.current;
      if (!workspace || !Blockly) return null;
      try {
        const dom = Blockly.Xml.workspaceToDom(workspace) as Element;
        return Blockly.Xml.domToText(dom) as string;
      } catch {
        return null;
      }
    }, []);

    useImperativeHandle(
      ref,
      () => ({
        getWorkspaceXml,
      }),
      [getWorkspaceXml]
    );

    // Resize the Blockly SVG when the container resizes
    useEffect(() => {
      if (!isReady || !containerRef.current || !workspaceRef.current) return;

      const workspace = workspaceRef.current;
      const Blockly = blocklyModuleRef.current;
      if (!Blockly) return;

      const observer = new ResizeObserver(() => {
        Blockly.svgResize(workspace);
      });

      observer.observe(containerRef.current);
      return () => observer.disconnect();
    }, [isReady]);

    return (
      <Card className="h-full rounded-2xl border-2 border-purple-200 shadow-md overflow-hidden">
        <CardContent className="h-full p-0">
          <div
            ref={containerRef}
            className="h-full w-full"
          />
        </CardContent>
      </Card>
    );
  }
);

BlocklyEditor.displayName = "BlocklyEditor";

export default BlocklyEditor;

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useDeleteNodeCallback } from "@/routes/workflows/hooks/useDeleteNodeCallback";
import { useNodeLabelChangeHandler } from "@/routes/workflows/hooks/useLabelChangeHandler";
import { Handle, NodeProps, Position, useReactFlow } from "@xyflow/react";
import { useState } from "react";
import { EditableNodeTitle } from "../components/EditableNodeTitle";
import { NodeActionMenu } from "../NodeActionMenu";
import type { ActionNode } from "./types";
import { HelpTooltip } from "@/components/HelpTooltip";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { errorMappingExampleValue } from "../types";
import { CodeEditor } from "@/routes/workflows/components/CodeEditor";
import { Switch } from "@/components/ui/switch";
import { ClickIcon } from "@/components/icons/ClickIcon";
import { placeholders, helpTooltips } from "../../helpContent";
import { WorkflowBlockInputTextarea } from "@/components/WorkflowBlockInputTextarea";
import { WorkflowBlockParameterSelect } from "../WorkflowBlockParameterSelect";

const urlTooltip =
  "The URL Skyvern is navigating to. Leave this field blank to pick up from where the last block left off.";
const navigationGoalTooltip =
  "Specify a single step or action you'd like Skyvern to complete. Actions are one-off tasks like filling a field or interacting with a specific element on the page.\n\nCurrently supported actions are click, input text, upload file, and select. Use {{ parameter_name }} to specify parameters to use.";

const navigationGoalPlaceholder = 'Input {{ name }} into "Name" field.';

function ActionNode({ id, data }: NodeProps<ActionNode>) {
  const [parametersPanelField, setParametersPanelField] = useState<
    string | null
  >(null);
  const { updateNodeData } = useReactFlow();
  const { editable } = data;
  const [label, setLabel] = useNodeLabelChangeHandler({
    id,
    initialValue: data.label,
  });
  const [inputs, setInputs] = useState({
    url: data.url,
    navigationGoal: data.navigationGoal,
    errorCodeMapping: data.errorCodeMapping,
    maxRetries: data.maxRetries,
    allowDownloads: data.allowDownloads,
    continueOnFailure: data.continueOnFailure,
    cacheActions: data.cacheActions,
    downloadSuffix: data.downloadSuffix,
    totpVerificationUrl: data.totpVerificationUrl,
    totpIdentifier: data.totpIdentifier,
  });
  const deleteNodeCallback = useDeleteNodeCallback();

  function handleChange(key: string, value: unknown) {
    if (!editable) {
      return;
    }
    setInputs({ ...inputs, [key]: value });
    updateNodeData(id, { [key]: value });
  }

  return (
    <div>
      <Handle
        type="source"
        position={Position.Bottom}
        id="a"
        className="opacity-0"
      />
      <Handle
        type="target"
        position={Position.Top}
        id="b"
        className="opacity-0"
      />
      <div className="w-[30rem] space-y-4 rounded-lg bg-slate-elevation3 px-6 py-4">
        <header className="flex h-[2.75rem] justify-between">
          <div className="flex gap-2">
            <div className="flex h-[2.75rem] w-[2.75rem] items-center justify-center rounded border border-slate-600">
              <ClickIcon className="size-6" />
            </div>
            <div className="flex flex-col gap-1">
              <EditableNodeTitle
                value={label}
                editable={editable}
                onChange={setLabel}
                titleClassName="text-base"
                inputClassName="text-base"
              />
              <span className="text-xs text-slate-400">Action Block</span>
            </div>
          </div>
          <NodeActionMenu
            onDelete={() => {
              deleteNodeCallback(id);
            }}
          />
        </header>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex gap-2">
              <Label className="text-xs text-slate-300">URL</Label>
              <HelpTooltip content={urlTooltip} />
            </div>
            <WorkflowBlockInputTextarea
              onIconClick={() => {
                setParametersPanelField("url");
              }}
              onChange={(event) => {
                if (!editable) {
                  return;
                }
                handleChange("url", event.target.value);
              }}
              value={inputs.url}
              placeholder={placeholders["action"]["url"]}
              className="nopan text-xs"
            />
          </div>
          <div className="space-y-2">
            <div className="flex gap-2">
              <Label className="text-xs text-slate-300">
                Action Instruction
              </Label>
              <HelpTooltip content={navigationGoalTooltip} />
            </div>
            <WorkflowBlockInputTextarea
              onIconClick={() => {
                setParametersPanelField("navigationGoal");
              }}
              onChange={(event) => {
                if (!editable) {
                  return;
                }
                handleChange("navigationGoal", event.target.value);
              }}
              value={inputs.navigationGoal}
              placeholder={navigationGoalPlaceholder}
              className="nopan text-xs"
            />
          </div>
          <div className="rounded-md bg-slate-800 p-2">
            <div className="space-y-1 text-xs text-slate-400">
              Tip: While executing the action block, Skyvern will only take one
              action.
            </div>
          </div>
        </div>
        <Separator />
        <Accordion type="single" collapsible>
          <AccordionItem value="advanced" className="border-b-0">
            <AccordionTrigger className="py-0">
              Advanced Settings
            </AccordionTrigger>
            <AccordionContent className="pl-6 pr-1 pt-1">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <Label className="text-xs font-normal text-slate-300">
                      Max Retries
                    </Label>
                    <HelpTooltip
                      content={helpTooltips["action"]["maxRetries"]}
                    />
                  </div>
                  <Input
                    type="number"
                    placeholder={placeholders["action"]["maxRetries"]}
                    className="nopan w-52 text-xs"
                    min="0"
                    value={inputs.maxRetries ?? ""}
                    onChange={(event) => {
                      if (!editable) {
                        return;
                      }
                      const value =
                        event.target.value === ""
                          ? null
                          : Number(event.target.value);
                      handleChange("maxRetries", value);
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex gap-4">
                    <div className="flex gap-2">
                      <Label className="text-xs font-normal text-slate-300">
                        Error Messages
                      </Label>
                      <HelpTooltip
                        content={helpTooltips["action"]["errorCodeMapping"]}
                      />
                    </div>
                    <Checkbox
                      checked={inputs.errorCodeMapping !== "null"}
                      disabled={!editable}
                      onCheckedChange={(checked) => {
                        if (!editable) {
                          return;
                        }
                        handleChange(
                          "errorCodeMapping",
                          checked
                            ? JSON.stringify(errorMappingExampleValue, null, 2)
                            : "null",
                        );
                      }}
                    />
                  </div>
                  {inputs.errorCodeMapping !== "null" && (
                    <div>
                      <CodeEditor
                        language="json"
                        value={inputs.errorCodeMapping}
                        onChange={(value) => {
                          if (!editable) {
                            return;
                          }
                          handleChange("errorCodeMapping", value);
                        }}
                        className="nowheel nopan"
                        fontSize={8}
                      />
                    </div>
                  )}
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <Label className="text-xs font-normal text-slate-300">
                      Continue on Failure
                    </Label>
                    <HelpTooltip
                      content={helpTooltips["action"]["continueOnFailure"]}
                    />
                  </div>
                  <div className="w-52">
                    <Switch
                      checked={inputs.continueOnFailure}
                      onCheckedChange={(checked) => {
                        if (!editable) {
                          return;
                        }
                        handleChange("continueOnFailure", checked);
                      }}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <Label className="text-xs font-normal text-slate-300">
                      Cache Actions
                    </Label>
                    <HelpTooltip
                      content={helpTooltips["action"]["cacheActions"]}
                    />
                  </div>
                  <div className="w-52">
                    <Switch
                      checked={inputs.cacheActions}
                      onCheckedChange={(checked) => {
                        if (!editable) {
                          return;
                        }
                        handleChange("cacheActions", checked);
                      }}
                    />
                  </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <Label className="text-xs font-normal text-slate-300">
                      Complete on Download
                    </Label>
                    <HelpTooltip
                      content={helpTooltips["action"]["completeOnDownload"]}
                    />
                  </div>
                  <div className="w-52">
                    <Switch
                      checked={inputs.allowDownloads}
                      onCheckedChange={(checked) => {
                        if (!editable) {
                          return;
                        }
                        handleChange("allowDownloads", checked);
                      }}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <Label className="text-xs font-normal text-slate-300">
                      File Suffix
                    </Label>
                    <HelpTooltip
                      content={helpTooltips["action"]["fileSuffix"]}
                    />
                  </div>
                  <Input
                    type="text"
                    placeholder={placeholders["action"]["downloadSuffix"]}
                    className="nopan w-52 text-xs"
                    value={inputs.downloadSuffix ?? ""}
                    onChange={(event) => {
                      if (!editable) {
                        return;
                      }
                      handleChange("downloadSuffix", event.target.value);
                    }}
                  />
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Label className="text-xs text-slate-300">
                      2FA Verification URL
                    </Label>
                    <HelpTooltip
                      content={helpTooltips["action"]["totpVerificationUrl"]}
                    />
                  </div>
                  <WorkflowBlockInputTextarea
                    onIconClick={() => {
                      setParametersPanelField("totpVerificationUrl");
                    }}
                    onChange={(event) => {
                      handleChange("totpVerificationUrl", event.target.value);
                    }}
                    value={inputs.totpVerificationUrl ?? ""}
                    placeholder={placeholders["action"]["totpVerificationUrl"]}
                    className="nopan text-xs"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Label className="text-xs text-slate-300">
                      2FA Identifier
                    </Label>
                    <HelpTooltip
                      content={helpTooltips["action"]["totpIdentifier"]}
                    />
                  </div>
                  <WorkflowBlockInputTextarea
                    onIconClick={() => {
                      setParametersPanelField("totpIdentifier");
                    }}
                    onChange={(event) => {
                      if (!editable) {
                        return;
                      }
                      handleChange("totpIdentifier", event.target.value);
                    }}
                    value={inputs.totpIdentifier ?? ""}
                    placeholder={placeholders["action"]["totpIdentifier"]}
                    className="nopan text-xs"
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      {typeof parametersPanelField === "string" && (
        <WorkflowBlockParameterSelect
          nodeId={id}
          onClose={() => setParametersPanelField(null)}
          onAdd={(parameterKey) => {
            if (parametersPanelField === null || !editable) {
              return;
            }
            if (parametersPanelField in inputs) {
              const currentValue =
                inputs[parametersPanelField as keyof typeof inputs];
              handleChange(
                parametersPanelField,
                `${currentValue ?? ""}{{ ${parameterKey} }}`,
              );
            }
          }}
        />
      )}
    </div>
  );
}

export { ActionNode };

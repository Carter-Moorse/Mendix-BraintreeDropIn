/**
 * This file was generated from BraintreeDropIn.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix UI Content Team
 */
import { CSSProperties } from "react";
import { ActionValue, EditableValue } from "mendix";

export type BootstrapStyleEnum = "default" | "primary" | "success" | "info" | "inverse" | "warning" | "danger";

export type BraintreedropinTypeEnum = "badge" | "label";

export interface BraintreeDropInContainerProps {
    name: string;
    class: string;
    style?: CSSProperties;
    tabIndex?: number;
    valueAttribute?: EditableValue<string | BigJs.Big>;
    braintreedropinValue: string;
    bootstrapStyle: BootstrapStyleEnum;
    braintreedropinType: BraintreedropinTypeEnum;
    onClickAction?: ActionValue;
}

export interface BraintreeDropInPreviewProps {
    class: string;
    style: string;
    valueAttribute: string;
    braintreedropinValue: string;
    bootstrapStyle: BootstrapStyleEnum;
    braintreedropinType: BraintreedropinTypeEnum;
    onClickAction: {} | null;
}

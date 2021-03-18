/**
 * This file was generated from BraintreeDropIn.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix UI Content Team
 */
import { CSSProperties } from "react";
import { ActionValue, DynamicValue, EditableValue } from "mendix";

export type SubmitButtonStyleEnum = "default" | "primary" | "success" | "info" | "inverse" | "warning" | "danger";

export interface BraintreeDropInContainerProps {
    name: string;
    class: string;
    style?: CSSProperties;
    tabIndex?: number;
    clientToken: EditableValue<string>;
    clientOptions: DynamicValue<string>;
    nonce: EditableValue<string>;
    deviceData: EditableValue<string>;
    submitButtonStyle: SubmitButtonStyleEnum;
    submitButtonText: string;
    onFormSubmit?: ActionValue;
}

export interface BraintreeDropInPreviewProps {
    class: string;
    style: string;
    clientToken: string;
    clientOptions: string;
    nonce: string;
    deviceData: string;
    submitButtonStyle: SubmitButtonStyleEnum;
    submitButtonText: string;
    onFormSubmit: {} | null;
}

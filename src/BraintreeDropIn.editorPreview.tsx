import { Component, ReactNode, createElement } from "react";

import { parseInlineStyle } from "@mendix/pluggable-widgets-tools";

import { BadgeSample, BadgeSampleProps } from "./components/BadgeSample";
import { BraintreeDropInPreviewProps } from "../typings/BraintreeDropInProps";

declare function require(name: string): string;

export class preview extends Component<BraintreeDropInPreviewProps> {
    render(): ReactNode {
        return (
            <div ref={this.parentInline}>
                <BadgeSample {...this.transformProps(this.props)}></BadgeSample>
            </div>
        );
    }

    private parentInline(node?: HTMLElement | null): void {
        // Temporary fix, the web modeler add a containing div, to render inline we need to change it.
        if (node && node.parentElement && node.parentElement.parentElement) {
            node.parentElement.parentElement.style.display = "inline-block";
        }
    }

    private transformProps(props: BraintreeDropInPreviewProps): BadgeSampleProps {
        return {
            type: props.braintreedropinType,
            bootstrapStyle: props.bootstrapStyle,
            className: props.class,
            clickable: false,
            style: parseInlineStyle(props.style),
            defaultValue: props.braintreedropinValue ? props.braintreedropinValue : "",
            value: props.valueAttribute
        };
    }
}

export function getPreviewCss(): string {
    return require("./ui/BraintreeDropIn.css");
}

import { Component, ReactNode, createElement } from "react";

import { BraintreeDropInContainerProps } from "../typings/BraintreeDropInProps";
import { BadgeSample } from "./components/BadgeSample";
import "./ui/BraintreeDropIn.css";

export default class BraintreeDropIn extends Component<BraintreeDropInContainerProps> {
    private readonly onClickHandler = this.onClick.bind(this);

    render(): ReactNode {
        return (
            <BadgeSample
                type={this.props.braintreedropinType}
                bootstrapStyle={this.props.bootstrapStyle}
                className={this.props.class}
                clickable={!!this.props.onClickAction}
                defaultValue={this.props.braintreedropinValue ? this.props.braintreedropinValue : ""}
                onClickAction={this.onClickHandler}
                style={this.props.style}
                value={this.props.valueAttribute ? this.props.valueAttribute.displayValue : ""}
            ></BadgeSample>
        );
    }

    private onClick(): void {
        if (this.props.onClickAction && this.props.onClickAction.canExecute) {
            this.props.onClickAction.execute();
        }
    }
}

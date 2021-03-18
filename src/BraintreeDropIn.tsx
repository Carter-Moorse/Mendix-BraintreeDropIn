import { Component, ReactNode, createElement } from "react";

import * as braintree from "braintree-web-drop-in";

import { BraintreeDropInContainerProps } from "../typings/BraintreeDropInProps";
import { DropIn, SubmitButtonProps } from "./components/DropIn";
import "./ui/BraintreeDropIn.css";

export default class BraintreeDropIn extends Component<BraintreeDropInContainerProps> {
  handlePaymentMethod = (payload, deviceData) => {
    // ...
    this.props.deviceData.setValue(deviceData);
    this.props.nonce.setValue(payload.nonce);
    // Execute microflow
    if (this.props.onFormSubmit?.canExecute) this.props.onFormSubmit?.execute();
  }

  onCreate = (instance) => {
    console.log('onCreate', instance)
    // ...
  }

  onDestroyStart = () => {
    console.log('onDestroyStart')
    // ...
  }

  onDestroyEnd = () => {
    console.log('onDestroyEnd')
    // ...
  }

  onError = (error) => {
    console.log('onError', error)
    // ...
  }

  renderSubmitButton = (props: SubmitButtonProps) => {
    return (
      <button
        className={`btn btn-${this.props.submitButtonStyle}`}
        onClick={props.onClick}
        disabled={props.isDisabled}
      >{this.props.submitButtonText}</button>
    )
  }

  render(): ReactNode {
    // Grab client token
    const authorization: string | undefined = this.props.clientToken.value;
    // If client token exists
    if (authorization) {
      const options: braintree.Options = {
        authorization,
        container: ''
      }
      if (this.props.clientOptions.value) Object.assign(options, JSON.parse(this.props.clientOptions.value?.toString()))
      return (
        <DropIn
          options={options}
          handlePaymentMethod={this.handlePaymentMethod}
          onCreate={this.onCreate}
          onDestroyEnd={this.onDestroyEnd}
          onDestroyStart={this.onDestroyStart}
          onError={this.onError}
          className={this.props.class}
          renderSubmitButton={this.renderSubmitButton}
        ></DropIn>
      );
    } else {
      return null;
    }
  }
}

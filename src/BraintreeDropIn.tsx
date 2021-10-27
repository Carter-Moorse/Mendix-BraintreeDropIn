/// <reference types="../typings/MendixHelper" />

import { Component, ReactNode, createElement } from "react";

import * as braintree from "braintree-web-drop-in";

import { BraintreeDropInContainerProps } from "../typings/BraintreeDropInProps";
import { DropIn, SubmitButtonProps } from "./components/DropIn";
import "./ui/BraintreeDropIn.css";

export default class BraintreeDropIn extends Component<BraintreeDropInContainerProps> {
  progressBar: number | undefined;

  handlePaymentMethod = (payload) => {
    // ...
    this.props.deviceData.setValue(payload.deviceData);
    this.props.nonce.setValue(payload.nonce);
    // Execute microflow
    if (this.props.onFormSubmit?.canExecute && !this.props.onFormSubmit?.isExecuting) this.props.onFormSubmit?.execute();
  }

  onCreate = (instance) => {
    // console.log('onCreate', instance)
    // ...
    // Execute microflow
    if (this.props.onCreate?.canExecute) this.props.onCreate?.execute();
  }

  onDestroyStart = () => {
    // console.log('onDestroyStart')
    // ...
    // Execute microflow
    if (this.props.onDestroyStart?.canExecute) this.props.onDestroyStart?.execute();
  }

  onDestroyEnd = () => {
    // console.log('onDestroyEnd')
    // ...
    // Execute microflow
    if (this.props.onDestroyEnd?.canExecute) this.props.onDestroyEnd?.execute();
    this.hideProgress();
  }

  onError = (error) => {
    // console.log('onError', error)
    // ...
    // Execute microflow
    if (this.props.onError?.canExecute) this.props.onError?.execute();
    this.hideProgress();
  }

  showProgress = () => {
    if (this.progressBar === undefined) this.progressBar = this.props.submitProgress !== 'none' ? mx.ui.showProgress(this.props.submitProgressMessage, this.props.submitProgress === 'blocking' ? true : false) : undefined;
  }

  hideProgress = () => {
    if (this.progressBar !== undefined) mx.ui.hideProgress(this.progressBar);
    this.progressBar = undefined;
  }

  renderSubmitButton = (props: SubmitButtonProps) => {
    return (
      <button
        className={`btn btn-${this.props.submitButtonStyle} ${this.props.submitButtonClass}`}
        onClick={props.onClick}
        disabled={props.isDisabled || this.props.onFormSubmit?.isExecuting || !this.props.onFormSubmit?.canExecute}
      >{this.props.submitButtonText}</button>
    )
  }

  componentDidUpdate(prevProps) {
    // Check if submit status has changed?
    if (this.props.onFormSubmit?.isExecuting !== prevProps.onFormSubmit?.isExecuting) {
      // ... if so, show or hide the progress bar
      if (this.props.onFormSubmit?.isExecuting) {
        this.showProgress();
      } else {
        this.hideProgress();
      }
    }
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
          onSubmit={this.showProgress}
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

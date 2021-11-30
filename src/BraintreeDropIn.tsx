/// <reference types="../typings/MendixHelper" />

import { ValueStatus } from "mendix";
import { Component, ReactNode, createElement } from "react";

import * as braintree from "braintree-web-drop-in";

import { BraintreeDropInContainerProps } from "../typings/BraintreeDropInProps";
import { DropIn, SubmitButtonProps } from "./components/DropIn";
import "./ui/BraintreeDropIn.css";

export default class BraintreeDropIn extends Component<BraintreeDropInContainerProps> {
  progressBar: number | undefined;

  // Braintree handles
  handlePaymentMethod = (payload) => {
    // ...
    this.props.deviceData.setValue(payload.deviceData);
    this.props.nonce.setValue(payload.nonce);
    // Execute microflow
    if (this.props.event_onSubmit?.canExecute && !this.props.event_onSubmit?.isExecuting) this.props.event_onSubmit?.execute();
  }

  onCreate = (instance) => {
    // console.log('onCreate', instance)
    // ...
    // Execute microflow
    if (this.props.event_onCreate?.canExecute) this.props.event_onCreate?.execute();
  }

  onDestroyStart = () => {
    // console.log('onDestroyStart')
    // ...
    // Execute microflow
    if (this.props.event_onDestroyStart?.canExecute) this.props.event_onDestroyStart?.execute();
  }

  onDestroyEnd = () => {
    // console.log('onDestroyEnd')
    // ...
    // Execute microflow
    if (this.props.event_onDestroyEnd?.canExecute) this.props.event_onDestroyEnd?.execute();
    this.hideProgress();
  }

  onError = (error) => {
    // console.log('onError', error)
    // ...
    // Execute microflow
    if (this.props.event_onError?.canExecute) this.props.event_onError?.execute();
    this.hideProgress();
  }

  // Mendix functions
  showProgress = () => {
    if (this.progressBar === undefined) this.progressBar = this.props.event_onSubmit_progress !== 'none' ? mx.ui.showProgress(this.props.event_onSubmit_progressMessage, this.props.event_onSubmit_progress === 'blocking' ? true : false) : undefined;
  }

  hideProgress = () => {
    if (this.progressBar !== undefined) mx.ui.hideProgress(this.progressBar);
    this.progressBar = undefined;
  }

  // Custom submit button
  renderSubmitButton = (props: SubmitButtonProps) => {
    return (
      <button
        className={`btn btn-${this.props.style_submitButton_style} ${this.props.style_submitButton_class}`}
        onClick={props.onClick}
        disabled={props.isDisabled || this.props.event_onSubmit?.isExecuting || !this.props.event_onSubmit?.canExecute}
      >{this.props.style_submitButton_text}</button>
    )
  }

  /** 
   * Checks the status of all ``EditableValue`` fields to make sure they have a ``ValueStatus`` of ``Available``.
   */
  checkFields = (): boolean => {
    // Check the status of all the enabled props
    let status = (
      // Check option fields
      this.props.options_authorization?.status === ValueStatus.Available &&
      // Check PayPal fields
      (
        this.props.options_payPal ? 
        (!this.props.payPal_amount || this.props.payPal_amount?.status === ValueStatus.Available)
        : true
      ) &&
      // Check Apple Pay fields
      (
        this.props.options_applePay ?
        (!this.props.applePay_paymentRequest_amount || this.props.applePay_paymentRequest_amount?.status === ValueStatus.Available) &&
        (!this.props.applePay_paymentRequest_recurringPaymentStartDate || this.props.applePay_paymentRequest_recurringPaymentStartDate?.status === ValueStatus.Available) &&
        (!this.props.applePay_paymentRequest_recurringPaymentIntervalCount || this.props.applePay_paymentRequest_recurringPaymentIntervalCount?.status === ValueStatus.Available) &&
        (!this.props.applePay_paymentRequest_recurringPaymentEndDate || this.props.applePay_paymentRequest_recurringPaymentEndDate?.status === ValueStatus.Available) &&
        (!this.props.applePay_paymentRequest_deferredPaymentDate || this.props.applePay_paymentRequest_deferredPaymentDate?.status === ValueStatus.Available)
        : true
      ) &&
      // Check Google Pay fields
      (
        this.props.options_googlePay ?
        (!this.props.googlePay_transactionInfo_totalPrice || this.props.googlePay_transactionInfo_totalPrice?.status === ValueStatus.Available)
        : true
      ) &&
      // Check 3DS fields
      (
        this.props.options_threeDSecure ? 
        (!this.props.threeDS_amount || this.props.threeDS_amount?.status === ValueStatus.Available) &&
        (!this.props.threeDS_billing_countryCodeAlpha2 || this.props.threeDS_billing_countryCodeAlpha2?.status === ValueStatus.Available) &&
        (!this.props.threeDS_billing_extendedAddress || this.props.threeDS_billing_extendedAddress?.status === ValueStatus.Available) &&
        (!this.props.threeDS_billing_givenName || this.props.threeDS_billing_givenName?.status === ValueStatus.Available) &&
        (!this.props.threeDS_billing_lineThree || this.props.threeDS_billing_lineThree?.status === ValueStatus.Available) &&
        (!this.props.threeDS_billing_locality || this.props.threeDS_billing_locality?.status === ValueStatus.Available) &&
        (!this.props.threeDS_billing_phoneNumber || this.props.threeDS_billing_phoneNumber?.status === ValueStatus.Available) &&
        (!this.props.threeDS_billing_postalCode || this.props.threeDS_billing_postalCode?.status === ValueStatus.Available) &&
        (!this.props.threeDS_billing_streetAddress || this.props.threeDS_billing_streetAddress?.status === ValueStatus.Available) &&
        (!this.props.threeDS_billing_surname || this.props.threeDS_billing_surname?.status === ValueStatus.Available) &&
        (!this.props.threeDS_email || this.props.threeDS_email?.status === ValueStatus.Available) &&
        (!this.props.threeDS_mobilePhoneNumber || this.props.threeDS_mobilePhoneNumber?.status === ValueStatus.Available)
        : true
      )
    );
    // Check the status of Mendix object attributes
    if (status && this.props.card_overrides_fields.length) {
      for (var fieldOverride of this.props.card_overrides_fields) {
        status = status && (!fieldOverride.prefill || fieldOverride.prefill?.status === ValueStatus.Available);
      }
    }

    return status;
  }

  checkValue = (value: any): any | undefined => {
    if (typeof value === 'string') {
      if (value.trim() !== '') return value;
      else return undefined;
    }
    return value;
  }

  splitString = (value: String): Array<any> | undefined => {
    let newValue = this.checkValue(value);
    if (newValue !== undefined) return newValue.split(/\ *,\ */gm);
    return undefined
  }

  /** 
   * Generates the JSON structure for the "braintree-web-drop-in" ``create`` options.
   */
  getOptionsJSON = (): braintree.Options => {
    if (this.props.options_authorization?.value) {
      let options = {
        "authorization": this.props.options_authorization?.value,
        "container": "",
        "dataCollector": this.props.options_dataCollector,
        "locale": this.props.options_locale,
        "paymentOptionPriority": this.splitString(this.props.options_paymentOptionPriority),
        "preselectVaultedPaymentMethod": this.props.options_preselectVaultedPaymentMethod,
        "threeDSecure": this.props.options_threeDSecure,
        "venmo": this.props.options_venmo,
        "vaultManager": this.props.options_vaultManager,
      }
      // Card options
      if (this.props.options_card) {
        options["card"] = {
          "cardholderName": this.props.card_cardholderName_required ? { "required": true } : this.props.card_cardholderName,
          "clearFieldsAfterTokenization": this.props.card_clearFieldsAfterTokenization,
          "overrides": {
            "fields": {}, // Added below
            // "styles": {}
          },
          "vault" : {
            "allowVaultCardOverride": this.props.card_vault_allowVaultCardOverride,
            "vaultCard": this.props.card_vault_vaultCard
          }
        }
        // Field overrides
        if (this.props.card_overrides_fields.length) {
          // Ensure attributes
          if (!options["card"]["overrides"]) options["card"]["overrides"] = {};
          if (!options["card"]["overrides"]["fields"]) options["card"]["overrides"]["fields"] = {};
          // Loop through Mendix objects
          for (var fieldOverride of this.props.card_overrides_fields) {
            options["card"]["overrides"]["fields"][fieldOverride.fieldOptions] = {
              // "selector": ?,
              // "container": ?,
              "iframeTitle": this.checkValue(fieldOverride.iframeTitle),
              "internalLabel": this.checkValue(fieldOverride.internalLabel),
              "placeholder": this.checkValue(fieldOverride.placeholder),
              "type": this.checkValue(fieldOverride.type),
              "formatInput": fieldOverride.formatInput,
              "maskInput": fieldOverride.maskInput ? { "character": this.checkValue(fieldOverride.maskInput_character), "showLastFour": fieldOverride.maskInput_showLastFour } : false,
              "select": fieldOverride.select,
              "maxCardLength": fieldOverride.maxCardLength,
              "maxlength": fieldOverride.maxlength,
              "minlength": fieldOverride.minlength,
              "prefill": fieldOverride.prefill?.value,
              // "supportedCardBrands": ?
            }
          }
        }
      }
      else {
        options["card"] = this.props.options_card;
      }
      // PayPal options
      if (this.props.options_payPal) {
        options["paypal"] = {
          "amount": String(this.props.payPal_amount),
          "buttonStyle": {
            "color": this.props.payPal_buttonStyle_color,
            "label": this.props.payPal_buttonStyle_label,
            "shape": this.props.payPal_buttonStyle_shape,
            "size": this.props.payPal_buttonStyle_size,
            "tagline": this.props.payPal_buttonStyle_tagline
          },
          "commit": this.props.payPal_commit,
          "currency": this.checkValue(this.props.payPal_currency),
          "flow": this.props.payPal_flow
        }
      }
      // Apple Pay
      if (this.props.options_applePay) {
        options["applePay"] = {
          "applePaySessionVersion": this.props.applePay_applePaySessionVersion,
          "buttonStyle": this.props.applePay_buttonStyle.replace('_', '-'),
          "displayName": this.checkValue(this.props.applePay_displayName),
          "paymentRequest": { 
            // "billingContact": {
              // "phoneNumber": ?,
              // "emailAddress": ?,
              // "givenName": ?,
              // "familyName": ?,
              // "phoneticGivenName": ?,
              // "phoneticFamilyName": ?,
              // "addressLines": ?,
              // "subLocality": ?,
              // "locality": ?,
              // "postalCode": ?,
              // "subAdministrativeArea": ?,
              // "administrativeArea": ?,
              // "country": ?,
              // "countryCode": ?
            // },
            "countryCode": this.checkValue(this.props.applePay_paymentRequest_countryCode),
            "currencyCode": this.checkValue(this.props.applePay_paymentRequest_currencyCode),
            "merchantCapabilities": this.splitString(this.props.applePay_paymentRequest_merchantCapabilities),
            "requiredBillingContactFields": this.splitString(this.props.applePay_paymentRequest_requiredBillingContactFields),
            // "requiredShippingContactFields": ["email", "name", "phone", "postalAddress"],
            // "shippingContact": {
              // "phoneNumber": ?,
              // "emailAddress": ?,
              // "givenName": ?,
              // "familyName": ?,
              // "phoneticGivenName": ?,
              // "phoneticFamilyName": ?,
              // "addressLines": ?,
              // "subLocality": ?,
              // "locality": ?,
              // "postalCode": ?,
              // "subAdministrativeArea": ?,
              // "administrativeArea": ?,
              // "country": ?,
              // "countryCode": ?
            // },
            // "shippingMethods": [
            //   {
            //     "label": "Free Shipping",
            //     "detail": "Arrives in 5 to 7 days",
            //     "amount": "0.00",
            //     "identifier": "FreeShip",
            //     "dateComponentsRange": {
            //       "startDateComponents": {
            //         "years": 0,
            //         "months": 0,
            //         "days": 0,
            //         "hours": 0
            //       },
            //       "endDateComponents": {
            //         "years": 0,
            //         "months": 0,
            //         "days": 0,
            //         "hours": 0
            //       }
            //     }
            //   }
            // ],
            // "shippingType": "shipping" |"delivery" | "storePickup" | "servicePickup",
            "supportedNetworks": this.splitString(this.props.applePay_paymentRequest_supportedNetworks),
            "total": {
              "amount": String(this.props.applePay_paymentRequest_amount),
              "label": this.checkValue(this.props.applePay_paymentRequest_label)
            }
          }
        }
      }
      // Google Pay
      if (this.props.options_googlePay) {
        options["googlePay"] = {
          "button": {
            "buttonColor": this.props.googlePay_button_buttonColor,
            // "buttonLocale": ?,
            "buttonSizeMode": this.props.googlePay_button_buttonSizeMode,
            "buttonType": this.props.googlePay_button_buttonType
          },
          "googlePayVersion": String(this.props.googlePay_googlePayVersion),
          "merchantId": this.checkValue(this.props.googlePay_merchantId),
          "transactionInfo": {
            "checkoutOption": this.props.googlePay_transactionInfo_checkoutOption,
            "countryCode": this.checkValue(this.props.googlePay_transactionInfo_countryCode),
            "currencyCode": this.checkValue(this.props.googlePay_transactionInfo_currencyCode),
            // "displayItems": ?,
            "totalPrice": String(this.props.googlePay_transactionInfo_totalPrice),
            "totalPriceLabel": this.checkValue(this.props.googlePay_transactionInfo_totalPriceLabel),
            "totalPriceStatus": this.props.googlePay_transactionInfo_totalPriceStatus,
            // "transactionId": ?,
            // "transactionNote": ?
          }
        }
      }
      return options;
    }
    throw Error('Authorization missing');
  }

  /** 
   * Generates the JSON structure for the "braintree-web-drop-in" ``requestPaymentMethod`` options.
   */
  getPaymentMethodOptions = (): braintree.PaymentMethodOptions | undefined => {
    if (this.props.options_threeDSecure) {
      let paymentMethodOptions: braintree.PaymentMethodOptions = {
        threeDSecure: {
          "amount": String(this.props.threeDS_amount?.value),
          "email": this.checkValue(this.props.threeDS_email?.value),
          "mobilePhoneNumber": this.checkValue(this.props.threeDS_mobilePhoneNumber?.value?.replace(/[0-9]/gm, '')), // Replace all non-numeric
          "billingAddress": {
            "givenName": this.checkValue(this.props.threeDS_billing_givenName?.value),
            "surname": this.checkValue(this.props.threeDS_billing_surname?.value),
            "phoneNumber": this.checkValue(this.props.threeDS_billing_phoneNumber?.value?.replace(/[0-9]/gm, '')), // Replace all non-numeric
            "streetAddress": this.checkValue(this.props.threeDS_billing_streetAddress?.value),
            "extendedAddress": this.checkValue(this.props.threeDS_billing_extendedAddress?.value),
            "line3": this.checkValue(this.props.threeDS_billing_lineThree?.value),
            "locality": this.checkValue(this.props.threeDS_billing_locality?.value),
            "postalCode": this.checkValue(this.props.threeDS_billing_postalCode?.value),
            "countryCodeAlpha2": this.checkValue(this.props.threeDS_billing_countryCodeAlpha2?.value)
          }
        }
      }
      return paymentMethodOptions;
    }
    return undefined;
  }


  getSnapshotBeforeUpdate(prevProps) {

  }

  // React handles
  componentDidUpdate(prevProps) {
    // Check if submit status has changed?
    if (this.props.event_onSubmit?.isExecuting !== prevProps.event_onSubmit?.isExecuting) {
      // ... if so, show or hide the progress bar
      if (this.props.event_onSubmit?.isExecuting) {
        this.showProgress();
      } else {
        this.hideProgress();
      }
    }
  }

  render(): ReactNode {
    try {
      if (this.checkFields()) {
          const options: braintree.Options = this.getOptionsJSON();
          const paymentMethodOptions: braintree.PaymentMethodOptions | undefined = this.getPaymentMethodOptions();
          return (
            <DropIn
              options={options}
              paymentMethodOptions={paymentMethodOptions}
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
      }
      else {
        return null;
      }
    }
    catch(err) {
      let message = err instanceof Error ? err.message : 'An error occurred';
      return (<p className="alert alert-danger">{ message }</p>);
    }
  }
}

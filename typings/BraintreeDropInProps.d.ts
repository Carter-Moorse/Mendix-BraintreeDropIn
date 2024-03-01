/**
 * This file was generated from BraintreeDropIn.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix Widgets Framework Team
 */
import { CSSProperties } from "react";
import { ActionValue, DynamicValue, EditableValue, ListValue, ListAttributeValue } from "mendix";
import { Big } from "big.js";

export type Options_localeEnum = "ar_EG" | "cs_CZ" | "da_DK" | "de_DE" | "el_GR" | "en_AU" | "en_GB" | "en_IN" | "en_US" | "es_ES" | "es_XC" | "fi_FI" | "fr_CA" | "fr_FR" | "fr_XC" | "he_IL" | "hu_HU" | "id_ID" | "it_IT" | "ja_JP" | "ko_KR" | "nl_NL" | "no_NO" | "pl_PL" | "pt_BR" | "pt_PT" | "ru_RU" | "sk_SK" | "sv_SE" | "th_TH" | "zh_CN" | "zh_HK" | "zh_TW" | "zh_XC";

export type FieldOptionsEnum = "number" | "expirationDate" | "cvv" | "postalCode" | "cardholderName";

export interface Card_overrides_fieldsType {
    fieldOptions: FieldOptionsEnum;
    placeholder: string;
    type: string;
    iframeTitle: string;
    internalLabel: string;
    prefill?: DynamicValue<string>;
    formatInput: boolean;
    maskInput: boolean;
    maskInput_character: string;
    maskInput_showLastFour: boolean;
    select: boolean;
    maxCardLength: number;
    maxlength: number;
    minlength: number;
}

export type PayPal_flowEnum = "checkout" | "vault";

export type PayPal_buttonStyle_colorEnum = "gold" | "blue" | "silver" | "black";

export type PayPal_buttonStyle_shapeEnum = "pill" | "rect";

export type PayPal_buttonStyle_sizeEnum = "small" | "medium" | "large" | "responsive";

export type PayPal_buttonStyle_labelEnum = "checkout" | "credit" | "pay" | "buynow" | "paypal";

export type ApplePay_paymentRequest_total_typeEnum = "final" | "pending";

export type ApplePay_buttonStyleEnum = "black" | "white" | "white_outline";

export type GooglePay_transactionInfo_totalPriceStatusEnum = "NOT_CURRENTLY_KNOWN" | "ESTIMATED" | "FINAL";

export type GooglePay_transactionInfo_checkoutOptionEnum = "DEFAULT" | "COMPLETE_IMMEDIATE_PURCHASE";

export type GooglePay_button_buttonColorEnum = "default" | "black" | "white";

export type GooglePay_button_buttonTypeEnum = "book" | "buy" | "checkout" | "donate" | "order" | "pay" | "plain" | "subscribe";

export type GooglePay_button_buttonSizeModeEnum = "static" | "fill";

export type Style_submitButton_styleEnum = "default" | "primary" | "success" | "info" | "inverse" | "warning" | "danger";

export type Event_onSubmit_progressEnum = "none" | "nonBlocking" | "blocking";

export interface Card_overrides_fieldsPreviewType {
    fieldOptions: FieldOptionsEnum;
    placeholder: string;
    type: string;
    iframeTitle: string;
    internalLabel: string;
    prefill: string;
    formatInput: boolean;
    maskInput: boolean;
    maskInput_character: string;
    maskInput_showLastFour: boolean;
    select: boolean;
    maxCardLength: number | null;
    maxlength: number | null;
    minlength: number | null;
}

export interface BraintreeDropInContainerProps {
    name: string;
    class: string;
    style?: CSSProperties;
    tabIndex?: number;
    nonce: EditableValue<string>;
    deviceData: EditableValue<string>;
    options_authorization: EditableValue<string>;
    totalAmount: EditableValue<Big>;
    currencyCode: EditableValue<string>;
    countryCode: EditableValue<string>;
    lineItems_data?: ListValue;
    options_card: DynamicValue<boolean>;
    options_payPal: DynamicValue<boolean>;
    options_venmo: DynamicValue<boolean>;
    options_applePay: DynamicValue<boolean>;
    options_googlePay: DynamicValue<boolean>;
    options_paymentOptionPriority: string;
    options_threeDSecure: boolean;
    options_locale: Options_localeEnum;
    options_dataCollector: boolean;
    options_vaultManager: boolean;
    options_preselectVaultedPaymentMethod: boolean;
    card_clearFieldsAfterTokenization: boolean;
    card_vault_allowVaultCardOverride: boolean;
    card_vault_vaultCard: boolean;
    card_cardholderName: boolean;
    card_cardholderName_required: boolean;
    card_overrides_fields: Card_overrides_fieldsType[];
    payPal_flow: PayPal_flowEnum;
    payPal_commit: boolean;
    payPal_vault_vaultPayPal: boolean;
    payPal_buttonStyle_color: PayPal_buttonStyle_colorEnum;
    payPal_buttonStyle_shape: PayPal_buttonStyle_shapeEnum;
    payPal_buttonStyle_size: PayPal_buttonStyle_sizeEnum;
    payPal_buttonStyle_label: PayPal_buttonStyle_labelEnum;
    payPal_buttonStyle_tagline: boolean;
    payPal_lineItems_quantity?: ListAttributeValue<Big>;
    payPal_lineItems_unitAmount?: ListAttributeValue<Big>;
    payPal_lineItems_name?: ListAttributeValue<string>;
    payPal_lineItems_kind?: ListAttributeValue<string>;
    payPal_lineItems_unitTaxAmount?: ListAttributeValue<Big>;
    payPal_lineItems_description?: ListAttributeValue<string>;
    payPal_lineItems_productCode?: ListAttributeValue<string>;
    payPal_lineItems_url?: ListAttributeValue<string>;
    applePay_applePaySessionVersion: number;
    applePay_paymentRequest_total_type: ApplePay_paymentRequest_total_typeEnum;
    applePay_paymentRequest_total_label?: EditableValue<string>;
    applePay_displayName?: EditableValue<string>;
    applePay_paymentRequest_merchantCapabilities?: DynamicValue<string>;
    applePay_paymentRequest_supportedNetworks?: DynamicValue<string>;
    applePay_paymentRequest_requiredBillingContactFields?: DynamicValue<string>;
    applePay_buttonStyle: ApplePay_buttonStyleEnum;
    applePay_paymentRequest_lineItem_type?: ListAttributeValue<string>;
    applePay_paymentRequest_lineItem_label?: ListAttributeValue<string>;
    applePay_paymentRequest_lineItem_amount?: ListAttributeValue<Big>;
    googlePay_googlePayVersion: number;
    googlePay_merchantId?: DynamicValue<string>;
    googlePay_transactionInfo_totalPriceStatus: GooglePay_transactionInfo_totalPriceStatusEnum;
    googlePay_transactionInfo_totalPriceLabel?: EditableValue<string>;
    googlePay_transactionInfo_checkoutOption: GooglePay_transactionInfo_checkoutOptionEnum;
    googlePay_button_buttonColor: GooglePay_button_buttonColorEnum;
    googlePay_button_buttonType: GooglePay_button_buttonTypeEnum;
    googlePay_button_buttonSizeMode: GooglePay_button_buttonSizeModeEnum;
    googlePay_transactionInfo_displayItems_label?: ListAttributeValue<string>;
    googlePay_transactionInfo_displayItems_type?: ListAttributeValue<string>;
    googlePay_transactionInfo_displayItems_price?: ListAttributeValue<Big>;
    googlePay_transactionInfo_displayItems_status?: ListAttributeValue<string>;
    threeDS_challengeRequested: boolean;
    threeDS_exemptionRequested: boolean;
    threeDS_collectDeviceData: boolean;
    threeDS_email?: EditableValue<string>;
    threeDS_mobilePhoneNumber?: EditableValue<string>;
    threeDS_additionalInformation_ipAddress?: EditableValue<string>;
    threeDS_billing_givenName?: EditableValue<string>;
    threeDS_billing_surname?: EditableValue<string>;
    threeDS_billing_phoneNumber?: EditableValue<string>;
    threeDS_billing_streetAddress?: EditableValue<string>;
    threeDS_billing_extendedAddress?: EditableValue<string>;
    threeDS_billing_lineThree?: EditableValue<string>;
    threeDS_billing_locality?: EditableValue<string>;
    threeDS_billing_region?: EditableValue<string>;
    threeDS_billing_postalCode?: EditableValue<string>;
    threeDS_billing_countryCodeAlpha2?: EditableValue<string>;
    style_submitButton_style: Style_submitButton_styleEnum;
    style_submitButton_class: string;
    style_submitButton_text: string;
    event_onSubmit?: ActionValue;
    event_onSubmit_progress: Event_onSubmit_progressEnum;
    event_onSubmit_progressMessage: string;
    event_onCreate?: ActionValue;
    event_onDestroyStart?: ActionValue;
    event_onDestroyEnd?: ActionValue;
    event_onError?: ActionValue;
}

export interface BraintreeDropInPreviewProps {
    /**
     * @deprecated Deprecated since version 9.18.0. Please use class property instead.
     */
    className: string;
    class: string;
    style: string;
    styleObject?: CSSProperties;
    readOnly: boolean;
    nonce: string;
    deviceData: string;
    options_authorization: string;
    totalAmount: string;
    currencyCode: string;
    countryCode: string;
    lineItems_data: {} | { caption: string } | { type: string } | null;
    options_card: string;
    options_payPal: string;
    options_venmo: string;
    options_applePay: string;
    options_googlePay: string;
    options_paymentOptionPriority: string;
    options_threeDSecure: boolean;
    options_locale: Options_localeEnum;
    options_dataCollector: boolean;
    options_vaultManager: boolean;
    options_preselectVaultedPaymentMethod: boolean;
    card_clearFieldsAfterTokenization: boolean;
    card_vault_allowVaultCardOverride: boolean;
    card_vault_vaultCard: boolean;
    card_cardholderName: boolean;
    card_cardholderName_required: boolean;
    card_overrides_fields: Card_overrides_fieldsPreviewType[];
    payPal_flow: PayPal_flowEnum;
    payPal_commit: boolean;
    payPal_vault_vaultPayPal: boolean;
    payPal_buttonStyle_color: PayPal_buttonStyle_colorEnum;
    payPal_buttonStyle_shape: PayPal_buttonStyle_shapeEnum;
    payPal_buttonStyle_size: PayPal_buttonStyle_sizeEnum;
    payPal_buttonStyle_label: PayPal_buttonStyle_labelEnum;
    payPal_buttonStyle_tagline: boolean;
    payPal_lineItems_quantity: string;
    payPal_lineItems_unitAmount: string;
    payPal_lineItems_name: string;
    payPal_lineItems_kind: string;
    payPal_lineItems_unitTaxAmount: string;
    payPal_lineItems_description: string;
    payPal_lineItems_productCode: string;
    payPal_lineItems_url: string;
    applePay_applePaySessionVersion: number | null;
    applePay_paymentRequest_total_type: ApplePay_paymentRequest_total_typeEnum;
    applePay_paymentRequest_total_label: string;
    applePay_displayName: string;
    applePay_paymentRequest_merchantCapabilities: string;
    applePay_paymentRequest_supportedNetworks: string;
    applePay_paymentRequest_requiredBillingContactFields: string;
    applePay_buttonStyle: ApplePay_buttonStyleEnum;
    applePay_paymentRequest_lineItem_type: string;
    applePay_paymentRequest_lineItem_label: string;
    applePay_paymentRequest_lineItem_amount: string;
    googlePay_googlePayVersion: number | null;
    googlePay_merchantId: string;
    googlePay_transactionInfo_totalPriceStatus: GooglePay_transactionInfo_totalPriceStatusEnum;
    googlePay_transactionInfo_totalPriceLabel: string;
    googlePay_transactionInfo_checkoutOption: GooglePay_transactionInfo_checkoutOptionEnum;
    googlePay_button_buttonColor: GooglePay_button_buttonColorEnum;
    googlePay_button_buttonType: GooglePay_button_buttonTypeEnum;
    googlePay_button_buttonSizeMode: GooglePay_button_buttonSizeModeEnum;
    googlePay_transactionInfo_displayItems_label: string;
    googlePay_transactionInfo_displayItems_type: string;
    googlePay_transactionInfo_displayItems_price: string;
    googlePay_transactionInfo_displayItems_status: string;
    threeDS_challengeRequested: boolean;
    threeDS_exemptionRequested: boolean;
    threeDS_collectDeviceData: boolean;
    threeDS_email: string;
    threeDS_mobilePhoneNumber: string;
    threeDS_additionalInformation_ipAddress: string;
    threeDS_billing_givenName: string;
    threeDS_billing_surname: string;
    threeDS_billing_phoneNumber: string;
    threeDS_billing_streetAddress: string;
    threeDS_billing_extendedAddress: string;
    threeDS_billing_lineThree: string;
    threeDS_billing_locality: string;
    threeDS_billing_region: string;
    threeDS_billing_postalCode: string;
    threeDS_billing_countryCodeAlpha2: string;
    style_submitButton_style: Style_submitButton_styleEnum;
    style_submitButton_class: string;
    style_submitButton_text: string;
    event_onSubmit: {} | null;
    event_onSubmit_progress: Event_onSubmit_progressEnum;
    event_onSubmit_progressMessage: string;
    event_onCreate: {} | null;
    event_onDestroyStart: {} | null;
    event_onDestroyEnd: {} | null;
    event_onError: {} | null;
}

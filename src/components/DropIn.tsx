import { Component, createElement } from "react";

import dropin from "braintree-web-drop-in";

export interface SubmitButtonProps {
  onClick: ((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void) | undefined,
  isDisabled: boolean
}

const renderSubmitButton = (props: SubmitButtonProps) => <button onClick={props.onClick} disabled={props.isDisabled}>Purchase</button>

export interface DropInProps {
  options: dropin.Options,
  paymentMethodOptions?: dropin.PaymentMethodOptions,
  handlePaymentMethod: (payload: dropin.PaymentMethodPayload) => void,
  onSubmit?: () => void,
  onCreate?: (instance: dropin.Dropin | undefined) => void,
  onError?: (error: object) => void,
  onDestroyStart?: () => void,
  onDestroyEnd?: (error: object | null | undefined) => void,
  className: string,
  renderSubmitButton: (props: SubmitButtonProps) => JSX.Element
}

export interface DropInState {
  dropInInstance: dropin.Dropin | undefined,
  isSubmitButtonDisabled: boolean
}

export class DropIn extends Component<DropInProps, DropInState> {
  static defaultProps = {
    className: 'braintree-dropin-react',
    renderSubmitButton
  }

  constructor(props: DropInProps) {
    super(props)
    this.state = {
      dropInInstance: undefined,
      isSubmitButtonDisabled: true
    }
  }

  componentDidMount = () => {
    if (!dropin || this.state.dropInInstance) return
    this.setup()
  }

  componentDidUpdate = (prevProps: DropInProps, prevState: DropInState) => {
    if (this.state.dropInInstance !== prevState.dropInInstance && prevProps.options !== this.props.options) {
      this.tearDown().then(() => {
        this.setState({
          dropInInstance: undefined,
          isSubmitButtonDisabled: true
        }, () => {
          this.setup();
        })
      }).catch((err) => {
        this.props.onError?.(err);
      })
    }
  }

  componentWillUnmount = () => {
    if (!this.state.dropInInstance) return

    this.tearDown().catch((err) => {
      this.props.onError?.(err);
    })
  }

  // ?
  // getDeviceData = () => {
  //   return new Promise<string>((resolve, reject) => {
  //     braintreeWeb.client.create({
  //       authorization: this.props.options.authorization
  //     }).then((clientInstance) => {
  //       braintreeWeb.dataCollector.create({
  //         client: clientInstance
  //       }).then((dataCollectorInstance) => {
  //         resolve(dataCollectorInstance.deviceData);
  //       });
  //     }).catch(function (err) {
  //       reject(err);
  //     });
  //   })
  // }

  setup = () => {
    const options: dropin.Options = this.props.options;
    options.container = '.braintree-dropin-react-form';
    dropin.create(options, (err, dropinInstance) => {
      // Execute events
      if (err) {
        this.props.onError?.(err);
        return;
      } else {
        this.props.onCreate?.(dropinInstance);
      }
      // Setting states
      if (dropinInstance) {
        if (dropinInstance.isPaymentMethodRequestable()) {
          this.setState({
            isSubmitButtonDisabled: false
          })
        }

        dropinInstance.on('paymentMethodRequestable', () => {
          this.setState({
            isSubmitButtonDisabled: false
          })
        })

        dropinInstance.on('noPaymentMethodRequestable', () => {
          this.setState({
            isSubmitButtonDisabled: true
          })
        })

        this.setState({
          dropInInstance: dropinInstance
        })
      }
      // Throw custom error
      else {
        this.props.onError?.(new Error('No dropinInstance'));
      }
    })
  }

  tearDown = () => {
    // Execute events
    this.props.onDestroyStart?.();
    // Synchronous callback -> Asynchronous callback
    return new Promise<void>((resolve, reject) => {
      if (this.state.dropInInstance) {
        // Start teardown
        this.state.dropInInstance.teardown((err) => {
          // Execute callback
          this.props.onDestroyEnd?.(err);
          // Return result
          if (err) {
            return reject(err)
          } else {
            return resolve()
          }
        })
      }
    })
  }

  handleSubmit = () => {
    // Validate state
    if (this.state.dropInInstance && !this.state.isSubmitButtonDisabled) {
      // Change state
      this.setState({ isSubmitButtonDisabled: true }, () => {
        if (this.state.dropInInstance) {
          // Execute events
          this.props.onSubmit?.();
          // Request payment method
          if (this.props.paymentMethodOptions) {
            this.state.dropInInstance.requestPaymentMethod(this.props.paymentMethodOptions, this.requestPaymentMethod);
          }
          else {
            this.state.dropInInstance.requestPaymentMethod(this.requestPaymentMethod);
          }
        } 
        // Throw custom error
        else {
          this.props.onError?.(new Error('No dropinInstance'));
        }
      })
    }
  }

  requestPaymentMethod = (err, payload) => {
    this.setState({
      isSubmitButtonDisabled: false
    });

    if (err) {
      this.props.onError?.(err);
    } else {
      // Execute events
      this.props.handlePaymentMethod(payload);
    }
  }

  render = () => {
    return (
      <div className={this.props.className}>
        <div className='braintree-dropin-react-form' />
        <div className='braintree-dropin-react-submit-btn-wrapper'>
          {this.props.renderSubmitButton({
            onClick: this.handleSubmit,
            isDisabled: this.state.isSubmitButtonDisabled
          })}
        </div>
      </div>
    )
  }
}

export default DropIn

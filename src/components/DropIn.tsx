import { Component, createElement } from "react";

import * as braintreeDropIn from "braintree-web-drop-in";
import * as braintreeWeb from "braintree-web";

export interface SubmitButtonProps {
  onClick: ((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void) | undefined,
  isDisabled: boolean
}

const renderSubmitButton = (props: SubmitButtonProps) => <button onClick={props.onClick} disabled={props.isDisabled}>Purchase</button>

export interface DropInProps {
  options: braintreeDropIn.Options,
  handlePaymentMethod: (payload: braintreeDropIn.PaymentMethodPayload) => void,
  onSubmit?: () => void,
  onCreate?: (instance: braintreeDropIn.Dropin | undefined) => void,
  onError?: (error: object) => void,
  onDestroyStart?: () => void,
  onDestroyEnd?: (error: object | null | undefined) => void,
  className: string,
  renderSubmitButton: (props: SubmitButtonProps) => JSX.Element
}

export interface DropInState {
  dropInInstance: braintreeDropIn.Dropin | undefined,
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
    if (!braintreeDropIn || this.state.dropInInstance) return
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
  getDeviceData = () => {
    return new Promise<string>((resolve, reject) => {
      braintreeWeb.client.create({
        authorization: this.props.options.authorization
      }).then((clientInstance) => {
        braintreeWeb.dataCollector.create({
          client: clientInstance
        }).then((dataCollectorInstance) => {
          resolve(dataCollectorInstance.deviceData);
        });
      }).catch(function (err) {
        reject(err);
      });
    })
  }

  setup = () => {
    const options: braintreeDropIn.Options = this.props.options;
    options.container = '.braintree-dropin-react-form';
    options.dataCollector = true;
    braintreeDropIn.create(options, (err, dropinInstance) => {
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
          this.state.dropInInstance.requestPaymentMethod((err, payload) => {
            this.setState({
              isSubmitButtonDisabled: false
            })
            if (err) {
              this.props.onError?.(err);
            } else {
              // Execute events
              this.props.handlePaymentMethod(payload);
            }
          })
        } 
        // Throw custom error
        else {
          this.props.onError?.(new Error('No dropinInstance'));
        }
      })
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

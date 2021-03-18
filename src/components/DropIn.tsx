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
  handlePaymentMethod: Function,
  onCreate: Function,
  onError: Function,
  onDestroyStart: Function,
  onDestroyEnd: Function,
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
          this.setup()
        })
      }).catch((err) => {
        if (this.props.onError) {
          this.props.onError(err)
        }
      })
    }
  }

  componentWillUnmount = () => {
    if (!this.state.dropInInstance) return

    this.tearDown().catch((err) => {
      if (this.props.onError) {
        this.props.onError(err)
      }
    })
  }

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
    braintreeDropIn.create(options, (err, dropinInstance) => {
      if (err) {
        if (this.props.onError) {
          this.props.onError(err)
        }
        return
      } else {
        if (this.props.onCreate) {
          this.props.onCreate(dropinInstance)
        }
      }
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
      } else {
        this.props.onError('No dropinInstance')
      }
    })
  }

  tearDown = () => {
    if (this.props.onDestroyStart) {
      this.props.onDestroyStart()
    }
    return new Promise<void>((resolve, reject) => {
      if (this.state.dropInInstance) {
        this.state.dropInInstance.teardown((err) => {
          if (this.props.onDestroyEnd) {
            this.props.onDestroyEnd(err)
          }
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
    if (this.state.dropInInstance && !this.state.isSubmitButtonDisabled) {
      this.setState({ isSubmitButtonDisabled: true }, () => {
        if (this.state.dropInInstance) {
          this.state.dropInInstance.requestPaymentMethod((err, payload) => {
            this.setState({
              isSubmitButtonDisabled: false
            })
            if (err) {
              if (this.props.onError) {
                this.props.onError(err)
              }
            } else {
              this.getDeviceData().then((clientData) => {
                this.props.handlePaymentMethod(payload, clientData)
              }).catch((err) => {
                this.props.onError(err);
              })
            }
          })
        } else {
          this.props.onError('No dropinInstance')
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

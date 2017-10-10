import * as React from 'react'
import { SketchPicker, RGBColor } from 'react-color'

export interface ColorPickerProps {
  color: RGBColor,
  onChange?: (color: RGBColor) => void
}

export interface ColorPickerState {
  display: boolean
}

//http://casesandberg.github.io/react-color/
export class ColorPicker extends React.Component<ColorPickerProps, ColorPickerState> {
  constructor(props: ColorPickerProps) {
    super(props);
    this.state = {
      display: false
    };
  }

  render() {
    return (
      <div>
        <div style={{
          padding: '5px',
          background: '#fff',
          borderRadius: '1px',
          boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
          display: 'inline-block',
          cursor: 'pointer',
        }} onClick={() => this.setState({ display: !this.state.display })}>
          <div style={{
            width: '36px',
            height: '14px',
            borderRadius: '2px',
            background: `rgba(${this.props.color.r}, ${this.props.color.g}, ${this.props.color.b}, ${this.props.color.a})`,
          }} />
        </div>
        {this.state.display ? <div style={{
          position: 'absolute',
          zIndex: 2,
        }}>
          <div style={{
            position: 'fixed',
            top: '0px',
            right: '0px',
            bottom: '0px',
            left: '0px',
          }} onClick={() => this.setState({ display: false })} />
          <SketchPicker color={this.props.color} onChange={color => {
            if (this.props.onChange) {
              this.props.onChange(color.rgb)
            }
          }} />
        </div> : null}

      </div>
    )
  }
}
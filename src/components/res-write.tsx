import * as React from 'react';
import * as api from '@anontown/api-types'
import { TextField, Checkbox, SelectField, MenuItem, IconButton } from 'material-ui';
import { NavigationArrowForward } from 'material-ui/svg-icons';
import { Errors } from './errors';
import { MdEditorContainer } from '../containers';

export interface ResWriteProps {
  profiles: api.Profile[];
  errors?: string[];
  onSubmit?: (value: ResWriteState) => void;
  mdEditorID: symbol;
}

export interface ResWriteState {
  name: string;
  profile: string | null;
  age: boolean;
}

export class ResWrite extends React.Component<ResWriteProps, ResWriteState> {
  constructor(props: ResWriteProps) {
    super(props);
    this.state = {
      name: '',
      profile: null,
      age: true
    };
  }

  onSubmit() {
    if (this.props.onSubmit) {
      this.props.onSubmit(this.state);
    }
  }

  render() {
    return (
      <form onSubmit={() => this.onSubmit()} >
        <Errors errors={this.props.errors} />
        <TextField floatingLabelText="名前" value={this.state.name} onChange={(_e, v) => this.setState({ name: v })} />
        <Checkbox label="age" checked={this.state.age} onCheck={(_e, v) => this.setState({ age: v })} />
        <SelectField floatingLabelText="プロフ" value={null} onChange={(_e, _i, v) => this.setState({ profile: v })}>
          <MenuItem value={null} primaryText="なし" />
          {this.props.profiles.map(p => <MenuItem value={p.id} primaryText={`●${p.sn} ${p.name}`} />)}
        </SelectField>
        <MdEditorContainer id={this.props.mdEditorID}
          maxRows={5}
          minRows={1} />
        <IconButton type="submit">
          <NavigationArrowForward />
        </IconButton>
      </form>
    );
  }
}
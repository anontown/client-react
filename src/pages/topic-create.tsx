import * as React from 'react';
import { UserData } from "../models";
import { apiClient } from "../utils";
import { connect } from "react-redux";
import { Store } from "../reducers";
import { ObjectOmit } from "typelevel-ts";
import {
  RouteComponentProps,
  Redirect
} from "react-router-dom";
import {
  Page,
  Errors,
  TagsInput,
  MdEditor
} from "../components";
import {
  Paper,
  RaisedButton,
  TextField,
  SelectField,
  MenuItem,
  Dialog
} from "material-ui";
import * as api from "@anontown/api-types";
import { AtError } from "@anontown/api-client";
import { Observable } from "rxjs";

type _TopicCreatePageProps = RouteComponentProps<{}> & { user: UserData | null };
export type TopicCreatePageProps = ObjectOmit<_TopicCreatePageProps, "user">;

export interface TopicCreatePageState {
  title: string,
  tags: string[],
  text: string,
  type: api.TopicType,
  errors?: string[],
  redirect: string | null,
  openDialog: boolean
}

class _TopicCreatePage extends React.Component<_TopicCreatePageProps, TopicCreatePageState> {
  constructor(props: _TopicCreatePageProps) {
    super(props);
    this.state = {
      title: '',
      tags: [],
      text: '',
      type: 'one',
      redirect: null,
      openDialog: false
    };
  }

  render() {
    return this.state.redirect === null
      ? <Page column={1}>
        {this.props.user !== null
          ? <Paper>
            <Dialog
              title="確認"
              open={this.state.openDialog}
              autoScrollBodyContent={true}
              onRequestClose={() => this.setState({ openDialog: false })}
              actions={[
                <RaisedButton label={"はい"} onClick={() => {
                  this.setState({ openDialog: false });
                  this.create();
                }} />,
                <RaisedButton label={"いいえ"} onClick={() => this.setState({ openDialog: false })} />
              ]}>
              ニュース・ネタ・実況などは単発トピックで建てて下さい。<br />
              本当に建てますか？
            </Dialog>
            <form onSubmit={() => this.submit()}>
              <Errors errors={this.state.errors} />
              <div>
                <SelectField floatingLabelText="種類" value={this.state.type} onChange={(_e, _i, v) => this.setState({ type: v })}>
                  <MenuItem value="one" primaryText="単発" />
                  <MenuItem value="normal" primaryText="通常" />
                </SelectField>
              </div>
              <div>
                <TextField floatingLabelText="タイトル" value={this.state.title} onChange={(_e, v) => this.setState({ title: v })} />
              </div>
              <div>
                <TagsInput value={this.state.tags} onChange={v => this.setState({ tags: v })} />
              </div>
              <MdEditor value={this.state.text} onChange={v => this.setState({ text: v })} />
              <div>
                <RaisedButton type="submit" label="トピック作成" />
              </div>
            </form>
          </Paper>
          : <Paper>
            ログインしてください。
        </Paper>
        }
      </Page>
      : <Redirect to={`/topic/${this.state.redirect}`} />;
  }

  submit() {
    if (this.state.type === 'normal') {
      this.setState({ openDialog: true });
    } else {
      this.create();
    }
  }

  create() {
    if (this.props.user === null) {
      return;
    }
    const params = {
      title: this.state.title,
      tags: this.state.tags,
      text: this.state.text,
    };

    let obs$: Observable<api.Topic> = (this.state.type === 'one' ?
      apiClient.createTopicOne(this.props.user.token, params) :
      apiClient.createTopicNormal(this.props.user.token, params));

    obs$.subscribe(topic => {
      this.setState({ errors: undefined, redirect: topic.id });
    }, error => {
      if (error instanceof AtError) {
        this.setState({ errors: error.errors.map(e => e.message) })
      } else {
        this.setState({ errors: ['エラーが発生しました'] })
      }
    });

  }
}

export const TopicCreatePage = connect((state: Store) => ({ user: state.user }))(_TopicCreatePage);
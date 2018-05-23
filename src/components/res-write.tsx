import { AtError } from "@anontown/api-client";
import * as api from "@anontown/api-types";
import * as Im from "immutable";
import {
  RaisedButton,
} from "material-ui";
import * as React from "react";
import { Subject, Subscription } from "rxjs";
import { Storage, UserData } from "../models";
import { apiClient } from "../utils";
import { Errors } from "./errors";
import { MdEditor } from "./md-editor";

interface ResWriteProps {
  onSubmit?: (value: api.Res) => void;
  topic: string;
  reply: string | null;
  userData: UserData;
  changeUserData: (data: UserData) => void;
}

interface ResWriteState {
  errors?: string[];
  textCache: string;
}

export class ResWrite extends React.Component<ResWriteProps, ResWriteState> {
  formDefualt = {
    name: "",
    profile: null as string | null,
    text: "",
    replyText: Im.Map<string, string>(),
    age: true,
  };

  textUpdate = new Subject<string>();
  subscriptions: Subscription[] = [];

  constructor(props: ResWriteProps) {
    super(props);
    const text = this.props.reply === null
      ? this.getData().text
      : this.getData().replyText.get(this.props.reply, "");
    this.state = {
      textCache: text,
    };
    this.subscriptions.push(this.textUpdate
      .debounceTime(1000)
      .subscribe(value => {
        if (this.props.reply === null) {
          this.setStorage(this.props.userData.storage.topicWrite.update(this.props.topic, this.formDefualt, x => ({
            ...x,
            value,
          })));
        } else {
          const reply = this.props.reply;
          this.setStorage(this.props.userData.storage.topicWrite.update(this.props.topic, this.formDefualt, x => ({
            ...x,
            replyText: x.replyText.set(reply, value),
          })));
        }
      }));
  }

  componentWillUnmount() {
    this.subscriptions.forEach(x => x.unsubscribe());
  }

  getData() {
    return this.props.userData.storage.topicWrite.get(this.props.topic, this.formDefualt);
  }

  setStorage(data: Storage["topicWrite"]) {
    this.props.changeUserData({
      ...this.props.userData,
      storage: {
        ...this.props.userData.storage,
        topicWrite: data,
      },
    });
  }

  setText(text: string) {
    this.setState({ textCache: text });
    this.textUpdate.next(text);
  }

  async onSubmit() {
    const data = this.getData();
    try {
      const res = await apiClient.createRes(this.props.userData.token, {
        topic: this.props.topic,
        name: data.name.length !== 0 ? data.name : null,
        text: this.state.textCache,
        reply: this.props.reply,
        profile: data.profile,
        age: data.age,
      });

      if (this.props.onSubmit) {
        this.props.onSubmit(res);
      }
      this.setState({ errors: [] });
      this.setText("");
    } catch (e) {
      if (e instanceof AtError) {
        this.setState({ errors: e.errors.map(e => e.message) });
      } else {
        this.setState({ errors: ["エラーが発生しました"] });
      }
    }
  }

  render() {
    const data = this.getData();
    return <form>
      <Errors errors={this.state.errors} />
      <input
        style={{
          marginRight: "3px"
        }}
        type="text"
        placeholder="名前"
        value={data.name}
        onChange={e =>
          this.setStorage(this.props.userData.storage.topicWrite
            .update(this.props.topic, this.formDefualt, x => ({
              ...x,
              name: e.target.value,
            })))} />
      <select
        style={{
          marginRight: "3px",
          backgroundColor: "#fff"
        }}
        value={data.profile || ""}
        onChange={e => {
          this.setStorage(this.props.userData.storage.topicWrite
            .update(this.props.topic, this.formDefualt, x => ({
              ...x,
              profile: e.target.value || null,
            })))
        }}>
        <option value="">(プロフなし)</option>
        {this.props.userData.profiles.map(p => <option value={p.id} key={p.id}>{`●${p.sn} ${p.name}`}</option>)}
      </select>
      <label
        style={{
          marginRight: "3px"
        }}>
        <input
          type="checkbox"
          checked={data.age}
          onChange={e =>
            this.setStorage(this.props.userData.storage.topicWrite
              .update(this.props.topic, this.formDefualt, x => ({
                ...x,
                age: e.target.checked,
              })))} />
        Age
      </label>
      <MdEditor value={this.state.textCache}
        onChange={v => this.setText(v)}
        maxRows={5}
        minRows={1}
        onKeyDown={e => {
          if ((e.shiftKey || e.ctrlKey) && e.keyCode === 13) {
            e.preventDefault();
            this.onSubmit();
          }
        }}
        fullWidth={true}
        actions={<RaisedButton onClick={() => this.onSubmit()}>
          書き込む
      </RaisedButton>} />
    </form>;
  }
}

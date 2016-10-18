// @flow
import React, { PureComponent } from 'react';
import classnames from 'classnames';
import style from 'styles/components/UserInterface.css';

type Props = {
  className?: string,
  onShow: (_:Event) => void,
  onHide: (_:Event) => void,
  onReset: (_:Event) => void,
  onTrace: (_:Event) => void,
};

export default class UserInterface extends PureComponent {
  props: Props;

  render() {
    const { className, onShow, onHide, onTrace } = this.props;
    return (
      <div className={classnames(className, style.my)}>
        <div className={style.myButtons}>
          <button onClick={e => onShow(e)}>Show</button>
          <button onClick={e => onHide(e)}>Hide</button>
          <button onClick={e => onTrace(e)}>Trace</button>
        </div>
      </div>
    );
  }
}

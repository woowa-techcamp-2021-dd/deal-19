import Component from '../../core/component.js';
import _ from '../../utils/dom.js';
import Header from '../../components/header.js';
import './style.scss';
import ChatRoom from './chatRoom/index.js';

const $root = document.querySelector('#root');

class App extends Component {
  initState () {
    this.state = {
      username: 'User123'
    };
  }

  getTemplate () {
    return `
      <div id="chat-detail__header"></div>
      <div id="chat-detail__contents"></div>
    `;
  }

  mountChildren () {
    const { leaveChatRoom } = this;
    const { username } = this.state;

    const $header = _.$('#chat-detail__header');
    const $contents = _.$('#chat-detail__contents');

    new Header($header, {
      type: 'chat',
      title: username,
      handlerClickRightIcon: leaveChatRoom.bind(this)
    });

    new ChatRoom($contents, {});
  }

  leaveChatRoom () {
    console.log('채팅방 나가기');
  }

  setEventListener () {}
}

new App($root);

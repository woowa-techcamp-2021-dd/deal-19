import Component from '../../../core/component.js';
import _ from '../../../utils/dom.js';
import './style.scss';

export default class EditorForm extends Component {
  initState () {
    this.state = {
      imageList: ['https://i.guim.co.uk/img/media/8a13052d4db7dcd508af948e5db7b04598e03190/0_294_5616_3370/master/5616.jpg?width=1200&height=1200&quality=85&auto=format&fit=crop&s=bcaa4eed2c1e6dab61c41a61e41433d9', 'https://i.guim.co.uk/img/media/8a13052d4db7dcd508af948e5db7b04598e03190/0_294_5616_3370/master/5616.jpg?width=1200&height=1200&quality=85&auto=format&fit=crop&s=bcaa4eed2c1e6dab61c41a61e41433d9', 'https://i.guim.co.uk/img/media/8a13052d4db7dcd508af948e5db7b04598e03190/0_294_5616_3370/master/5616.jpg?width=1200&height=1200&quality=85&auto=format&fit=crop&s=bcaa4eed2c1e6dab61c41a61e41433d9'],
      name: '빈티지 롤러 스케이트',
      category: '',
      categoryList: ['여성패션/잡화', '기타 중고물품', '가구/인테리어'],
      price: 169000,
      contents: '어린시절 추억의 향수를 어쩌구 저쩌구'
    };
  }

  getTemplate () {
    const { imageList, name, category, categoryList, price, contents } = this.state;
    const { location } = this.props;
    return `
      <form id="editor__form" action="http://localhost:3000/api/items" method="post"> 
        <div class="write__image-list content-box">
          <input name="images" id="input-image" type="file" accept="img/*"  multiple />
          <div class="button-add-image">추가</div>
          <div class="carousel">
          ${imageList
            .map(
              (src) =>
                `<figure class="image-box image-added"><img src=${src} /></figure>`
            )
            .join('')}
        </div>
        </div>
        <div class="write__info content-box">
        <div>
          <input type="text" name="name" >${name}</h2>
        </div>
        <div class="category">${
          category === '' ? '(필수) 카테고리를 선택해주세요.' : category
        }</div>
        <div class="carousel">
        ${categoryList
          .map(
            (item, i) =>
              `<div class="category-item">
                <input type="radio" id="category-${i}" name="category" value="${item}">
                <label for="category-${i}">${item}</label>
              </div>`
          )
          .join('')}</div>
        </div>
        <div class="write__price content-box">
          <input type="number" value="${price}" name="price"/>
        </div>
        <div class="write__contents content-box">
          <textarea>${contents}</textarea>
        </div>
        <div class="write__footer" >
          <input type="text" value="${location}" name="location"/>
        </div>
      </form>
    `;
  }

  mountChildren () {

  }

  requestAddPosting () {
    console.log('글쓰기 요청');
  }

  setEventListener () {
    
  }
}

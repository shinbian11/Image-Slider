export default class ImageSlider {
  #currentPosition = 0;

  #sliderNumber = 0;

  #sliderWidth = 0;

  sliderWrapEl;

  sliderListEl;

  nextBtnEl;

  previousBtnEl;

  constructor() {
    // 초기화 하면서 실행시킬 메소드들
    this.assignElement();
    this.initSliderNumber();
    this.initSliderWidth();
    this.initSliderListWidth();
    this.addEvent();
  }

  assignElement() {
    // HTML의 id, class명이 부여되어 있는 태그들을 가져온다.
    this.sliderWrapEl = document.getElementById('slider-wrap');
    this.sliderListEl = this.sliderWrapEl.querySelector('#slider');
    this.nextBtnEl = this.sliderWrapEl.querySelector('#next');
    this.previousBtnEl = this.sliderWrapEl.querySelector('#previous');
  }

  initSliderNumber() {
    this.#sliderNumber = this.sliderListEl.querySelectorAll('li').length;
  }

  initSliderWidth() {
    // clientWidth 속성 설명 : https://ohgyun.com/571
    this.#sliderWidth = this.sliderWrapEl.clientWidth;
  }

  initSliderListWidth() {
    // this.#sliderNumber (7개) * this.#sliderWidth (1000px) = 8000px
    this.sliderListEl.style.width = `${
      this.#sliderNumber * this.#sliderWidth
    }px`;
  }

  addEvent() {
    this.nextBtnEl.addEventListener('click', this.moveToRight.bind(this));
    this.previousBtnEl.addEventListener('click', this.moveToLeft.bind(this));
  }

  // moveToRight, moveToLeft 메서드 구성 원리
  // this.sliderListEl, 즉 .slider-wrap ul.slider의 width는 7000px으로 계산이 되었고,
  // 이 ul 태그는 현재 가로넓이가 1000px인 li 태그가 총 7개가 가로로 줄지어서 배치되어있는 것이다.
  // 이 ul 태그에 left 값을 -1000px, -2000px, ... 씩 줘보면 알겠지만,
  // 오른쪽에 줄지어서 배치되어 화면에 보이지 않았던 색깔들이 차례로 보인다.
  // 즉, 0, 1, 2, 3, 4, 5, 6 으로 currentPosition 값을 바꿔가면서 left 속성을 조절하면 btn 구현이 가능하다!

  moveToRight() {
    this.#currentPosition += 1;

    // 경계값 처리
    if (this.#currentPosition === this.#sliderNumber) {
      this.#currentPosition = 0;
    }
    this.sliderListEl.style.left = `-${
      this.#sliderWidth * this.#currentPosition
    }px`;
  }

  moveToLeft() {
    this.#currentPosition -= 1;

    // 경계값 처리
    if (this.#currentPosition === -1) {
      this.#currentPosition = this.#sliderNumber - 1;
    }

    this.sliderListEl.style.left = `-${
      this.#sliderWidth * this.#currentPosition
    }px`;
  }
}

export default class ImageSlider {
  #currentPosition = 0;

  #sliderNumber = 0;

  #sliderWidth = 0;

  #intervalId;

  #autoPlay = true;

  sliderWrapEl;

  sliderListEl;

  nextBtnEl;

  previousBtnEl;

  indicatorWrapEl;

  controlWrapEl;

  constructor() {
    // 인스턴스 생성하면서 동시에 실행시킬 메소드들
    this.assignElement();
    this.initSliderNumber();
    this.initSliderWidth();
    this.initSliderListWidth();
    this.addEvent();
    this.createIndicator();
    this.setIndicator();
    this.initAutoplay();
  }

  assignElement() {
    // HTML의 id, class명이 부여되어 있는 태그들을 가져온다.
    this.sliderWrapEl = document.getElementById('slider-wrap');
    // this.sliderWrapEl = document.querySelector('#slider-wrap');
    this.sliderListEl = this.sliderWrapEl.querySelector('#slider');
    this.nextBtnEl = this.sliderWrapEl.querySelector('#next');
    this.previousBtnEl = this.sliderWrapEl.querySelector('#previous');
    this.indicatorWrapEl = this.sliderWrapEl.querySelector('#indicator-wrap');
    this.controlWrapEl = this.sliderWrapEl.querySelector('.control-wrap');
  }

  // 3000ms (3초) 에 한번씩 다음 슬라이드로 이동하는 메서드
  initAutoplay() {
    this.#intervalId = setInterval(this.moveToRight.bind(this), 3000);
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

  // click 이벤트 모아놓은 메소드
  addEvent() {
    this.nextBtnEl.addEventListener('click', this.moveToRight.bind(this));
    this.previousBtnEl.addEventListener('click', this.moveToLeft.bind(this));

    // event 전파를 이용하여, li 태그에 일일히 event 걸어주는 것이 아니라,
    // this.indicatorWrapEl 에 event를 걸어준다.
    this.indicatorWrapEl.addEventListener(
      'click',
      this.onClickIndicator.bind(this),
    );

    // autoplay control
    this.controlWrapEl.addEventListener('click', this.togglePlay.bind(this));
  }

  // pause 버튼을 누르면 play 버튼으로, 그 반대로도 아이콘이 바뀌도록 구현
  togglePlay(event) {
    // event.currentTarget : 이벤트를 실제로 건 대상 (이벤트 핸들러가 부착된 곳), 여기서는 .control-wrap class가 붙은 div 태그 부분 요소
    // event.target : 실제로 발생한 이벤트의 대상 (여기서는 id 가 pause 또는 play인 i 태그)
    // console.log(`event.currentTarget : ${event.currentTarget}`);
    // console.log(`event.target : ${event.target}`);

    // event 전파 (버블링)
    if (event.target.dataset.status === 'play') {
      this.#autoPlay = true;
      this.controlWrapEl.classList.add('play');
      this.controlWrapEl.classList.remove('pause');
      this.initAutoplay();
    } else if (event.target.dataset.status === 'pause') {
      this.#autoPlay = false;
      this.controlWrapEl.classList.add('pause');
      this.controlWrapEl.classList.remove('play');
      clearInterval(this.#intervalId);
    }
  }

  // Indicator (이미지 슬라이드 하단의 동그라미들) 을 클릭하면 해당되는 이미지 슬라이드로 이동
  onClickIndicator() {
    // li 태그는 data-index="0" 부터 data-index="6" 까지 있는데,
    // this.indicatorWrapEl 요소 부분에서, li 태그가 아닌 다른 부분을 클릭했을 때는,
    // dataset.index가 undefined가 된다. undefined를 parseInt 하면 NaN이 되므로,
    // indexPosition이 NaN이 아닌 경우에만 제대로 작동되도록 구현해야 한다.
    const indexPosition = parseInt(event.target.dataset.index);

    if (Number.isInteger(indexPosition)) {
      this.#currentPosition = indexPosition;
      this.sliderListEl.style.left = `-${
        this.#sliderWidth * this.#currentPosition
      }px`;
      this.setIndicator();
    }
  }

  // < moveToRight, moveToLeft 메서드 > - 구성 원리
  // this.sliderListEl, 즉 .slider-wrap ul.slider의 width는 7000px으로 계산이 되었고,
  // 이 ul 태그는 현재 가로넓이가 1000px인 li 태그가 총 7개가 가로로 줄지어서 배치되어있는 것이다.
  // 이 ul 태그에 left 값을 -1000px, -2000px, ... 씩 줘보면 알겠지만,
  // 오른쪽에 줄지어서 배치되어 화면에 보이지 않았던 색깔들이 차례로 보인다.
  // 즉, 0, 1, 2, 3, 4, 5, 6 으로 currentPosition 값을 바꿔가면서 left 속성을 조절하면 btn 구현이 가능하다!

  // 오른쪽 이동 버튼
  moveToRight() {
    this.#currentPosition += 1;

    // 경계값 처리
    if (this.#currentPosition === this.#sliderNumber) {
      this.#currentPosition = 0;
    }
    this.sliderListEl.style.left = `-${
      this.#sliderWidth * this.#currentPosition
    }px`;

    // autoplay 도중 다음 슬라이드로 이동하는 버튼을 눌렀을 땐,
    // 시간을 초기화하고 다시 세야 한다.
    if (this.#autoPlay) {
      // autoPlay 기능이 켜져있을때만 작동해야 한다
      clearInterval(this.#intervalId);
      this.initAutoplay();
    }

    this.setIndicator();
  }

  // 왼쪽 이동 버튼
  moveToLeft() {
    this.#currentPosition -= 1;

    // 경계값 처리
    if (this.#currentPosition === -1) {
      this.#currentPosition = this.#sliderNumber - 1;
    }

    this.sliderListEl.style.left = `-${
      this.#sliderWidth * this.#currentPosition
    }px`;

    // autoplay 도중 이전 슬라이드로 이동하는 버튼을 눌렀을 땐,
    // 시간을 초기화하고 다시 세야 한다.
    if (this.#autoPlay) {
      // autoPlay 기능이 켜져있을때만 작동해야 한다
      clearInterval(this.#intervalId);
      this.initAutoplay();
    }

    this.setIndicator();
  }

  // Indicator (이미지 슬라이드 하단의 동그라미들) 생성
  createIndicator() {
    // createDocumentFragment()로 만든 docFragment는 render가 되지 않는다.
    // 여러 가지의 결과물들을 한번에 담을 때 (여기서는 li 태그들) 주로 사용

    const docFragment = document.createDocumentFragment();
    for (let i = 0; i < this.#sliderNumber; i += 1) {
      const li = document.createElement('li');
      li.dataset.index = i; // <li data-index="i"></li> 라고 적용됨
      docFragment.appendChild(li);
    }
    // #indicator-wrap 의 ul 태그 밑에 바로 docFragment를 appendChild 해도 li들만 삽입이 된다.
    this.indicatorWrapEl.querySelector('ul').appendChild(docFragment);
  }

  // Indicator (이미지 슬라이드 하단의 동그라미들) 설정
  // 현재 위치에 있는 이미지 슬라이드에 해당하는 동그라미 활성화 시키기
  setIndicator() {
    // STEP 1 : index 활성화된 것 있으면 없애주기
    // optional chainging (?) 해줘야 한다. 처음에는 active 클래스 없을수도 있으니! 안 해주면 Error 발생 가능!
    this.indicatorWrapEl.querySelector('li.active')?.classList.remove('active');

    // STEP 2 : index에 따라서 활성화 (.active 클래스 부여)
    this.indicatorWrapEl
      .querySelector(`ul li:nth-child(${this.#currentPosition + 1})`)
      .classList.add('active');
  }
}

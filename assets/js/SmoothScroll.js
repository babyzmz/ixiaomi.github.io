export default class SmoothScroll {
  constructor(options) {
    this.element = options.element || document.querySelector('.js-smooth')
    this.speed = options.speed ? options.speed : 500
    this.buffer = options.buffer ? options.buffer : () => 0
    this['clickEvent'] = this['clickEvent'].bind(this)

    this.attachEvents()
  }

  attachEvents() {
    this.element.addEventListener('click', this.clickEvent, {passive: true})
  }

  clickEvent(ev) {
    const href = ev.currentTarget.getAttribute('href')

    if ((href === '#') || (href === '')) {
      this.scroll('html')
    } else {
      this.scroll(href)
    }
  }

  // TODO: jQueryへの依存を修正する
  scroll(hash) {
    $('body, html').stop().animate({
      scrollTop: $(hash).offset().top - this.buffer()
    }, this.speed)
  }
}

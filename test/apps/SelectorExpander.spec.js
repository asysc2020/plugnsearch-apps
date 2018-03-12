/* eslint-env jest */
import cheerio from 'cheerio'
import { URL } from 'plugnsearch'
import SelectorExpander from '../../src/apps/SelectorExpander'

const BODY = `
<html>
<body>
  <a href="/test.de">Logo</a>
  <ul class="pagination">
   <li><a href="/test.de?page=1">Page 1</a></li>
   <li><a href="test.de?page=2">Page 2</a></li>
   <li><a href="http://somewhere.else.com/test.de?page=3">Page 3</a></li>
  </ul>
</body>
</html>
`

describe('SelectorExpander', () => {
  let app

  beforeEach(() => {
    app = new SelectorExpander({
      paginationSelector: '.pagination a'
    })
  })

  it('uses the paginationSelector to get the links', done => {
    const $ = cheerio.load(BODY)
    expect.assertions(1)
    app.process({
      $,
      url: new URL('http://some.rainbow.com/over-it/of-course'),
      queueUrls: (urls) => {
        expect(urls).toEqual([
          'http://some.rainbow.com/test.de?page=1',
          'http://some.rainbow.com/over-it/test.de?page=2',
          'http://somewhere.else.com/test.de?page=3'
        ])
        done()
      }
    })
  })

  it('does not expand anything if no matching selectors are found', done => {
    app = new SelectorExpander({
      paginationSelector: '.no-pagination a'
    })
    const $ = cheerio.load(BODY)
    expect.assertions(1)
    app.process({
      $,
      url: new URL('http://some.rainbow.com/over-it/of-course'),
      queueUrls: (urls) => {
        expect(urls).toEqual([])
        done()
      }
    })
  })
})

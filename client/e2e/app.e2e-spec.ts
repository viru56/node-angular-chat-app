import { MyWorldPage } from './app.po';

describe('my-world App', () => {
  let page: MyWorldPage;

  beforeEach(() => {
    page = new MyWorldPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});

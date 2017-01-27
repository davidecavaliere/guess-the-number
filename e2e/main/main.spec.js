'use strict';

describe('Main View', function() {
  var page;

  beforeEach(function() {
    browser.get('/');
    page = require('./main.po');
  });

  it('should have an header', function() {
    // console.log(page.header.getText());
    expect(page.header.getText()).toBe('Guess the number');
  });


  it('should show a message with range number', function() {
    // console.log(page.title);
    expect(page.title.getText()).toBe('Please enter a number betwee 1 and 100');
  });

  it('should show a message with number of attemps', function() {
    expect(page.attemptsText.getText()).toBe('You have 3 attempts left');
  });

  it('should have an input empty input box', function() {
    // console.log(page.inputNumber);
    expect(page.inputNumber.getText()).toBe('');
  });

  it('should give an error if input is empty', function() {
    var input = page.inputNumber;
    input.sendKeys('');
    page.checkButton.click();
    expect(page.emptyMessage.isDisplayed()).toBeTruthy();
    expect(page.emptyMessage.getText()).toBe('You must input a number');
  });

  it('should give an error if input is less than 1', function() {
    var input = page.inputNumber;
    input.sendKeys('0');
    page.checkButton.click();
    expect(page.minMessage.isDisplayed()).toBeTruthy();
    expect(page.minMessage.getText()).toBe('Number must be equal or greater than 1');
  });

  it('should give an error if input is greater than 100', function() {
    var input = page.inputNumber;
    input.sendKeys('101');
    page.checkButton.click();
    expect(page.maxMessage.isDisplayed()).toBeTruthy();
    expect(page.maxMessage.getText()).toBe('Number must be lower or equal to 100');
  });

  it('should reduce the number of attempts from 3 to 0', function() {
    var input = page.inputNumber;
    input.sendKeys('12');
    page.checkButton.click();
    expect(page.attemptsText.getText()).toBe('You have 2 attempts left');

    var input = page.inputNumber;
    input.click().clear().sendKeys('13');
    page.checkButton.click();
    expect(page.attemptsText.getText()).toBe('You have 1 attempts left');

    var input = page.inputNumber;
    input.click().clear().sendKeys('14');
    page.checkButton.click();
    expect(page.attemptsText.getText()).toBe('You have 0 attempts left');

    expect(page.inputNumber.isEnabled()).toBe(false);
    expect(page.checkButton.isEnabled()).toBe(false);

  });


});

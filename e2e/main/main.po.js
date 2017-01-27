/**
 * This file uses the Page Object pattern to define the main page for tests
 * https://docs.google.com/presentation/d/1B6manhG0zEXkC-H-tPo2vwU06JhL8w9-XCF9oehXzAQ
 */

'use strict';

var MainPage = function() {
  this.header = element(by.css('.md-toolbar-tools > h2 > span'));
  this.title = element(by.css('body > md-content > md-content > h1'));
  this.attemptsText = element(by.binding('attempts'));
  this.checkButton = element(by.css('[type="submit"]'));
  this.inputNumber = element(by.model('number'));
  this.emptyMessage = element(by.css('[ng-message="required"]'));
  this.minMessage = element(by.css('[ng-message="min"]'));
  this.maxMessage = element(by.css('[ng-message="max"]'));

};

module.exports = new MainPage();

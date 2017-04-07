'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Class representing InvertedIndex
 */
var InvertedIndex = function () {

  /**
   * InvertedIndex Constructor
   * @constructor
   */
  function InvertedIndex() {
    _classCallCheck(this, InvertedIndex);

    this.iDexMapper = {};
    this.numberOfDocuments = {};
    this.unIndexedBooks = {};
    this.indexedBookTitles = {};
  }

  /**
   * Reads the data from the file being uploaded as a JavaScript object
   * @param {Object} book - object of book containing documents
   * @return {Object} if true
   * @return {Boolean.<false>} if false
   */


  _createClass(InvertedIndex, [{
    key: 'createsArray',


    /**
     * Creates a word array for each document in a book
     * @param {String} bookName - name of a book to index
     * @param {Object} book - documents in a book
     * @return {Array.<Object>} bookContents - words in each document
     */
    value: function createsArray(bookName, book) {
      var _this = this;

      var bookContents = [];
      Object.keys(book).map(function (documentPosition) {
        var mergedTitleAndText = book[documentPosition].title + ' \n      ' + book[documentPosition].text;
        bookContents.push(InvertedIndex.tokenize(mergedTitleAndText).split(' '));
        _this.setBookTitles(bookName, book[documentPosition].title);
        return _this;
      });
      return bookContents;
    }

    /**
     * Sets title(s) for a book in an instance variable - indexedBookTitles
     * @param {String} bookName - name of a book being indexed
     * @param {String} title - a titlee in the book being indexed
     * @returns {Void} indexedBookTitles - instance variable
     */

  }, {
    key: 'setBookTitles',
    value: function setBookTitles(bookName, title) {
      if (this.indexedBookTitles[bookName]) {
        this.indexedBookTitles[bookName].push(title);
      } else {
        this.indexedBookTitles[bookName] = [];
        this.indexedBookTitles[bookName].push(title);
      }
    }

    /**
     * Creates the index for specified book
     * @param {string} bookName - Name of book to be indexed
     * @param {object} book - document words in specified book
     * @return {Promise.<iDexMapper>} - indexes of specified book
     */

  }, {
    key: 'createIndex',
    value: function createIndex(bookName, book) {
      var _this2 = this;

      var tokenIndex = {};
      this.numberOfDocuments[bookName] = [];
      var bookContents = this.createsArray(bookName, book);
      return new Promise(function (resolve) {
        bookContents.map(function (eachdocument, documentPosition) {
          var documentPositionToInt = parseInt(documentPosition, 10);
          _this2.numberOfDocuments[bookName].push(documentPositionToInt);
          return eachdocument.map(function (eachWord) {
            if (tokenIndex[eachWord]) {
              if (tokenIndex[eachWord].indexOf(documentPositionToInt) === -1) {
                tokenIndex[eachWord].push(documentPositionToInt);
              }
            } else {
              tokenIndex[eachWord] = [documentPositionToInt];
            }
            return _this2;
          });
        });
        _this2.iDexMapper[bookName] = tokenIndex;
        resolve(_this2.iDexMapper[bookName]);
      });
    }

    /**
     * Get’s indexes created for particular files
     * @param {String} bookName - name of book to get its indexes
     * @return {Object.<iDexMapper>} - indexes of specified bookName
     */

  }, {
    key: 'getIndex',
    value: function getIndex(bookName) {
      return this.iDexMapper[bookName];
    }

    /**
     * Searches through one or more indices for words
     * @param {String} bookName - name of book to search
     * @param {String} tokens - words to search
     * @return {Object.<searchResult>} - words in each book specified
     */

  }, {
    key: 'searchIndex',
    value: function searchIndex(bookName, tokens) {
      var _this3 = this;

      tokens = tokens.split(' ');
      var allBooks = this.iDexMapper;
      var bookToSearchName = bookName;
      var searchResult = [];
      if (bookToSearchName === 'allBooks') {
        Object.keys(allBooks).map(function (book) {
          var search = _this3.getSearchResult(book, tokens);
          searchResult.push(search);
          return searchResult;
        });
      } else {
        var search = this.getSearchResult(bookToSearchName, tokens);
        searchResult.push(search);
      }
      return searchResult;
    }

    /**
     * Get search result for the specified book
     * @param {String} bookName - name of book to search
     * @param {String} tokens - words to search
     * @return {Object<searchResult>} - words in specified books
     */

  }, {
    key: 'getSearchResult',
    value: function getSearchResult(bookName, tokens) {
      var allBooks = this.iDexMapper;
      if (!allBooks[bookName]) {
        return false;
      }
      var searchResult = {};
      searchResult[bookName] = {};
      tokens.map(function (word) {
        searchResult[bookName][word] = allBooks[bookName][word] || [];
        return searchResult;
      });
      return searchResult;
    }
  }], [{
    key: 'readFile',
    value: function readFile(book) {
      try {
        return JSON.parse(book);
      } catch (error) {
        return false;
      }
    }

    /**
     * Ensures all the documents in a particular file is valid
     * @param {array} allBooks - Array containing document objects of bookName
     * @param {string} bookName - Name of the book to validate
     * @return {Promise.<bookHolder>} An Object containing validated book
     */

  }, {
    key: 'validateFile',
    value: function validateFile(allBooks, bookName) {
      var _this4 = this;

      return new Promise(function (resolve, reject) {
        if (Object.keys(allBooks).length < 1) {
          reject('Cannot index an empty object');
        } else {
          bookName = bookName.split('.')[0];
          var bookHolder = _defineProperty({}, bookName, {});
          allBooks.map(function (eachBook, eachIndex) {
            if (Object.prototype.hasOwnProperty.call(eachBook, 'title') && Object.prototype.hasOwnProperty.call(eachBook, 'text')) {
              if (eachBook.title.length < 1 || eachBook.text.length < 1) {
                var index = parseInt(eachIndex, 10) + 1;
                reject('Document ' + index + ' have an empty title or text.');
              }
              bookHolder[bookName][eachIndex] = {
                title: eachBook.title.toLowerCase(),
                text: eachBook.text.toLowerCase()
              };
            } else {
              var _index = parseInt(eachIndex, 10) + 1;
              reject('No \'title\' or \'text\' in Document ' + _index + ' of ' + bookName);
            }
            return _this4;
          });
          resolve(bookHolder);
        }
      });
    }

    /**
    * Strips out special characters from documents to be indexed
    * @param {String} text - contents of each document
    * @return {String} sanitizedText - sanitized contents of each document
    */

  }, {
    key: 'tokenize',
    value: function tokenize(text) {
      return text.replace(/[^\w\s]/gi, '').replace(/\s+/g, ' ').trim().toLowerCase();
    }
  }]);

  return InvertedIndex;
}();

module.exports.InvertedIndex = InvertedIndex;
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
  }

  /**
   * Reads the data from the file being uploaded as a JavaScript object
   * @param {Object} book - object of book containing documents
   * @return {Object} if true
   * @return {Boolean.<false>} if false
   */


  _createClass(InvertedIndex, [{
    key: 'createIndex',


    /**
     * Creates the index for specified book
     * @param {string} bookname - Name of book to be indexed
     * @param {object} book - document words in specified book
     * @return {Promise.<iDexMapper>} - indexes of specified book
     */
    value: function createIndex(bookname, book) {
      var _this = this;

      var tokenIndex = {};
      this.numberOfDocuments[bookname] = [];
      var bookContents = InvertedIndex.createsArray(book);
      return new Promise(function (resolve) {
        bookContents.map(function (eachdocument, documentPosition) {
          var documentPositionToInt = parseInt(documentPosition, 10);
          _this.numberOfDocuments[bookname].push(documentPositionToInt);
          eachdocument.map(function (eachWord) {
            if (tokenIndex[eachWord]) {
              if (tokenIndex[eachWord].indexOf(documentPositionToInt) === -1) {
                tokenIndex[eachWord].push(documentPositionToInt);
              }
            } else {
              tokenIndex[eachWord] = [documentPositionToInt];
            }
          });
        });
        _this.iDexMapper[bookname] = tokenIndex;
        resolve(_this.iDexMapper[bookname]);
      });
    }

    /**
     * Get’s indexes created for particular files
     * @param {String} bookname - name of book to get its indexes
     * @return {Object.<iDexMapper>} - indexes of specified bookname
     */

  }, {
    key: 'getIndex',
    value: function getIndex(bookname) {
      return this.iDexMapper[bookname];
    }

    /**
     * Searches through one or more indices for words
     * @param {String} bookname - name of book to search
     * @param {String} tokens - words to search
     * @return {Object.<searchResult>} - words in each book specified
     */

  }, {
    key: 'searchIndex',
    value: function searchIndex(bookname, tokens) {
      var _this2 = this;

      tokens = tokens.split(' ');
      var allBooks = this.iDexMapper;
      var bookToSearchName = bookname;
      var searchResult = [];
      if (bookToSearchName === 'allBooks') {
        Object.keys(allBooks).map(function (book) {
          var search = _this2.getSearchResult(book, tokens);
          searchResult.push(search);
        });
      } else {
        var search = this.getSearchResult(bookToSearchName, tokens);
        searchResult.push(search);
      }
      return searchResult;
    }

    /**
     * Get search result for the specified book
     * @param {String} bookname - name of book to search
     * @param {String} tokens - words to search
     * @return {Object<searchResult>} - words in specified books
     */

  }, {
    key: 'getSearchResult',
    value: function getSearchResult(bookname, tokens) {
      var allBooks = this.iDexMapper;
      if (!allBooks[bookname]) {
        return false;
      }
      var searchResult = {};
      searchResult[bookname] = {};
      tokens.map(function (word) {
        searchResult[bookname][word] = allBooks[bookname][word] || [];
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
     * @param {array} allBooks - Array containing document objects of bookname
     * @param {string} bookname - Name of the book to validate
     * @return {Promise.<bookHolder>} An Object containing validated book
     */

  }, {
    key: 'validateFile',
    value: function validateFile(allBooks, bookname) {
      return new Promise(function (resolve, reject) {
        if (Object.keys(allBooks).length < 1) {
          reject('Cannot index an empty object');
        } else {
          bookname = bookname.split('.')[0];
          var bookHolder = _defineProperty({}, bookname, {});
          allBooks.map(function (eachBook, eachIndex) {
            if (Object.prototype.hasOwnProperty.call(eachBook, 'title') && Object.prototype.hasOwnProperty.call(eachBook, 'text')) {
              if (eachBook.title.length < 1 || eachBook.text.length < 1) {
                var index = parseInt(eachIndex, 10) + 1;
                reject('Document ' + index + ' have an empty title or text.');
              }
              bookHolder[bookname][eachIndex] = {
                title: eachBook.title.toLowerCase(),
                text: eachBook.text.toLowerCase()
              };
            } else {
              var _index = parseInt(eachIndex, 10) + 1;
              reject('Document ' + _index + ' in ' + bookname + '.json book do not have a "title" or "text" fields');
            }
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
      var sanitizedText = text.replace(/[^\w\s]+/gi, '');
      sanitizedText = sanitizedText.replace(/\s\s+/g, ' ');
      sanitizedText = sanitizedText.replace(/^[.\s]+|[.\s]+$/g, '');
      return sanitizedText.toLowerCase();
    }

    /**
     * Creates a word array for each document in a book
     * @param {Object} book - documents in a book
     * @return {Array.<Object>} bookContents - words in each document
     */

  }, {
    key: 'createsArray',
    value: function createsArray(book) {
      var _this3 = this;

      var bookContents = [];
      Object.keys(book).map(function (documentPosition) {
        var mergedTitleAndText = book[documentPosition].title + ' \n      ' + book[documentPosition].text;
        bookContents.push(_this3.tokenize(mergedTitleAndText).split(' '));
      });
      return bookContents;
    }
  }]);

  return InvertedIndex;
}();

module.exports.InvertedIndex = InvertedIndex;
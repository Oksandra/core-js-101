/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  this.width = width;
  this.height = height;
  this.getArea = () => this.width * this.height;
}

/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const obj = JSON.parse(json);
  const values = Object.values(obj);
  return new proto.constructor(...values);
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

class SelectoCss {
  constructor(value = '') {
    this.elementTag = '';
    this.elementId = '';
    this.elementClasses = [];
    this.elementAttr = [];
    this.elementPseudoClasses = [];
    this.elementPseudoElement = '';
    this.mean = value;
  }

  element(value) {
    if (this.elementTag) throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    if (this.elementId || this.elementClasses[0]
      || this.elementAttr[0] || this.elementPseudoClasses[0]
      || this.elementPseudoElement) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    this.elementTag = value;
    return this;
  }

  id(value) {
    if (this.elementId) throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    if (this.elementClasses[0] || this.elementAttr[0]
      || this.elementPseudoClasses[0] || this.elementPseudoElement) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    this.elementId = value;
    return this;
  }

  class(value) {
    if (this.elementAttr[0] || this.elementPseudoClasses[0] || this.elementPseudoElement) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    this.elementClasses.push(value);
    return this;
  }

  attr(value) {
    if (this.elementPseudoClasses[0] || this.elementPseudoElement) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    this.elementAttr.push(value);
    return this;
  }

  pseudoClass(value) {
    if (this.elementPseudoElement) throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    this.elementPseudoClasses.push(value);
    return this;
  }

  pseudoElement(value) {
    if (this.elementPseudoElement) throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    this.elementPseudoElement = value;
    return this;
  }

  stringify() {
    let res = '';
    if (this.elementTag) {
      res += `${this.elementTag}`;
    }
    if (this.elementId) {
      res += `#${this.elementId}`;
    }
    if (this.elementClasses[0]) {
      this.elementClasses.forEach((cl) => {
        res += `.${cl}`;
      });
    }
    if (this.elementAttr[0]) {
      this.elementAttr.forEach((atr) => {
        res += `[${atr}]`;
      });
    }
    if (this.elementPseudoClasses[0]) {
      this.elementPseudoClasses.forEach((psev) => {
        res += `:${psev}`;
      });
    }
    if (this.elementPseudoElement) {
      res += `::${this.elementPseudoElement}`;
    }
    return res;
  }
}

const cssSelectorBuilder = {
  element(value) {
    return new SelectoCss().element(value);
  },

  id(value) {
    return new SelectoCss().id(value);
  },

  class(value) {
    return new SelectoCss().class(value);
  },

  attr(value) {
    return new SelectoCss().attr(value);
  },

  pseudoClass(value) {
    return new SelectoCss().pseudoClass(value);
  },

  pseudoElement(value) {
    return new SelectoCss().pseudoElement(value);
  },

  combine(selector1, combine, selector2) {
    return {
      firstSel: selector1.stringify(),
      secondtSel: selector2.stringify(),
      combine,
      stringify() {
        return `${this.firstSel} ${this.combine} ${this.secondtSel}`;
      },
    };
  },
};


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};

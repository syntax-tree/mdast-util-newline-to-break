/**
 * @typedef {import('mdast').Root} Root
 */

import assert from 'node:assert/strict'
import {test} from 'node:test'
import {fromMarkdown} from 'mdast-util-from-markdown'
import {newlineToBreak} from 'mdast-util-newline-to-break'
import {toMarkdown} from 'mdast-util-to-markdown'

const fixtures = [
  {
    in: 'This is a\nparagraph.',
    out: 'This is a\\\nparagraph.\n',
    name: 'no space'
  },
  {
    in: 'This is a \nparagraph.',
    out: 'This is a\\\nparagraph.\n',
    name: 'one space'
  },
  {
    in: 'This is a  \nparagraph.',
    out: 'This is a\\\nparagraph.\n',
    name: 'two spaces'
  },
  {
    in: 'This is a   \nparagraph.',
    out: 'This is a\\\nparagraph.\n',
    name: 'three spaces'
  },
  {
    in: 'This is a\rparagraph.',
    out: 'This is a\\\nparagraph.\n',
    name: 'carriage return'
  },
  {
    in: 'This is a\r\nparagraph.',
    out: 'This is a\\\nparagraph.\n',
    name: 'carriage return + line feed'
  },
  {
    in: 'After *phrasing*\nmore.',
    out: 'After *phrasing*\\\nmore.\n',
    name: 'after phrasing'
  },
  {
    in: 'Before\n*phrasing*.',
    out: 'Before\\\n*phrasing*.\n',
    name: 'before phrasing'
  },
  {
    in: 'Mul\nti\nple.',
    out: 'Mul\\\nti\\\nple.\n',
    name: 'multiple'
  },
  {
    in: 'None.',
    out: 'None.\n',
    name: 'none'
  },
  {
    in: [
      'no space',
      'asd',
      '',
      'one space ',
      'asd',
      '',
      'one tab	',
      'asd',
      '',
      'in an ![image',
      'alt](#)',
      '',
      'in a [link',
      'alt](#)',
      '',
      'in an *emphasis',
      'emphasis*.',
      '',
      'in a **strong',
      'strong**.',
      '',
      'setext',
      'heading',
      '===',
      '',
      '> block',
      '> quote.',
      '',
      '* list',
      '  item.'
    ].join('\n'),
    out: [
      'no space\\',
      'asd',
      '',
      'one space\\',
      'asd',
      '',
      'one tab\\',
      'asd',
      '',
      'in an ![image',
      'alt](#)',
      '',
      'in a [link\\',
      'alt](#)',
      '',
      'in an *emphasis\\',
      'emphasis*.',
      '',
      'in a **strong\\',
      'strong**.',
      '',
      'setext\\',
      'heading',
      '=======',
      '',
      '> block\\',
      '> quote.',
      '',
      '*   list\\',
      '    item.',
      ''
    ].join('\n'),
    name: 'document'
  }
]

for (const fixture of fixtures) {
  test(fixture.name, () => {
    // To do: remove cast when released.
    const mdast = /** @type {Root} */ (fromMarkdown(fixture.in))
    newlineToBreak(mdast)
    // @ts-expect-error: remove when released.
    assert.equal(toMarkdown(mdast), fixture.out)
  })
}

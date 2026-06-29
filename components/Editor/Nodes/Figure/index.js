// import { Node } from 'tiptap'
// import { Plugin } from 'prosemirror-state'

// import FigureView from './View'

// export default class Figure extends Node {
//   get name() {
//     return 'figure'
//   }

//   get schema() {
//     return {
//       attrs: {
//         class: {
//           default: 'is-center',
//         },
//       },
//       content: 'image figcaption',
//       group: 'block',
//       parseDOM: [
//         {
//           tag: 'figure[data-content="image"]',
//           getAttrs: (dom) => {
//             return { 'data-content': 'image' }
//           },
//         },
//       ],
//       toDOM: (node) => [
//         'figure',
//         {
//           'data-content': 'image',
//         },
//         0,
//       ],
//     }
//   }

//   get view() {
//     return FigureView
//   }

//   // Deletes the entire figure node if imageNode is empty.
//   get plugins() {
//     return [
//       new Plugin({
//         appendTransaction: (transactions, oldState, newState) => {
//           const tr = newState.tr
//           let modified = false
//           // TO-DO: Iterate through transactions instead of descendants.
//           newState.doc.descendants((node, pos, parent) => {
//             if (node.type.name !== 'figure') return
//             const imageNode = node.firstChild
//             if (
//               imageNode.attrs.src === imageNode.type.defaultAttrs.src &&
//               imageNode.attrs.alt === imageNode.type.defaultAttrs.alt
//             ) {
//               tr.deleteRange(pos, pos + node.nodeSize)
//               modified = true
//             }
//           })
//           if (modified) return tr
//         },
//       }),
//     ]
//   }
// }

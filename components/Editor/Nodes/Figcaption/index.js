// import { Node } from 'tiptap'

// import FigcaptionView from './View'

// export default class Figcaption extends Node {
//   get name() {
//     return 'figcaption'
//   }

//   get schema() {
//     return {
//       attrs: {
//         contenteditable: {
//           default: true,
//         },
//       },
//       content: 'inline*',
//       group: 'figure',
//       // TO-DO: get image alt if figcaption not found using prosemirror-model
//       parseDOM: [
//         {
//           tag: 'figcaption[data-content="image"]',
//           getAttrs: (dom) => {
//             return { 'data-content': 'image' }
//           },
//         },
//       ],
//       toDOM: (node) => [
//         'figcaption',
//         {
//           'data-content': 'image',
//         },
//         0,
//       ],
//     }
//   }

//   get view() {
//     return FigcaptionView
//   }
// }
